import { world } from "@minecraft/server";

/**
 * @param { import("@minecraft/server").Block } block
 * @param { import("@minecraft/server").Dimension } dimension
 * @param { import("@minecraft/server").Player } player
 */
export function blockPlace(block, dimension, player) {
    let achievementName;
    switch (block.typeId) {
        case "better_on_bedrock:enchant_bench":
            if (player.hasTag("firts_block")) return;

            achievementName = "§aMiner's Dream!";
            player.playSound("normal_quest");
            player.addTag("firts_block");
        break;
        case "minecraft:carrots":
            if (player.hasTag("carrots")) return;

            achievementName = "§aA Seedy Place!";
            player.playSound("normal_quest");
            player.addTag("carrots");
        break;
        case "minecraft:crafting_table":
            if (player.hasTag("craftingTable")) return;

            achievementName = "§aBenchmarking!";
            player.playSound("normal_quest");
            player.addTag("craftingTable");
            player.onScreenDisplay.setTitle("craftingTable");
        break;
        default: return;
    };

    world.sendMessage({
        translate: "bob.message.achievementMade",
        with: [
            player.name,
            achievementName
        ],
    });
};