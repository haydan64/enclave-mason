import { BlockTypes, ItemStack } from "@minecraft/server";

const crops = {
    "minecraft:wheat": 7,
    "minecraft:potatoes": 7,
    "minecraft:carrots": 7,
    "minecraft:beetroot": 7,
    "minecraft:pitcher_crop": 4,
    "minecraft:torchflower_crop": 7,
    "minecraft:pumpkin_stem": 7,
    "minecraft:melon_stem": 7,
    "minecraft:sweet_berry_bush": 3,
    "better_on_bedrock:tomato_crop": 2,
    "better_on_bedrock:barley_crop": 3,
    "better_on_bedrock:cabbage_crop": 3,
    "better_on_bedrock:onion_crop": 3,
    "better_on_bedrock:grape": 3,
    "better_on_bedrock:blueberry_block": 4,
    "better_on_bedrock:eggplant_crop": 2,
};

const maxDistance = 7.5;
const blocks = BlockTypes.getAll().map((block) => block.id);
function getIdentifier(id) {
    const name = id.split(":")[0];
    return name
        .replaceAll("_", " ")
        .replace(/(\b[a-z](?!\s))/g, (x) => x.toUpperCase());
};

function healthToText(currentHealth, maxHealth) {
    if (!maxHealth) return;
    if (maxHealth <= 40) {
        const max = Math.ceil(maxHealth / 2);
        const health = Math.floor(currentHealth / 2);
        const half = currentHealth % 2 === 1 && health < max;
        const empty = max - health - (half ? 1 : 0);
        const hearts = "".repeat(health).concat(half ? "" : "").concat("".repeat(empty));

        return splitHearts(hearts);
    }
    else return "§7Health: ".concat(currentHealth, " / ", maxHealth);
};

function splitHearts(string) {
    let result = "";
    for (let i = 0; i < string.length; i += 10) {
        result += string.substr(i, 10).concat("\n");
    };

    const data = result.split("\n");
    return data.filter((item) => item.trim().length != 0).join("\n");
};

/** @param { import("@minecraft/server").Player } player */
export function wawla(player) {
    const entity = player.getEntitiesFromViewDirection({
        maxDistance,
        excludeFamilies: ["wawla"]
    })[0]?.entity;
    if (entity !== undefined && entity.isValid()) {
        if (entity.hasComponent("minecraft:item")) {
            /** @type { ItemStack } */
            const itemStack = entity.getComponent("minecraft:item").itemStack;
            const isBlock = blocks.includes(itemStack.typeId);
            const hasMinecraftNamespace = itemStack.typeId.split(":")[0] === "minecraft";

            player.onScreenDisplay.setActionBar([
                //{ text: "wawla;" },
                {
                    translate: (isBlock ? "tile." : "item.")
                        .concat(hasMinecraftNamespace ? itemStack.typeId.split(":")[1] : itemStack.typeId)
                        .concat(itemStack.hasComponent("minecraft:food") ? "" : ".name")
                },
                {
                    text: " §7x".concat(itemStack.amount)
                },
                {
                    text: itemStack.nameTag !== undefined ?
                        "\n§7Display name: ".concat(itemStack.nameTag)
                        : null
                },
                {
                    text: "\n§9§o".concat(getIdentifier(itemStack.typeId))
                }
            ]);

            return;
        };

        const hasMinecraftNamespace = entity.typeId.split(":")[0] === "minecraft";
        const health = entity.getComponent("minecraft:health");
        player.onScreenDisplay.setActionBar([
            //{ text: "wawla;" },
            {
                translate: entity.typeId == "minecraft:player" ?
                    "entity.player.name" : ("entity."
                        .concat(hasMinecraftNamespace ? entity.typeId.split(":")[1] : entity.typeId)
                        .concat(".name")
                    )
            },
            {
                text: entity.typeId == "minecraft:player" ? "\n§7Name: ".concat(entity.name) : null
            },
            {
                text: entity.typeId !== "minecraft:player" && entity.nameTag.trim().length !== 0 ?
                    "\n§7Nametag: ".concat(entity.nameTag) : null
            },
            {
                text: entity.hasComponent("minecraft:is_baby") ? "\n§7".concat("Baby") : null
            },
            {
                text: entity.hasComponent("minecraft:tameable") ?
                    "\n§7Tame Chance: ".concat(entity.getComponent("minecraft:tameable").probability.toFixed(2) * 100).concat("%") : null
            },
            {
                text: health !== undefined ? "\n".concat(healthToText(Math.round(health.currentValue), health.effectiveMax)) : null
            },
            {
                text: "\n§9§o".concat(getIdentifier(entity.typeId))
            }
        ]);
    }
    else {
        const block = player.getBlockFromViewDirection({ maxDistance })?.block;
        if (block === undefined || !block.isValid())
            return;

        const toolInfo = getTool(block);
        const namePart = block.typeId.split(":")[1].split(/\.+/)[0];
        const newName = namePart.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const honeyLevel = block.permutation.getState("honey_level");
        const compostLevel = block.permutation.getState("composter_fill_level");

        let growth;
        if (crops[block.typeId] !== undefined) {
            const maxGrowth = crops[block.typeId];
            const currentGrowth = ((block.permutation.getState("growth") || block.permutation.getState("better_on_bedrock:growth_stage")) ?? 0) / maxGrowth;
            const percentage = Math.round((currentGrowth !== 0 ? Number(currentGrowth.toFixed(2)) : 0) * 100);
            growth = percentage == 100 ?
                "§aGrown" : percentage.toString().concat("%");
        };

        player.onScreenDisplay.setActionBar([
            //{ text: "wawla;" },
            {
                text: newName
            },
            {
                text: growth !== undefined ? "\n§7Growth: ".concat(growth) : null
            },
            {
                text: honeyLevel > 0 ? "\n§7Honey: ".concat(honeyLevel) : null
            },
            {
                text: compostLevel > 0 ? "\n§7Compost Level: ".concat(compostLevel).concat("/8") : null
            },
            {
                text: toolInfo.tool !== undefined ?
                    "\n§7Correct Tool: §3".concat(toolInfo.tool)
                        .concat("\n§7Can Harvest: ").concat(toolInfo.farmable ? "§aYes" : "§cNo")
                    : null
            },
            {
                text: "\n§9§o".concat(getIdentifier(block.typeId))
            }
        ]);
    };
};

