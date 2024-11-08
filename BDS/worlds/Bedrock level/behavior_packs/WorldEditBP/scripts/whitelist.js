import { system, world } from "@minecraft/server";
let whitelistEnabled = world.getDynamicProperty("whitelistEnabled") ?? true;
system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id !== "wedit:whitelist")
        return;
    const player = ev.sourceEntity;
    if (["true", "false"].includes(ev.message.toLowerCase())) {
        const value = ev.message.toLowerCase() === "true";
        if (value === whitelistEnabled)
            return;
        whitelistEnabled = value;
        world.setDynamicProperty("whitelistEnabled", whitelistEnabled);
        player?.sendMessage({ rawtext: [{ translate: whitelistEnabled ? "worldedit.whitelist.enabled" : "worldedit.whitelist.disabled" }] });
    }
    else {
        player?.sendMessage({ rawtext: [{ translate: whitelistEnabled ? "worldedit.whitelist.status.on" : "worldedit.whitelist.status.off" }] });
    }
});
export default () => whitelistEnabled;
