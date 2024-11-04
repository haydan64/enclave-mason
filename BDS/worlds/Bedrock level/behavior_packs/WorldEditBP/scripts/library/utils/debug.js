import { system } from "@minecraft/server";
export function doOn(command, callback) {
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
        if (ev.id !== "dev:" + command)
            return;
        callback();
    }, { namespaces: ["dev"] });
}
