import * as MM from "@minecraft/server";

export const Uses = [
    "beforePlayerBreak",
    "beforePlayerBlockInteraction"
];

export const name = "Auto Smelt";
export const id = name.toLowerCase().replace(/\s/g, "_");
export const maxLevel = 1;
export const appliesTo = ["pickaxe", "shovel", "axe"];



/**
 * 
 * @param {MM.PlayerBreakBlockBeforeEvent} event 
 */
export function BeforePlayerBreak (event) {
    
}

/**
 * 
 * @param {MM.PlayerInteractWithBlockBeforeEvent} event 
 */
export function BeforePlayerBlockInteraction (event) {
    
}