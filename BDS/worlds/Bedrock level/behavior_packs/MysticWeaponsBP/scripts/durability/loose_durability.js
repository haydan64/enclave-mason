export function looseDurability(item, player, amountDamage) {
    const inv = player.getComponent('inventory').container;
    const durability = item.getComponent('durability');
    const unbreakingLevel = item.getComponent('enchantable')?.getEnchantment('unbreaking')?.level || 0;
    const destroyChance = (100 / (unbreakingLevel + 1)) / 100;

    if(Math.random() < destroyChance) {
        if(durability.maxDurability < durability.damage) {
            durability.damage = amountDamage;
            inv.setItem(player.selectedSlot, item);
        }
        else if((durability.maxDurability - durability.damage) <= (amountDamage - 1)) {
            inv.setItem(player.selectedSlot);
        }
        else {
            durability.damage += amountDamage;
            inv.setItem(player.selectedSlot, item);
        }
    }
}