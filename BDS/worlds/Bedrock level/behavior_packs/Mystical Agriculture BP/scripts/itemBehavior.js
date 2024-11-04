import { world, system, ItemStack, ItemComponentTypes, ItemCooldownComponent, MolangVariableMap, ItemDurabilityComponent, ItemEnchantableComponent, EnchantmentTypes, EnchantmentType } from "@minecraft/server";
import { getPlayerHeldItem, setPlayerHeldItem, decrementPlayerHeldItem, damageEntityHeldItem, getPlayerHeldOffhandItem, setPlayerHeldOffhandItem } from "./utils.js";
import { growCrop, wateringCan } from "./mysticalAgriculture.js";

world.beforeEvents.worldInitialize.subscribe((e) => {
    e.itemComponentRegistry.registerCustomComponent("strat:hoe", {
        "onUseOn": function (e) {
            let didWork = false;
            if (["minecraft:dirt", "minecraft:grass_block", "minecraft:grass_path"].includes(e.block.typeId)) {
                const above = e.block.above(1);
                if (above && above.permutation.type.id === "minecraft:air") {
                    didWork = true;
                    e.block.setType("minecraft:farmland");
                    e.block.dimension.playSound("dig.gravel", e.block.location)
                }
            }
            else if ("minecraft:dirt_with_roots" === e.block.typeId) {
                //break.dirt_with_roots - dig.roots
                e.block.setType("minecraft:dirt");
                e.block.dimension.spawnItem(new ItemStack("minecraft:hanging_roots", 1), e.block.center());
                e.block.dimension.playSound("dig.roots", e.block.location);
                didWork = true;
            }
            else if ("minecraft:coarse_dirt" === e.block.typeId) {
                e.block.setType("minecraft:dirt");
                e.block.dimension.playSound("dig.gravel", e.block.location);
                didWork = true;
            }
            if (didWork) {
                damageEntityHeldItem(e.source, e.itemStack)
            }
        },
        "onMineBlock": function(e) {
            if(e.itemStack) {
                damageEntityHeldItem(e.source, e.itemStack);
            }
        }
    });
    e.itemComponentRegistry.registerCustomComponent("strat:shovel", {
        "onUseOn": function (e) {
            let didWork = false;
            if (["minecraft:dirt", "minecraft:grass_block", "minecraft:dirt_with_roots", "minecraft:coarse_dirt", "minecraft:podzol", "minecraft:mycelium"].includes(e.block.typeId)) {
                const above = e.block.above(1);
                if (above && above.permutation.type.id === "minecraft:air") {
                    didWork = true;
                    e.block.setType("minecraft:grass_path");
                    e.block.dimension.playSound("dig.gravel", e.block.location)
                }
            } else if (["minecraft:campfire", "minecraft:soul_campfire"].includes(e.block.typeId)) {
                const extinguish = e.block.permutation.getState("extinguished")
                if (!extinguish) {
                    didWork = true;
                    e.block.setPermutation(e.block.permutation.withState("extinguished", true));
                    e.block.dimension.playSound("extinguish.candle", e.block.location);
                }
            }
            if (didWork) {
                damageEntityHeldItem(e.source, e.itemStack)
            }
        },
        "onMineBlock": function(e) {
            if(e.itemStack) {
                damageEntityHeldItem(e.source, e.itemStack);
            }
        }
    });
    const Axe_Blocks = {
        "minecraft:oak_wood": "minecraft:stripped_oak_wood",
        "minecraft:spruce_wood": "minecraft:stripped_spruce_wood",
        "minecraft:birch_wood": "minecraft:stripped_birch_wood",
        "minecraft:jungle_wood": "minecraft:stripped_jungle_wood",
        "minecraft:acacia_wood": "minecraft:stripped_acacia_wood",
        "minecraft:dark_oak_wood": "minecraft:stripped_dark_oak_wood",
        "minecraft:mangrove_wood": "minecraft:stripped_mangrove_wood",
        "minecraft:cherry_wood": "minecraft:stripped_cherry_wood",
        "minecraft:crimson_hyphae": "minecraft:stripped_crimson_hyphae",
        "minecraft:warped_hyphae": "minecraft:stripped_warped_hyphae",
        "minecraft:oak_log": "minecraft:stripped_oak_log",
        "minecraft:spruce_log": "minecraft:stripped_spruce_log",
        "minecraft:birch_log": "minecraft:stripped_birch_log",
        "minecraft:jungle_log": "minecraft:stripped_jungle_log",
        "minecraft:acacia_log": "minecraft:stripped_acacia_log",
        "minecraft:dark_oak_log": "minecraft:stripped_dark_oak_log",
        "minecraft:mangrove_log": "minecraft:stripped_mangrove_log",
        "minecraft:cherry_log": "minecraft:stripped_cherry_log",
        "minecraft:crimson_stem": "minecraft:stripped_crimson_stem",
        "minecraft:warped_stem": "minecraft:stripped_warped_stem",
        "minecraft:exposed_cut_copper_stairs": "minecraft:cut_copper_stairs",
        "minecraft:weathered_cut_copper_stairs": "minecraft:exposed_cut_copper_stairs",
        "minecraft:oxidized_cut_copper_stairs": "minecraft:weathered_cut_copper_stairs",
        "minecraft:waxed_cut_copper_stairs": "minecraft:cut_copper_stairs",
        "minecraft:waxed_exposed_cut_copper_stairs": "minecraft:exposed_cut_copper_stairs",
        "minecraft:waxed_weathered_cut_copper_stairs": "minecraft:weathered_cut_copper_stairs",
        "minecraft:waxed_oxidized_cut_copper_stairs": "minecraft:oxidized_cut_copper_stairs",
        "minecraft:exposed_cut_copper_slab": "minecraft:cut_copper_slab",
        "minecraft:weathered_cut_copper_slab": "minecraft:exposed_cut_copper_slab",
        "minecraft:oxidized_cut_copper_slab": "minecraft:weathered_cut_copper_slab",
        "minecraft:waxed_cut_copper_slab": "minecraft:cut_copper_slab",
        "minecraft:waxed_exposed_cut_copper_slab": "minecraft:exposed_cut_copper_slab",
        "minecraft:waxed_weathered_cut_copper_slab": "minecraft:weathered_cut_copper_slab",
        "minecraft:waxed_oxidized_cut_copper_slab": "minecraft:oxidized_cut_copper_slab",
        "minecraft:exposed_copper": "minecraft:copper_block",
        "minecraft:exposed_copper_door": "minecraft:copper_door",
        "minecraft:exposed_copper_trapdoor": "minecraft:copper_trapdoor",
        "minecraft:weathered_copper_trapdoor": "minecraft:exposed_copper_trapdoor",
        "minecraft:exposed_copper_grate": "minecraft:copper_grate",
        "minecraft:weathered_copper": "minecraft:exposed_copper",
        "minecraft:weathered_copper_door": "minecraft:exposed_copper_door",
        "minecraft:weathered_copper_grate": "minecraft:exposed_copper_grate",
        "minecraft:oxidized_copper": "minecraft:weathered_copper",
        "minecraft:oxidized_copper_door": "minecraft:weathered_copper_door",
        "minecraft:oxidized_copper_trapdoor": "minecraft:weathered_copper_trapdoor",
        "minecraft:oxidized_copper_grate": "minecraft:weathered_copper_grate",
        "minecraft:waxed_copper": "minecraft:copper_block",
        "minecraft:waxed_copper_door": "minecraft:copper_door",
        "minecraft:waxed_copper_trapdoor": "minecraft:copper_trapdoor",
        "minecraft:waxed_copper_grate": "minecraft:copper_grate",
        "minecraft:waxed_exposed_copper": "minecraft:exposed_copper",
        "minecraft:waxed_exposed_copper_door": "minecraft:exposed_copper_door",
        "minecraft:waxed_exposed_copper_trapdoor": "minecraft:exposed_copper_trapdoor",
        "minecraft:waxed_exposed_copper_grate": "minecraft:exposed_copper_grate",
        "minecraft:waxed_weathered_copper": "minecraft:weathered_copper",
        "minecraft:waxed_weathered_copper_door": "minecraft:weathered_copper_door",
        "minecraft:waxed_weathered_copper_trapdoor": "minecraft:weathered_copper_trapdoor",
        "minecraft:waxed_weathered_copper_grate": "minecraft:weathered_copper_grate",
        "minecraft:waxed_oxidized_copper": "minecraft:oxidized_copper",
        "minecraft:waxed_oxidized_copper_door": "minecraft:oxidized_copper_door",
        "minecraft:waxed_oxidized_copper_trapdoor": "minecraft:oxidized_copper_trapdoor",
        "minecraft:waxed_oxidized_copper_grate": "minecraft:oxidized_copper_grate",
        "minecraft:exposed_cut_copper": "minecraft:cut_copper",
        "minecraft:weathered_cut_copper": "minecraft:exposed_cut_copper",
        "minecraft:oxidized_cut_copper": "minecraft:weathered_cut_copper",
        "minecraft:waxed_cut_copper": "minecraft:cut_copper",
        "minecraft:waxed_exposed_cut_copper": "minecraft:exposed_cut_copper",
        "minecraft:waxed_weathered_cut_copper": "minecraft:weathered_cut_copper",
        "minecraft:waxed_oxidized_cut_copper": "minecraft:oxidized_cut_copper",
        "minecraft:exposed_chiseled_copper": "minecraft:chiseled_copper",
        "minecraft:weathered_chiseled_copper": "minecraft:exposed_chiseled_copper",
        "minecraft:oxidized_chiseled_copper": "minecraft:weathered_chiseled_copper",
        "minecraft:waxed_chiseled_copper": "minecraft:chiseled_copper",
        "minecraft:waxed_exposed_chiseled_copper": "minecraft:exposed_chiseled_copper",
        "minecraft:waxed_oxidized_chiseled_copper": "minecraft:oxidized_chiseled_copper",
        "minecraft:waxed_weathered_chiseled_copper": "minecraft:weathered_chiseled_copper",
        "minecraft:exposed_copper_bulb": "minecraft:copper_bulb",
        "minecraft:weathered_copper_bulb": "minecraft:exposed_copper_bulb",
        "minecraft:oxidized_copper_bulb": "minecraft:weathered_copper_bulb",
        "minecraft:waxed_copper_bulb": "minecraft:copper_bulb",
        "minecraft:waxed_exposed_copper_bulb": "minecraft:exposed_copper_bulb",
        "minecraft:waxed_weathered_copper_bulb": "minecraft:weathered_copper_bulb",
        "minecraft:waxed_oxidized_copper_bulb": "minecraft:oxidized_copper_bulb"
    }
    e.itemComponentRegistry.registerCustomComponent("strat:axe", {
        "onUseOn": function (e) {
            let didWork = false;
            if (Axe_Blocks[e.block.typeId]) {
                const above = e.block.above(1);
                didWork = true;
                const permutation = e.block.permutation;
                if (e.block.typeId.includes("_door")) {
                    e.block.dimension.runCommand(
                        `setblock ${e.block.x} ${e.block.y - (permutation.getState("upper_block_bit") ? 1 : 0)} ${e.block.z} ${Axe_Blocks[e.block.typeId]} ["${Object.entries(permutation.getAllStates()).filter((value) => {
                            return value[0] !== "upper_block_bit";
                        }).map((value) => {
                            return value.join('"=');
                        }).join(',"')
                        }]`)
                } else {
                    e.block.setType(Axe_Blocks[e.block.typeId]);
                    let newPermutation = e.block.permutation;
                    Object.entries(permutation.getAllStates()).filter((value) => {
                        //List of states to ignore.
                        return !(["stripped_bit", "wood_type", "old_log_type"].includes(value[0]))
                    }).map((value) => {
                        try {
                            newPermutation = newPermutation.withState(value[0], value[1]);
                        } catch (e) {
                            console.error(e);
                        }
                    });
                    e.block.setPermutation(newPermutation);
                }
                if (e.block.typeId.includes("copper")) {
                    e.block.dimension.playSound("copper.wax.off", e.block.location)
                } else if (e.block.typeId.includes("_wood") || e.block.typeId.includes("_log")) {
                    e.block.dimension.playSound("use.wood", e.block.location)
                } else if (e.block.typeId.includes("_stem") || e.block.typeId.includes("_hyphae")) {
                    e.block.dimension.playSound("use.stem", e.block.location)
                } else {
                    e.block.dimension.playSound("dig.gravel", e.block.location)
                }
            }
            if (didWork) {
                damageEntityHeldItem(e.source, e.itemStack)
            }
        },
        "onMineBlock": function(e) {
            if(e.itemStack) {
                damageEntityHeldItem(e.source, e.itemStack);
            }
        }
    });
    e.itemComponentRegistry.registerCustomComponent("strat:watering_can", {
        "onUse": function (e) {
            wateringCan(e.itemStack, e.source, true)
        }
    });
    e.itemComponentRegistry.registerCustomComponent("strat:digger", {
        "onMineBlock": function(e) {
            if(e.itemStack) {
                damageEntityHeldItem(e.source, e.itemStack);
            }
        }
    });
    e.itemComponentRegistry.registerCustomComponent("strat:fertilizer", {
        "onUseOn": function(e) {
            if(growCrop(e.block)) {
                e.block.dimension.spawnParticle("minecraft:crop_growth_emitter", e.block.center())
                decrementPlayerHeldItem(e.source, e.itemStack);
                e.dimension.playSound("item.bone_meal.use", e.block.location);
            }
        }
    });
    e.itemComponentRegistry.registerCustomComponent("strat:super_fertilizer", {
        "onUseOn": function(e) {
            if(growCrop(e.block)) {
                decrementPlayerHeldItem(e.source, e.itemStack);
                e.block.dimension.spawnParticle("minecraft:crop_growth_emitter", e.block.center());
                growCrop(e.block);
                growCrop(e.block);
                growCrop(e.block);
                growCrop(e.block);
                growCrop(e.block);
                growCrop(e.block);
                e.dimension.playSound("item.bone_meal.use", e.block.location);
            }
        }
    });
    const Dagger_Mobs = {
        "minecraft:zombie": "strat:soul_jar_zombie_",
        "minecraft:husk": "strat:soul_jar_zombie_",
        "minecraft:drowned": "strat:soul_jar_zombie_",
        "minecraft:skeleton": "strat:soul_jar_skeleton_",
        "minecraft:stray": "strat:soul_jar_skeleton_",
        "minecraft:creeper": "strat:soul_jar_creeper_",
        "minecraft:spider": "strat:soul_jar_spider_",
        "minecraft:cave_spider": "strat:soul_jar_spider_",
        "minecraft:enderman": "strat:soul_jar_enderman_",
        "minecraft:wither_skeleton": "strat:soul_jar_wither_skeleton_",
        "minecraft:blaze": "strat:soul_jar_blaze_",
        "minecraft:ghast": "strat:soul_jar_ghast_",
        "minecraft:cow": "strat:soul_jar_cow_",
        "minecraft:sheep": "strat:soul_jar_sheep_",
        "minecraft:pig": "strat:soul_jar_pig_",
        "minecraft:chicken": "strat:soul_jar_chicken_",
        "minecraft:rabbit": "strat:soul_jar_rabbit_",
        "minecraft:slime": "strat:soul_jar_slime_",
        "minecraft:squid": "strat:soul_jar_squid_",
        "minecraft:glow_squid": "strat:soul_jar_squid_",
        "minecraft:cod": "strat:soul_jar_fish_",
        "minecraft:pufferfish": "strat:soul_jar_fish_",
        "minecraft:tropicalfish": "strat:soul_jar_fish_",
        "minecraft:salmon": "strat:soul_jar_fish_",
        "minecraft:turtle": "strat:soul_jar_turtle_",
    }
    const Passive_Mobs = [
        "minecraft:cow",
        "minecraft:sheep",
        "minecraft:pig",
        "minecraft:chicken",
        "minecraft:rabbit",
        "minecraft:slime",
        "minecraft:squid",
        "minecraft:glow_squid",
        "minecraft:cod",
        "minecraft:pufferfish",
        "minecraft:tropicalfish",
        "minecraft:salmon",
        "minecraft:turtle"
    ]
    e.itemComponentRegistry.registerCustomComponent("strat:dagger", {
        "onHitEntity": function (e) {
            if (!e.hadEffect) return;
            if (!e.itemStack) return;
            if (!e.hitEntity) return;
            if (!Dagger_Mobs[e.hitEntity.typeId]) return;
            let isPassive = false;
            if (Passive_Mobs[e.hitEntity.typeId]) isPassive = true;
            let chance = 0.1;

            let daggerType = {
                "strat:soulium_dagger_hostile": "hostile",
                "strat:soulium_dagger_passive": "passive",
                "strat:soulium_dagger": "basic",
                "strat:soulium_dagger_creative": "creative",
            }[e.itemStack.typeId]
            if (!daggerType) return;
            if (daggerType === "hostile" && !isPassive) chance += 0.2;
            if (daggerType === "passive" && isPassive) chance += 0.2;
            if (daggerType === "basic") chance += 0.1;
            if (daggerType === "creative") chance = 1;

            const offhand = getPlayerHeldOffhandItem(e.attackingEntity);
            let setItem;
            if (offhand.typeId === "strat:soul_jar") {
                setItem = Dagger_Mobs[e.hitEntity.typeId] + (daggerType === "creative" ? "4" : "1");
            } else if (offhand.typeId.startsWith(Dagger_Mobs[e.hitEntity.typeId])) {
                let value = parseInt(offhand.typeId.slice(-1))
                if (value === 4) return;
                setItem = Dagger_Mobs[e.hitEntity.typeId] + (daggerType === "creative" ? 4 : (value + 1)).toString();
            }
            if (!setItem) return;
            if (Math.random() < chance) {
                setPlayerHeldOffhandItem(e.attackingEntity, new ItemStack(setItem, 1));
                if (e.attackingEntity.typeId === "minecraft:player") e.attackingEntity.playSound("random.orb");
            }
        }
    })
});
