import { world, system, TicksPerSecond } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
const warpRegex = /(?:Warp:)(.*?)-((?:-|)\d+)\|((?:-|)\d+)\|((?:-|)\d+)\|(minecraft:.+)/;
const DimensionNames = {
    "minecraft:overworld": "§aOverworld",
    "minecraft:nether": "§cNether",
    "minecraft:the_end": "§5End"
};

/**
 * @param { import("@minecraft/server").Player } player 
 * @param { import("@minecraft/server").Block } block 
 */
function addNew(player, block) {
    const { x, y, z } = block.location;
    const isTopBit = block.permutation.getState("pog:tobBit");
    const location = { x: x + 0.5, y: isTopBit ? (y - 1) : y, z: z + 0.5 };
    const warps = player.getTags().filter((v) => v.startsWith("Warp:"));
    const maxWarps = world.getDynamicProperty("maxWarps") ?? 25;
    if (warps.length > maxWarps - 1) {
        player.sendMessage("§c[!] §rYou have the max amount of Waystones set already!");
        player.playSound("beacon.activate", {
            location,
            pitch: 0.5
        });

        return;
    };

    new ModalFormData()
        .title("Add a Waystone")
        .textField("Enter the name of your Waystone.\n\n§7If this field is not filled, the name of the Waystone will be §8\"Default\"§r.\n\n§7If a name is the same as a current Waystone, the old Waystone will be overwritten.\n\n§7You have §c".concat(warps.length).concat("/", maxWarps, " Waystones set§7."), "")
        .toggle("Global Waystone")
        .show(player).then((response) => {
            if (response.canceled)
                return;

            let [name, isGlobal] = response.formValues;
            if (name.trim().length == 0)
                name = "Default"
            else if (name.toLowerCase() == "warp")
                name = name.concat(" #", warps.length);

            const warpValue = "Warp:".concat(name, "-", location.x - 0.5, "|", location.y, "|", location.z - 0.5, "|", block.dimension.id);

            if (true == isGlobal) {
                const w = world.getDynamicPropertyIds().filter((v) => v.startsWith("Warp:")).find((v) => {
                    const warpName = v.match(/(?<=Warp:).*?(?=-)/)[0];
                    return warpName == name;
                });

                if (w !== undefined)
                    world.setDynamicProperty(w, undefined);

                world.setDynamicProperty("Warp:".concat(name, "-", block.dimension.id), {
                    x: location.x - 0.5,
                    y: location.y,
                    z: location.z - 0.5,
                });
            }
            else {
                const w = warps.find((v) => {
                    const warpName = v.match(/(?<=Warp:).*?(?=-)/)[0];
                    return warpName == name;
                });

                if (w !== undefined)
                    player.removeTag(w);

                player.addTag(warpValue);
            };


            const b = isTopBit ? block.below() : block.above();
            if (b.typeId == block.typeId) {
                const permutation = b.permutation;
                b.setPermutation(permutation
                    .withState("pog:activated", !isGlobal)
                    .withState("pog:activatedAsGlobal", isGlobal));
            };
            block.setPermutation(block.permutation
                .withState("pog:activated", !isGlobal)
                .withState("pog:activatedAsGlobal", isGlobal));

            player.sendMessage("§a[!] §fWaystone added!");
            player.playSound("block.waystone.activate", { location });
            block.dimension.spawnParticle(isGlobal ? "pog:waystone_activate_global" : "pog:waystone_activate", location);
        });
};

/**
 * @param { import("@minecraft/server").Player } player 
 * @param { string } warpTag
 */
function warpMenu(player, warpTag) {
    const warpName = warpTag.match(/(?<=Warp:).*?(?=-)/)[0];
    const warpXp = world.getDynamicProperty("warpXp") ?? 3;
    const dimensionWarpXp = world.getDynamicProperty("dimensionWarpXp") ?? 6;

    new ActionFormData()
        .title("Waystone: §6".concat(warpName))
        .body("You are about to teleport to this Waystone. \n\nTeleporting to this waystone requires §e".concat(warpXp, " XP Levels§r. \n\nIf you are teleporting across dimensions, it will cost §e", dimensionWarpXp, " XP Levels§r."))
        .button("§uTeleport to this Waystone")
        .button("§cRemove this Waystone")
        .show(player).then((response) => {
            if (response.canceled)
                return;

            let isGlobal = false;
            let warpName, xCord, yCord, zCord, dimensionName;
            if (/(?:Warp:)(.*?)-(minecraft:.+)/.test(warpTag)) {
                isGlobal = true;

                const [_, name, dimension] = warpTag.match(/(?:Warp:)(.*?)-(minecraft:.+)/);
                const { x, y, z } = world.getDynamicProperty(warpTag);
                warpName = name, xCord = x, yCord = y, zCord = z, dimensionName = dimension;
            }
            else {
                const [_, name, x, y, z, dimension] = warpTag.match(warpRegex);
                warpName = name, xCord = x, yCord = y, zCord = z, dimensionName = dimension;
            };

            switch (response.selection) {
                case 0: {
                    const requiredLevel = dimensionName !== player.dimension.id ? dimensionWarpXp : warpXp;
                    if (player.level < requiredLevel) {
                        player.sendMessage("§c[!] §rYou don't have enough levels!");
                        return;
                    };

                    player.camera.fade({
                        fadeColor: { red: 0, green: 0, blue: 0 },
                        fadeTime: {
                            fadeInTime: 0,
                            holdTime: 0.25,
                            fadeOutTime: 0.25,
                        },
                    });

                    const dimension = world.getDimension(dimensionName);
                    const teleportLocation = {
                        x: Number(xCord) + 0.5,
                        y: Number(yCord),
                        z: Number(zCord) + 0.5
                    };

                    player.teleport(teleportLocation, { dimension });
                    system.runTimeout(() => player.playSound("block.waystone.teleport"), 2);
                    player.sendMessage("§u[!] §rTeleporting to §7".concat(warpName, "§r..."));
                    player.startItemCooldown("marker", TicksPerSecond * 30);
                    player.addLevels(-requiredLevel);
                    break;
                };
                case 1: {
                    if (isGlobal)
                        world.setDynamicProperty(warpTag, undefined);
                    else
                        player.removeTag(warpTag);

                    player.sendMessage("§c[!] §fWaystone removed.");
                    player.sendMessage(" §8- §rName: ".concat(isGlobal ? "§p" : "§7", warpName));
                    player.sendMessage(" §8- §rLocation: §6".concat(xCord, "§7, §6", yCord, "§7, §6", zCord).concat("§7, §rin The ", DimensionNames[dimensionName]));
                    break;
                };
            };
        });
};

