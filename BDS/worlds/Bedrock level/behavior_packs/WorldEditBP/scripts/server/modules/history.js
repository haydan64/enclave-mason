import { BlockPermutation } from "@minecraft/server";
import { Vector, regionVolume, Server, regionSize, regionCenter, getCurrentThread } from "./../../library/Minecraft.js";
import { UnloadedChunksError } from "./assert.js";
import { canPlaceBlock } from "../util.js";
import config from "config.js";
import { Jobs } from "./jobs.js";
const air = BlockPermutation.resolve("minecraft:air");
let historyId = 0;
let historyPointId = 0;
export class History {
    constructor(session) {
        this.historyPoints = new Map();
        this.undoStructures = [];
        this.redoStructures = [];
        this.selectionHistory = [];
        this.historyIdx = -1;
        this.session = session;
    }
    record(brush = false) {
        historyPointId++;
        const historyPoint = {
            undo: [],
            redo: [],
            selection: "none",
            blockChange: new BlockChangeImpl(this.session.getPlayer().dimension, this, historyPointId),
            blocksChanged: 0,
            thread: getCurrentThread(),
            brush,
        };
        this.historyPoints.set(historyPointId, historyPoint);
        return historyPointId;
    }
    commit(historyPoint) {
        const point = this.historyPoints.get(historyPoint);
        this.historyPoints.delete(historyPoint);
        this.historyIdx++;
        for (let i = this.historyIdx; i < this.undoStructures.length; i++) {
            this.deleteHistoryRegions(i);
        }
        this.undoStructures.length = this.redoStructures.length = this.selectionHistory.length = this.historyIdx + 1;
        this.undoStructures[this.historyIdx] = point.undo;
        this.redoStructures[this.historyIdx] = point.redo;
        this.selectionHistory[this.historyIdx] = point.selection;
        while (this.historyIdx > config.maxHistorySize - 1) {
            this.deleteHistoryRegions(0);
            this.undoStructures.shift();
            this.redoStructures.shift();
            this.selectionHistory.shift();
            this.historyIdx--;
        }
    }
    cancel(historyPoint) {
        if (!this.historyPoints.has(historyPoint))
            return;
        const point = this.historyPoints.get(historyPoint);
        this.historyPoints.delete(historyPoint);
        for (const struct of point.undo)
            Server.structure.delete(struct.name);
        for (const struct of point.redo)
            Server.structure.delete(struct.name);
    }
    collectBlockChanges(historyPoint) {
        return this.historyPoints.get(historyPoint)?.blockChange;
    }
    async addUndoStructure(historyPoint, start, end, blocks = "any") {
        // contentLog.debug("adding undo structure");
        const point = this.historyPoints.get(historyPoint);
        point.blocksChanged += blocks == "any" ? regionVolume(start, end) : blocks.length;
        // We test the change limit here,
        if (point.blocksChanged > this.session.changeLimit) {
            throw "commands.generic.wedit:blockLimit";
        }
        const structName = await this.processRegion(historyPoint, start, end, blocks);
        point.undo.push({
            name: structName,
            dimension: this.session.getPlayer().dimension,
            location: Vector.min(start, end).floor(),
            size: regionSize(start, end),
        });
    }
    async addRedoStructure(historyPoint, start, end, blocks = "any") {
        const point = this.historyPoints.get(historyPoint);
        this.assertRecording();
        const structName = await this.processRegion(historyPoint, start, end, blocks);
        point.redo.push({
            name: structName,
            dimension: this.session.getPlayer().dimension,
            location: Vector.min(start, end).floor(),
            size: regionSize(start, end),
        });
    }
    recordSelection(historyPoint, session) {
        const point = this.historyPoints.get(historyPoint);
        if (point.selection == "none") {
            point.selection = {
                type: session.selection.mode,
                points: session.selection.points,
            };
        }
        else if ("points" in point.selection) {
            point.selection = [
                point.selection,
                {
                    type: session.selection.mode,
                    points: session.selection.points,
                },
            ];
        }
        else {
            throw new Error('Cannot call "recordSelection" more than two times!');
        }
    }
    async undo(session) {
        this.assertNotRecording();
        if (this.historyIdx <= -1) {
            return true;
        }
        const player = this.session.getPlayer();
        const dim = player.dimension;
        const jobCtx = Jobs.getContext();
        for (const region of this.undoStructures[this.historyIdx]) {
            await Server.structure.loadWhileLoadingChunks(region.name, region.location, dim, {}, (min, max) => {
                if (Jobs.isContextValid(jobCtx)) {
                    Jobs.loadBlock(regionCenter(min, max), jobCtx);
                    return false;
                }
                return true;
            });
        }
        let selection;
        if (Array.isArray(this.selectionHistory[this.historyIdx])) {
            selection = this.selectionHistory[this.historyIdx][0];
        }
        else if (this.selectionHistory[this.historyIdx] != "none") {
            selection = this.selectionHistory[this.historyIdx];
        }
        if (selection) {
            session.selection.mode = selection.type;
            for (let i = 0; i < selection.points.length; i++) {
                session.selection.set(i == 0 ? 0 : 1, selection.points[i]);
            }
        }
        this.historyIdx--;
        return false;
    }
    async redo(session) {
        this.assertNotRecording();
        if (this.historyIdx >= this.redoStructures.length - 1) {
            return true;
        }
        const player = this.session.getPlayer();
        const dim = player.dimension;
        const jobCtx = Jobs.getContext();
        this.historyIdx++;
        for (const region of this.redoStructures[this.historyIdx]) {
            await Server.structure.loadWhileLoadingChunks(region.name, region.location, dim, {}, (min, max) => {
                if (Jobs.isContextValid(jobCtx)) {
                    Jobs.loadBlock(regionCenter(min, max), jobCtx);
                    return false;
                }
                return true;
            });
        }
        let selection;
        if (Array.isArray(this.selectionHistory[this.historyIdx])) {
            selection = this.selectionHistory[this.historyIdx][1];
        }
        else if (this.selectionHistory[this.historyIdx] != "none") {
            selection = this.selectionHistory[this.historyIdx];
        }
        if (selection) {
            session.selection.mode = selection.type;
            for (let i = 0; i < selection.points.length; i++) {
                session.selection.set(i == 0 ? 0 : 1, selection.points[i]);
            }
        }
        return false;
    }
    clear() {
        this.historyIdx = -1;
        for (let i = 0; i < this.undoStructures.length; i++) {
            this.deleteHistoryRegions(i);
        }
        this.undoStructures.length = 0;
        this.redoStructures.length = 0;
    }
    isRecording() {
        return this.historyPoints.size != 0;
    }
    getActivePointsInThread(thread) {
        const points = [];
        for (const [point, data] of this.historyPoints.entries()) {
            if (data.thread === thread)
                points.push(point);
        }
        return points;
    }
    delete() {
        do {
            this.deleteHistoryRegions(0);
        } while (this.undoStructures.shift());
    }
    deleteHistoryRegions(index) {
        try {
            for (const struct of this.undoStructures[index]) {
                Server.structure.delete(struct.name);
            }
            for (const struct of this.redoStructures[index]) {
                Server.structure.delete(struct.name);
            }
        }
        catch {
            /* pass */
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async processRegion(historyPoint, start, end, blocks) {
        let structName;
        const player = this.session.getPlayer();
        const dim = player.dimension;
        try {
            const jobCtx = Jobs.getContext();
            if (!jobCtx && (!canPlaceBlock(start, dim) || !canPlaceBlock(end, dim))) {
                throw new UnloadedChunksError("worldedit.error.saveHistory");
            }
            structName = "wedit:history_" + (historyId++).toString(16);
            if (await Server.structure.saveWhileLoadingChunks(structName, start, end, dim, {}, (min, max) => {
                if (Jobs.isContextValid(jobCtx)) {
                    Jobs.loadBlock(regionCenter(min, max), jobCtx);
                    return false;
                }
                return true;
            })) {
                this.cancel(historyPoint);
                throw new UnloadedChunksError("worldedit.error.saveHistory");
            }
        }
        catch (err) {
            this.cancel(historyPoint);
            throw err;
        }
        return structName;
    }
    assertRecording() {
        if (!this.isRecording()) {
            throw new Error("History was not being recorded!");
        }
    }
    assertNotRecording() {
        if (this.isRecording()) {
            throw new Error("History was still being recorded!");
        }
    }
}
class BlockChangeImpl {
    constructor(dim, history, record) {
        this.blockCache = new Map();
        this.iteration = new Map();
        this.changes = new Map();
        this.ranges = [];
        this.dimension = dim;
        this.history = history;
        this.record = record;
    }
    getBlockPerm(loc) {
        const key = this.vec2string(loc);
        const change = this.changes.get(key);
        try {
            if (change)
                return change;
            if (!this.blockCache.has(key))
                this.blockCache.set(key, this.dimension.getBlock(loc));
            return this.blockCache.get(key).permutation ?? air;
        }
        catch {
            return air;
        }
    }
    getBlock(loc) {
        const perm = this.getBlockPerm(loc);
        return {
            typeId: perm.type.id,
            permutation: perm,
            location: loc,
            dimension: this.dimension,
            setPermutation: (perm) => this.setBlock(loc, perm),
            hasTag: perm.hasTag,
            get isAir() {
                return perm.type.id == "minecraft:air" ? true : false;
            },
        };
    }
    setBlock(loc, block) {
        this.iteration.set(this.vec2string(loc), block);
        if (!this.ranges.length) {
            this.ranges.push([Vector.from(loc), Vector.from(loc)]);
        }
        else {
            const [min, max] = this.ranges[0];
            min.x = Math.min(min.x, loc.x);
            min.y = Math.min(min.y, loc.y);
            min.z = Math.min(min.z, loc.z);
            max.x = Math.max(max.x, loc.x);
            max.y = Math.max(max.y, loc.y);
            max.z = Math.max(max.z, loc.z);
        }
    }
    applyIteration() {
        if (!this.iteration.size)
            return;
        this.changes = new Map([...this.changes, ...this.iteration]);
        this.iteration.clear();
    }
    getRegion() {
        return this.ranges.map((v) => [v[0], v[1]]);
    }
    *flush() {
        this.applyIteration();
        for (const range of this.ranges) {
            this.history.addUndoStructure(this.record, ...range);
        }
        let i = 0;
        for (const [loc, block] of this.changes.entries()) {
            try {
                this.blockCache.get(loc).setPermutation(block);
            }
            catch {
                /* pass */
            }
            yield ++i;
        }
        for (const range of this.ranges) {
            this.history.addRedoStructure(this.record, ...range);
        }
        this.ranges.length = 0;
        this.changes.clear();
    }
    vec2string(vec) {
        return "" + vec.x + "_" + vec.y + "_" + vec.z;
    }
}
