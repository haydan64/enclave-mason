import * as MM from "@minecraft/server";


const VanillaEnchants = {};
MM.EnchantmentTypes.getAll().forEach(ench=>{
    VanillaEnchants[ench.id] = {
        maxLevel: ench.maxLevel,
        id: ench.id
    }
});

import * as CustomEnchants from "./Enchants/define.js"

class Enchantment {
    /**
     * @type {string} enchantmentName - The enchantment identifier.
     */
    enchant;

    /**
     * @type {number} level - The level of the enchantment.
     */
    level;
    
    /**
     * @type {bool} custom - Weather the enchant is custom or vanilla.
     */
    custom;

    /**
     * Creates an instance of Enchantment.
     * @param {string} enchant - The enchantment identifier.
     * @param {number} level - The level of the enchantment.
     * @throws Will throw an error if the enchantment ID is malformed or doesn't exist.
     */
    constructor(enchant, level) {
        enchant = enchant?.toString()?.toLowerCase();
        if (VanillaEnchants[enchant]) {
            this.enchant = VanillaEnchants[enchant];
        } else if (CustomEnchants[enchant]) {

            this.enchant = CustomEnchants[enchant];
        } else {
            throw new Error("Enchantment ID is malformed / doesn't exist.")
        }
        this.level = parseInt(level);
    }

    /**
     * Applies the enchantment to an item.
     * @param {MM.ItemStack} - The item to which the enchantment will be applied
     * @returns {boolean} - Returns true if the enchantment was applied, otherwise false.
     */
    applyToItem(item) {
        if (!item) return false;
        if (this.enchant && this.level) {
            if(this.custom) {

            } else {

            }
        }
    }
}


/**
 * Gets all enchantments from an item
 * @param {MM.ItemStack} item 
 * @returns {Enchantment}
 */
function getEnchants(item) {
    const enchants = [];
    const lore = item.getLore().filter((value)=>{value.startsWith("§%")}).map((ench)=>{
        ench = ench.split("§|")
        return {
            name: ench[0].replace("§%", "").trim(),
            level: parseInt(ench[1].replace(/\D/g, ""))
        };
    });
    const vanilla = item.getComponent("enchantable").getEnchantments();

    lore.forEach((ench)=>{
        enchants.push(new Enchantment(ench.name))
    })
}

function EnchantNameToID(name) {
    return name.trim().toLowerCase().replace(/\s/g,"_").replace("'", "");
}

/**
 * 
 * @param {MM.PlayerBreakBlockBeforeEvent} event 
 */
export function beforePlayerBreak (event) {
    const enchants = getEnchants(events);
}
