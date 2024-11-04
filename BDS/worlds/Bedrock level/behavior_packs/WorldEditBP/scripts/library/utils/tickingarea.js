import { Server, Vector } from "./../Minecraft.js";
import { world } from "@minecraft/server";
const DIMENSIONS = [world.getDimension("overworld"), world.getDimension("nether"), world.getDimension("the_end")];
/**
 * Sets a ticking area in a cuboid region to load chunks. Note that chunks don't get loaded immediately.
 * @returns `true` when created successfully; `false` otherwise.
 */
export function setTickingArea(start, end, dimension, name) {
    const removed = removeTickingArea(name, dimension);
    return !!Server.runCommand(`tickingarea add ${Vector.from(start).print()} ${Vector.from(end).print()} ${name}`, dimension).successCount || removed;
}
/**
 * Sets a ticking area in a circular region to load chunks. Note that chunks don't get loaded immediately.
 * @returns `true` when created successfully; `false` otherwise.
 */
export function setTickingAreaCircle(center, radius, dimension, name) {
    const removed = removeTickingArea(name, dimension);
    const result = Server.runCommand(`tickingarea add circle ${Vector.from(center).print()} ${radius} ${name}`, dimension);
    return !!result.successCount || removed;
}
/** Removes a ticking area. */
export function removeTickingArea(name, dimension) {
    if (dimension) {
        return !!Server.runCommand(`tickingarea remove ${name}`, dimension).successCount;
    }
    else {
        DIMENSIONS.forEach((d) => Server.runCommand(`tickingarea remove ${name}`, d));
    }
}
