import * as MM from "@minecraft/server";

export const Uses = [
    "beforePlayerBreak"
];

export const name = "Miner's Luck";
export const id = name.toLowerCase().replace(/\s/g, "_").replace("'", "");
export const maxLevel = 1;
export const appliesTo = ["pickaxe", "shovel", "axe", "mining"];