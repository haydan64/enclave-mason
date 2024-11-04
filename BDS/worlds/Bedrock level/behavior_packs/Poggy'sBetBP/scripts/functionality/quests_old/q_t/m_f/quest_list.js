import { ActionFormData } from "@minecraft/server-ui";

import * as Quests from "../../constants/Quests.js";
import * as QuestStatus from "../../constants/QuestStatus.js";

const getFormattedStatus = (status) => {
    if (status == 0) return "§cLocked§r";
    else if (status == 1) return "§qUnlocked§r";
    else if (status == 2) return "§dBusy§r";
    else if (status == 3) return "§pCompleted§r";
    else if (status == 4) return "§aClaimed§r";
};

const quests = [
    {
        id: Quests.ABigNut,
        name: "A Big Nut",
        icon: "textures/items/crops/food/Opened_Coconut",
        info: (player) => {
            const form = new ActionFormData();
            form.title("§uA Big Nut");
            form.body("Get a Broken Open Coconut by breaking open a whole coconut on stone.\n§dRewards:\n§c- 125 XP");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData();
            form.title("Start Quest?");
            form.body("Get a Broken Open Coconut by breaking open a whole coconut on stone.\n§dRewards:\n§c- 125 XP");
            form.button("Start Quest!");
            form.button("Cancel");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_1");
                            player.onScreenDisplay.setTitle('ABigNutQuestStart');
                            player.sendMessage("§a[!] §rQuest Started!");
                            savedQuests.find((q) => q.id == Quests.ABigNut).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests5",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData();
            form.title("§uA Big Nut");
            form.body("§dClaim:\n§c- 125 XP");
            form.button("Claim");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.ABigNut);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 125");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests5",
                                    JSON.stringify(savedQuests),
                                );
                            };
                            break;
                    };
                },
            );
        },
    },
    {
        id: Quests.EggsAsPlants,
        name: "Eggs as plants?",
        icon: "textures/items/crops/food/Eggplant_Item",
        locked: (player) => player.sendMessage("§cYou need to complete \"A Big Nut\" in order to unlock this quest."),
        info: (player) => {
            const form = new ActionFormData();
            form.title("§uEggs as plants?");
            form.body("Get 32 Baked Eggplants.\n§dRewards:\n§c- 100 XP");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("Start Quest?")
            form.body("Get 32 Baked Eggplants.\n§dRewards:\n§c- 100 XP")
            form.button("Start Quest!")
            form.button("Cancel")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_2")
                            player.onScreenDisplay.setTitle('EggsAsPlantsQuestStart')
                            player.sendMessage("§aQuest Started!")
                            savedQuests.find((q) => q.id == Quests.EggsAsPlants).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests5",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("§uEggs as plants?")
            form.body("§dClaim:\n§c- 100 XP")
            form.button("Claim")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.EggsAsPlants);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 100");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests5",
                                    JSON.stringify(savedQuests),
                                );
                            };
                            break;
                    };
                },
            );
        },
    },
    {
        id: Quests.AGoodDiet,
        name: "A Good Diet",
        icon: "textures/items/crops/food/salad",
        locked: (player) => player.sendMessage("§cYou need to complete \"Eggs as plants?\" in order to unlock this quest."),
        info: (player) => {
            const form = new ActionFormData();
            form.title("§uA Good Diet");
            form.body("Get 8 Salad.\n§dRewards:\n§c- 3x Healthy Carrots\n§c- 50 XP");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("Start Quest?")
            form.body("Get 8 Salad.\n§dRewards:\n§c- 3x Healthy Carrots\n§c- 50 XP")
            form.button("Start Quest!")
            form.button("Cancel")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_2")
                            player.onScreenDisplay.setTitle('AGoodDietQuestStart')
                            player.sendMessage("§aQuest Started!")
                            savedQuests.find((q) => q.id == Quests.AGoodDiet).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests5",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("§uA Good Diet")
            form.body("§dClaim:\n§c- 3x Healthy Carrots\n§c- 50 XP")
            form.button("Claim")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.AGoodDiet);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 50");
                                player.runCommandAsync("give @s better_on_bedrock:healthy_carrot_item 3");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests5",
                                    JSON.stringify(savedQuests),
                                );
                            };
                            break;
                    };
                },
            );
        },
    },
    {
        id: Quests.WildinFood,
        name: "Wildin' Food",
        icon: "textures/items/crops/food/wild_carrot",
        locked: (player) => player.sendMessage("§cYou need to complete \"A Good Diet\" in order to unlock this quest."),
        info: (player) => {
            const form = new ActionFormData();
            form.title("§uWildin' Food");
            form.body("Get 16 Wild Carrots which are found in the Plains Biome.\n§dRewards:\n§c- 5x Healthy Carrots\n§c- 50 XP");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("Start Quest?")
            form.body("Get 16 Wild Carrots.\n§dRewards:\n§c- 5x Healthy Carrots\n§c- 50 XP")
            form.button("Start Quest!")
            form.button("Cancel")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_2")
                            player.onScreenDisplay.setTitle('WildinFoodQuestStart')
                            player.sendMessage("§aQuest Started!")
                            savedQuests.find((q) => q.id == Quests.WildinFood).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests5",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("§uWildin' Food")
            form.body("§dClaim:\n§c- 5x Healthy Carrots\n§c- 50 XP")
            form.button("Claim")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.WildinFood);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 50");
                                player.runCommandAsync("give @s better_on_bedrock:healthy_carrot_item 5");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests5",
                                    JSON.stringify(savedQuests),
                                );
                            };
                            break;
                    };
                },
            );
        },
    },
    {
        id: Quests.GreenHay,
        name: "Green Hay?",
        icon: "textures/items/crops/food/barley",
        locked: (player) => player.sendMessage("§cYou need to complete \"Wildin' Food\" in order to unlock this quest."),
        info: (player) => {
            const form = new ActionFormData();
            form.title("§uGreen Hay?");
            form.body("Get 5 Barley Stew.\n§dRewards:\n§c- 2x Barley Stew\n§c- 50 XP");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("Start Quest?")
            form.body("Get 5 Barley Stew.\n§dRewards:\n§c- 2x Barley Stew and 50\n§c- XP")
            form.button("Start Quest!")
            form.button("Cancel")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_2")
                            player.onScreenDisplay.setTitle('GreenHayQuestStart')
                            player.sendMessage("§aQuest Started!")
                            savedQuests.find((q) => q.id == Quests.GreenHay).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests5",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("§uGreen Hay?")
            form.body("§dClaim:\n§c- 2x Barley Stew\n§c- 50 XP")
            form.button("Claim")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.GreenHay);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 50");
                                player.runCommandAsync("give @s better_on_bedrock:barley_soup 2");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests5",
                                    JSON.stringify(savedQuests),
                                );
                            };
                            break;
                    };
                },
            );
        },
    },//This code has issues (the code below me)
    {
        id: Quests.CureForTears,
        name: "Cure for tears",
        icon: "textures/items/crops/food/onion",
        locked: (player) => player.sendMessage("§cYou need to complete \"Green Hay?\" in order to unlock this quest."),
        info: (player) => {
            const form = new ActionFormData();
            form.title("§uCure for tears");
            form.body("Get 32 Baked Onion by cooking Onions in a furnace or smoker.\n§dRewards:\n§c- Barley Stew\n§c- 50 XP");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("Start Quest?")
            form.body("Get 32 Baked Onion by cooking Onions in a furnace or smoker.\n§dRewards:\n§c- Barley Stew\n§c- 50 XP")
            form.button("Start Quest!")
            form.button("Cancel")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_2")
                            player.onScreenDisplay.setTitle('CureForTearsQuestStart')
                            player.sendMessage("§aQuest Started!")
                            savedQuests.find((q) => q.id == Quests.CureForTears).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests5",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("§uCure for tears")
            form.body("§dClaim:\n§c- Barley Stew\n§c- 50 XP")
            form.button("Claim")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.CureForTears);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 50");
                                player.runCommandAsync("give @s better_on_bedrock:barley_soup 1");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests5",
                                    JSON.stringify(savedQuests),
                                );
                            };
                            break;
                    };
                },
            );
        },
    },
    {
        id: Quests.LeBaguette,
        name: "Le Baguette",
        icon: "textures/items/crops/food/baguete",
        locked: (player) => player.sendMessage("§cYou need to complete \"Cure for tears\" in order to unlock this quest."),
        info: (player) => {
            const form = new ActionFormData();
            form.title("§uLe Baguette");
            form.body("Get a Baguette.\n§dRewards:\n§c- 6x Bread\n§c- 100 XP");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("Start Quest?")
            form.body("Get a Baguette.\n§dRewards:\n§c- 6x Bread\n§c- 100 XP")
            form.button("Start Quest!")
            form.button("Cancel")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_2")
                            player.onScreenDisplay.setTitle('LeBaguetteQuestStart')
                            player.sendMessage("§aQuest Started!")
                            savedQuests.find((q) => q.id == Quests.LeBaguette).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests5",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
            const form = new ActionFormData()
            form.title("§uLe Baguette")
            form.body("§dClaim:\n§c- 6x Bread\n§c- 100 XP")
            form.button("Claim")
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.LeBaguette);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 50");
                                player.runCommandAsync("give @s better_on_bedrock:barley_soup 1");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests5",
                                    JSON.stringify(savedQuests),
                                );
                            };
                            break;
                    };
                },
            );
        },
    },
];

