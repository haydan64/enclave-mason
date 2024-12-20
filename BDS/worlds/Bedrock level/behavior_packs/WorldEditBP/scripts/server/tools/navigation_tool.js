import { Tool } from "./base_tool.js";
import { Tools } from "./tool_manager.js";
import { PlayerUtil } from "./../modules/player_util.js";
import { Server } from "./../../library/Minecraft.js";
import { getWorldHeightLimits } from "server/util.js";
class NavigationTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = "worldedit.navigation";
        this.use = function (self, player) {
            const dimension = player.dimension;
            const limits = getWorldHeightLimits(dimension);
            const blockLoc = PlayerUtil.getBlockLocation(player).offset(0, 1, 0);
            if (blockLoc.y >= limits[0] && blockLoc.y <= limits[1] && !dimension.getBlock(blockLoc).isAir) {
                Server.command.callCommand(player, "unstuck", []);
            }
            else if (player.isSneaking) {
                Server.command.callCommand(player, "thru", []);
            }
            else {
                Server.command.callCommand(player, "jumpto", []);
            }
        };
    }
}
Tools.register(NavigationTool, "navigation_wand");
