import * as MM from "@minecraft/server";

export const Uses = [
    "afterPlayerHitEntity",
    "afterPlayerBreak",
    "afterProjectileHitEntity",
    "afterProjectileHitBlock",
    ""
];

export const name = "Explosive";
export const id = name.toLowerCase().replace(/\s/g, "_");
export const maxLevel = 3;
export const appliesTo = ["weapons", "mining", "bows"];