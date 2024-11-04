import { Server } from "./../../library/Minecraft.js";
import { Tool } from "./base_tool";
import { Tools } from "./tool_manager";
import { assertCuboidSelection } from "./../modules/assert";
class SelectionFillTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = "worldedit.region.replace";
        this.use = function (self, player, session) {
            if (player.isSneaking) {
                Server.uiForms.show("$selectRegionMode", player);
            }
            else {
                if (session.globalMask.empty()) {
                    Server.command.callCommand(player, "set", ["air"]);
                }
                else {
                    Server.command.callCommand(player, "replace", ["air", "air"]);
                }
            }
        };
    }
}
Tools.register(SelectionFillTool, "selection_fill", "wedit:selection_fill");
class SelectionWallTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = "worldedit.region.walls";
        this.use = function (self, player) {
            if (player.isSneaking) {
                Server.uiForms.show("$selectRegionMode", player);
            }
            else {
                Server.command.callCommand(player, "walls", ["air"]);
            }
        };
    }
}
Tools.register(SelectionWallTool, "selection_wall", "wedit:selection_wall");
class SelectionOutlineTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = "worldedit.region.faces";
        this.use = function (self, player) {
            if (player.isSneaking) {
                Server.uiForms.show("$selectRegionMode", player);
            }
            else {
                Server.command.callCommand(player, "faces", ["air"]);
            }
        };
    }
}
Tools.register(SelectionOutlineTool, "selection_outline", "wedit:selection_outline");
class SelectionHollowTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = "worldedit.region.hollow";
        this.use = function (self, player) {
            if (player.isSneaking) {
                Server.uiForms.show("$selectRegionMode", player);
            }
            else {
                Server.command.callCommand(player, "hollow", ["1"]);
            }
        };
    }
}
Tools.register(SelectionHollowTool, "selection_hollow", "wedit:selection_hollow");
class SelectionStackTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = "worldedit.region.stack";
        this.use = function (self, player, session) {
            if (player.isSneaking) {
                Server.uiForms.show("$selectRegionMode", player);
            }
            else {
                assertCuboidSelection(session);
                Server.uiForms.show("$stackAmount", player);
            }
        };
    }
}
Tools.register(SelectionStackTool, "selection_stack", "wedit:selection_stack");
class SelectionMoveTool extends Tool {
    constructor() {
        super(...arguments);
        this.permission = "worldedit.region.move";
        this.use = function (self, player, session) {
            if (player.isSneaking) {
                Server.uiForms.show("$selectRegionMode", player);
            }
            else {
                assertCuboidSelection(session);
                Server.uiForms.show("$moveAmount", player);
            }
        };
    }
}
Tools.register(SelectionMoveTool, "selection_move", "wedit:selection_move");
