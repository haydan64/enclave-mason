import { world, ItemStack, EntityInventoryComponent } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { regularScreen } from "./regular/main";
import { boughtScreen } from "./bought/main";

export function mainScreen(player) {
    new ActionFormData()
    .title("§uQuest Menu")
    .body("Select a quest chapter.")
    .button("§eMain", "textures/items/raw_iron")
    .button("§aBought Quests", "textures/items/emerald")
    .show(player).then((response) => {
        if (response.canceled)
            return;

        switch (response.selection) {
            case 0: regularScreen(player); break;
            case 1: boughtScreen(player); break;
        };
    });
};

world.afterEvents.itemUse.subscribe(
    ({ source, itemStack }) => {
        switch (itemStack.typeId) {
            case "better_on_bedrock:bounty_paper_open": mainScreen(source); break;
            case "better_on_bedrock:quest_paper":
                const container = source.getComponent(EntityInventoryComponent.componentId).container;
                container.setItem(source.selectedSlotIndex, new ItemStack("better_on_bedrock:bounty_paper_open"));
            break;
        };
    },
);