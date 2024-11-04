import { world, system, ItemStack, ItemComponentTypes, ItemCooldownComponent, ItemDurabilityComponent, ItemEnchantableComponent, EnchantmentTypes, EnchantmentType, Block } from "@minecraft/server";

export const Watering_Can_Sizes = {
    "strat:inferium_watering_can": 1,
    "strat:prudentium_watering_can": 2,
    "strat:tertium_watering_can": 3,
    "strat:imperium_watering_can": 4,
    "strat:supremium_watering_can": 5,
    "strat:watering_can": 0
}
export const Fertilizers = [
    "minecraft:bone_meal",
    "strat:fertilized_essence"
]
export const Super_Fertilizers = [
    "minecraft:rapid_fertilizer",
    "strat:mystical_fertilizer"
]

/**
 * Grows a plant using the strat:growth_stage or vanilla growth block state.
 * @param {Block} block
 * @throws This function can throw errors.
 */
export const growCrop = function (block) {
    const growth_stage = block.permutation.getState("strat:growth_stage");
    const growth = block.permutation.getState("growth");

    if (typeof growth_stage === "number") {
        try {
            const newPermutation = block.permutation.withState("strat:growth_stage", growth_stage + 1);
            if(newPermutation.getState("strat:growth_stage") > growth_stage) {
                block.setPermutation(newPermutation);
                return true;
            }
            
            return false;
        } catch (e) {
            return false;
        }
    } else if (typeof growth === "number") {
        try {
            const newPermutation = block.permutation.withState("growth", growth + 1);
            if(newPermutation.getState("growth") > growth) {
                block.setPermutation(newPermutation);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
    return false;
}
/**
 * Grows a plant using the strat:growth_stage or vanilla growth block state.
 * @param {itemStack} item
 * @throws This function can throw errors.
 */
export const wateringCan = function (itemStack, source, direct) {
    if (!itemStack) return;
    if (source.typeId === "minecraft:player") {
        /**
         * @type ItemCooldownComponent
         */
        const cooldown = itemStack.getComponent(ItemComponentTypes.Cooldown);
        if(!direct) {
            if(cooldown.getCooldownTicksRemaining(source) > 0) return;
        }
        cooldown.startCooldown(source);
    }

    const size = Watering_Can_Sizes[itemStack.typeId];
    const centerBlock = source.getBlockFromViewDirection({
        "includeLiquidBlocks": true,
        "includePassableBlocks": true,
        "maxDistance": 12
    })?.block;
    if (!centerBlock) return;
    for (let x = -size; x <= size; x++) {
        for (let z = -size; z <= size; z++) {
            if (Math.random() < 0.2) {
                growCrop(centerBlock.offset({ x, y: 0, z }));
                growCrop(centerBlock.offset({ x, y: 1, z }));
            }
            source.dimension.spawnParticle("minecraft:water_splash_particle_manual", { x: centerBlock.x + x + Math.random(), y: centerBlock.y + 1, z: centerBlock.z + z + Math.random() })
            source.dimension.spawnParticle("minecraft:water_splash_particle_manual", { x: centerBlock.x + x + Math.random(), y: centerBlock.y + 1, z: centerBlock.z + z + Math.random() })
            source.dimension.spawnParticle("minecraft:water_splash_particle_manual", { x: centerBlock.x + x + Math.random(), y: centerBlock.y + 1, z: centerBlock.z + z + Math.random() })
        }
    }
}