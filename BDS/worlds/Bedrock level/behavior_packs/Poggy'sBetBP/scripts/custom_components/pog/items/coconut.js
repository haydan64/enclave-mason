import { ItemStack, EntityInventoryComponent } from "@minecraft/server";

/** @type { import("@minecraft/server").ItemCustomComponent } */
export const events = {
    onUse: ({ source }) => {
        source.runCommandAsync("clear @s better_on_bedrock:coconut_nut 0 1");
        source.getComponent(EntityInventoryComponent.componentId).container
        .addItem(new ItemStack("better_on_bedrock:broken_open_coconut"));
    },
};