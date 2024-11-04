import { world } from "@minecraft/server";

import { releaseUseAmulet } from "../../functionality/items/nether-amulet";

world.afterEvents.itemReleaseUse.subscribe(
    ({ itemStack, source }) => {
        releaseUseAmulet(itemStack, source);
    },
);