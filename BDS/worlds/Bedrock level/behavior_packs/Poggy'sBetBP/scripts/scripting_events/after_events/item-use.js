import { world } from "@minecraft/server";

import { configScreen } from "../../functionality/items/addon-config";
import { lostJournal } from "../../functionality/items/lost-journal";
import { lootbags } from "../../functionality/items/lootbags";
import { netherAmulet } from "../../functionality/items/nether-amulet";

world.afterEvents.itemUse.subscribe(
    ({ itemStack, source }) => {
        configScreen(itemStack, source);
        lostJournal(itemStack, source);
        lootbags(itemStack, source);
        netherAmulet(itemStack, source);
    },
);