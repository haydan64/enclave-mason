import { EntityEquippableComponent, EntityInventoryComponent, ItemDurabilityComponent, ItemStack } from "@minecraft/server";

/**
 * @param { import("@minecraft/server").BlockPermutation } permutation
 * @param { import("@minecraft/server").Player } player
 * @param { import("@minecraft/server").ItemStack } itemStack
 */
export function stonePickaxe(permutation, player, itemStack) {
    const block = player.getBlockFromViewDirection({ maxDistance: 8 })?.block;
    switch (permutation.type.id) {
        case "minecraft:iron_ore": {
            if (itemStack.typeId !== "minecraft:stone_pickaxe"
                && itemStack.typeId !== "better_on_bedrock:stone_pickaxe")
                return;

            player.playSound("random.break");
            player.sendMessage("§c[!] §rYou can only mine this ore with a copper or better pickaxe!");
            block.dimension.getEntities({ type: "minecraft:item", location: block.location, maxDistance: 3 }).forEach((entity) => {
                entity.kill()
            })
            break;
        };
    };
};