/**
 * @param { import("@minecraft/server").Player } player 
 * @param { import("@minecraft/server").Block } block 
 */
export function waystoneMenu(player, block) {
    const globals = world.getDynamicPropertyIds().filter((v) => v.startsWith("Warp:"));
    const warps = player.getTags().filter((v) => v.startsWith("Warp:"));
    if (warps.length < 1 && globals.length < 1) {
        if (block === undefined)
            player.sendMessage("§c[!] §rNo waystones available.");
        else
            addNew(player, block);
        return false;
    };

    const menu = new ActionFormData()
        .title("Waystone Menu")
        .body("To add another waystone, crouch and interact on the waystone.\n")

    const warpTags = [];
    for (const tag of globals) {
        warpTags.push(tag);
        menu.button("Waystone: §a".concat(tag.match(/(?<=Warp:).*?(?=-)/)[0]));
    };

    for (const tag of warps) {
        warpTags.push(tag);
        menu.button("Waystone: §6".concat(tag.match(/(?<=Warp:).*?(?=-)/)[0]));
    };

    menu.show(player).then((response) => {
        if (response.canceled)
            return;

        const selectedTag = warpTags[response.selection];
        warpMenu(player, selectedTag);
    });

    return true;
};

/** @type { import("@minecraft/server").BlockCustomComponent } */
export const events = {
    beforeOnPlayerPlace: (data) => {
        const { block, permutationToPlace } = data;
        const above = block.above();
        if (!above.isAir) {
            data.cancel = true;
            return;
        };

        above.setPermutation(permutationToPlace.withState("pog:tobBit", true));
    },
    onPlayerDestroy: ({ block, destroyedBlockPermutation, player }) => {
        const below = block.below();
        if (below.typeId == destroyedBlockPermutation.type.id)
            below.setType("minecraft:air");

        const { x, y, z } = block.location;
        const isTopBit = destroyedBlockPermutation.getState("pog:tobBit");
        const location = { x, y: isTopBit ? (y - 1) : y, z };

        // Global warps
        const globals = world.getDynamicPropertyIds().filter((v) => v.startsWith("Warp:"));
        const g = globals.filter((v) => {
            const { x, y, z } = world.getDynamicProperty(v);
            return (
                location.x == x
                && location.y == y
                && location.z == z
            );
        });

        for (let tag of g) {
            const { x, y, z } = world.getDynamicProperty(tag);
            const [_, warpName, dimensionName] = tag.match(/(?:Warp:)(.*?)-(minecraft:.+)/);

            world.setDynamicProperty(tag, undefined);
            player.sendMessage("§c[!] §fWaystone removed.");
            player.sendMessage(" §8- §rName: §p".concat(warpName));
            player.sendMessage(" §8- §rLocation: §6".concat(x, "§7, §6", y, "§7, §6", z).concat("§7, §rin The ", DimensionNames[dimensionName]));
        };

        // Player warps
        const warps = player.getTags().filter((v) => v.startsWith("Warp:"));
        const w = warps.filter((v) => {
            const [_, warpName, xCord, yCord, zCord, dimensionName] = v.match(warpRegex);
            return (
                location.x == Number(xCord)
                && location.y == Number(yCord)
                && location.z == Number(zCord)
            );
        });

        for (let tag of w) {
            const [_, warpName, xCord, yCord, zCord, dimensionName] = tag.match(warpRegex);

            player.removeTag(tag);
            player.sendMessage("§c[!] §fWaystone removed.");
            player.sendMessage(" §8- §rName: §7".concat(warpName));
            player.sendMessage(" §8- §rLocation: §6".concat(xCord, "§7, §6", yCord, "§7, §6", zCord).concat("§7, §rin The ", DimensionNames[dimensionName]));
        };
    },
    onPlayerInteract: ({ block, dimension, player }) => {
        const isGlobal = block.permutation.getState("pog:activatedAsGlobal");
        const isActivated = block.permutation.getState("pog:activated");
        if ((isActivated || isGlobal) && !player.isSneaking) {
            waystoneMenu(player, block);
        }
        else {
            addNew(player, block);
        };
    },
};