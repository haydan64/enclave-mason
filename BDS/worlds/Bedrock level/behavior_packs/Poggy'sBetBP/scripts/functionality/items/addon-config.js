import { EntityInventoryComponent, ItemStack, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

/**
 * @param { import("@minecraft/server").ItemStack } itemStack
 * @param { import("@minecraft/server").Player } player
 */
export function configScreen(itemStack, player) {
    if (itemStack.typeId !== "better_on_bedrock:config")
        return;

    new ModalFormData()
    .title("Add-On Config")
    .toggle("Corpse On Death - Enables Player Corpse", player.hasTag("allow_corpse"))
    .toggle("What Block Is This? [UI] - Enables the 'WAILA' UI", player.hasTag("toolTip"))
    .toggle("End Biome Fog - Enables fog for End biomes", player.hasTag("endFog"))
    .toggle("Falling Leaves - Disable for low-end devices", player.hasTag("fallenLeaves"))
    .slider("Required players to sleep", 1, 10, 1)
    .show(player).then((response) => {
        if (response.canceled)
            return;

        const [
            isPlayerCorpseEnabled,
            isWailaEnabled,
            isEndBiomeFogEnabled,
            isFallingLeavesEnabled,
            requiredPlayersForSleep
        ] = response.formValues;

        player.sendMessage("§a[!] §rAddon config updated!");

        // Player Corpse
        if (true == isPlayerCorpseEnabled)
            player.addTag("allow_corpse");
        else
            player.removeTag("allow_corpse");
        player.sendMessage(" §8- §7Player Corpse: ".concat(isPlayerCorpseEnabled ? "§aEnabled§r" : "§cDisabled§r"));

        // Waila
        if (true == isWailaEnabled)
            player.addTag("toolTip");
        else
            player.removeTag("toolTip");
        player.sendMessage(" §8- §7What's That UI: ".concat(isWailaEnabled ? "§aEnabled§r" : "§cDisabled§r"));

        // End Biome Fog
        if (true == isEndBiomeFogEnabled)
            player.addTag("endFog");
        else {
            player.removeTag("endFog");
            player.removeTag("abyssal");
            player.removeTag("vacant");
            player.removeTag("shroom");
            player.removeTag("void");
            player.removeTag("chorus");
            player.runCommandAsync("fog @s remove test");
        };
        player.sendMessage(" §8- §7End Biome Fog: ".concat(isEndBiomeFogEnabled ? "§aEnabled§r" : "§cDisabled§r"));

        // Falling Leaves
        if (true == isFallingLeavesEnabled)
            player.addTag("fallenLeaves");
        else
            player.removeTag("fallenLeaves");
        player.sendMessage(" §8- §7Falling Leaves: ".concat(isFallingLeavesEnabled ? "§aEnabled§r" : "§cDisabled§r"));

        player.sendMessage(" §8- §7Players required to sleep: §6".concat(requiredPlayersForSleep).concat("§r"));
        world.gameRules.playersSleepingPercentage = requiredPlayersForSleep;
    });
};

/** @param { import("@minecraft/server").Player } player */
export function configItem(player) {
    if (!player.hasTag("gotConfig")) {
        player.addTag("allow_corpse");
        player.addTag("toolTip");
        player.addTag("fallenLeaves");
        player.addTag("gotConfig");

        const inventory = player.getComponent(EntityInventoryComponent.componentId).container;
        inventory.addItem(new ItemStack("better_on_bedrock:config"));
    };
};