import { world, system } from "@minecraft/server";

class CommandSystem {
  static Prefix = "!";
  static Commands = {};

  static RegisterCommand(name, callback, paramTypes, opOnly = false) {
    this.Commands[name] = {
      callback: callback,
      paramTypes: paramTypes,
      opOnly: opOnly,
    };
  }

  static executeCommand(input, source, event) {
    if (input.startsWith(CommandSystem.Prefix)) {
      event.cancel = true;

      system.run(() => {
        const text = input.replace(this.Prefix, "");
        const parts = text.split(" ");
        const commandName = parts[0];
        const args = parts.slice(1);

        if (this.Commands[commandName]) {
          const command = this.Commands[commandName];
          if (command.opOnly && !source.isOp()) {
            source.sendMessage("§cThis command can only be used by operators!");
            return;
          }
          const typedArgs = {};

          typedArgs["source"] = source;

          let i = 0;
          for (const [paramName, type] of Object.entries(command.paramTypes)) {
            let value = args[i];

            switch (type) {
              case "string":
                if (value == undefined) {
                  source.sendMessage(
                    `§cInvalid Paramater Input: §e[${paramName}]§r. Received §e[${value}]§r, Expected §e[${type}]§r`
                  );
                  return;
                }
                break;
              case "integer":
                value = parseInt(value);
                if (isNaN(value)) {
                  source.sendMessage(
                    `§cInvalid Paramater Input: §e[${paramName}]§r. Received §e[${value}]§r, Expected §e[${type}]§r`
                  );
                  return;
                }
                break;
              case "float":
                value = parseFloat(value);
                if (isNaN(value)) {
                  source.sendMessage(
                    `§cInvalid Paramater Input: §e[${paramName}]§r. Received §e[${value}]§r, Expected §e[${type}]§r`
                  );
                  return;
                }
                break;
              default:
                source.sendMessage(
                  `§cInvalid parameter type: ${type} for param ${paramName}`
                );
                return;
            }

            typedArgs[paramName] = value;
            i++;
          }
          command.callback.call(null, typedArgs);
        } else {
          source.sendMessage(`§cUnkown command: ${commandName}`);
        }
      });
    }
  }
}

world.beforeEvents.chatSend.subscribe((ev) => {
  CommandSystem.executeCommand(ev.message, ev.sender, ev);

  if (ev.cancel) return;

  let prefix = "";
  if (ev.sender.hasTag("owner")) prefix += "§d§l<Owner>§r ";
  else {
    if (ev.sender.hasTag("staff")) prefix += "§a<Staff>§r ";
    if (ev.sender.hasTag("mason")) prefix += "§3<Mason>§r ";
    if (ev.sender.hasTag("dev")) prefix += "§4<Dev>§r ";
  }

  let nameColor = "§r";

  if (ev.sender.hasTag("kam")) nameColor = "§g";
  if (ev.sender.hasTag("war")) nameColor = "§4";
  if (ev.sender.hasTag("leg")) nameColor = "§b";
  if (ev.sender.hasTag("mer")) nameColor = "§q";

  ev.cancel = true;
  world.sendMessage(`§r${prefix}${nameColor}<${ev.sender.name}>§r ${ev.message}`);
  console.info(`[Player Message] ${JSON.stringify(
    {
      prefix,
      nameColor,
      name: ev.sender.name,
      message: ev.message
    }
  )}`);

});

export { CommandSystem };
