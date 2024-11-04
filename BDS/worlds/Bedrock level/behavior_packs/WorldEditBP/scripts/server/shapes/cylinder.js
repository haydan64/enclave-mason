import { Shape } from "./base_shape.js";
import { Vector } from "./../../library/Minecraft.js";
export class CylinderShape extends Shape {
    constructor(height, radiusX, radiusZ, direction) {
        super();
        this.radii = [0, 0];
        this.customHollow = true;
        this.height = height;
        this.radii[0] = radiusX;
        this.radii[1] = radiusZ ?? this.radii[0];
        if ((direction?.x ?? 0) !== 0) {
            this.axes = ["y", "x", "z"];
        }
        else if ((direction?.z ?? 0) !== 0) {
            this.axes = ["x", "z", "y"];
        }
        else {
            this.axes = ["x", "y", "z"];
        }
    }
    getRegion(loc) {
        const center = new Vector(0, -this.height / 2, 0).ceil();
        const min = center.offset(-this.radii[0], 0, -this.radii[1]);
        const max = center.offset(this.radii[0], this.height - 1, this.radii[1]);
        return [loc.offset(min[this.axes[0]], min[this.axes[1]], min[this.axes[2]]), loc.offset(max[this.axes[0]], max[this.axes[1]], max[this.axes[2]])];
    }
    getYRange(x, z) {
        // TODO: Support cylinders facing the x and z axes.
        const [lX, lZ] = [x / (this.radii[0] + 0.5), z / (this.radii[1] + 0.5)];
        return lX * lX + lZ * lZ > 1.0 ? null : [-this.height / 2, this.height - 1 - this.height / 2];
    }
    getOutline(loc) {
        // TODO: Support oblique cylinders and different axes.
        loc = loc.offset(0, -this.height / 2, 0).ceil();
        const locWithOffset = loc.offset(0.5, 0, 0.5);
        const maxRadius = Math.max(...this.radii) + 0.5;
        const vertices = [
            locWithOffset.add([-maxRadius, 0, 0]),
            locWithOffset.add([-maxRadius, this.height, 0]),
            locWithOffset.add([maxRadius, 0, 0]),
            locWithOffset.add([maxRadius, this.height, 0]),
            locWithOffset.add([0, 0, -maxRadius]),
            locWithOffset.add([0, this.height, -maxRadius]),
            locWithOffset.add([0, 0, maxRadius]),
            locWithOffset.add([0, this.height, maxRadius]),
        ];
        const edges = [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
        ];
        return [...this.drawCircle(loc.sub([0, 0.5, 0]), maxRadius, "y"), ...this.drawCircle(loc.sub([0, 0.5, 0]).add([0, this.height, 0]), maxRadius, "y"), ...this.drawShape(vertices, edges)];
    }
    prepGeneration(genVars, options) {
        genVars.isHollow = options?.hollow ?? false;
        genVars.radiiOff = this.radii.map((v) => v + 0.5);
        genVars.thickness = options?.hollowThickness ?? 1;
    }
    inShape(relLoc, genVars) {
        if (genVars.isHollow) {
            const thickness = genVars.thickness;
            const hLocal = [relLoc[this.axes[0]] / (genVars.radiiOff[0] - thickness), relLoc[this.axes[2]] / (genVars.radiiOff[1] - thickness)];
            if (hLocal[0] * hLocal[0] + hLocal[1] * hLocal[1] < 1.0)
                return false;
        }
        const local = [relLoc[this.axes[0]] / genVars.radiiOff[0], relLoc[this.axes[2]] / genVars.radiiOff[1]];
        if (local[0] * local[0] + local[1] * local[1] <= 1.0)
            return true;
        return false;
    }
}
