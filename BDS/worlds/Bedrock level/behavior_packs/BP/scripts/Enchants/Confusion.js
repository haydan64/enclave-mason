import * as MM from "@minecraft/server";

export const Uses = [
    "afterPlayerHitEntity"
];

export const name = "Confusion";
export const id = name.toLowerCase().replace(/\s/g, "_");
export const maxLevel = 3;
export const appliesTo = ["weapons"];