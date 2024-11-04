import { GameMode, world } from "@minecraft/server";
import { configItem } from "../../functionality/items/addon-config";

world.afterEvents.playerSpawn.subscribe(
    ({ player, initialSpawn }) => {
        if (initialSpawn) {
            configItem(player);
            if (player.getDynamicProperty("usedGhostNecklace")) {
                player.setGameMode(GameMode.survival);
                player.setDynamicProperty("usedGhostNecklace");

                const topmost = player.dimension.getTopmostBlock(player.location);
                if (topmost !== undefined) {
                    const { x, y, z } = topmost.location;
                    player.teleport({ x, y: y + 1, z });
                }
            };
        }
        else {

        };
    },
);