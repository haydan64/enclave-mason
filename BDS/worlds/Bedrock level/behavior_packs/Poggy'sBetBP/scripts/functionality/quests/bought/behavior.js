import { world, system, ItemStack, Player, EntityInventoryComponent } from "@minecraft/server";

export const items = {
    "better_on_bedrock:vein_miner_book": {
        id: 0,
        rarity: 2,
        name: "Enchanted Expedition",
        description: "Obtain every enchanted book added by Better on Bedrock. This can be done via searching chests or buying from Librarian Villagers\n\n§e§lRewards§r\n§8- §71000x XP\n§8- §71x Random Lootbag",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(1000);
            player.dimension.spawnItem(new ItemStack("better_on_bedrock:rare_lootbag", 1), player.location);
            player.dimension.spawnItem(new ItemStack("minecraft:amethyst_shard", 3), player.location);
        },
    },
    "better_on_bedrock:willager_hat_item": {
        id: 1,
        rarity: 0,
        name: "Goblin Menace",
        description: "Obtain a Willager Hat by defeating the Willager.\n\n§e§lRewards§r\n§8- §7500 XP\n§8- §75x Emerald",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(500);
            player.dimension.spawnItem(new ItemStack("minecraft:emerald", 5), player.location);
        },
    },
    "better_on_bedrock:quetzacaw_egg": {
        id: 2,
        rarity: 1,
        name: "Wisdom Elixir",
        description: "Obtain 5 Quetzacaw eggs which are found in nether chests.\n\n§e§lRewards§r\n§8- §7250x XP\n§8- §71x Random Lootbag",
        requiredAmount: 5,
        reward: (player) => {
            player.addExperience(250);
            player.dimension.spawnItem(new ItemStack("better_on_bedrock:rare_lootbag", 1), player.location);
        },
    },
    "better_on_bedrock:ghost_necklace_fragment": {
        id: 4,
        rarity: 2,
        name: "Mystical Relics",
        description: "Obtain 4 Necklace Fragments by killing 2 Flenders.\n\n§e§lRewards§r\n§8- §72000x XP\n§8- §71x Totem of Undying",
        requiredAmount: 4,
        reward: (player) => {
            player.addExperience(2000);
            player.dimension.spawnItem(new ItemStack("minecraft:totem_of_undying", 1), player.location);
        },
    },
    "minecraft:heart_of_the_sea": {
        id: 5,
        rarity: 1,
        name: "Treasure Hunter",
        description: "Obtain a heart of the sea by searching Treasure Chests.\n\n§e§lRewards§r\n§8- §7500x XP\n§8- §72x Golden Apples",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(500);
            player.dimension.spawnItem(new ItemStack("minecraft:golden_apple", 2), player.location);
        },
    },
    "better_on_bedrock:deepslate_stardust_ore": {
        id: 7,
        rarity: 3,
        name: "Celestial Elements",
        description: "Obtain Deepslate Stardust Ore. Found at Deepslate level (Y0 - Y-24).\n\n§e§lRewards§r\n§8- §7269 XP\n§8- §73x Stardust Ingot",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(269);
            player.dimension.spawnItem(new ItemStack("better_on_bedrock:stardust_ingot", 3), player.location);
        },
    },
    "minecraft:ghast_tear": {
        id: 9,
        rarity: 1,
        name: "Ghostly Tears",
        description: "Obtain 2 Ghast Tears.\n\n§e§lRewards§r\n§8- §7232x XP\n§8- §72x Phantom Membrane",
        requiredAmount: 2,
        reward: (player) => {
            player.addExperience(232);
            player.dimension.spawnItem(new ItemStack("minecraft:phantom_membrane", 2), player.location);
        },
    },
    "better_on_bedrock:quetzacaw_feather": {
        id: 11,
        rarity: 3,
        name: "Phoenix Rising",
        description: "Obtain Quetzacaw Feathers.\n\n§e§lRewards§r\n§8- §7496 XP",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(496);
        },
    },
    "minecraft:arrow": {
        id: 13,
        rarity: 1,
        name: "Spectral Hunt",
        description: "Obtain at least 69 Arrows.\n\n§e§lRewards§r\n§8- §7150x XP",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(150);
        },
    },
    "better_on_bedrock:bounty_paper_open": {
        id: 14,
        rarity: 0,
        name: "Lost Scroll",
        description: "Obtain a Bounty Scroll found in a Trader Outpost bounty board.\n\n§e§lRewards§r\n- 200x XP\n§8- §71x Iron Sword",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(200);
            player.dimension.spawnItem(new ItemStack("minecraft:iron_sword", 1), player.location);
        },
    },
};

export const entities = {
    "minecraft:ender_dragon": {
        id: 3,
        rarity: 3,
        name: "Dragon's Hoard",
        description: "Slay the Ender Dragon.\n\n§e§lRewards§r\n§8- §78000x XP\n§8- §75x Netherite Ingot",
        reward: (player) => {
            player.addExperience(8000);
            player.dimension.spawnItem(new ItemStack("minecraft:netherite_ingot", 5), player.location);
        },
    },
    "better_on_bedrock:inferior": {
        id: 8,
        rarity: 2,
        name: "Eternal Flame",
        description: "Slain the Inferior.\n\n§e§lRewards§r\n§8- §71000x XP\n§8- §72x Fiery Ingots\n§8- §73x Combined Elements",
        reward: (player) => {
            player.addExperience(1000);
            player.dimension.spawnItem(new ItemStack("better_on_bedrock:firey_ingot", 2), player.location);
            player.dimension.spawnItem(new ItemStack("better_on_bedrock:combined_elements", 3), player.location);
        },
    },
};

