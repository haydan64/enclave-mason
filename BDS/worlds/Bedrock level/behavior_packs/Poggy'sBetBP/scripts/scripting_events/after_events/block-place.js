import { world } from "@minecraft/server";

import * as Achievements from "../../functionality/advancements/index.js";

world.afterEvents.playerPlaceBlock.subscribe(
    ({ block, dimension, player }) => {
        Achievements.blockPlace(block, dimension, player);
    },
);