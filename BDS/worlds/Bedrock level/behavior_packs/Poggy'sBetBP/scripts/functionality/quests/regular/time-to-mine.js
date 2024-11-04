import { ActionFormData } from "@minecraft/server-ui";

import { getFormattedStatus, getQuestStatus } from "../util";
import { QuestStatus } from "../constants";
import { regularScreen } from "./main";

const quests = [
    {
        name: "First Wood!",
        icon: "textures/items/stick",
        description: "Test",
        claim: (player) => {
            player.sendMessage("Meow :3");
        },
    },
    {
        name: "Cat",
        icon: "textures/items/diamond_sword",
        description: "Test",
        claim: (player) => {
            player.sendMessage("Meow :3");
        },
    }
];

/** @param { import("@minecraft/server").Player } player  */
export function timeToMine(player) {
    const form = new ActionFormData()
    .title("§uGetting Started!")
    .body("Complete the quests to unlock the next tier!");

    for (let i = 0; i < quests.length; i++) {
        const quest = quests[i];
        const status = getQuestStatus(player, i, "quests", quests);

        form.button(quest.name.concat(
            "\n", getFormattedStatus(status)
        ), quest.icon);
    };

    form.button("§c< Go back");
    form.show(player).then((response) => {
        if (response.canceled)
            return;

        if (response.selection == quests.length) {
            regularScreen(player);
            return;
        };

        const status = getQuestStatus(player, response.selection, "quests", quests);
        switch (status) {
            case QuestStatus.Locked:
                const previousQuest = quests[response.selection - 1];
                player.sendMessage("§c[!] §rYou need to complete §7\"".concat(previousQuest.name, "\"§r in order to unlock this quest."));
            break;
            case QuestStatus.Unlocked:

            break;
            case QuestStatus.Busy:

            break;
            case QuestStatus.Completed:

            break;
            case QuestStatus.Claimed:

            break;
        };
    });
};