export const dimensions = {
    "minecraft:the_end": {
        id: 16,
        rarity: 3,
        name: "Abyssal Enigma",
        description: "Enter The End.\n\n§e§lRewards§r\n§8- §71000x XP\n§8- §73x Ender Pearl\n§8- §75x Prismarine Shards",
        reward: (player) => {
            player.addExperience(1000);
            player.dimension.spawnItem(new ItemStack("minecraft:ender_pearl", 3), player.location);
            player.dimension.spawnItem(new ItemStack("minecraft:prismarine_shard", 5), player.location);
        },
    },
};

world.afterEvents.entityDie.subscribe(
    ({ damageSource, deadEntity }) => {
        if (!(damageSource.damagingEntity instanceof Player))
            return;

        if (entities[deadEntity.typeId] == undefined)
            return;

        const quest = entities[deadEntity.typeId];
        const player = damageSource.damagingEntity;
        const unlockedQuests = JSON.parse(player.getDynamicProperty("unlockedQuests"));
        const q = unlockedQuests.find((q) => q[0] == quest.id);
        const isUnlocked = q !== undefined;
        if (!isUnlocked || q[2] == 1)
            return;

        q[2] = 1;
        quest.reward(player);
        player.playSound(q[1] > 1 ? "epic_quest" : "normal_quest");
        player.sendMessage({ translate: "bob.message.questComplete", with: [quest.name] });
        player.setDynamicProperty("unlockedQuests", JSON.stringify(unlockedQuests));
    },
);

export const extras = {
    veinMiner: {
        id: 10,
        rarity: 0,
        name: "Miner's Dilemma",
        description: "Have a pickaxe that has Vein Miner I.\n\n§e§lRewards§r\n§8- §7231 XP\n§8- §73x Diamond",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(231);
            player.dimension.spawnItem(new ItemStack("minecraft:diamond", 2), player.location);
        },
    },
    trophies: {
        id: 12,
        rarity: 2,
        name: "Enigmatic Artifacts",
        description: "Obtain a Boss Trophy.\n\n§e§lRewards§r\n§8- §72000x XP",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(2000);
        },
    },
    stone: {
        id: 15,
        rarity: 3,
        name: "Titan's Gauntlet",
        description: "Obtain a Nether Stone. Usually found in Blackstone Castle Chests.\n\n§e§lRewards§r\n§8- §71000x XP\n§8- §72x Nether Star",
        requiredAmount: 1,
        reward: (player) => {
            player.addExperience(1000);
            player.dimension.spawnItem(new ItemStack("minecraft:nether_star", 2), player.location);
        },
    },
};

system.runInterval(() => {
    const players = world.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const container = player.getComponent(EntityInventoryComponent.componentId).container;
        for (let k = 0; k < container.size; k++) {
            const itemStack = container.getItem(k);
            if (itemStack == undefined)
                continue;

            const lore = itemStack.getLore();
            let quest;
            if (itemStack.typeId.includes("pickaxe") && lore.includes("§r§7Vein Miner I")) {
                quest = extras["veinMiner"];
            }
            else if (itemStack.typeId.includes("trophy")) {
                quest = extras["trophies"];
            }
            else if (itemStack.typeId.includes("_stone")) {
                quest = extras["stone"];
            }
            else quest = items[itemStack.typeId];

            if (quest == undefined)
                continue;

            const unlockedQuests = JSON.parse(player.getDynamicProperty("unlockedQuests") ?? "[]");
            let q = unlockedQuests.find((q) => q[0] == quest.id);
            const isUnlocked = q !== undefined;
            if (!isUnlocked || q[2] == 1 || quest.requiredAmount > itemStack.amount)
                continue;

            q[2] = 1;
            quest.reward(player);
            player.playSound(q[1] > 1 ? "epic_quest" : "normal_quest");
            player.sendMessage({ translate: "bob.message.questComplete", with: [quest.name] });
            player.setDynamicProperty("unlockedQuests", JSON.stringify(unlockedQuests));
        };
    };
}, 20);

world.afterEvents.playerDimensionChange.subscribe(
    ({ player, toDimension }) => {
        if (dimensions[toDimension.id] == undefined)
            return;

        const quest = dimensions[toDimension.id];
        const unlockedQuests = JSON.parse(player.getDynamicProperty("unlockedQuests"));
        const q = unlockedQuests.find((q) => q[0] == quest.id);
        const isUnlocked = q !== undefined;
        if (!isUnlocked || q[2] == 1)
            return;

        q[2] = 1;
        quest.reward(player);
        player.playSound(q[1] > 1 ? "epic_quest" : "normal_quest");
        player.sendMessage({ translate: "bob.message.questComplete", with: [quest.name] });
        player.setDynamicProperty("unlockedQuests", JSON.stringify(unlockedQuests));
    },
);