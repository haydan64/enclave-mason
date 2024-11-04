import { world, system, EquipmentSlot } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { mainScreen } from "../main.js";
import { createDistribution, randomItem } from "../util.js";
import { items, entities, dimensions, extras } from "./behavior.js";
const rarities = {
	0: "§8Common",
	1: "§aUncommon",
	2: "§uRare",
	3: "§6Legendary",
};

const quests = [];
for (let key in items)
    quests.push(items[key]);
for (let key in entities)
    quests.push(entities[key]);
for (let key in dimensions)
    quests.push(dimensions[key]);
for (let key in extras)
    quests.push(extras[key]);

function getIcon(rarity) {
    let icon;
    switch (rarity) {
        case 1: icon = "textures/items/emerald"; break;
        case 2: icon = "textures/items/amethyst_shard"; break;
        case 3: icon = "textures/items/raw_gold"; break;
        default: icon = "textures/items/raw_iron"; break;
    };

    return icon;
};

/** @param { import("@minecraft/server").Player } player */
export function boughtScreen(player, ui = -1) {
    const unlockedQuests = JSON.parse(player.getDynamicProperty("unlockedQuests"));
	const form = new ActionFormData();
	form.title("§aBought Quests");

    quests.sort((a, b) => a.rarity - b.rarity);
    let buttons = [];
    switch (ui) {
        case -1:
            form.button("Unlocked");
            form.button("Available");
            form.button("Completed");
        break;
        case 0: {
            for (const quest of quests) {
                const rarityUnlockedQuests = unlockedQuests.filter((q) => q[1] == quest.rarity);
        
                const isUnlocked = rarityUnlockedQuests.find((q) => q[0] == quest.id && q[1] == quest.rarity) !== undefined;
                const isCompleted = unlockedQuests.find((q) => q[0] == quest.id && q[2] == 1) !== undefined;
                
                if (!isUnlocked || isCompleted)
                    continue;
        
                const name = quest.name.length > 16 ? quest.name.slice(0, 13).concat("...") : quest.name;
                form.button(name + " - " + rarities[quest.rarity], getIcon(quest.rarity));
                buttons.push({ quest, isUnlocked, isCompleted });
            };
            break;
        };
        case 1: {
            for (const quest of quests) {
                const rarityUnlockedQuests = unlockedQuests.filter((q) => q[1] == quest.rarity);
        
                const isUnlocked = rarityUnlockedQuests.find((q) => q[0] == quest.id && q[1] == quest.rarity) !== undefined;
                const isCompleted = unlockedQuests.find((q) => q[0] == quest.id && q[2] == 1) !== undefined;
                
                if (isUnlocked || isCompleted)
                    continue;
        
                const name = quest.name.length > 16 ? quest.name.slice(0, 13).concat("...") : quest.name;
                form.button(name + " - " + rarities[quest.rarity] + "\n§c[Requires Bought Quest]", getIcon(quest.rarity));
                buttons.push({ quest, isUnlocked, isCompleted });
            };
            break;
        };
        case 2: {
            for (const quest of quests) {
                const rarityUnlockedQuests = unlockedQuests.filter((q) => q[1] == quest.rarity);
        
                const isUnlocked = rarityUnlockedQuests.find((q) => q[0] == quest.id && q[1] == quest.rarity) !== undefined;
                const isCompleted = unlockedQuests.find((q) => q[0] == quest.id && q[2] == 1) !== undefined;
                
                if (!isCompleted)
                    continue;
        
                const name = quest.name.length > 16 ? quest.name.slice(0, 13).concat("...") : quest.name;
                form.button(name + " - " + rarities[quest.rarity] + "\n§a§l[Done]", getIcon(quest.rarity));
                buttons.push({ quest, isUnlocked, isCompleted });
            };
            break;
        };
    };

    if (ui !== -1 && buttons.length == 0)
        form.body("Nothing to see here.");

	form.button("§c< Go back");
	form.show(player).then((response) => {
		if (response.canceled)
            return;

		if (ui === -1) {
            if (response.selection == 3) {
                mainScreen(player);
            } else boughtScreen(player, response.selection);
            return;
        }
        else if (response.selection == buttons.length) {
            boughtScreen(player);
            return;
        };
        
        const quest = buttons[response.selection];
        if (!quest.isUnlocked) {
            player.sendMessage("§c[!] §rThis quest is currently locked.");
            return;
        };

        new ActionFormData()
        .title(quest.quest.name)
        .body(quest.quest.description)
        .button("§c< Go back")
        .show(player).then((response) => {
            if (response.canceled)
                return;

            boughtScreen(player, ui);
        });
    });
};

system.runInterval(() => {
	const players = world.getAllPlayers();
	for (let i = 0; i < players.length; i++) {
		const player = players[i];
		if (player.getDynamicProperty("unlockedQuests") == undefined) {
			player.setDynamicProperty("unlockedQuests", JSON.stringify([]));
		};

		const inventory = player.getComponent("inventory").container;
		for (let i = 0; i < inventory.size; i++) {
			const item = inventory.getItem(i);
			if (item?.typeId !== "better_on_bedrock:bought_quest") continue;
			if (item.getLore().length > 0) continue;

			const rarities = [0, 1, 2, 3]; // 0 = Common, 1 = Uncommon, 2 = Rare, 3 = Legendary
			const weights = [0.45, 0.3, 0.125, 0.125];
			const distribution = createDistribution(weights);
			const rarity = randomItem(rarities, distribution);
			const rarityQuests = quests.filter((q) => q.rarity == rarity);
			const data = {
				rarity,
				quest: rarityQuests[Math.floor(Math.random() * rarityQuests.length)].id,
			};

			item.setLore([JSON.stringify(data)]);
			inventory.setItem(i, item);
		};
	};
}, 20);

world.afterEvents.itemUse.subscribe(({ source: player, itemStack }) => {
	if (itemStack.typeId !== "better_on_bedrock:bought_quest" || !itemStack.getLore().length) return;
	const data = JSON.parse(itemStack.getLore());
	const quest = quests.find((q) => q.id == data.quest && q.rarity == data.rarity);
	if (!quest)
        return;

	const unlockedQuests = JSON.parse(player.getDynamicProperty("unlockedQuests"));
	const isUnlocked = unlockedQuests.find((q) => q[0] == quest.id && q[1] == quest.rarity) !== undefined;

	if (isUnlocked) {
		player.sendMessage("§c[!] §rYou already unlocked this quest.");
		player.addExperience(50)
		player.getComponent("equippable").setEquipment(EquipmentSlot.Mainhand);
		return;
	};

	unlockedQuests.push([ quest.id, quest.rarity, 0 ]);
	player.setDynamicProperty("unlockedQuests", JSON.stringify(unlockedQuests));

	player.sendMessage("§a[!] QUEST UNLOCKED §r§8- §rYou have unlocked the §7" + quest.name + " §7- " + rarities[quest.rarity]);
	player.getComponent("equippable").setEquipment(EquipmentSlot.Mainhand);
});