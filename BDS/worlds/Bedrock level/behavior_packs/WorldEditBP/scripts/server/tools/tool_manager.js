import { world, system } from "@minecraft/server";
import { contentLog, Databases, Server, sleep, Thread, Vector } from "./../../library/Minecraft.js";
import { ToolAction } from "./base_tool.js";
import { getSession, hasSession } from "../sessions.js";
const tools = new Map();
Databases.addParser((k, v, databaseName) => {
    if (databaseName.startsWith("tools|") && v && typeof v === "object" && "toolType" in v) {
        try {
            const toolClass = tools.get(v.toolType);
            const tool = new toolClass(...toolClass.parseJSON(v));
            tool.type = v.toolType;
            return tool;
        }
        catch (err) {
            contentLog.error(`Failed to load tool from '${JSON.stringify(v)}' for '${k}': ${err}`);
        }
    }
    else {
        return v;
    }
});
system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity }) => {
    if (id !== "wedit:reset_tools_database" || !sourceEntity)
        return;
    Databases.delete(`tools|${sourceEntity.id}`);
});
class ToolBuilder {
    constructor() {
        this.bindings = new Map();
        this.fixedBindings = new Map();
        this.prevHeldTool = new Map();
        this.conditionalBindings = new Map();
        this.disabled = [];
        Server.on("itemUseBefore", (ev) => {
            if (!ev.itemStack || !hasSession(ev.source.id))
                return;
            this.onItemUse(ev.itemStack, ev.source, ev);
        });
        Server.on("itemUseOnBefore", (ev) => {
            if (!ev.itemStack || !hasSession(ev.source.id))
                return;
            this.onItemUse(ev.itemStack, ev.source, ev, Vector.from(ev.block));
        });
        Server.on("entityCreate", ({ entity }) => {
            if (!entity.hasComponent("minecraft:item"))
                return;
            const player = entity.dimension.getPlayers({ closest: 1, location: entity.location, maxDistance: 2 })[0];
            if (player)
                this.onItemDrop(entity.getComponent("item").itemStack, player);
        });
        Server.on("blockBreak", (ev) => {
            if (!ev.itemStack || !hasSession(ev.player.id))
                return;
            this.onBlockBreak(ev.itemStack, ev.player, ev, Vector.from(ev.block));
        });
        Server.on("blockHit", (ev) => {
            if (ev.damagingEntity.typeId != "minecraft:player" || !hasSession(ev.damagingEntity.id))
                return;
            const item = Server.player.getHeldItem(ev.damagingEntity);
            if (!item)
                return;
            this.onBlockHit(item, ev.damagingEntity, ev, Vector.from(ev.hitBlock));
        });
        new Thread().start(function* (self) {
            while (true) {
                for (const player of world.getPlayers()) {
                    if (!hasSession(player.id))
                        break;
                    try {
                        const item = Server.player.getHeldItem(player);
                        if (item) {
                            yield* self.onItemTick(item, player, system.currentTick);
                        }
                        else {
                            self.stopHolding(player);
                        }
                    }
                    catch (err) {
                        contentLog.error(err);
                    }
                }
                yield sleep(1);
            }
        }, this);
    }
    register(toolClass, name, item, condition) {
        tools.set(name, toolClass);
        if (typeof item == "string") {
            this.fixedBindings.set(item, new toolClass());
        }
        else if (condition && Array.isArray(item)) {
            const tool = { condition, tool: new toolClass() };
            for (const key of item) {
                this.conditionalBindings.set(key, tool);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bind(toolId, itemId, playerId, ...args) {
        this.unbind(itemId, playerId);
        if (itemId) {
            const tool = new (tools.get(toolId))(...args);
            tool.type = toolId;
            this.createPlayerBindingMap(playerId);
            this.bindings.get(playerId).data[itemId]?.delete();
            this.bindings.get(playerId).data[itemId] = tool;
            this.bindings.get(playerId).save();
            return tool;
        }
        else {
            throw "worldedit.tool.noItem";
        }
    }
    unbind(itemId, playerId) {
        if (itemId) {
            if (this.fixedBindings.has(itemId)) {
                throw "worldedit.tool.fixedBind";
            }
            this.createPlayerBindingMap(playerId);
            this.bindings.get(playerId).data[itemId]?.delete();
            delete this.bindings.get(playerId).data[itemId];
            this.bindings.get(playerId).save();
        }
        else {
            throw "worldedit.tool.noItem";
        }
    }
    hasBinding(itemId, playerId) {
        if (itemId) {
            return !!this.bindings.get(playerId)?.data[itemId] || this.fixedBindings.has(itemId);
        }
        else {
            return false;
        }
    }
    getBindingType(itemId, playerId) {
        if (itemId) {
            const tool = this.bindings.get(playerId)?.data[itemId] || this.fixedBindings.get(itemId);
            return tool?.type ?? "";
        }
        else {
            return "";
        }
    }
    getBoundItems(playerId, type) {
        this.createPlayerBindingMap(playerId);
        const tools = this.bindings.get(playerId).data;
        return tools
            ? Array.from(Object.entries(tools))
                .filter((binding) => !type || (typeof type == "string" ? binding[1].type == type : type.test(binding[1].type)))
                .map((binding) => binding[0])
            : [];
    }
    setProperty(itemId, playerId, prop, value) {
        if (itemId) {
            const tool = this.bindings.get(playerId).data[itemId];
            if (tool && prop in tool) {
                tool[prop] = value;
                this.bindings.get(playerId).save();
                return true;
            }
        }
        return false;
    }
    getProperty(itemId, playerId, prop) {
        if (itemId) {
            const tool = this.bindings.get(playerId).data[itemId];
            if (tool && prop in tool) {
                return tool[prop];
            }
        }
        return null;
    }
    hasProperty(itemId, playerId, prop) {
        if (itemId) {
            const tool = this.bindings.get(playerId).data[itemId];
            if (tool && prop in tool) {
                return true;
            }
        }
        return false;
    }
    setDisabled(playerId, disabled) {
        if (disabled && !this.disabled.includes(playerId)) {
            this.disabled.push(playerId);
        }
        else if (!disabled && this.disabled.includes(playerId)) {
            this.disabled.splice(this.disabled.indexOf(playerId), 1);
        }
    }
    *onItemTick(item, player, tick) {
        if (this.disabled.includes(player.id) || !hasSession(player.id))
            return this.stopHolding(player);
        const key = item.typeId;
        let tool;
        if (this.bindings.get(player.id)?.data[key]) {
            tool = this.bindings.get(player.id).data[key];
        }
        else if (this.fixedBindings.has(key)) {
            tool = this.fixedBindings.get(key);
        }
        else {
            return this.stopHolding(player);
        }
        if (this.prevHeldTool.get(player) !== tool) {
            this.stopHolding(player);
            this.prevHeldTool.set(player, tool);
        }
        const gen = tool.tick?.(tool, player, getSession(player), tick);
        if (gen)
            yield* gen;
    }
    onItemUse(item, player, ev, loc) {
        if (this.disabled.includes(player.id) || !hasSession(player.id))
            return;
        const key = item.typeId;
        let tool;
        if (this.bindings.get(player.id)?.data[key]) {
            tool = this.bindings.get(player.id).data[key];
        }
        else if (this.fixedBindings.has(key)) {
            tool = this.fixedBindings.get(key);
        }
        else if (this.conditionalBindings.get(key)?.condition(player, getSession(player))) {
            tool = this.conditionalBindings.get(key).tool;
        }
        else {
            return;
        }
        if (tool.process(getSession(player), loc ? ToolAction.USE_ON : ToolAction.USE, loc)) {
            ev.cancel = true;
        }
    }
    onBlockBreak(item, player, ev, loc) {
        if (this.disabled.includes(player.id))
            return;
        const key = item.typeId;
        let tool;
        if (this.bindings.get(player.id)?.data[key]) {
            tool = this.bindings.get(player.id).data[key];
        }
        else if (this.fixedBindings.has(key)) {
            tool = this.fixedBindings.get(key);
        }
        else if (this.conditionalBindings.get(key)?.condition(player, getSession(player))) {
            tool = this.conditionalBindings.get(key).tool;
        }
        else {
            return;
        }
        if (tool.process(getSession(player), ToolAction.BREAK, loc)) {
            ev.cancel = true;
        }
    }
    onBlockHit(item, player, ev, loc) {
        if (this.disabled.includes(player.id))
            return;
        const key = item.typeId;
        let tool;
        if (this.bindings.get(player.id)?.data[key]) {
            tool = this.bindings.get(player.id).data[key];
        }
        else if (this.fixedBindings.has(key)) {
            tool = this.fixedBindings.get(key);
        }
        else if (this.conditionalBindings.get(key)?.condition(player, getSession(player))) {
            tool = this.conditionalBindings.get(key).tool;
        }
        else {
            return;
        }
        tool.process(getSession(player), ToolAction.HIT, loc);
    }
    onItemDrop(item, player) {
        if (this.disabled.includes(player.id) || !hasSession(player.id)) {
            return;
        }
        const key = item.typeId;
        let tool;
        if (this.bindings.get(player.id)?.data[key]) {
            tool = this.bindings.get(player.id).data[key];
        }
        else if (this.fixedBindings.has(key)) {
            tool = this.fixedBindings.get(key);
        }
        else if (this.conditionalBindings.get(key)?.condition(player, getSession(player))) {
            tool = this.conditionalBindings.get(key).tool;
        }
        else {
            return;
        }
        tool.process(getSession(player), ToolAction.DROP);
    }
    createPlayerBindingMap(playerId) {
        if (this.bindings.has(playerId))
            return;
        const database = Databases.load(`tools|${playerId}`, world);
        this.bindings.set(playerId, database);
    }
    stopHolding(player) {
        if (!this.prevHeldTool.has(player))
            return;
        this.prevHeldTool.get(player)?.process(getSession(player), ToolAction.STOP_HOLD);
        this.prevHeldTool.delete(player);
    }
}
export const Tools = new ToolBuilder();
