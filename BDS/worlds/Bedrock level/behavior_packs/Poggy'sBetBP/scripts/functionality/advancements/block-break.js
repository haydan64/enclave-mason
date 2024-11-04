import { world } from "@minecraft/server";

/** @param { import("@minecraft/server").PlayerBreakBlockAfterEvent } data */
export function blockBreak({
    block, brokenBlockPermutation: permutation,
    player
}) {
    let achievementName;
    switch (permutation.type.id) {
        case "minecraft:stone":
            if (player.hasTag("stone_age")) return;

            achievementName = "§eStone Age!";
            player.playSound("normal_quest");
            player.addTag("stone_age");
            player.onScreenDisplay.setTitle("stone_age");
        break;
        case "better_on_bedrock:stardust_ore":
            if (player.hasTag("stardust_ore")) return;

            achievementName = "§uMagic Stones!";
            player.playSound("epic_quest");
            player.addTag("stardust_ore");
            player.onScreenDisplay.setTitle("stardust_ore");
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