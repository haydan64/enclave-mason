import * as MM from "@minecraft/server";

export const Uses = [
    "afterPlayerHitEntity"
];

export const name = "Shuffle";
export const id = name.toLowerCase().replace(/\s/g, "_");
export const maxLevel = 1;
export const appliesTo = ["weapons"];