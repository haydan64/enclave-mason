import { Shape } from "./base_shape.js";
import { Vector } from "./../../library/Minecraft.js";
export class CuboidShape extends Shape {
    constructor(length, width, depth) {
        super();
        this.size = [0, 0, 0];
        this.customHollow = true;
        this.size = [length, width, depth];
    }
    getRegion(loc) {
        return [loc, loc.offset(this.size[0] - 1, this.size[1] - 1, this.size[2] - 1)];
    }
    getYRange() {
        return [0, this.size[1] - 1];
    }
    getOutline(loc) {
        const min = loc;
        const max = loc.add(this.size);
        const vertices = [
            new Vector(min.x, min.y, min.z),
            new Vector(max.x, min.y, min.z),
            new Vector(min.x, max.y, min.z),
            new Vector(max.x, max.y, min.z),
            new Vector(min.x, min.y, max.z),
            new Vector(max.x, min.y, max.z),
            new Vector(min.x, max.y, max.z),
            new Vector(max.x, max.y, max.z),
        ];
        const edges = [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
            [0, 2],
            [1, 3],
            [4, 6],
            [5, 7],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
        ];
        return this.drawShape(vertices, edges);
    }
    prepGeneration(genVars, options) {
        genVars.isHollow = options?.hollow ?? false;
        genVars.isWall = options?.wall ?? false;
        genVars.hollowOffset = options?.hollowThickness ?? 0;
        genVars.end = this.size.map((v) => v - (genVars.isHollow || genVars.isWall ? options?.hollowThickness ?? 1 : 1));
        if (!genVars.isHollow && !genVars.isWall) {
            genVars.isSolidCuboid = true;
        }
    }
    getChunkStatus(relLocMin, relLocMax, genVars) {
        return genVars.isWall || genVars.isHollow ? Shape.ChunkStatus.DETAIL : Shape.ChunkStatus.FULL;
    }
    inShape(relLoc, genVars) {
        const end = genVars.end;
        const hollowOffset = genVars.hollowOffset;
        if (genVars.isWall && relLoc.x > hollowOffset && relLoc.x < end[0] && relLoc.z > hollowOffset && relLoc.z < end[2]) {
            return false;
        }
        else if (genVars.isHollow && relLoc.x > hollowOffset && relLoc.x < end[0] && relLoc.y > hollowOffset && relLoc.y < end[1] && relLoc.z > hollowOffset && relLoc.z < end[2]) {
            return false;
        }
        return true;
    }
}
