import { Shape } from "./base_shape.js";
export class SphereShape extends Shape {
    constructor(radiusX, radiusY, radiusZ, domeDirection) {
        super();
        this.radii = [0, 0, 0];
        this.customHollow = true;
        this.radii[0] = radiusX;
        this.radii[1] = radiusY ?? this.radii[0];
        this.radii[2] = radiusZ ?? this.radii[1];
        this.domeDirection = domeDirection;
    }
    getRegion(loc) {
        if (this.domeDirection?.x === 1) {
            return [loc.offset(0, -this.radii[1], -this.radii[2]), loc.offset(this.radii[0], this.radii[1], this.radii[2])];
        }
        else if (this.domeDirection?.x === -1) {
            return [loc.offset(-this.radii[0], -this.radii[1], -this.radii[2]), loc.offset(0, this.radii[1], this.radii[2])];
        }
        else if (this.domeDirection?.y === 1) {
            return [loc.offset(-this.radii[0], 0, -this.radii[2]), loc.offset(this.radii[0], this.radii[1], this.radii[2])];
        }
        else if (this.domeDirection?.y === -1) {
            return [loc.offset(-this.radii[0], -this.radii[1], -this.radii[2]), loc.offset(this.radii[0], 0, this.radii[2])];
        }
        else if (this.domeDirection?.z === 1) {
            return [loc.offset(-this.radii[0], -this.radii[1], 0), loc.offset(this.radii[0], this.radii[1], this.radii[2])];
        }
        else if (this.domeDirection?.z === -1) {
            return [loc.offset(-this.radii[0], -this.radii[1], -this.radii[2]), loc.offset(this.radii[0], this.radii[1], 0)];
        }
        else {
            return [loc.offset(-this.radii[0], -this.radii[1], -this.radii[2]), loc.offset(this.radii[0], this.radii[1], this.radii[2])];
        }
    }
    getYRange() {
        throw new Error("getYRange not implemented!");
    }
    getOutline(loc) {
        // TODO: Support oblique spheres
        const maxRadius = Math.max(...this.radii) + 0.5;
        return [...this.drawCircle(loc, maxRadius, "x"), ...this.drawCircle(loc, maxRadius, "y"), ...this.drawCircle(loc, maxRadius, "z")];
    }
    prepGeneration(genVars, options) {
        genVars.isHollow = options?.hollow ?? false;
        genVars.radiiOff = this.radii.map((v) => v + 0.5);
        genVars.thickness = options?.hollowThickness ?? 1;
    }
    inShape(relLoc, genVars) {
        if (genVars.isHollow) {
            const thickness = genVars.thickness;
            const hLocal = [relLoc.x / (genVars.radiiOff[0] - thickness), relLoc.y / (genVars.radiiOff[1] - thickness), relLoc.z / (genVars.radiiOff[2] - thickness)];
            if (hLocal[0] * hLocal[0] + hLocal[1] * hLocal[1] + hLocal[2] * hLocal[2] < 1.0) {
                return false;
            }
        }
        const local = [relLoc.x / genVars.radiiOff[0], relLoc.y / genVars.radiiOff[1], relLoc.z / genVars.radiiOff[2]];
        if (local[0] * local[0] + local[1] * local[1] + local[2] * local[2] <= 1.0) {
            return true;
        }
        return false;
    }
}
