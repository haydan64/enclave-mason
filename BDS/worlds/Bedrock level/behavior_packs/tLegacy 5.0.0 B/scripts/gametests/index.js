import * as mc from '@minecraft/server';
import {
    isCreative,
    durabilityDamage,
    id,
    breakBlocks
} from "./utils.js";

// Constants for patterns
const patterns = {
    "rc:3x3x1": {
        north: [-1, -1, 0, 1, 1, 0],
        south: [-1, -1, 0, 1, 1, 0],
        west: [0, -1, -1, 0, 1, 1],
        east: [0, -1, -1, 0, 1, 1],
        down: [-1, 0, -1, 1, 0, 1],
        up: [-1, 0, -1, 1, 0, 1]
    }
};

// Utility function to get mine pattern
function getMinePattern(id, direction) {
    return patterns[id] ? patterns[id][direction] : null;
}

// Function to handle durability
function handleDurability(player, aoeTool, damageTotalRemove) {
    if (!isCreative(player)) {
        const actualDurability = aoeTool.getComponent("minecraft:durability").maxDurability - aoeTool.getComponent("minecraft:durability").damage;
        if (actualDurability > damageTotalRemove) {
            aoeTool.getComponent("durability").damage += damageTotalRemove;
            player.getComponent("equippable").setEquipment("Mainhand", aoeTool);
        } else {
            player.runCommand("replaceitem entity @s slot.weapon.mainhand 0 air");
            player.runCommand("playsound random.break @s ~ ~ ~");
        }
    }
}

// Player break block event
mc.world.beforeEvents.playerBreakBlock.subscribe(data => {
    const player = data.player;
    const block = data.block;
    const direction = player.getBlockFromViewDirection()?.face.toLowerCase();
    mc.system.run(() => {
        const aoeTool = player.getComponent("equippable")?.getEquipment("Mainhand");
        if (!aoeTool?.typeId?.startsWith("hax:")) return;
        durabilityDamage(player, aoeTool);
        const aoeToolId = id(player, aoeTool);
        const minePattern = getMinePattern(aoeToolId, direction);
        if (!minePattern) return;

        const level = aoeTool.getComponent("minecraft:enchantable")?.getEnchantment("unbreaking")?.level;
        const damageChance = Math.floor(Math.random() * 10);
        let damageTotalRemove = 1;

        if ((level === 1 && damageChance > 8) || (level === 2 && damageChance > 6) || (level === 3 && damageChance > 4)) {
            damageTotalRemove = 0;
        }

        handleDurability(player, aoeTool, damageTotalRemove);
        breakBlocks(block, aoeTool, minePattern, aoeToolId, player);
    });
});

