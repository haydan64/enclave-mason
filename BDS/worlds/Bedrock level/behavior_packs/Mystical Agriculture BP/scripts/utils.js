import { world, system, Entity, Player, EntityEquippableComponent, EntityComponentTypes, EquipmentSlot, ItemStack, ItemComponentTypes, EnchantmentTypes } from "@minecraft/server";
/**
 * Gets the item the player is holding in their mainhand.
 * @param {Player} player The player with the item.
 * @throws This function can throw errors.
 */
export const getPlayerHeldItem = function (player) {
    /**
     * @type EntityEquippableComponent
     */
    const equipment = player.getComponent(EntityComponentTypes.Equippable);

    return equipment.getEquipment(EquipmentSlot.Mainhand);
}
/**
 * Gets the item the player is holding in their offhand.
 * @param {Player} player The player with the item.
 * @throws This function can throw errors.
 */
export const getPlayerHeldOffhandItem = function (player) {
    /**
     * @type EntityEquippableComponent
     */
    const equipment = player.getComponent(EntityComponentTypes.Equippable);

    return equipment.getEquipment(EquipmentSlot.Offhand);
}
/**
 * Sets the item the player is holding in their mainhand.
 * @param {Player} player The player with the item.
 * @param {ItemStack} item The item to equip. If undefined, clears the slot.
 * @throws This function can throw errors.
 */
export const setPlayerHeldItem = function (player, item) {
    if (!player) return false;
    /**
     * @type EntityEquippableComponent
     */
    const equipment = player.getComponent(EntityComponentTypes.Equippable);
    if (!equipment) return false;
    return equipment.setEquipment(EquipmentSlot.Mainhand, item);
}
/**
 * Sets the item the player is holding in their offhand.
 * @param {Player} player The player with the item.
 * @param {ItemStack} item The item to equip. If undefined, clears the slot.
 * @throws This function can throw errors.
 */
export const setPlayerHeldOffhandItem = function (player, item) {
    if (!player) return false;
    /**
     * @type EntityEquippableComponent
     */
    const equipment = player.getComponent(EntityComponentTypes.Equippable);
    if (!equipment) return false;
    return equipment.setEquipment(EquipmentSlot.Offhand, item);
}
/**
 * Decrements the item the player is holding in their mainhand.
 * @param {Player} player The player with the item.
 * @param {ItemStack} item The item to decrement and give player - leave undefined to use player's item.
 * @throws This function can throw errors.
 */
export const decrementPlayerHeldItem = function (player, item) {
    if (!player) return false;
    if (!item) item = getPlayerHeldItem(player);
    return setPlayerHeldItem(player, decrementItem(item) || undefined);
}

/**
 * Removes 1 item from the stack and returns the stack, or false if no items are left.
 * @param {ItemStack} item The item to decrement.
 * @throws This function can throw errors.
 */
export const decrementItem = function (item) {
    if (!item) return false;

    if (item.amount > 1) {
        item.amount--;
        return item;
    }
    return false;
}


/**
 * Damages the item the entity is holding in their mainhand.
 * @param {Entity} entity The entity/player with the item.
 * @param {ItemStack} item The item to damage and give entity - leave undefined to use entity's item.
 * @throws This function can throw errors.
 */
export const damageEntityHeldItem = function (entity, item) {
    if (entity.typeId === "minecraft:player" && entity.getGameMode() === "creative") return true;
    /**
     * @type ItemDurabilityComponent
     */
    const durability = item.getComponent(ItemComponentTypes.Durability);
    if (!durability) return false;
    /**
     * @type ItemEnchantableComponent
     */
    const enchants = item.getComponent(ItemComponentTypes.Enchantable);

    let unbreaking = 0;
    if (enchants) unbreaking = enchants.getEnchantment(EnchantmentTypes.get("minecraft:unbreaking"))?.level || 0;
    if (unbreaking > 3) unbreaking = 3;
    const damageChance = durability.getDamageChance(unbreaking);
    //console.info(damageChance);
    if (Math.random() < damageChance) {
        durability.damage++;
        return setPlayerHeldItem(entity, item);
    }
}