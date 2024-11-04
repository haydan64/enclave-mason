import { world, system } from "@minecraft/server";

import * as Quests from "./constants/Quests.js";
import * as QuestStatus from "./constants/QuestStatus.js";
export const quests = [
    {
        id: Quests.Metallis,
        s: QuestStatus.Unlocked,
    },
    {
        id: Quests.LightMyDay,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.WitchcraftBlue,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.Amethysts,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.Diamonds,
        s: QuestStatus.Locked,
    },
];
export const quests2 = [
    {
        id: Quests.sadEnderman,
        s: QuestStatus.Unlocked,
    },
    {
        id: Quests.bountyTime,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.logCollector,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.oreCollector,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.evokerSpells,
        s: QuestStatus.Locked,
    },
];
export const quests3 = [
    {
        id: Quests.DeepBelow,
        s: QuestStatus.Unlocked,
    },
    {
        id: Quests.Friends,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.Money,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.Wildfire,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.Samurai,
        s: QuestStatus.Locked,
    },
];
export const quests4 = [
    {
        id: Quests.ZombieSlayer,
        s: QuestStatus.Unlocked,
    },
    {
        id: Quests.CreeperHunter,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.StringySituation,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.MoreSouls,
        s: QuestStatus.Locked,
    },
];
export const quests7 = [
    {
        id: Quests.ThatsFine,
        s: QuestStatus.Unlocked,
    },
    {
        id: Quests.Snowwhite,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.Netherite,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.EnderPlayer,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.NetherBed,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.MovableChest,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.DragonEgg,
        s: QuestStatus.Locked,
    },
];
export const quests6 = [
    {
        id: Quests.BowMaster,
        s: QuestStatus.Unlocked,
    },
    {
        id: Quests.StayingHealthy,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.ArmoredUp,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.WillagerHat,
        s: QuestStatus.Locked,
    },
];

export const quests5 = [
    {
        id: Quests.ABigNut,
        s: QuestStatus.Unlocked,
    },
    {
        id: Quests.EggsAsPlants,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.AGoodDiet,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.WildinFood,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.GreenHay,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.CureForTears,
        s: QuestStatus.Locked,
    },
    {
        id: Quests.LeBaguette,
        s: QuestStatus.Locked,
    },
];


world.afterEvents.playerSpawn.subscribe(
    ({ player }) => {
        if (!player.getDynamicProperty("quests")) {
            player.setDynamicProperty(
                "quests",
                JSON.stringify(quests),
            );
        };
        if (!player.getDynamicProperty("quests2")) {
            player.setDynamicProperty(
                "quests2",
                JSON.stringify(quests2),
            );
        };
        if (!player.getDynamicProperty("quests3")) {
            player.setDynamicProperty(
                "quests3",
                JSON.stringify(quests3),
            );
        };
        if (!player.getDynamicProperty("quests4")) {
            player.setDynamicProperty(
                "quests4",
                JSON.stringify(quests4),
            );
        };
        if (!player.getDynamicProperty("quests5")) {
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
        };
        if (!player.getDynamicProperty("quests6")) {
            player.setDynamicProperty(
                "quests6",
                JSON.stringify(quests6),
            );
        };
        if (!player.getDynamicProperty("quests7")) {
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
        };

        if (player.getDynamicProperty("tiersCompleted") == undefined) {
            player.setDynamicProperty("tiersCompleted", 0)
        }
    },
)

