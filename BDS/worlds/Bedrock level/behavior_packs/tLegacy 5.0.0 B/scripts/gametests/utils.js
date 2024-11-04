import * as mc from "@minecraft/server";
import { EbreakBlocks, onlyIronBreake, onlyStoneBreake, onlyDiamondBreake, spadeBreake } from "./blocks.js";

// Utility function to get aoe tool ID based on type
function getAoeId(player, item) {
    //if (!player.isSneaking) return;
    const aoeTypes = {
        "hax:brimstone_hammer": "rc:3x3x1",
        "hax:bronze_hammer": "rc:3x3x1",
        "hax:cobalt_hammer": "rc:3x3x1",
        "hax:copper_hammer": "rc:3x3x1",
        "hax:diamond_hammer": "rc:3x3x1",
        "hax:dragonscale_hammer": "rc:3x3x1",
        "hax:electrum_hammer": "rc:3x3x1",
        "hax:emerald_hammer": "rc:3x3x1",
        "hax:enderium_hammer": "rc:3x3x1",
        "hax:gold_hammer": "rc:3x3x1",
        "hax:iron_hammer": "rc:3x3x1",
        "hax:lead_hammer": "rc:3x3x1",
        "hax:netherite_hammer": "rc:3x3x1",
        "hax:_netherite_hammer": "rc:3x3x1",
        "hax:obsidian_hammer": "rc:3x3x1",
        "hax:ruby_hammer": "rc:3x3x1",
        "hax:silver_hammer": "rc:3x3x1",
        "hax:slime_hammer": "rc:3x3x1",
        "hax:steel_hammer": "rc:3x3x1",
        "hax:stone_hammer": "rc:3x3x1",
        "hax:tin_hammer": "rc:3x3x1",
        "hax:wood_hammer": "rc:3x3x1",

        "hax:brimstone_spade": "rc:3x3x1",
        "hax:bronze_spade": "rc:3x3x1",
        "hax:cobalt_spade": "rc:3x3x1",
        "hax:copper_spade": "rc:3x3x1",
        "hax:diamond_spade": "rc:3x3x1",
        "hax:dragonscale_spade": "rc:3x3x1",
        "hax:electrum_spade": "rc:3x3x1",
        "hax:emerald_spade": "rc:3x3x1",
        "hax:enderium_spade": "rc:3x3x1",
        "hax:gold_spade": "rc:3x3x1",
        "hax:iron_spade": "rc:3x3x1",
        "hax:lead_spade": "rc:3x3x1",
        "hax:netherite_spade": "rc:3x3x1",
        "hax:_netherite_spade": "rc:3x3x1",
        "hax:obsidian_spade": "rc:3x3x1",
        "hax:ruby_spade": "rc:3x3x1",
        "hax:silver_spade": "rc:3x3x1",
        "hax:slime_spade": "rc:3x3x1",
        "hax:steel_spade": "rc:3x3x1",
        "hax:stone_spade": "rc:3x3x1",
        "hax:tin_spade": "rc:3x3x1",
        "hax:wood_spade": "rc:3x3x1"
    };
    return aoeTypes[item?.typeId];
}

// Check if the player is in creative mode
const isCreative = (player) => player.runCommand("testfor @s[m=1]").successCount === 1;

function randomChance(chance) {
    const randomNumber = Math.random();
    return randomNumber < chance
}
// Handle durability damage
function durabilityDamage(player, item, damageTotalRemove = 1) {
    if (isCreative(player)) return;
    if (!(item?.typeId.includes(("hammer")||("spade")) && item?.typeId?.startsWith("hax:"))) return;
    const durabilityComponent = item.getComponent('minecraft:durability');
    const unbreakingLevel = item.getComponent(mc.ItemComponentTypes?.Enchantable)?.getEnchantment("unbreaking")?.level || 0
    if (durabilityComponent?.damage + 1 < durabilityComponent?.maxDurability) {
        if (
            (unbreakingLevel == 0 && randomChance(1)) ||
            (unbreakingLevel == 1 && randomChance(0.5)) ||
            (unbreakingLevel == 2 && randomChance(0.33)) ||
            (unbreakingLevel == 3 && randomChance(0.25))
        ) durabilityComponent.damage += damageTotalRemove
    } else {
        player.playSound("random.break")
        item = new mc.ItemStack('minecraft:air')
    }
    player.getComponent("equippable").setEquipment("Mainhand", item)
}

