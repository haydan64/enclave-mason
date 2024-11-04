import * as MM from "@minecraft/server";

export const Uses = [
    "afterPlayerKill"
];

export const name = "Decapitation";
export const id = name.toLowerCase().replace(/\s/g, "_");
export const maxLevel = 3;
export const appliesTo = ["weapons"];