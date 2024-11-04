import { QuestStatus } from "./constants";
export function getQuestStatus(player, questId, quests, array) {
    const activeQuest = player.getDynamicProperty("activeQuest");
    const completedQuests = JSON.parse(player.getDynamicProperty(quests) ?? "[]");

    const isActive = activeQuest == questId;
    const isCompleted = completedQuests.find(([ id ]) => id == questId);

    let status = QuestStatus.Locked;
    if (array[questId - 1] !== undefined && !completedQuests.find(([ id ]) => id == questId - 1))
        status = QuestStatus.Locked;
    else if (!isActive && !isCompleted) status = QuestStatus.Unlocked;
    else if (isActive && !isCompleted) status = QuestStatus.Busy;
    else if (isActive && isCompleted) status = QuestStatus.Completed;
    else if (!isActive && isCompleted) status = QuestStatus.Claimed

    return status;
};

export function getFormattedStatus(status) {
    switch (status) {
        case 1: return "§qUnlocked§r";
        case 2: return "§dBusy§r";
        case 3: return "§pCompleted§r";
        case 4: return "§aClaimed§r";
        default: return "§cLocked§r";
    };
};

export const randomIndex = (distribution) => distribution[Math.floor(Math.random() * distribution.length)];
export const randomItem = (array, distribution) => array[randomIndex(distribution)];
export const createDistribution = (weights) => {
    const distribution = [];
    const sum = weights.reduce((a, b) => a + b);
    const quant = 10 / sum;
  	for (let i = 0; i < weights.length; ++i) {
      	const limit = quant * weights[i];
      	for (let j = 0; j < limit; ++j) distribution.push(i);
    };
	
  	return distribution;
};