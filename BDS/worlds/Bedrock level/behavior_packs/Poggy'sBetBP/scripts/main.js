import { world, system, EntityInventoryComponent, ItemStack } from "@minecraft/server";

import { wawla } from "./functionality/wawla.js";
import { ghostNecklace } from "./functionality/items/ghost-necklace.js";
import { voidTotem } from "./functionality/items/void-totem.js";
import { voidBoots } from "./functionality/items/void-boots.js";

import { seeker } from "./functionality/entities/seeker.js";
import { sootEye } from "./functionality/entities/soot_eye.js";

import * as Achievements from "./functionality/advancements/index.js"
import { registerBlockComponents, registerItemComponents } from "./custom_components/index.js";

import "./scripting_events/index.js";
import "./functionality/index.js";
import "./functionality/entities/inferior.js"
import "./functionality/custom_spear/handler.js";


/** @param { import("@minecraft/server").Vector3 } vector */
function vectorLength(vector) {
    const x = Math.pow(vector.x, 2);
    const y = Math.pow(vector.y, 2);
    const z = Math.pow(vector.z, 2);
    return Math.sqrt(x + y + z);
};

system.runInterval(() => {
    const players = world.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.hasTag("toolTip"))
            wawla(player);
    };
});

// Main interval
system.runInterval(() => {
    const players = world.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        Achievements.getItems(player);

        // First time moving
        const velocityVector = player.getVelocity();
        const velocity = vectorLength({ x: velocityVector.x, y: 0, z: velocityVector.z });
        if (velocity > 0 && !player.hasTag("introMove")) {
            player.addTag("introMove");

            player.sendMessage("§6[!] §rThanks for playing §7Better on Bedrock§r! Be sure to read the info book to get started on what to expect and how some things work!");
            player.onScreenDisplay.setTitle("begin");
            player.playSound("normal_quest");

            const container = player.getComponent(EntityInventoryComponent.componentId).container;
            container.addItem(new ItemStack("better_on_bedrock:lost_journal"));
            container.addItem(new ItemStack("better_on_bedrock:quest_paper"));
        };

        ghostNecklace(player);
        voidTotem(player);
        voidBoots(player);

        // Boss attacks
        seeker(player);
        sootEye(player);
    };
}, 2);

// Custom Components
world.beforeEvents.worldInitialize.subscribe(
    ({ blockComponentRegistry, itemComponentRegistry }) => {
        registerBlockComponents(blockComponentRegistry);
        registerItemComponents(itemComponentRegistry);
    },
);