// Break blocks based on aoe tool type and pattern
function breakBlocks(block, aoeType, minePattern, aoeId, entity) {
    const blockLocation = block.location;
    const blockList = {
        "hax:brimstone_hammer": [...onlyDiamondBreake, ...onlyStoneBreake, ...EbreakBlocks, ...onlyIronBreake],
        "hax:bronze_hammer": [...EbreakBlocks, ...onlyStoneBreake, ...onlyIronBreake],
        "hax:cobalt_hammer": [...EbreakBlocks, ...onlyStoneBreake, ...onlyIronBreake],
        "hax:copper_hammer": [...EbreakBlocks, ...onlyStoneBreake],
        "hax:diamond_hammer": [...onlyDiamondBreake, ...onlyStoneBreake, ...EbreakBlocks, ...onlyIronBreake],
        "hax:dragonscale_hammer": [...onlyDiamondBreake, ...onlyStoneBreake, ...EbreakBlocks, ...onlyIronBreake],
        "hax:electrum_hammer": [...EbreakBlocks, ...onlyStoneBreake],
        "hax:emerald_hammer": [...EbreakBlocks, ...onlyStoneBreake, ...onlyIronBreake],
        "hax:enderium_hammer": [...onlyDiamondBreake, ...onlyStoneBreake, ...EbreakBlocks, ...onlyIronBreake],
        "hax:gold_hammer": [...EbreakBlocks, ...onlyStoneBreake],
        "hax:iron_hammer": [...EbreakBlocks, ...onlyStoneBreake, ...onlyIronBreake],
        "hax:lead_hammer": [...EbreakBlocks, ...onlyStoneBreake, ...onlyIronBreake],
        "hax:netherite_hammer": [...onlyDiamondBreake, ...onlyStoneBreake, ...EbreakBlocks, ...onlyIronBreake],
        "hax:_netherite_hammer": [...onlyDiamondBreake, ...onlyStoneBreake, ...EbreakBlocks, ...onlyIronBreake],
        "hax:obsidian_hammer": [...EbreakBlocks, ...onlyStoneBreake],
        "hax:ruby_hammer": [...EbreakBlocks, ...onlyStoneBreake, ...onlyIronBreake],
        "hax:silver_hammer": [...EbreakBlocks, ...onlyStoneBreake],
        "hax:slime_hammer": [...EbreakBlocks],
        "hax:steel_hammer": [...EbreakBlocks, ...onlyStoneBreake, ...onlyIronBreake],
        "hax:stone_hammer": [...EbreakBlocks, ...onlyStoneBreake],
        "hax:tin_hammer": [...EbreakBlocks, ...onlyStoneBreake],
        "hax:wood_hammer": [...EbreakBlocks],

        "hax:brimstone_spade": [...spadeBreake],
        "hax:bronze_spade": [...spadeBreake],
        "hax:cobalt_spade": [...spadeBreake],
        "hax:copper_spade": [...spadeBreake],
        "hax:diamond_spade": [...spadeBreake],
        "hax:dragonscale_spade": [...spadeBreake],
        "hax:electrum_spade": [...spadeBreake],
        "hax:emerald_spade": [...spadeBreake],
        "hax:enderium_spade": [...spadeBreake],
        "hax:gold_spade": [...spadeBreake],
        "hax:iron_spade": [...spadeBreake],
        "hax:lead_spade": [...spadeBreake],
        "hax:netherite_spade": [...spadeBreake],
        "hax:_netherite_spade": [...spadeBreake],
        "hax:obsidian_spade": [...spadeBreake],
        "hax:ruby_spade": [...spadeBreake],
        "hax:silver_spade": [...spadeBreake],
        "hax:slime_spade": [...spadeBreake],
        "hax:steel_spade": [...spadeBreake],
        "hax:stone_spade": [...spadeBreake],
        "hax:tin_spade": [...spadeBreake],
        "hax:wood_spade": [...spadeBreake]
    };
    const blockTypesToBreak = blockList[aoeType.typeId];

    for (let x = minePattern[0]; x <= minePattern[3]; x++) {
        for (let y = minePattern[1]; y <= minePattern[4]; y++) {
            for (let z = minePattern[2]; z <= minePattern[5]; z++) {
                const location = { x: blockLocation.x + x, y: blockLocation.y + y, z: blockLocation.z + z };
                const replaceBlock = block.dimension.getBlock(location);
                if (replaceBlock.isValid() /*&& entity.isSneaking*/) {
                    for (const currentId of blockTypesToBreak) {
                        if (entity.runCommand(`testforblock ${location.x} ${location.y} ${location.z} ${currentId}`).successCount > 0) {
                                let item = entity?.getComponent("equippable")?.getEquipment("Mainhand")
                            if (item){
                                const silkTouchLevel = item.getComponent(mc.ItemComponentTypes?.Enchantable)?.getEnchantment("silk_touch")?.level || 0
                                const fortuneLevel = item.getComponent(mc.ItemComponentTypes?.Enchantable)?.getEnchantment("fortune")?.level || 0
                                if (fortuneLevel > 0){
                                    entity.runCommand(`setblock ${location.x} ${location.y} ${location.z} air destroy`);
                                    let fortuneItem = replaceBlock.dimension.getEntities({location:location, maxDistante:1, type: "minecraft:item"})[0]?.getComponent("item").itemStack
                                    if (fortuneItem){
                                        if (
                                            (fortuneLevel == 0 && randomChance(0)) ||
                                            (fortuneLevel == 1 && randomChance(0.40)) ||
                                            (fortuneLevel == 2 && randomChance(0.40)) ||
                                            (fortuneLevel == 3 && randomChance(0.40))
                                        ) {
                                            block.dimension.spawnItem(new mc.ItemStack(fortuneItem.typeId, fortuneLevel), replaceBlock.center())
                                        }
                                    }
                                } else
                                if (silkTouchLevel > 0){
                                    block.dimension.spawnItem(new mc.ItemStack(replaceBlock?.getItemStack()?.typeId), replaceBlock.center());
                                    entity.runCommand(`setblock ${location.x} ${location.y} ${location.z} air`);
                                } else entity.runCommand(`fill ${location.x} ${location.y} ${location.z} ${location.x} ${location.y} ${location.z} air destroy`);
                                durabilityDamage(entity, aoeType);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

export {
    isCreative,
    durabilityDamage,
    getAoeId as id,
    breakBlocks
};
