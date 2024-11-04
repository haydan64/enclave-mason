import { world, system, ItemStack, ItemComponentTypes, ItemCooldownComponent, MolangVariableMap, ItemDurabilityComponent, ItemEnchantableComponent, EnchantmentTypes, EnchantmentType } from "@minecraft/server";
import { getPlayerHeldItem, setPlayerHeldItem, decrementPlayerHeldItem } from "./utils.js";
import { growCrop } from "./mysticalAgriculture.js";

