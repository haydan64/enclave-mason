import * as MM from "@minecraft/server";

export const Uses = [
    "afterPlayerKill",
];

export const name = "Lucky";
export const id = name.toLowerCase().replace(/\s/g, "_");
export const maxLevel = 3;
export const appliesTo = ["weapons"];