let tick = 0;
system.runInterval(
    () => {
        const players = world.getAllPlayers();
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (!player.hasTag('joined3')) {
                player.addTag('joined3')
            };

            if (player.hasTag('joined3')) {
                if (!player.getDynamicProperty("quests")) {
                    player.setDynamicProperty(
                        "quests",
                        JSON.stringify(quests),
                    );
                };
                if (!player.getDynamicProperty("quests2")) {
                    player.setDynamicProperty(
                        "quests2",
                        JSON.stringify(quests2),
                    );
                };
                if (!player.getDynamicProperty("quests3")) {
                    player.setDynamicProperty(
                        "quests3",
                        JSON.stringify(quests3),
                    );
                };
                if (!player.getDynamicProperty("quests4")) {
                    player.setDynamicProperty(
                        "quests4",
                        JSON.stringify(quests4),
                    );
                };
                if (!player.getDynamicProperty("quests5")) {
                    player.setDynamicProperty(
                        "quests5",
                        JSON.stringify(quests5),
                    );
                };
                if (!player.getDynamicProperty("quests6")) {
                    player.setDynamicProperty(
                        "quests6",
                        JSON.stringify(quests6),
                    );
                };
                if (!player.getDynamicProperty("quests7")) {
                    player.setDynamicProperty(
                        "quests7",
                        JSON.stringify(quests7),
                    );
                }

                if (player.getDynamicProperty("tiersCompleted") == undefined) {
                    player.setDynamicProperty("tiersCompleted", 0)
                }
            };

            if (tick >= 20) {
                tick = 0;
                ticks(player);
            } else tick++;
        };
    },
);

