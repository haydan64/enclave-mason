import { Shape } from "./base_shape.js";
export class PyramidShape extends Shape {
    constructor(size) {
        super();
        this.customHollow = true;
        this.size = size;
    }
    getRegion(loc) {
        return [loc.offset(-this.size + 1, 0, -this.size + 1), loc.offset(this.size - 1, this.size - 1, this.size - 1)];
    }
    getYRange() {
        throw new Error("getYRange not implemented!");
    }
    getOutline(loc) {
        const vertices = [
            loc.add([-this.size + 1, 0, -this.size + 1]),
            loc.add([-this.size + 1, 0, this.size]),
            loc.add([this.size, 0, -this.size + 1]),
            loc.add([this.size, 0, this.size]),
            loc.add([0.5, this.size, 0.5]),
        ];
        const edges = [
            [0, 1],
            [1, 3],
            [2, 0],
            [3, 2],
            [0, 4],
            [1, 4],
            [2, 4],
            [3, 4],
        ];
        return this.drawShape(vertices, edges);
    }
    prepGeneration(genVars, options) {
        genVars.isHollow = options?.hollow ?? false;
        genVars.thickness = options?.hollowThickness ?? 1;
    }
    inShape(relLoc, genVars) {
        const latSize = this.size - relLoc.y - 0.5;
        const local = [relLoc.x, relLoc.z];
        if (genVars.isHollow) {
            const hLatSize = latSize - genVars.thickness;
            if (local[0] > -hLatSize && local[0] < hLatSize && local[1] > -hLatSize && local[1] < hLatSize) {
                return false;
            }
        }
        if (local[0] > -latSize && local[0] < latSize && local[1] > -latSize && local[1] < latSize) {
            return true;
        }
        return false;
    }
}
