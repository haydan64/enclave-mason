import { world, system, Block, BlockTypes, BlockPermutation, BlockInventoryComponent, BlockComponentTypes, ItemComponentTypes, ItemEnchantableComponent, EnchantmentTypes, EnchantmentType, ItemStack } from "@minecraft/server";
import { getPlayerHeldItem, setPlayerHeldItem, decrementPlayerHeldItem } from "./utils.js";
import { growCrop, wateringCan, Watering_Can_Sizes, Fertilizers, Super_Fertilizers } from "./mysticalAgriculture.js";

const Pedestal_Offsets = [
    { x: 3, y: 0, z: 0 },
    { x: 2, y: 0, z: 2 },
    { x: 0, y: 0, z: 3 },
    { x: -2, y: 0, z: 2 },
    { x: -3, y: 0, z: 0 },
    { x: -2, y: 0, z: -2 },
    { x: 0, y: 0, z: -3 },
    { x: 2, y: 0, z: -2 }
];



world.beforeEvents.worldInitialize.subscribe((ev) => {
    ev.blockComponentRegistry.registerCustomComponent("strat:growth_accelerator", {
        "onRandomTick": function (e) {
            e.dimension.runCommandAsync(`execute positioned ${e.block.x} ${e.block.y} ${e.block.z} run function ${e.block.typeId.split(":")[1]}`)
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:altar_deactivated", {
        "onPlayerInteract": function (e) {
            const showing_guides = !!e.block.permutation.getState("strat:pedestal_guides");
            if (showing_guides) {
                e.block.setPermutation(e.block.permutation.withState("strat:pedestal_guides", 0));
                e.dimension.runCommandAsync(`execute positioned ${e.block.x} ${e.block.y} ${e.block.z} run function strat_remove_pedestal_guides`);
            } else {
                e.block.setPermutation(e.block.permutation.withState("strat:pedestal_guides", 1));
                e.dimension.runCommandAsync(`execute positioned ${e.block.x} ${e.block.y} ${e.block.z} run function strat_pedestal_guides`);
            }
        },
        "onPlayerDestroy": function(e) {
            e.dimension.runCommandAsync(`execute positioned ${e.block.x} ${e.block.y} ${e.block.z} run function strat_remove_pedestal_guides`);
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:altar_activated", {
        "onPlayerInteract": function (e) {
            checkAlterValidity(e.block);
        },
        "onRandomTick": function (e) {
            checkAlterValidity(e.block);
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:pedestal_guide", {
        "onPlayerInteract": function (e) {
            const item = getPlayerHeldItem(e.player);
            if (item) {
                if (item.typeId === "strat:infusion_pedestal") {
                    if(e.player.getGameMode() !== "creative") decrementPlayerHeldItem(e.player, item);
                    e.block.setType("strat:infusion_pedestal");
                    e.dimension.playSound("use.stone", e.block.center());
                    pedestalChanged(e.block)
                }
            }
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:pedestal", {
        "onPlace": function (e) {
            pedestalChanged(e.block);
        },
        "onPlayerDestroy": function (e) {
            pedestalChanged(e.block);
        }
    });
    /**
     * Call this function when a pedestal is altered to make the alter valid or invalid.
     * @param {Block} block 
     */
    function pedestalChanged(block) {
        if (!block) return false;
        for (let i = 0; i < Pedestal_Offsets.length; i++) {
            const alter = block.offset(Pedestal_Offsets[i]);
            if (alter?.typeId === "strat:infusion_altar") {
                checkAlterValidity(alter);
            }
        }
    }
    /**
     * Call this function when the Validity of a alter may have changed.
     * @param {Block} alterBlock 
     * @returns null if it's not a alter, true if it's activated, false if it's deactivated.
     */
    function checkAlterValidity(alterBlock) {
        if (!alterBlock || alterBlock.typeId !== "strat:infusion_altar") return null;
        for (let i = 0; i < Pedestal_Offsets.length; i++) {
            if (alterBlock.offset(Pedestal_Offsets[i]).typeId !== "strat:infusion_pedestal") {
                alterBlock.setPermutation(alterBlock.permutation.withState("strat:activation", 0));
                return false;
            }
        }
        const activated = alterBlock.permutation.getState("strat:activation");
        if(!activated) {
            alterBlock.setPermutation(alterBlock.permutation.withState("strat:activation", 1).withState("strat:pedestal_guides", 0));
            alterBlock.dimension.playSound("random.orb", alterBlock.location);
        }
    }
    ev.blockComponentRegistry.registerCustomComponent("strat:crop", {
        "onPlayerInteract": function (e) {
            const growth_stage = e.block.permutation.getState("strat:growth_stage");
            if (growth_stage === 7) {
                e.block.setPermutation(e.block.permutation.withState("strat:growth_stage", 0))
                e.dimension.playSound("block.sweet_berry_bush.pick", e.block.center());
                e.dimension.runCommand(`loot spawn ${e.block.x + 0.5} ${e.block.y + 0.5} ${e.block.z + 0.5} loot "seeds/${e.block.typeId.split(":")[1]}"`);
                return;
            }
            if(!e.player) return;
            const item = getPlayerHeldItem(e.player);
            if(!item) return;
            if(typeof Watering_Can_Sizes[item.typeId] === "number") {
                wateringCan(item, e.player);
            } else if(Fertilizers.includes(item.typeId)) {
                if(growCrop(e.block)) {
                    e.dimension.spawnParticle("minecraft:crop_growth_emitter", e.block.center())
                    decrementPlayerHeldItem(e.player, item);
                    e.dimension.playSound("item.bone_meal.use", e.block.location);
                }
            } else if (Super_Fertilizers.includes(item.typeId)) {
                if(growth_stage !== 7) {
                    e.block.setPermutation(e.block.permutation.withState("strat:growth_stage", 7))
                    e.dimension.spawnParticle("minecraft:crop_growth_emitter", e.block.center())
                    decrementPlayerHeldItem(e.player, item);
                    e.dimension.playSound("item.bone_meal.use", e.block.location);
                }
            }
        },
        "onRandomTick": function (e) {
            const growth_stage = e.block.permutation.getState("strat:growth_stage");
            if (growth_stage < 7) {
                e.block.setPermutation(e.block.permutation.withState("strat:growth_stage", growth_stage + 1))
            }
        },
        "onPlayerDestroy": function (e) {
            if (e.destroyedBlockPermutation.getState("strat:growth_stage") === 7) {
                e.dimension.runCommand(`loot spawn ${e.block.x + 0.5} ${e.block.y} ${e.block.z + 0.5} loot "seeds/air_seeds"`)
            }
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:slab", {
        "onPlayerInteract": function (e) {
            const isBlock = !!e.block.permutation.getState("strat:block");
            const verticalHalf = e.block.permutation.getState("minecraft:vertical_half");

            if (isBlock) return;
            if (!e.player) return;
            if (verticalHalf === "bottom" && e.face === "Up" || verticalHalf === "top" && e.face === "Down") {
                const item = getPlayerHeldItem(e.player);
                if (item.typeId === e.block.permutation.getItemStack(1).typeId) {
                    decrementPlayerHeldItem(e.player, item);
                    e.block.setPermutation(e.block.permutation.withState("strat:block", 1));
                    if (e.block.hasTag("stone_sound")) e.dimension.playSound("dig.stone", e.block.center())

                }
            }
        },
        "onPlayerDestroy": function (e) {
            if (e.player?.getGameMode() === "creative") return;
            e.dimension.spawnItem(e.destroyedBlockPermutation.getItemStack(1), e.block.center());
        }
    });
    const Crop_Index = [
        [
            null,
            'strat:air_seeds',
            'strat:earth_seeds',
            'strat:fire_seeds',
            'strat:water_seeds',
            'strat:inferium_seeds',
            'strat:wood_seeds',
            'strat:dirt_seeds',
            'strat:stone_seeds',
            'strat:deepslate_seeds',
            'strat:ice_seeds',
            'strat:marble_seeds',
            'strat:flarestone_seeds',
            'strat:limestone_seeds'
        ],
        [
            null,
            'strat:coal_seeds',
            'strat:amethyst_seeds',
            'strat:nature_seeds',
            'strat:nether_seeds',
            'strat:honey_seeds'
        ],
        [
            null,
            'strat:iron_seeds',
            'strat:copper_seeds',
            'strat:redstone_seeds',
            'strat:obsidian_seeds',
            'strat:nether_quartz_seeds',
            'strat:glowstone_seeds',
            'strat:prismarine_seeds',
            'strat:pig_iron_seeds',
            'strat:tin_seeds',
            'strat:bronze_seeds',
            'strat:aluminium_seeds'
        ],
        [
            null,
            'strat:gold_seeds',
            'strat:lapis_lazuli_seeds',
            'strat:electrum_seeds',
            'strat:lead_seeds',
            'strat:steel_seeds',
            'strat:silver_seeds',
            'strat:ruby_seeds',
            'strat:cobalt_seeds',
            'strat:ardite_seeds',
            'strat:end_seeds',
            'strat:alumite_seeds',
            'strat:soulium_seeds',
            'strat:rose_gold_seeds',
            'strat:titanium_seeds',
            'strat:sapphire_seeds'
        ],
        [
            null,
            'strat:diamond_seeds',
            'strat:emerald_seeds',
            'strat:netherite_seeds',
            'strat:manyullyn_seeds',
            'strat:enderium_seeds',
            'strat:platinum_seeds',
            'strat:enderite_seeds'
        ],
        [
            null,
            'strat:cow_seeds',
            'strat:pig_seeds',
            'strat:chicken_seeds',
            'strat:sheep_seeds',
            'strat:fish_seeds',
            'strat:squid_seeds',
            'strat:turtle_seeds',
            'strat:slime_seeds'
        ],
        [
            null,
            'strat:creeper_seeds',
            'strat:zombie_seeds',
            'strat:skeleton_seeds',
            'strat:spider_seeds',
            'strat:rabbit_seeds'
        ],
        [
            null,
            'strat:blaze_seeds',
            'strat:enderman_seeds',
            'strat:ghast_seeds'
        ],
        [null, 'strat:wither_skeleton_seeds']
    ]
    ev.blockComponentRegistry.registerCustomComponent("strat:growth_pot", {
        "onPlayerInteract": function (e) {
            const index = {
                'strat:air_seeds': { crop_category: 0, crop_type: 1 },
                'strat:earth_seeds': { crop_category: 0, crop_type: 2 },
                'strat:fire_seeds': { crop_category: 0, crop_type: 3 },
                'strat:water_seeds': { crop_category: 0, crop_type: 4 },
                'strat:inferium_seeds': { crop_category: 0, crop_type: 5 },
                'strat:wood_seeds': { crop_category: 0, crop_type: 6 },
                'strat:dirt_seeds': { crop_category: 0, crop_type: 7 },
                'strat:stone_seeds': { crop_category: 0, crop_type: 8 },
                'strat:deepslate_seeds': { crop_category: 0, crop_type: 9 },
                'strat:ice_seeds': { crop_category: 0, crop_type: 10 },
                'strat:marble_seeds': { crop_category: 0, crop_type: 11 },
                'strat:flarestone_seeds': { crop_category: 0, crop_type: 12 },
                'strat:limestone_seeds': { crop_category: 0, crop_type: 13 },
                'strat:coal_seeds': { crop_category: 1, crop_type: 1 },
                'strat:amethyst_seeds': { crop_category: 1, crop_type: 2 },
                'strat:nature_seeds': { crop_category: 1, crop_type: 3 },
                'strat:nether_seeds': { crop_category: 1, crop_type: 4 },
                'strat:honey_seeds': { crop_category: 1, crop_type: 5 },
                'strat:iron_seeds': { crop_category: 2, crop_type: 1 },
                'strat:copper_seeds': { crop_category: 2, crop_type: 2 },
                'strat:redstone_seeds': { crop_category: 2, crop_type: 3 },
                'strat:obsidian_seeds': { crop_category: 2, crop_type: 4 },
                'strat:nether_quartz_seeds': { crop_category: 2, crop_type: 5 },
                'strat:glowstone_seeds': { crop_category: 2, crop_type: 6 },
                'strat:prismarine_seeds': { crop_category: 2, crop_type: 7 },
                'strat:pig_iron_seeds': { crop_category: 2, crop_type: 8 },
                'strat:tin_seeds': { crop_category: 2, crop_type: 9 },
                'strat:bronze_seeds': { crop_category: 2, crop_type: 10 },
                'strat:aluminium_seeds': { crop_category: 2, crop_type: 11 },
                'strat:gold_seeds': { crop_category: 3, crop_type: 1 },
                'strat:lapis_lazuli_seeds': { crop_category: 3, crop_type: 2 },
                'strat:electrum_seeds': { crop_category: 3, crop_type: 3 },
                'strat:lead_seeds': { crop_category: 3, crop_type: 4 },
                'strat:steel_seeds': { crop_category: 3, crop_type: 5 },
                'strat:silver_seeds': { crop_category: 3, crop_type: 6 },
                'strat:ruby_seeds': { crop_category: 3, crop_type: 7 },
                'strat:cobalt_seeds': { crop_category: 3, crop_type: 8 },
                'strat:ardite_seeds': { crop_category: 3, crop_type: 9 },
                'strat:end_seeds': { crop_category: 3, crop_type: 10 },
                'strat:alumite_seeds': { crop_category: 3, crop_type: 11 },
                'strat:soulium_seeds': { crop_category: 3, crop_type: 12 },
                'strat:rose_gold_seeds': { crop_category: 3, crop_type: 13 },
                'strat:titanium_seeds': { crop_category: 3, crop_type: 14 },
                'strat:sapphire_seeds': { crop_category: 3, crop_type: 15 },
                'strat:diamond_seeds': { crop_category: 4, crop_type: 1 },
                'strat:emerald_seeds': { crop_category: 4, crop_type: 2 },
                'strat:netherite_seeds': { crop_category: 4, crop_type: 3 },
                'strat:manyullyn_seeds': { crop_category: 4, crop_type: 4 },
                'strat:enderium_seeds': { crop_category: 4, crop_type: 5 },
                'strat:platinum_seeds': { crop_category: 4, crop_type: 6 },
                'strat:enderite_seeds': { crop_category: 4, crop_type: 7 },
                'strat:cow_seeds': { crop_category: 5, crop_type: 1 },
                'strat:pig_seeds': { crop_category: 5, crop_type: 2 },
                'strat:chicken_seeds': { crop_category: 5, crop_type: 3 },
                'strat:sheep_seeds': { crop_category: 5, crop_type: 4 },
                'strat:fish_seeds': { crop_category: 5, crop_type: 5 },
                'strat:squid_seeds': { crop_category: 5, crop_type: 6 },
                'strat:turtle_seeds': { crop_category: 5, crop_type: 7 },
                'strat:slime_seeds': { crop_category: 5, crop_type: 8 },
                'strat:creeper_seeds': { crop_category: 6, crop_type: 1 },
                'strat:zombie_seeds': { crop_category: 6, crop_type: 2 },
                'strat:skeleton_seeds': { crop_category: 6, crop_type: 3 },
                'strat:spider_seeds': { crop_category: 6, crop_type: 4 },
                'strat:rabbit_seeds': { crop_category: 6, crop_type: 5 },
                'strat:blaze_seeds': { crop_category: 7, crop_type: 1 },
                'strat:enderman_seeds': { crop_category: 7, crop_type: 2 },
                'strat:ghast_seeds': { crop_category: 7, crop_type: 3 },
                'strat:wither_skeleton_seeds': { crop_category: 8, crop_type: 1 }
            }
            const crop_category = e.block.permutation.getState("strat:crop_category");
            const crop_type = e.block.permutation.getState("strat:crop_type");
            const growth_stage = e.block.permutation.getState("strat:growth_stage");
            const automatic = e.block.permutation.getState("strat:automatic");

            if (growth_stage === 7 && crop_type !== 0) {
                //harvest crop

                const center = e.block.center();
                e.dimension.playSound("block.sweet_berry_bush.pick", center);
                e.block.setPermutation(e.block.permutation.withState("strat:growth_stage", 0));
                e.dimension.runCommandAsync(`loot spawn ${center.x} ${center.y} ${center.z} loot "seeds/${Crop_Index[crop_category][crop_type]?.split(":")[1].replace("seeds", "crop")}"`);
                return;
            }

            if (!e.player) return;

            const item = getPlayerHeldItem(e.player);

            if (item) {
                if (item.typeId === "minecraft:hopper" && !automatic) {
                    const center = e.block.center();
                    e.dimension.playSound("place.copper", center);
                    e.block.setPermutation(e.block.permutation.withState("strat:automatic", true));
                    decrementPlayerHeldItem(e.player, item);
                    return;
                }
                if (crop_type === 0) {
                    if (index[item.typeId]) {
                        //plant item in pot
                        e.dimension.playSound("block.sweet_berry_bush.place", e.block.center());
                        e.block.setPermutation(e.block.permutation
                            .withState("strat:crop_category", index[item.typeId].crop_category)
                            .withState("strat:crop_type", index[item.typeId].crop_type)
                            .withState("strat:growth_stage", 0)
                        )
                        decrementPlayerHeldItem(e.player, item);
                    }
                } else if(Fertilizers.includes(item.typeId)) {
                    if(growCrop(e.block)) {
                        decrementPlayerHeldItem(e.player, item);
                        e.dimension.playSound("item.bone_meal.use", e.block.location);
                        e.dimension.spawnParticle("minecraft:crop_growth_emitter", e.block.center())
                    };
                } else if (Super_Fertilizers.includes(item.typeId)) {
                    if(growth_stage !== 7 && crop_type !== 0) {
                        e.dimension.playSound("item.bone_meal.use", e.block.location);
                        e.block.setPermutation(e.block.permutation.withState("strat:growth_stage", 7))
                        e.dimension.spawnParticle("minecraft:crop_growth_emitter", e.block.center())
                        decrementPlayerHeldItem(e.player, item);
                    }
                } else if(typeof Watering_Can_Sizes[item.typeId] === "number") {
                    wateringCan(item, e.player);
                }
            }
        },
        "onPlayerDestroy": function (e) {
            const automatic = e.destroyedBlockPermutation.getState("strat:automatic");
            const crop_category = e.destroyedBlockPermutation.getState("strat:crop_category");
            const crop_type = e.destroyedBlockPermutation.getState("strat:crop_type");
            const growth_stage = e.destroyedBlockPermutation.getState("strat:growth_stage");
            const center = e.block.center();

            if (e.player && e.player.getGameMode() === "creative") return;

            if (automatic) {
                e.dimension.spawnItem(new ItemStack("minecraft:hopper", 1), center);
            }

            if (crop_type > 0) {
                if (growth_stage === 7) {
                    e.dimension.runCommandAsync(`loot spawn ${center.x} ${center.y} ${center.z} loot "seeds/${Crop_Index[crop_category][crop_type]?.split(":")[1].replace("seeds", "crop")}"`);
                }
                e.dimension.runCommandAsync(`loot spawn ${center.x} ${center.y} ${center.z} loot "seeds/${Crop_Index[crop_category][crop_type]?.split(":")[1]}"`);
            }
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:growth_pot_tick", {
        "onRandomTick": function (e) {
            const crop_category = e.block.permutation.getState("strat:crop_category");
            const crop_type = e.block.permutation.getState("strat:crop_type");
            const growth_stage = e.block.permutation.getState("strat:growth_stage");
            const automatic = e.block.permutation.getState("strat:automatic");
            if (growth_stage <= 6) {
                //grow crop
                e.block.setPermutation(e.block.permutation.withState("strat:growth_stage", growth_stage + 1));
            }
            if (automatic) {
                if (growth_stage >= 6) {
                    //harvest crop

                    e.dimension.playSound("block.sweet_berry_bush.pick", e.block.center());
                    e.block.setPermutation(e.block.permutation.withState("strat:growth_stage", 0));
                    const below = e.block.below(1);
                    if (below) {
                        /**
                         * @type BlockInventoryComponent
                        */
                        const inventory = below.getComponent(BlockComponentTypes.Inventory);
                        if (inventory?.container?.emptySlotsCount > 2) {
                            const center = below.center();
                            e.dimension.runCommandAsync(`loot insert ${center.x} ${center.y} ${center.z} loot "seeds/${Crop_Index[crop_category][crop_type]?.split(":")[1].replace("seeds", "crop")}"`);
                            return;
                        }
                    }
                    const center = e.block.center();
                    e.dimension.runCommandAsync(`loot spawn ${center.x} ${center.y} ${center.z} loot "seeds/${Crop_Index[crop_category][crop_type]?.split(":")[1].replace("seeds", "crop")}"`);
                }
            }
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:ore", {
        "onPlayerDestroy": function (e) {
            if(!e.player) return;
            const item = getPlayerHeldItem(e.player);
            /**
             * @type ItemEnchantableComponent
             */
            if(!item) return;
            const enchants = item.getComponent(ItemComponentTypes.Enchantable);
            if(enchants) {
                if(enchants.hasEnchantment("minecraft:silk_touch")) {
                    return;
                }
            }
            const center = e.block.center();
            let i = 0;
            while(Math.random() < 0.8 && i++ < 100) {
                e.dimension.spawnEntity("minecraft:xp_orb", center);
            }
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("strat:witherproof", {
        "onPlayerDestroy": function(e) {
            console.info("witherproof destroy!")
        }
    })
})