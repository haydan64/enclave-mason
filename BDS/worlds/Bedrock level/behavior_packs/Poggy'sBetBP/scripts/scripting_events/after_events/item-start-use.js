import { world } from "@minecraft/server";

import { startUseAmulet } from "../../functionality/items/nether-amulet";

world.afterEvents.itemStartUse.subscribe(
    ({ itemStack, source }) => {
        startUseAmulet(itemStack, source);
    },
);