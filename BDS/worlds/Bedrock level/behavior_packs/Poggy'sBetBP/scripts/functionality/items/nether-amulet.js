import { EntityDamageCause, EntityEquippableComponent, EquipmentSlot, ItemStack, TicksPerSecond } from "@minecraft/server";

/**
 * @param { import("@minecraft/server").ItemStack } itemStack
 * @param { import("@minecraft/server").Player } player
 */
export function netherAmulet(itemStack, player) {
    if (!player.isSneaking)
        return;

    const equippable = player.getComponent(EntityEquippableComponent.componentId);
    switch (itemStack.typeId) {
        case "better_on_bedrock:nether_amulet_3_stone_yellow_red_green":
            equippable.setEquipment(EquipmentSlot.Mainhand, new ItemStack("better_on_bedrock:nether_amulet_full_purple_active"));
        break;
        case "better_on_bedrock:nether_amulet_full_purple_active":
            equippable.setEquipment(EquipmentSlot.Mainhand, new ItemStack("better_on_bedrock:nether_amulet_full_red_active"));
        break;
        case "better_on_bedrock:nether_amulet_full_red_active":
            equippable.setEquipment(EquipmentSlot.Mainhand, new ItemStack("better_on_bedrock:nether_amulet_3_stone_yellow_red_green"));
        break;
    };
};

/**
 * @param { import("@minecraft/server").ItemStack } itemStack
 * @param { import("@minecraft/server").Player } player
 */
export function startUseAmulet(itemStack, player) {
    if (player.isSneaking || itemStack == undefined)
        return;

    switch (itemStack.typeId) {
        case "better_on_bedrock:nether_amulet_full_purple_active": {
            player.playSound("mob.amulet.shoot");
            player.dimension.spawnEntity("minecraft:wither_skull_dangerous", {
                x: player.getHeadLocation().x + player.getViewDirection().x,
                y: player.getHeadLocation().y + player.getViewDirection().y,
                z: player.getHeadLocation().z + player.getViewDirection().z
            })
            .applyImpulse(player.getViewDirection());
            break;
        };
    };
};


/**
 * @param { import("@minecraft/server").ItemStack } itemStack
 * @param { import("@minecraft/server").Player } player
 */
export function releaseUseAmulet(itemStack, player) {
    if (player.isSneaking || itemStack == undefined)
        return;

    switch (itemStack.typeId) {
        case "better_on_bedrock:nether_amulet_full_red_active": {
            player.addEffect("regeneration", TicksPerSecond * 30, { amplifier: 2, showParticles: false });
            player.dimension.getEntities({
                location: player.location,
                maxDistance: 16,
                excludeTypes: [ "minecraft:player" ]
            })
            .forEach((entity) => entity.applyDamage(15, { cause: EntityDamageCause.fire }));
            player.dimension.spawnParticle("pog:heal", player.location);
            break;
        };
        case "better_on_bedrock:nether_amulet_3_stone_yellow_red_green": {
            player.playSound("mob.amulet.shoot");
            player.dimension.spawnEntity("better_on_bedrock:inferno_shield", {
                x: player.getHeadLocation().x + player.getViewDirection().x,
                y: player.getHeadLocation().y + player.getViewDirection().y,
                z: player.getHeadLocation().z + player.getViewDirection().z
            })
            .applyImpulse(player.getViewDirection());
            break;
        };
    };
};