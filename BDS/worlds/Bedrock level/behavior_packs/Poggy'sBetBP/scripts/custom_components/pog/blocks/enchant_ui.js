import { EnchantmentType, EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, ItemEnchantableComponent, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui"

/** @param { import("@minecraft/server").Player } player */
function hasItem(player, itemId) {
    const container = player.getComponent(EntityInventoryComponent.componentId).container;
    for (let i = 0; i < container.size; i++) {
        const itemStack = container.getItem(i);
        if (itemStack?.typeId === itemId)
            return true;
    };

    return false;
};

const pickaxeEnchants = [
    {
        name: "Vein Miner I",
        book: "better_on_bedrock:vein_miner_book",
        lore: "§r§7Vein Miner I",
        levels: 6,
    },
    {
        name: "Auto Smelter I",
        book: "better_on_bedrock:auto_smelter",
        lore: "§r§7Ore Smelter I",
        levels: 6,
    },
];
const axeEnchants = [
    {
        name: "Tree Capitator I",
        book: "better_on_bedrock:tree_cap_book",
        lore: "§r§7Tree Capitator I",
        levels: 6,
    },
];
const hoeEnchants = [
    {
        name: "Harvest Touch I",
        book: "better_on_bedrock:harvest_touch",
        lore: "§r§7Harvest Touch I",
        levels: 6,
    },
];
const shearsEnchants = [
    {
        name: "Leafy Liberator I",
        book: "better_on_bedrock:leafy_liberator",
        lore: "§r§7Leafy Liberator I",
        levels: 6,
    },
];

/**
 * @param { import("@minecraft/server").Block } block
 * @param { import("@minecraft/server").Player } player
 */
function enchantUi(block, player, itemTag, enchants) {
    const equippable = player.getComponent(EntityEquippableComponent.componentId);
    const form = new ActionFormData()
    .title("Miner Bench")
    .body("");

    let enchantButtons = [];
    for (let i = 0; i < enchants.length; i++) {
        const enchant = enchants[i];

        const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (!itemStack.getLore().includes(enchant.lore)) {
            form.button(enchant.name);
            enchantButtons.push(enchant);
        };
    };

    if (enchantButtons.length == 0)
        form.body("No more enchants available for this item.");

    form.button("§c< Exit§r");
    form.show(player).then((response) => {
        if (response.canceled || response.selection == enchantButtons.length)
            return;

        const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (!itemStack?.hasTag(itemTag) && itemStack?.typeId !== itemTag) {
            player.sendMessage("§c[!] §rThis tool cannot be enchanted. Enchantable tools are:\n §8- §7Pickaxes\n §8- §7Axes\n §8- §7Hoes\n §8- §7Shears");
            return;
        };

        const enchant = enchantButtons[response.selection];
        if (!hasItem(player, enchant.book)) {
            player.sendMessage("§c[!] §rYou don't have the required items!");
            return;
        };

        if (player.level < enchant.levels) {
            player.sendMessage("§c[!] §rYou don't have enough levels!");
            return;
        };

        player.addLevels(-enchant.levels);
        itemStack.setLore([ enchant.lore, ...itemStack.getLore() ]);
        try {
            itemStack.getComponent(ItemEnchantableComponent.componentId)
            .addEnchantment({ type: new EnchantmentType("efficiency"), level: 1 });
        } catch {};
        player.runCommandAsync(`clear @s ${enchant.book} 0 1`);
        world.playSound("block.enchanting_table.use", block.location);
        equippable.setEquipment(EquipmentSlot.Mainhand, itemStack);
    });
};

/** @type { import("@minecraft/server").BlockCustomComponent } */
export const events = {
    onPlayerInteract: ({ block, player }) => {
        const equippable = player.getComponent(EntityEquippableComponent.componentId);
        const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);

        if (itemStack?.hasTag("minecraft:is_pickaxe")) {
            enchantUi(block, player, "minecraft:is_pickaxe", pickaxeEnchants);
            return;
        };
        
        if (itemStack?.hasTag("minecraft:is_axe")) {
            enchantUi(block, player, "minecraft:is_axe", axeEnchants);
            return;
        };
        
        if (itemStack?.hasTag("minecraft:is_hoe")) {
            enchantUi(block, player, "minecraft:is_hoe", hoeEnchants);
            return;
        };
        
        if (itemStack?.typeId == "minecraft:shears") {
            enchantUi(block, player, "minecraft:shears", shearsEnchants);
            return;
        };

        player.sendMessage("§c[!] §rThis tool cannot be enchanted. Enchantable tools are:\n §8- §7Pickaxes\n §8- §7Axes\n §8- §7Hoes\n §8- §7Shears");
    },
};