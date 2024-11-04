import { ActionFormData } from "@minecraft/server-ui";

import * as Quests from "../../constants/Quests.js";
import * as QuestStatus from "../../constants/QuestStatus.js";

const getFormattedStatus = (status) => {
    if (status == 0) return "§dLocked§f";
    else if (status == 1) return "§aUnlocked§f";
    else if (status == 2) return "§dBusy§f";
    else if (status == 3) return "§aCompleted§f";
    else if (status == 4) return "§aClaimed§f";
};

const quests = [
    {
        id: Quests.DeepBelow,
        name: "§gDeep Below!§f",
        icon: "textures/items/blaze_rod",
        info: (player) => {
            const form = new ActionFormData();
            form.title("§fDeepBelow");
            form.body("Find a Corstinite Ingot found in the Nether.\n§dRewards:\n§c- 1x Corstinite Ingot");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("Start Quest?");
            form.body("Find a Corstinite Ingot found in the Nether.\n§dRewards:\n§c- 1x Corstinite Ingot");
            form.button("Start Quest!");
            form.button("Cancel");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_1");
                            player.onScreenDisplay.setTitle('deepBelowQuestStart');
                            player.sendMessage("§a[!] §rQuest Started!");
                            savedQuests.find((q) => q.id == Quests.DeepBelow).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests3",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("§fDeep Below");
            form.body("§dClaim:\n§c- 1x Corstinite Ingot");
            form.button("Claim");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.DeepBelow);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 15");
                                player.runCommandAsync("give @s better_on_bedrock:corstinite_ingot 1");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests3",
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
        id: Quests.Friends,
        name: "§gFriends :3!§f",
        icon: "textures/items/misc/eggs/green_bird_egg",
        info: (player) => {
            const form = new ActionFormData();
            form.title("§fFriends :3");
            form.body("Place a Quetzacaw Egg. These are found in chests all over the Nether.\n§dRewards:\n§c- 1x Smeared Pearl");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("Start Quest?");
            form.body("Place a Quetzacaw Egg. These are found in chests all over the Nether.\n§dRewards:\n§c- 1x Smeared Pearl");

            form.button("Start Quest!");
            form.button("Cancel");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_1");
                            player.onScreenDisplay.setTitle('friendsQuestStart');
                            player.sendMessage("§a[!] §rQuest Started!");
                            savedQuests.find((q) => q.id == Quests.Friends).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests3",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("§fDeepBelow");
            form.body("§dClaim:\n§c- 1x Smeared Pearl");
            form.button("Claim");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.Friends);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 15");
                                player.runCommandAsync("give @s better_on_bedrock:smeared_pearl 1");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests3",
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
        id: Quests.Money,
        name: "§gMoney Crab!§f",
        icon: "textures/items/mobDrops/blackstone_crumb",
        info: (player) => {
            const form = new ActionFormData();
            form.title("Money Crab!");
            form.body("Hunt down 4 Basalt Crobbers, found in Basalt Deltas.\n§dRewards:\n§c- 5x Ender Pearl");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("Start Quest?");
            form.body("Hunt down 4 Basalt Crobbers, found in Basalt Deltas.\n§dRewards:\n§c- 5x Ender Pearl");
            form.button("Start Quest!");
            form.button("Cancel");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_1");
                            player.onScreenDisplay.setTitle('moneyQuestStart');
                            player.sendMessage("§a[!] §rQuest Started!");
                            savedQuests.find((q) => q.id == Quests.Money).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests3",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("§fMoney Crab!");
            form.body("§dClaim:\n§c- 5x Ender Pearl");
            form.button("Claim");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.Money);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 15");
                                player.runCommandAsync("give @s ender_pearl 5");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests3",
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
        id: Quests.Wildfire,
        name: "§gShielded Pyroclast!§f",
        icon: "textures/items/misc/amuleteempty_gauntlet",
        info: (player) => {
            const form = new ActionFormData();
            form.title("Shielded Pyroclast!");
            form.body("Defeat the Shielded Pyroclast.\n§dRewards:\n§c- Nether Stone");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("Start Quest?");
            form.body("Defeat the Shielded Pyroclast.\n§dRewards:\n§c- Nether Stone");
            form.button("Start Quest!");
            form.button("Cancel");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_1");
                            player.onScreenDisplay.setTitle('wildfireQuestStart');
                            player.sendMessage("§a[!] §rQuest Started!");
                            savedQuests.find((q) => q.id == Quests.Wildfire).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests3",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("§fShielded Pyroclast!");
            form.body("§dClaim:\n§c- Nether Stone");
            form.button("Claim");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.Wildfire);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 15");
                                player.runCommandAsync("give @s better_on_bedrock:green_stone 1");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests3",
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
        id: Quests.Samurai,
        name: "§gWithered Samurai!§f",
        icon: "textures/items/misc/decoration/soul_jar",
        info: (player) => {
            const form = new ActionFormData();
            form.title("Withered Samurai!");
            form.body("Defeat the Withered Samurai.\n§dRewards:\n§c- Nether Stone");
            form.button("Ok");
            form.show(player);
        },
        start: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("Start Quest?");
            form.body("Defeat the Withered Samurai.\n§dRewards:\n§c- Nether Stone");
            form.button("Start Quest!");
            form.button("Cancel");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            player.removeTag("unlocked_1");
                            player.onScreenDisplay.setTitle('samuraiQuestStart');
                            player.sendMessage("§a[!] §rQuest Started!");
                            savedQuests.find((q) => q.id == Quests.Samurai).s = QuestStatus.Busy;
                            player.setDynamicProperty(
                                "quests3",
                                JSON.stringify(savedQuests),
                            );
                            break;
                    };
                },
            );
        },
        claim: (player) => {
            const savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
            const form = new ActionFormData();
            form.title("§fWithered Samurai!");
            form.body("§dClaim:\n§c- Nether Stone");
            form.button("Claim");
            form.show(player).then(
                (response) => {
                    switch (response?.selection) {
                        case 0:
                            const quest = savedQuests.find((q) => q.id == Quests.Samurai);
                            if (quest.s != QuestStatus.Claimed) {
                                player.runCommandAsync("xp 15");
                                player.runCommandAsync("give @s blaze_powder 5");
                                quest.s = QuestStatus.Claimed;
                                player.setDynamicProperty(
                                    "quests3",
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

export const test = (player) => {
    let savedQuests = JSON.parse(player.getDynamicProperty("quests3"));
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
        "quests3",
        JSON.stringify(savedQuests),
    );

    const form = new ActionFormData();
    form.title("§fNether Arise");
    form.body("Complete Quests To Unlock The Next Tier");

    for (const questO of quests) {
        const quest = savedQuests.find((q) => q.id == questO.id);
        const questStatus = getFormattedStatus(quest.s);

        form.button(
            quest.s == QuestStatus.Locked
                ? "§d" + questO.name + "\n[§c" + questStatus + "§d]"
                : "§f" + questO.name + "\n[§c" + questStatus + "§f]",
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