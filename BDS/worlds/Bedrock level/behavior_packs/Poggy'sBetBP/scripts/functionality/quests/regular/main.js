import { ActionFormData } from "@minecraft/server-ui";

import { mainScreen } from "../main";

import { time_to_mine } from "../../quests_old/q_t/t_t_m/quest_list.js";
import { adventure_delight } from "../../quests_old/q_t/a_d/quest_list.js";
import { monster_looter } from "../../quests_old/q_t/m_l/quest_list.js";
import { beyond_the_overworld } from "../../quests_old/q_t/b_t_o/quest_list.js";
import { the_willager } from "../../quests_old/q_t/t_w/quest_list.js";
import { more_food } from "../../quests_old/q_t/m_f/quest_list.js";
import { test } from "../../quests_old/q_t/test/quest_list.js";

const tiers = [
    {
        name: "Getting Started",
        icon: "textures/items/raw_iron",
        handle: time_to_mine,
    },
    {
        name: "Mining Time",
        icon: "textures/items/diamond_boots",
        handle: adventure_delight,
    },
    {
        name: "Nether Arise",
        icon: "textures/items/ingots/fire/firey_ingot",
        handle: test,
    },
    {
        name: "Monster Looter",
        icon: "textures/items/rotten_flesh",
        handle: monster_looter,
    },
    {
        name: "The Willager",
        icon: "textures/items/dragons_breath",
        handle: the_willager,
    },
    {
        name: "Adventure Time!",
        icon: "textures/items/apple",
        handle: more_food,
    },
    {
        name: "Beyond the Overworld",
        icon: "textures/items/ingots/enderite/end_ingot",
        handle: beyond_the_overworld,
    },
];

/** @param { import("@minecraft/server").Player } player  */
export function regularScreen(player) {
    const tiersCompleted = player.getDynamicProperty("tiersCompleted") ?? 0;

    const form = new ActionFormData()
    .title("§uQuest Tiers")
    .body("These quests are a guide to help you with your journey!");

    for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        const isUnlocked = tiersCompleted >= i;

        form.button((isUnlocked ? "§u" : "§t").concat(tier.name, "\n").concat(isUnlocked ? "§8[§aUnlocked§8]" : "§8[§cLocked§8]"), tier.icon);
    };
    
    form.button("§c< Go back");
    form.show(player).then(
        (response) => {
            if (response.canceled)
                return;

            if (response.selection == tiers.length) {
                mainScreen(player);
                return;
            };

            const tiersCompleted = player.getDynamicProperty("tiersCompleted") ?? 0;
            if (tiersCompleted < response.selection) {
                const previousQuest = tiers[response.selection - 1];
                player.sendMessage("§c[!] §rYou need to complete §7\"".concat(previousQuest.name, "\"§r in order to unlock this tier."));
                return;
            };

            const tier = tiers[response.selection];
            tier.handle(player);
        },
    );
};