/** @param { import("@minecraft/server").Block } block */
function getTool(block) {
    let tool;
    let farmable = false;
    if (!block.isValid())
        return { tool, farmable };

    if (
        block.typeId != "minecraft:redstone_wire"
        && (
            block.typeId.includes("brick")
            || block.typeId.includes("spawner")
            || block.typeId.includes("lantern")
            || block.typeId.includes("_wall")
            || block.typeId.includes("ore")
            || block.typeId.includes("stone")
            || block.typeId.includes("deepslate")
            || block.hasTag("metal")
            || block.hasTag("diamond_pick_diggable")
        )
    ) tool = "Pickaxe";
    else if (
        block.typeId.includes("log")
        || block.typeId.includes("chest")
        || block.typeId.includes("table")
        || block.typeId.includes("book")
        || block.typeId.includes("wall_banner")
        || block.typeId.includes("planks")
        || block.typeId.includes("fence")
        || block.typeId.includes("nut")
        || (
            block.typeId.includes("pumpkin")
            && !block.typeId.includes("stem")
        )
        || (
            block.typeId.includes("melon")
            && !block.typeId.includes("stem")
        )
        || block.hasTag("log")
        || block.hasTag("wood")
    ) tool = "Axe";
    else if (
        block.typeId.includes("farm")
        || block.typeId.includes("dirt")
        || block.typeId.includes("path")
        || block.typeId.includes("podzol")
        || block.hasTag("dirt")
        || block.hasTag("grass_block")
    ) tool = "Shovel";
    else if (
        block.typeId.includes("crop")
        || block.typeId.includes("grape")
        || block.typeId.includes("bush")
        || block.typeId.includes("wild")
        || block.typeId.includes("flower")
        || block.typeId.includes("stem")
        || block.hasTag("minecraft:crop")
    ) tool = "All";
    else if (
        block.typeId.includes("leaves")
        || block.typeId.includes("vine")
        || block.typeId.includes("grass_block")
        || block.typeId.includes("root")
        || block.typeId.includes("plant")
        || block.typeId.includes("flender")
    ) tool = "Shears", farmable = true;
    else if (block.typeId.includes("wool"))
        tool = "Shears";
    else if (block.typeId.includes("hat"))
        tool = "Hand";

    return { tool, farmable };
};