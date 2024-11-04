import { contentLog, generateId, iterateChunk, regionCenter, regionIterateBlocks, regionSize, regionTransformedBounds, regionVolume, Server, sleep, Thread, Vector, } from "./../../library/Minecraft.js";
import { Block, BlockPermutation } from "@minecraft/server";
import { blockHasNBTData, getViewVector, locToString, stringToLoc } from "../util.js";
import { Jobs } from "./jobs.js";
export class RegionBuffer {
    constructor(isAccurate = false) {
        this.size = Vector.ZERO;
        this.blocks = new Map();
        this.blockCount = 0;
        this.subId = 0;
        this.savedEntities = false;
        this.imported = "";
        this.refCount = 1;
        this.isAccurate = isAccurate;
        this.id = "wedit:buffer_" + generateId();
        contentLog.debug("creating structure", this.id);
    }
    *save(start, end, dim, options = {}, blocks = "all") {
        if (this.isAccurate) {
            const min = Vector.min(start, end);
            const iterate = (block) => {
                const relLoc = Vector.sub(block, min).floor();
                if (blockHasNBTData(block)) {
                    const id = this.id + "_" + this.subId++;
                    this.saveBlockAsStruct(id, block, dim);
                    this.blocks.set(locToString(relLoc), [block.permutation, block.isWaterlogged, id]);
                }
                else {
                    this.blocks.set(locToString(relLoc), [block.permutation, block.isWaterlogged]);
                }
            };
            let count = 0;
            const isFilter = typeof blocks == "function";
            if (blocks == "all" || isFilter) {
                const volume = regionVolume(start, end);
                let i = 0;
                for (const loc of regionIterateBlocks(start, end)) {
                    let block = dim.getBlock(loc);
                    while (!block && Jobs.inContext()) {
                        block = Jobs.loadBlock(loc);
                        yield sleep(1);
                    }
                    if (!isFilter) {
                        iterate(block);
                        count++;
                    }
                    else {
                        const filtered = blocks(block);
                        if (typeof filtered != "boolean") {
                            const relLoc = Vector.sub(block, min).floor();
                            this.blocks.set(locToString(relLoc), [filtered, false]);
                            count++;
                        }
                        else if (filtered) {
                            iterate(block);
                            count++;
                        }
                    }
                    if (iterateChunk())
                        yield Jobs.setProgress(i / volume);
                    i++;
                }
            }
            else if (Array.isArray(blocks)) {
                for (let i = 0; i < blocks.length; i++) {
                    let block = dim.getBlock(blocks[i]);
                    while (!block && Jobs.inContext()) {
                        block = Jobs.loadBlock(blocks[i]);
                        yield sleep(1);
                    }
                    iterate(block);
                    if (iterateChunk())
                        yield Jobs.setProgress(i / blocks.length);
                }
                count = blocks.length;
            }
            this.blockCount = count;
            if (options.includeEntities) {
                Server.structure.save(this.id, start, end, dim, {
                    includeBlocks: false,
                    includeEntities: true,
                });
            }
        }
        else {
            const jobCtx = Jobs.getContext();
            if (yield Server.structure.saveWhileLoadingChunks(this.id, start, end, dim, options, (min, max) => {
                if (Jobs.isContextValid(jobCtx)) {
                    Jobs.loadBlock(regionCenter(min, max), jobCtx);
                    return false;
                }
                return true;
            }))
                return true;
            this.blockCount = regionVolume(start, end);
        }
        this.imported = "";
        this.savedEntities = options.includeEntities;
        this.size = regionSize(start, end);
        return false;
    }
    *load(loc, dim, options = {}) {
        const rotFlip = [options.rotation ?? Vector.ZERO, options.flip ?? Vector.ONE];
        if (this.isAccurate) {
            const bounds = regionTransformedBounds(Vector.ZERO, Vector.sub(this.size, [1, 1, 1]).floor(), Vector.ZERO, ...rotFlip);
            const shouldTransform = options.rotation || options.flip;
            let transform;
            if (shouldTransform) {
                transform = (block) => {
                    const blockName = block.type.id;
                    const attachment = block.getState("attachment");
                    const direction = block.getState("direction");
                    const doorHingeBit = block.getState("door_hinge_bit");
                    const facingDir = block.getState("facing_direction");
                    const groundSignDir = block.getState("ground_sign_direction");
                    const openBit = block.getState("open_bit");
                    const pillarAxis = block.getState("pillar_axis");
                    const topSlotBit = block.getState("top_slot_bit");
                    const upsideDownBit = block.getState("upside_down_bit");
                    const weirdoDir = block.getState("weirdo_direction");
                    const torchFacingDir = block.getState("torch_facing_direction");
                    const leverDir = block.getState("lever_direction");
                    const cardinalDir = block.getState("minecraft:cardinal_direction");
                    const withProperties = (properties) => {
                        for (const prop in properties) {
                            block = block.withState(prop, properties[prop]);
                        }
                        return block;
                    };
                    if (upsideDownBit != null && openBit != null && direction != null) {
                        const states = this.transformMapping(mappings.trapdoorMap, `${upsideDownBit}_${openBit}_${direction}`, ...rotFlip).split("_");
                        block = withProperties({ upside_down_bit: states[0] == "true", open_bit: states[1] == "true", direction: parseInt(states[2]) });
                    }
                    else if (weirdoDir != null && upsideDownBit != null) {
                        const states = this.transformMapping(mappings.stairsMap, `${upsideDownBit}_${weirdoDir}`, ...rotFlip).split("_");
                        block = withProperties({ upside_down_bit: states[0] == "true", weirdo_direction: parseInt(states[1]) });
                    }
                    else if (doorHingeBit != null && direction != null) {
                        const states = this.transformMapping(mappings.doorMap, `${doorHingeBit}_${direction}`, ...rotFlip).split("_");
                        block = withProperties({ door_hinge_bit: states[0] == "true", direction: parseInt(states[1]) });
                    }
                    else if (attachment != null && direction != null) {
                        const states = this.transformMapping(mappings.bellMap, `${attachment}_${direction}`, ...rotFlip).split("_");
                        block = withProperties({ attachment: states[0], direction: parseInt(states[1]) });
                    }
                    else if (cardinalDir != null) {
                        const state = this.transformMapping(mappings.cardinalDirectionMap, cardinalDir, ...rotFlip);
                        block = block.withState("minecraft:cardinal_direction", state);
                    }
                    else if (facingDir != null) {
                        const state = this.transformMapping(mappings.facingDirectionMap, facingDir, ...rotFlip);
                        block = block.withState("facing_direction", parseInt(state));
                    }
                    else if (direction != null) {
                        const mapping = blockName.includes("powered_repeater") || blockName.includes("powered_comparator") ? mappings.redstoneMap : mappings.directionMap;
                        const state = this.transformMapping(mapping, direction, ...rotFlip);
                        block = block.withState("direction", parseInt(state));
                    }
                    else if (groundSignDir != null) {
                        const state = this.transformMapping(mappings.groundSignDirectionMap, groundSignDir, ...rotFlip);
                        block = block.withState("ground_sign_direction", parseInt(state));
                    }
                    else if (torchFacingDir != null) {
                        const state = this.transformMapping(mappings.torchMap, torchFacingDir, ...rotFlip);
                        block = block.withState("torch_facing_direction", state);
                    }
                    else if (leverDir != null) {
                        const state = this.transformMapping(mappings.leverMap, leverDir, ...rotFlip);
                        block = block.withState("lever_direction", state.replace("0", ""));
                    }
                    else if (pillarAxis != null) {
                        const state = this.transformMapping(mappings.pillarAxisMap, pillarAxis + "_0", ...rotFlip);
                        block = block.withState("pillar_axis", state[0]);
                    }
                    else if (topSlotBit != null) {
                        const state = this.transformMapping(mappings.topSlotMap, String(topSlotBit), ...rotFlip);
                        block = block.withState("top_slot_bit", state == "true");
                    }
                    return block;
                };
            }
            else {
                transform = (block) => block;
            }
            let i = 0;
            for (const [key, block] of this.blocks.entries()) {
                let blockLoc = stringToLoc(key);
                if (shouldTransform)
                    blockLoc = Vector.from(blockLoc).rotateY(rotFlip[0].y).rotateX(rotFlip[0].x).rotateZ(rotFlip[0].z).mul(rotFlip[1]).sub(bounds[0]).floor();
                blockLoc = blockLoc.offset(loc.x, loc.y, loc.z);
                let oldBlock = dim.getBlock(blockLoc);
                while (!oldBlock && Jobs.inContext()) {
                    oldBlock = Jobs.loadBlock(blockLoc);
                    yield sleep(1);
                }
                if (options.mask && !options.mask.matchesBlock(oldBlock))
                    continue;
                if (block.length === 3)
                    this.loadBlockFromStruct(block[2], blockLoc, dim);
                oldBlock.setPermutation(transform(block[0]));
                oldBlock.setWaterlogged(block[1]);
                if (iterateChunk())
                    yield Jobs.setProgress(i / this.blocks.size);
                i++;
            }
            if (this.savedEntities) {
                const onEntityload = (ev) => {
                    if (shouldTransform) {
                        // FIXME: Not properly aligned
                        let entityLoc = ev.entity.location;
                        let entityFacing = Vector.from(getViewVector(ev.entity)).add(entityLoc);
                        entityLoc = Vector.from(entityLoc).sub(loc).rotateY(rotFlip[0].y).rotateX(rotFlip[0].x).rotateZ(rotFlip[0].z).mul(rotFlip[1]).sub(bounds[0]).add(loc);
                        entityFacing = Vector.from(entityFacing).sub(loc).rotateY(rotFlip[0].y).rotateX(rotFlip[0].x).rotateZ(rotFlip[0].z).mul(rotFlip[1]).sub(bounds[0]).add(loc);
                        ev.entity.teleport(entityLoc, {
                            dimension: dim,
                            facingLocation: entityFacing,
                        });
                    }
                };
                Server.on("entityCreate", onEntityload);
                Server.structure.load(this.id, loc, dim);
                Server.off("entityCreate", onEntityload);
            }
        }
        else {
            const loadOptions = {
                rotation: rotFlip[0].y,
                flip: "none",
            };
            if (options.flip?.z == -1)
                loadOptions.flip = "x";
            if (options.flip?.x == -1)
                loadOptions.flip += "z";
            if (loadOptions.flip == "nonez")
                loadOptions.flip = "z";
            if (this.imported)
                loadOptions.importedSize = Vector.from(this.size);
            const jobCtx = Jobs.getContext();
            yield Server.structure.loadWhileLoadingChunks(this.imported || this.id, loc, dim, loadOptions, (min, max) => {
                if (Jobs.isContextValid(jobCtx)) {
                    Jobs.loadBlock(regionCenter(min, max), jobCtx);
                    return false;
                }
                return true;
            });
        }
    }
    /**
     * @param func
     * @returns
     */
    *warp(func) {
        if (!this.isAccurate)
            return;
        const region = [Vector.ZERO.floor(), this.size.sub(-1)];
        const output = new Map();
        const volume = regionVolume(...region);
        const sampleBlock = (loc) => this.blocks.get(locToString(loc));
        let i = 0;
        for (const coord of regionIterateBlocks(...region)) {
            const block = func(coord, {
                blockData: this.blocks.get(locToString(coord)),
                sampleBlock,
            });
            if (block)
                output.set(locToString(coord), block);
            yield ++i / volume;
        }
        this.blocks = output;
        this.blockCount = this.blocks.size;
    }
    *create(start, end, func) {
        if (!this.isAccurate || !this.size.equals(Vector.ZERO))
            return;
        this.size = regionSize(start, end);
        const region = [Vector.ZERO.floor(), this.size.offset(-1, -1, -1)];
        const volume = regionVolume(...region);
        let i = 0;
        for (const coord of regionIterateBlocks(...region)) {
            const block = func(coord);
            if (block) {
                if (block instanceof Block && blockHasNBTData(block)) {
                    const id = this.id + "_" + this.subId++;
                    this.saveBlockAsStruct(id, block.location, block.dimension);
                    this.blocks.set(locToString(coord), [block.permutation, block.isWaterlogged, id]);
                }
                else {
                    this.blocks.set(locToString(coord), block instanceof Block ? [block.permutation, block.isWaterlogged] : [block, false]);
                }
            }
            yield Jobs.setProgress(++i / volume);
        }
        this.blockCount = this.blocks.size;
    }
    getSize() {
        return this.size;
    }
    getBlockCount() {
        return this.blockCount;
    }
    getBlock(loc) {
        if (!this.isAccurate)
            return null;
        const block = this.blocks.get(locToString(loc));
        if (block)
            return block[0];
    }
    getBlocks() {
        return Array.from(this.blocks.values());
    }
    setBlock(loc, block, options) {
        let error;
        const key = locToString(loc);
        if (this.blocks.has(key) && Array.isArray(this.blocks.get(key))) {
            this.deleteBlockStruct(this.blocks.get(key)[2]);
        }
        if (block instanceof BlockPermutation) {
            if (options?.includeEntities) {
                const id = this.id + "_" + this.subId++;
                error = Server.structure.save(id, options.loc, options.loc, options.dim, options);
                this.blocks.set(key, [block, false, id]);
            }
            else {
                this.blocks.set(key, [block, false]);
            }
        }
        else {
            const id = this.id + "_" + this.subId++;
            error = Server.structure.save(id, block.location, block.location, block.dimension, options);
            this.blocks.set(key, [block.permutation, block.isWaterlogged, id]);
        }
        this.size = Vector.max(this.size, Vector.from(loc).add(1)).floor();
        this.blockCount = this.blocks.size;
        return error ?? false;
    }
    import(structure, size) {
        this.imported = structure;
        this.size = Vector.from(size);
        this.blockCount = size.x * size.y * size.z;
    }
    ref() {
        this.refCount++;
    }
    deref() {
        if (--this.refCount < 1)
            this.delete();
    }
    transformMapping(mapping, state, rotate, flip) {
        let vec = Vector.from(mapping[state]);
        if (!vec) {
            contentLog.debug(`Can't map state "${state}".`);
            return typeof state == "string" ? state : state.toString();
        }
        vec = vec.rotateY(rotate.y).rotateX(rotate.x).rotateZ(rotate.z);
        vec = vec.mul(flip);
        let closestState;
        let closestDot = -1000;
        for (const newState in mapping) {
            const dot = Vector.from(mapping[newState]).dot(vec);
            if (dot > closestDot) {
                closestState = newState;
                closestDot = dot;
            }
        }
        return closestState;
    }
    saveBlockAsStruct(id, loc, dim) {
        const locStr = `${loc.x} ${loc.y} ${loc.z}`;
        return Server.runCommand(`structure save ${id} ${locStr} ${locStr} false memory`, dim);
    }
    loadBlockFromStruct(id, loc, dim) {
        const locStr = `${loc.x} ${loc.y} ${loc.z}`;
        return Server.runCommand(`structure load ${id} ${locStr}`, dim);
    }
    deleteBlockStruct(id) {
        Server.queueCommand(`structure delete ${id}`);
    }
    delete() {
        const thread = new Thread();
        thread.start(function* (self) {
            if (self.isAccurate) {
                const promises = [];
                for (const block of self.blocks.values()) {
                    if (block.length === 3) {
                        promises.push(self.deleteBlockStruct(block[2]));
                        yield;
                    }
                }
                if (promises.length) {
                    yield Promise.all(promises);
                }
                self.blocks.clear();
            }
            self.size = Vector.ZERO;
            self.blockCount = 0;
            yield Server.structure.delete(self.id);
            contentLog.debug("deleted structure", self.id);
        }, this);
    }
}
const mappings = {
    topSlotMap: {
        // upside_down_bit
        false: new Vector(0, 1, 0),
        true: new Vector(0, -1, 0),
    },
    redstoneMap: {
        0: new Vector(0, 0, -1),
        1: new Vector(1, 0, 0),
        2: new Vector(0, 0, 1),
        3: new Vector(-1, 0, 0),
    },
    directionMap: {
        // direction
        0: new Vector(1, 0, 0),
        1: new Vector(0, 0, 1),
        2: new Vector(-1, 0, 0),
        3: new Vector(0, 0, -1),
    },
    facingDirectionMap: {
        // facing_direction
        0: new Vector(0, -1, 0),
        1: new Vector(0, 1, 0),
        2: new Vector(0, 0, -1),
        3: new Vector(0, 0, 1),
        4: new Vector(-1, 0, 0),
        5: new Vector(1, 0, 0),
    },
    cardinalDirectionMap: {
        // minecraft:cardinal_direction
        north: new Vector(0, 0, -1),
        south: new Vector(0, 0, 1),
        west: new Vector(-1, 0, 0),
        east: new Vector(1, 0, 0),
    },
    pillarAxisMap: {
        // pillar_axis
        x_0: new Vector(1, 0, 0),
        y_0: new Vector(0, 1, 0),
        z_0: new Vector(0, 0, 1),
        x_1: new Vector(-1, 0, 0),
        y_1: new Vector(0, -1, 0),
        z_1: new Vector(0, 0, -1),
    },
    groundSignDirectionMap: {
        // ground_sign_direction
        0: new Vector(0, 0, 1),
        1: new Vector(0, 0, 1).rotateY((1 / 16) * 360),
        2: new Vector(0, 0, 1).rotateY((2 / 16) * 360),
        3: new Vector(0, 0, 1).rotateY((3 / 16) * 360),
        4: new Vector(0, 0, 1).rotateY((4 / 16) * 360),
        5: new Vector(0, 0, 1).rotateY((5 / 16) * 360),
        6: new Vector(0, 0, 1).rotateY((6 / 16) * 360),
        7: new Vector(0, 0, 1).rotateY((7 / 16) * 360),
        8: new Vector(0, 0, 1).rotateY((8 / 16) * 360),
        9: new Vector(0, 0, 1).rotateY((9 / 16) * 360),
        10: new Vector(0, 0, 1).rotateY((10 / 16) * 360),
        11: new Vector(0, 0, 1).rotateY((11 / 16) * 360),
        12: new Vector(0, 0, 1).rotateY((12 / 16) * 360),
        13: new Vector(0, 0, 1).rotateY((13 / 16) * 360),
        14: new Vector(0, 0, 1).rotateY((14 / 16) * 360),
        15: new Vector(0, 0, 1).rotateY((15 / 16) * 360),
    },
    stairsMap: {
        // upside_down_bit - weirdo_direction
        false_0: new Vector(-1, 1, 0),
        false_1: new Vector(1, 1, 0),
        false_2: new Vector(0, 1, -1),
        false_3: new Vector(0, 1, 1),
        true_0: new Vector(-1, -1, 0),
        true_1: new Vector(1, -1, 0),
        true_2: new Vector(0, -1, -1),
        true_3: new Vector(0, -1, 1),
    },
    torchMap: {
        // torch_facing_direction
        north: new Vector(0, 0, 1),
        east: new Vector(-1, 0, 0),
        south: new Vector(0, 0, -1),
        west: new Vector(1, 0, 0),
        top: new Vector(0, 1, 0),
    },
    leverMap: {
        // lever_direction
        north: new Vector(0, 0, 1),
        east: new Vector(-1, 0, 0),
        south: new Vector(0, 0, -1),
        west: new Vector(1, 0, 0),
        up_north_south: new Vector(0, 1, 0.5),
        up_north_south0: new Vector(0, 1, -0.5),
        up_east_west: new Vector(0.5, 1, 0),
        up_east_west0: new Vector(-0.5, 1, 0),
        down_north_south: new Vector(0, -1, 0.5),
        down_north_south0: new Vector(0, -1, -0.5),
        down_east_west: new Vector(0.5, -1, 0),
        down_east_west0: new Vector(-0.5, -1, 0),
    },
    doorMap: {
        // door_hinge_bit - direction
        false_0: new Vector(1, 0, 0.5),
        false_1: new Vector(-0.5, 0, 1),
        false_2: new Vector(-1, 0, -0.5),
        false_3: new Vector(0.5, 0, -1),
        true_0: new Vector(1, 0, -0.5),
        true_1: new Vector(0.5, 0, 1),
        true_2: new Vector(-1, 0, 0.5),
        true_3: new Vector(-0.5, 0, -1),
    },
    bellMap: {
        // attachment - direction
        standing_0: new Vector(1, 0.5, 0),
        standing_1: new Vector(0, 0.5, 1),
        standing_2: new Vector(-1, 0.5, 0),
        standing_3: new Vector(0, 0.5, -1),
        side_0: new Vector(1, 0, 0),
        side_1: new Vector(0, 0, 1),
        side_2: new Vector(-1, 0, 0),
        side_3: new Vector(0, 0, -1),
        hanging_0: new Vector(1, -0.5, 0),
        hanging_1: new Vector(0, -0.5, 1),
        hanging_2: new Vector(-1, -0.5, 0),
        hanging_3: new Vector(0, -0.5, -1),
    },
    trapdoorMap: {
        // upside_down_bit - open_bit - direction
        false_false_0: new Vector(-0.5, 1, 0),
        false_false_1: new Vector(0.5, 1, 0),
        false_false_2: new Vector(0, 1, -0.5),
        false_false_3: new Vector(0, 1, 0.5),
        true_false_0: new Vector(-0.5, -1, 0),
        true_false_1: new Vector(0.5, -1, 0),
        true_false_2: new Vector(0, -1, -0.5),
        true_false_3: new Vector(0, -1, 0.5),
        false_true_0: new Vector(-1, 0.5, 0),
        false_true_1: new Vector(1, 0.5, 0),
        false_true_2: new Vector(0, 0.5, -1),
        false_true_3: new Vector(0, 0.5, 1),
        true_true_0: new Vector(-1, -0.5, 0),
        true_true_1: new Vector(1, -0.5, 0),
        true_true_2: new Vector(0, -0.5, -1),
        true_true_3: new Vector(0, -0.5, 1),
    },
    // TODO: Support glow lychen
};
