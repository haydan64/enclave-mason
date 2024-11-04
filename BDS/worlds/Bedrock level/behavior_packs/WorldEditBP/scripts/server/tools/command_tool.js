import { Server } from "./../../library/Minecraft.js";
import { Tool } from "./base_tool";
import { Tools } from "./tool_manager";
class CommandTool extends Tool {
    constructor(command) {
        super();
        this.isCustom = false;
        this.use = function (self, player, session) {
            if (self.isCustom) {
                let firstSpace = self.command.indexOf(" ");
                if (firstSpace == -1) {
                    firstSpace = self.command.length;
                }
                const usingItem = session.usingItem;
                session.usingItem = false;
                Server.command.callCommand(player, self.command.substring(0, firstSpace).trim(), self.command.substring(firstSpace).trim());
                session.usingItem = usingItem;
            }
            else {
                if (player.isOp()) {
                    Server.queueCommand(self.command, player);
                }
            }
        };
        if (command.startsWith(";")) {
            this.isCustom = true;
            this.command = command.slice(1);
        }
        else if (command.startsWith("/")) {
            this.isCustom = false;
            this.command = command.slice(1);
        }
        else {
            this.command = command;
        }
    }
    toJSON() {
        return {
            toolType: this.type,
            command: (this.isCustom ? ";" : "/") + this.command,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parseJSON(json) {
        return [json.command];
    }
}
Tools.register(CommandTool, "command_wand");