export const more_food = (player) => {
    let savedQuests = JSON.parse(player.getDynamicProperty("quests5"));
    for (const questO of quests) {
        const qBefore = savedQuests.find((q) => q.id == (questO.id - 1));
        if (!savedQuests.find((q) => q.id == questO.id)) {
            savedQuests.push(
                {
                    id: questO.id,
                    status: (
                        qBefore.s == QuestStatus.Completed
                            ? QuestStatus.Unlocked
                            : QuestStatus.Locked
                    ),
                },
            );
        };
    };

    for (const savedQuest of savedQuests) {
        if (!quests.find((q) => q.id == savedQuest.id)) {
            savedQuests = savedQuests.filter((q) => q.id != savedQuest.id);
        };
    };

    player.setDynamicProperty(
        "quests5",
        JSON.stringify(savedQuests),
    );

    const form = new ActionFormData();
    form.title("§uThe Willager");
    form.body("Complete Quests To Unlock The Next Tier");

    for (const questO of quests) {
        const quest = savedQuests.find((q) => q.id == questO.id);
        const questStatus = getFormattedStatus(quest.s);

        form.button(
            quest.s == QuestStatus.Locked
                ? "§d" + questO.name + "\n[§c" + questStatus + "§d]"
                : "§u" + questO.name + "\n[" + questStatus + "§u]",
            questO.icon
        );
    };

    form.show(player).then(
        (response) => {
            if (response.canceled) return;
            const quest = savedQuests.find((q) => q.id == response.selection);
            const q = quests.find((q) => q.id == response.selection);

            if (quest.s == QuestStatus.Locked) q.locked(player);
            else if (quest.s == QuestStatus.Unlocked) q.start(player);
            else if (quest.s == QuestStatus.Busy) q.info(player);
            else if (quest.s == QuestStatus.Completed) q.claim(player);
        },
    );
};