const ticks = (player) => {
    const inventory = player.getComponent("inventory").container;
    for (let slot = 0; slot < inventory.size; slot++) {
        const item = inventory.getItem(slot);
        if (
            item?.typeId == "better_on_bedrock:coconut"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eBreak open on stone"]);
            inventory.setItem(slot, item);
        };

        if (
            item?.typeId == "better_on_bedrock:fixed_ghost_necklace"
            && !item.getLore().length
        ) {
            item.setLore(["§r§cRequires souls in your offhand\nto work."]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:ghost_necklace_fragment"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eCombine 4 to make a Ghost Necklace"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:stardust_nugget"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eSmelt in a furnace/blast furnace"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:amethyst_helmet"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants knockback to attacking mob"]);
            inventory.setItem(slot, item);
        };

        if (
            item?.typeId == "better_on_bedrock:amethyst_chestplate"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants knockback to attacking mob"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:amethyst_leggings"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants knockback to attacking mob"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:amethyst_boots"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants knockback to attacking mob"]);
            inventory.setItem(slot, item);
        };


        if (
            item?.typeId == "better_on_bedrock:stardust_helmet"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants health boost III"]);
            inventory.setItem(slot, item);
        };

        if (
            item?.typeId == "better_on_bedrock:stardust_chestplate"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants health boost III"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:stardust_leggings"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants health boost III"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:stardust_boots"
            && !item.getLore().length
        ) {
            item.setLore(["§r§eFull set grants health boost III"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:unactivated_default_rune"
            && !item.getLore().length
        ) {
            item.setLore(["§r§7Can be activated by a Cured Villager"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:unactivated_rune_of_mining"
            && !item.getLore().length
        ) {
            item.setLore(["§r§7Can be activated by a Cured Villager"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:unactivated_rune_of_protection"
            && !item.getLore().length
        ) {
            item.setLore(["§r§7Can be activated by a Cured Villager"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:unactivated_rune_of_strength"
            && !item.getLore().length
        ) {
            item.setLore(["§r§7Can be activated by a Cured Villager"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:unactivated_rune_of_vitality"
            && !item.getLore().length
        ) {
            item.setLore(["§r§7Can be activated by a Cured Villager"]);
            inventory.setItem(slot, item);
        };
        if (
            item?.typeId == "better_on_bedrock:unactivated_rune_of_the_seas"
            && !item.getLore().length
        ) {
            item.setLore(["§r§7Can be activated by a Cured Villager"]);
            inventory.setItem(slot, item);
        };

        //Quests Start here
        const quests = JSON.parse(player.getDynamicProperty("quests"));
        if (
            item?.typeId.includes('log') && item?.amount >= 3
            && quests.find((q) => q.id == Quests.Metallis).s == QuestStatus.Busy
        ) {
            quests.find((q) => q.id == Quests.Metallis).s = QuestStatus.Completed;
            quests.find((q) => q.id == Quests.LightMyDay).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("ironQuestDone") //this is used for our hud_screen.json to call toast
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests",
                JSON.stringify(quests),
            );
        } else if (
            item?.typeId == "minecraft:cobblestone" && item?.amount >= 14
            && quests.find((q) => q.id == Quests.LightMyDay).s == QuestStatus.Busy
        ) {
            quests.find((q) => q.id == Quests.LightMyDay).s = QuestStatus.Completed;
            quests.find((q) => q.id == Quests.WitchcraftBlue).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("coalQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests",
                JSON.stringify(quests),
            );
        } else if (
            item?.typeId === "better_on_bedrock:stone_pickaxe"
            && item?.amount >= 1
            && quests.find((q) => q.id == Quests.WitchcraftBlue).s == QuestStatus.Busy
        ) {
            quests.find((q) => q.id == Quests.WitchcraftBlue).s = QuestStatus.Completed;
            quests.find((q) => q.id == Quests.Amethysts).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("lapisQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests",
                JSON.stringify(quests),
            );
        } else if (
            item?.typeId === "better_on_bedrock:iron_pickaxe"
            && item?.amount >= 1
            && quests.find((q) => q.id == Quests.Amethysts).s == QuestStatus.Busy
        ) {
            quests.find((q) => q.id == Quests.Amethysts).s = QuestStatus.Completed;
            quests.find((q) => q.id == Quests.Diamonds).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("amethystQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests",
                JSON.stringify(quests),
            );
        } else if (
            item?.typeId === "minecraft:diamond"
            && item?.amount >= 9
            && quests.find((q) => q.id == Quests.Diamonds).s == QuestStatus.Busy
        ) {
            quests.find((q) => q.id == Quests.Diamonds).s = QuestStatus.Completed;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("tierTest")
            player.sendMessage("§a[!] §rYou have completed the §7\"Time To Mine\" §rtier!");
            player.playSound("epic_quest");
            player.runCommandAsync("give @p better_on_bedrock:adventure_hat")

            player.setDynamicProperty(
                "quests",
                JSON.stringify(quests),
            );
            player.setDynamicProperty(
                "tiersCompleted",
                1,
            );
        };

        //Tier 2
        const quests2 = JSON.parse(player.getDynamicProperty("quests2"));
        if (
            item?.typeId === "better_on_bedrock:bought_quest" && item?.amount >= 1
            && quests2.find((q) => q.id == Quests.sadEnderman).s == QuestStatus.Busy
        ) {
            quests2.find((q) => q.id == Quests.sadEnderman).s = QuestStatus.Completed;
            quests2.find((q) => q.id == Quests.bountyTime).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("enderTearQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests2",
                JSON.stringify(quests2),
            );
        } else if (
            item?.typeId === "better_on_bedrock:quest_scroll_closed" && item?.amount >= 1
            && quests2.find((q) => q.id == Quests.bountyTime).s == QuestStatus.Busy
        ) {
            quests2.find((q) => q.id == Quests.bountyTime).s = QuestStatus.Completed;
            quests2.find((q) => q.id == Quests.logCollector).s = QuestStatus.Unlocked;
            player.sendMessage("§aQuest Complete! Go claim your reward!")
            player.onScreenDisplay.setTitle("questScrollQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests2",
                JSON.stringify(quests2),
            );
        } else if (
            item?.typeId == "better_on_bedrock:scroll_of_the_nether" && item?.amount >= 1
            && quests2.find((q) => q.id == Quests.logCollector).s == QuestStatus.Busy
        ) {
            quests2.find((q) => q.id == Quests.logCollector).s = QuestStatus.Completed;
            quests2.find((q) => q.id == Quests.oreCollector).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("logQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests2",
                JSON.stringify(quests2),
            );
        } else if (
            item?.typeId === "better_on_bedrock:waystone_block" && item?.amount >= 1
            && quests2.find((q) => q.id == Quests.oreCollector).s == QuestStatus.Busy
        ) {
            quests2.find((q) => q.id == Quests.oreCollector).s = QuestStatus.Completed;
            quests2.find((q) => q.id == Quests.evokerSpells).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("oreCollectorQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests2",
                JSON.stringify(quests2),
            );
        } else if (
            item?.typeId === "better_on_bedrock:scroll_of_the_netherlvl2" && item?.amount >= 1 && quests2.find((q) => q.id == Quests.evokerSpells).s == QuestStatus.Busy
        ) {
            quests2.find((q) => q.id == Quests.evokerSpells).s = QuestStatus.Completed;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("tierTest2")
            player.sendMessage("§a[!] §rYou have completed the §7\"Time to Mine!\" §rtier!");
            player.playSound("epic_quest");
            player.setDynamicProperty(
                "quests2",
                JSON.stringify(quests2),
            );
            player.setDynamicProperty(
                "tiersCompleted",
                2,
            );
        };

        const quests3 = JSON.parse(player.getDynamicProperty("quests3"));
        if (
            item?.typeId === "better_on_bedrock:corstinite_ingot" && item?.amount >= 1
            && quests3.find((q) => q.id == Quests.DeepBelow).s == QuestStatus.Busy
        ) {
            quests3.find((q) => q.id == Quests.DeepBelow).s = QuestStatus.Completed;
            quests3.find((q) => q.id == Quests.Friends).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("deepbelowQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests3",
                JSON.stringify(quests3),
            );
        } else if (
            item?.typeId === "better_on_bedrock:quetzacaw_egg" && item?.amount >= 1
            && quests3.find((q) => q.id == Quests.Friends).s == QuestStatus.Busy
        ) {
            quests3.find((q) => q.id == Quests.Friends).s = QuestStatus.Completed;
            quests3.find((q) => q.id == Quests.Money).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("friendsrQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests3",
                JSON.stringify(quests3),
            );
        } else if (
            item?.typeId === "better_on_bedrock:blackstone_crumb" && item?.amount >= 6
            && quests3.find((q) => q.id == Quests.Money).s == QuestStatus.Busy
        ) {
            quests3.find((q) => q.id == Quests.Money).s = QuestStatus.Completed;
            quests3.find((q) => q.id == Quests.Wildfire).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("moneyQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests3",
                JSON.stringify(quests3),
            );
        }

        //Tier 3
        const quests4 = JSON.parse(player.getDynamicProperty("quests4"));
        if (
            item?.typeId === "minecraft:rotten_flesh" && item?.amount >= 32
            && quests4.find((q) => q.id == Quests.ZombieSlayer).s == QuestStatus.Busy
        ) {
            quests4.find((q) => q.id == Quests.ZombieSlayer).s = QuestStatus.Completed;
            quests4.find((q) => q.id == Quests.CreeperHunter).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("zombieSlayerQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests4",
                JSON.stringify(quests4),
            );
        } else if (
            item?.typeId === "minecraft:gunpowder" && item?.amount >= 16
            && quests4.find((q) => q.id == Quests.CreeperHunter).s == QuestStatus.Busy
        ) {
            quests4.find((q) => q.id == Quests.CreeperHunter).s = QuestStatus.Completed;
            quests4.find((q) => q.id == Quests.StringySituation).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("creeperHunterQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests4",
                JSON.stringify(quests4),
            );
        } else if (
            item?.typeId === "minecraft:string" && item?.amount >= 14
            && quests4.find((q) => q.id == Quests.StringySituation).s == QuestStatus.Busy
        ) {
            quests4.find((q) => q.id == Quests.StringySituation).s = QuestStatus.Completed;
            quests4.find((q) => q.id == Quests.MoreSouls).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("stringySituationQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests4",
                JSON.stringify(quests4),
            );
        } else if (
            item?.typeId === "better_on_bedrock:soul_star" && item?.amount >= 2
            && quests4.find((q) => q.id == Quests.MoreSouls).s == QuestStatus.Busy
        ) {
            quests4.find((q) => q.id == Quests.MoreSouls).s = QuestStatus.Completed;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("tierTest4")
            player.sendMessage("§a[!] §rYou have completed the §7\"Monster Looter\" §rtier!");
            player.playSound("epic_quest");
            player.setDynamicProperty(
                "quests4",
                JSON.stringify(quests4),
            );
            player.setDynamicProperty(
                "tiersCompleted",
                4,
            );
        };

        //Tier 4
        const quests7 = JSON.parse(player.getDynamicProperty("quests7"));
        if (
            item?.typeId === "minecraft:blaze_rod" && item?.amount >= 5
            && quests7.find((q) => q.id == Quests.ThatsFine).s == QuestStatus.Busy
        ) {
            quests7.find((q) => q.id == Quests.ThatsFine).s = QuestStatus.Completed;
            quests7.find((q) => q.id == Quests.Snowwhite).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("thatsFineQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
        } else if (
            item?.typeId === "minecraft:quartz" && item?.amount >= 32
            && quests7.find((q) => q.id == Quests.Snowwhite).s == QuestStatus.Busy
        ) {
            quests7.find((q) => q.id == Quests.Snowwhite).s = QuestStatus.Completed;
            quests7.find((q) => q.id == Quests.Netherite).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("snowwhiteQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
        } else if (
            item?.typeId === "minecraft:netherite_ingot" && item?.amount >= 1
            && quests7.find((q) => q.id == Quests.Netherite).s == QuestStatus.Busy
        ) {
            quests7.find((q) => q.id == Quests.Netherite).s = QuestStatus.Completed;
            quests7.find((q) => q.id == Quests.EnderPlayer).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("netheriteQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
        } else if (
            item?.typeId === "minecraft:chorus_fruit" && item?.amount >= 64
            && quests7.find((q) => q.id == Quests.EnderPlayer).s == QuestStatus.Busy
        ) {
            quests7.find((q) => q.id == Quests.EnderPlayer).s = QuestStatus.Completed;
            quests7.find((q) => q.id == Quests.NetherBed).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("enderPlayerQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
        } else if (
            item?.typeId === "minecraft:respawn_anchor" && item?.amount >= 1
            && quests7.find((q) => q.id == Quests.NetherBed).s == QuestStatus.Busy
        ) {
            quests7.find((q) => q.id == Quests.NetherBed).s = QuestStatus.Completed;
            quests7.find((q) => q.id == Quests.MovableChest).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("netherBedQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
        } else if (
            item?.typeId === "minecraft:undyed_shulker_box" && item?.amount >= 1
            && quests7.find((q) => q.id == Quests.MovableChest).s == QuestStatus.Busy
        ) {
            quests7.find((q) => q.id == Quests.MovableChest).s = QuestStatus.Completed;
            quests7.find((q) => q.id == Quests.DragonEgg).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("movableChestQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
        } else if (
            item?.typeId === "minecraft:dragon_egg" && item?.amount >= 1
            && quests7.find((q) => q.id == Quests.DragonEgg).s == QuestStatus.Busy
        ) {
            quests7.find((q) => q.id == Quests.DragonEgg).s = QuestStatus.Completed;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("tierTest7")
            player.sendMessage("§a[!] §rYou have completed the §7\"Beyond The Overworld\" §rtier!");
            player.playSound("epic_quest");
            player.setDynamicProperty(
                "quests7",
                JSON.stringify(quests7),
            );
            player.setDynamicProperty(
                "tiersCompleted",
                7,
            );
        };

        //Tier 5
        const quests6 = JSON.parse(player.getDynamicProperty("quests6"));
        if (
            item?.typeId === "minecraft:arrow" && item?.amount >= 48
            && quests6.find((q) => q.id == Quests.BowMaster).s == QuestStatus.Busy
        ) {
            quests6.find((q) => q.id == Quests.BowMaster).s = QuestStatus.Completed;
            quests6.find((q) => q.id == Quests.StayingHealthy).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("bowMasterQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests6",
                JSON.stringify(quests6),
            );
        } else if (
            item?.typeId === "better_on_bedrock:healthy_carrot_item" && item?.amount >= 16
            && quests6.find((q) => q.id == Quests.StayingHealthy).s == QuestStatus.Busy
        ) {
            quests6.find((q) => q.id == Quests.StayingHealthy).s = QuestStatus.Completed;
            quests6.find((q) => q.id == Quests.ArmoredUp).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("stayingHealthyQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests6",
                JSON.stringify(quests6),
            );
        } else if (
            item?.typeId === "minecraft:diamond_chestplate" && item?.amount >= 1
            && quests6.find((q) => q.id == Quests.ArmoredUp).s == QuestStatus.Busy
        ) {
            quests6.find((q) => q.id == Quests.ArmoredUp).s = QuestStatus.Completed;
            quests6.find((q) => q.id == Quests.WillagerHat).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("armoredUpQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests6",
                JSON.stringify(quests6),
            );
        } else if (
            item?.typeId === "better_on_bedrock:willager_hat_item" && item?.amount >= 1
            && quests6.find((q) => q.id == Quests.WillagerHat).s == QuestStatus.Busy
        ) {
            quests6.find((q) => q.id == Quests.WillagerHat).s = QuestStatus.Completed;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("tierTest5")
            player.sendMessage("§a[!] §rYou have completed the §7\"The Willager\" §rtier!");
            player.playSound("epic_quest");
            player.setDynamicProperty(
                "quests6",
                JSON.stringify(quests6),
            );
            player.setDynamicProperty(
                "tiersCompleted",
                5,
            );
        };

        //Tier 6
        const quests5 = JSON.parse(player.getDynamicProperty("quests5"));
        if (
            item?.typeId === "better_on_bedrock:broken_open_coconut" && item?.amount >= 1
            && quests5.find((q) => q.id == Quests.ABigNut).s == QuestStatus.Busy
        ) {
            quests5.find((q) => q.id == Quests.ABigNut).s = QuestStatus.Completed;
            quests5.find((q) => q.id == Quests.EggsAsPlants).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("aBigNutQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
        } else if (
            item?.typeId === "better_on_bedrock:baked_eggplant" && item?.amount >= 32
            && quests5.find((q) => q.id == Quests.EggsAsPlants).s == QuestStatus.Busy
        ) {
            quests5.find((q) => q.id == Quests.EggsAsPlants).s = QuestStatus.Completed;
            quests5.find((q) => q.id == Quests.AGoodDiet).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("eggsAsPlantsQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
        } else if (
            item?.typeId === "better_on_bedrock:salad" && item?.amount >= 8
            && quests5.find((q) => q.id == Quests.AGoodDiet).s == QuestStatus.Busy
        ) {
            quests5.find((q) => q.id == Quests.AGoodDiet).s = QuestStatus.Completed;
            quests5.find((q) => q.id == Quests.WildinFood).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("aGoodDietQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
        } else if (
            item?.typeId === "better_on_bedrock:wild_carrot_food" && item?.amount >= 16
            && quests5.find((q) => q.id == Quests.WildinFood).s == QuestStatus.Busy
        ) {
            quests5.find((q) => q.id == Quests.WildinFood).s = QuestStatus.Completed;
            quests5.find((q) => q.id == Quests.GreenHay).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("wildinFoodQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
        } else if (
            item?.typeId === "better_on_bedrock:barley_soup" && item?.amount >= 5
            && quests5.find((q) => q.id == Quests.GreenHay).s == QuestStatus.Busy
        ) {
            quests5.find((q) => q.id == Quests.GreenHay).s = QuestStatus.Completed;
            quests5.find((q) => q.id == Quests.CureForTears).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("greenHayQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
        } else if (
            item?.typeId === "better_on_bedrock:baked_onion" && item?.amount >= 32
            && quests5.find((q) => q.id == Quests.CureForTears).s == QuestStatus.Busy
        ) {
            quests5.find((q) => q.id == Quests.CureForTears).s = QuestStatus.Completed;
            quests5.find((q) => q.id == Quests.LeBaguette).s = QuestStatus.Unlocked;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("cureForTearsQuestDone")
            player.playSound("normal_quest");
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
        } else if (
            item?.typeId === "better_on_bedrock:baguete" && item?.amount >= 1
            && quests5.find((q) => q.id == Quests.LeBaguette).s == QuestStatus.Busy
        ) {
            quests5.find((q) => q.id == Quests.LeBaguette).s = QuestStatus.Completed;
            player.sendMessage("§a[!] §rQuest Complete! Go claim your reward!");
            player.onScreenDisplay.setTitle("tierTest6")
            player.sendMessage("§a[!] §rYou have completed the §7\"The Willager\" §rtier!");
            player.playSound("epic_quest");
            player.setDynamicProperty(
                "quests5",
                JSON.stringify(quests5),
            );
            player.setDynamicProperty(
                "tiersCompleted",
                6,
            );
        };
    };
}