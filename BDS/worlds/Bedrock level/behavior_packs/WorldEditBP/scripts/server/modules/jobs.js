import { Server, RawText, removeTickingArea, setTickingAreaCircle, getCurrentThread } from "./../../library/Minecraft.js";
import { getSession } from "server/sessions";
import { UnloadedChunksError } from "./assert";
// eslint-disable-next-line prefer-const
let globalJobIdCounter = 0;
class JobHandler {
    constructor() {
        this.jobs = new Map();
        this.occupiedTickingAreaSlots = [false];
        Server.on("tick", () => {
            this.manageTickingAreaSlots();
            this.printJobs();
        });
        for (let i = 0; i < 9; i++)
            removeTickingArea("wedit:ticking_area_" + i);
    }
    *run(session, steps, func) {
        const jobId = ++globalJobIdCounter;
        const job = {
            stepCount: steps,
            step: -1,
            player: session.getPlayer(),
            message: "",
            percent: 0,
            dimension: session.getPlayer().dimension,
            thread: getCurrentThread(),
        };
        this.jobs.set(jobId, job);
        const gen = "next" in func ? func : func();
        let val;
        let lastPromise;
        while (!val?.done) {
            try {
                this.current = jobId;
                val = gen.next(lastPromise);
                this.current = undefined;
                lastPromise = undefined;
                const value = val.value;
                if (value?.jobFunc === "setProgress") {
                    job.percent = Math.max(Math.min(value.data, 1), 0);
                }
                else if (value?.jobFunc === "nextStep") {
                    job.message = value.data;
                    job.percent = 0;
                    job.step++;
                }
                else if (val.value instanceof Promise) {
                    lastPromise = yield val.value;
                }
            }
            catch (err) {
                this.finishJob(jobId);
                throw err;
            }
            yield;
        }
        this.finishJob(jobId);
        return val.value;
    }
    nextStep(message) {
        if (this.current)
            return { jobFunc: "nextStep", data: message };
    }
    setProgress(percent) {
        if (this.current)
            return { jobFunc: "setProgress", data: percent };
    }
    loadBlock(loc, ctx) {
        const job = this.jobs.get(ctx ?? this.current);
        const block = job?.dimension.getBlock(loc);
        if ((ctx || !block) && job) {
            if (job.tickingAreaSlot === undefined) {
                if (!job.tickingAreaRequestTime)
                    job.tickingAreaRequestTime = Date.now();
                return;
            }
            if (!setTickingAreaCircle(loc, 4, job.dimension, "wedit:ticking_area_" + job.tickingAreaSlot)) {
                throw new UnloadedChunksError("worldedit.error.tickArea");
            }
        }
        return block;
    }
    inContext() {
        return !!this.current;
    }
    getContext() {
        return this.current;
    }
    isContextValid(ctx) {
        return this.jobs.has(ctx);
    }
    getJobsForSession(session) {
        const jobs = [];
        const player = session.getPlayer();
        for (const [id, data] of this.jobs.entries()) {
            if (data.player === player)
                jobs.push(id);
        }
        return jobs;
    }
    cancelJob(jobId) {
        const job = this.jobs.get(jobId);
        const history = getSession(job.player).getHistory();
        for (const point of history.getActivePointsInThread(job.thread))
            history.cancel(point);
        job.thread.abort();
        this.finishJob(jobId);
    }
    finishJob(jobId) {
        if (this.jobs.has(jobId)) {
            const job = this.jobs.get(jobId);
            job.percent = 1;
            job.step = job.stepCount - 1;
            if (job.message?.length)
                job.message = "Finished!"; // TODO: Localize
            if (job.tickingAreaSlot !== undefined) {
                removeTickingArea("wedit:ticking_area_" + job.tickingAreaSlot, job.dimension);
                this.occupiedTickingAreaSlots[job.tickingAreaSlot] = false;
            }
            this.printJobs();
            this.jobs.delete(jobId);
        }
    }
    printJobs() {
        const progresses = new Map();
        for (const job of this.jobs.values()) {
            if (job.message?.length) {
                if (!progresses.has(job.player))
                    progresses.set(job.player, []);
                const percent = (job.percent + job.step) / job.stepCount;
                progresses.get(job.player).push([job.tickingAreaRequestTime ? "Loading Chunks..." : job.message, Math.max(percent, 0)]);
            }
        }
        for (const [player, progress] of progresses.entries()) {
            let text;
            let i = 0;
            for (const [message, percent] of progress) {
                if (text)
                    text.append("text", "\n");
                let bar = "";
                for (let i = 0; i < 20; i++)
                    bar += i / 20 <= percent ? "█" : "▒";
                if (!text)
                    text = new RawText();
                if (progress.length > 1)
                    text.append("text", `Job ${++i}: `);
                text.append("translate", message).append("text", `\n${bar} ${(percent * 100).toFixed(2)}%`);
            }
            Server.queueCommand(`titleraw @s actionbar ${text.toString()}`, player);
        }
    }
    manageTickingAreaSlots() {
        const jobs = Array.from(this.jobs.values());
        const jobsRequestingArea = jobs.filter((job) => job.tickingAreaRequestTime).sort((a, b) => a.tickingAreaRequestTime - b.tickingAreaRequestTime);
        if (!jobsRequestingArea)
            return;
        const jobsUsingArea = jobs.filter((job) => job.tickingAreaUsageTime && job.tickingAreaUsageTime < Date.now() - 2000).sort((a, b) => a.tickingAreaUsageTime - b.tickingAreaUsageTime);
        for (const needy of jobsRequestingArea) {
            let slot = this.occupiedTickingAreaSlots.findIndex((slot) => !slot);
            if (slot === -1 && jobsUsingArea.length) {
                const donor = jobsUsingArea.shift();
                slot = donor.tickingAreaSlot;
                donor.tickingAreaSlot = undefined;
                donor.tickingAreaRequestTime = undefined;
                donor.tickingAreaUsageTime = undefined;
            }
            if (slot !== -1) {
                needy.tickingAreaRequestTime = undefined;
                needy.tickingAreaUsageTime = Date.now();
                needy.tickingAreaSlot = slot;
                this.occupiedTickingAreaSlots[slot] = true;
            }
        }
    }
}
export const Jobs = new JobHandler();
