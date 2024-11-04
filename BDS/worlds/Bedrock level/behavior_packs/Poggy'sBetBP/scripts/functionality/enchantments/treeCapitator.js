import { mine } from "./functionality";
const blocks = [
    {
        blocks: [
            {
                name: "minecraft:oak_log",
                mineable: [],
                drop: "minecraft:oak_log",
            },
            {
                name: "minecraft:oak_wood",
                mineable: [],
                drop: "minecraft:oak_wood",
            },
            {
                name: "minecraft:spruce_log",
                mineable: [],
                drop: "minecraft:spruce_log",
            },
            {
                name: "minecraft:spruce_wood",
                mineable: [],
                drop: "minecraft:spruce_wood",
            },
            {
                name: "minecraft:birch_log",
                mineable: [],
                drop: "minecraft:birch_log",
            },
            {
                name: "minecraft:birch_wood",
                mineable: [],
                drop: "minecraft:birch_wood",
            },
            {
                name: "minecraft:jungle_log",
                mineable: [],
                drop: "minecraft:jungle_log",
            },
            {
                name: "minecraft:jungle_wood",
                mineable: [],
                drop: "minecraft:jungle_wood",
            },
            {
                name: "minecraft:acacia_log",
                mineable: [],
                drop: "minecraft:acacia_log",
            },
            {
                name: "minecraft:acacia_wood",
                mineable: [],
                drop: "minecraft:acacia_wood",
            },
            {
                name: "minecraft:dark_oak_log",
                mineable: [],
                drop: "minecraft:dark_oak_log",
            },
            {
                name: "minecraft:dark_oak_wood",
                mineable: [],
                drop: "minecraft:dark_oak_wood",
            },
            {
                name: "minecraft:mangrove_log",
                mineable: [],
                drop: "minecraft:mangrove_log",
            },
            {
                name: "minecraft:mangrove_wood",
                mineable: [],
                drop: "minecraft:mangrove_wood",
            },
            {
                name: "minecraft:cherry_log",
                mineable: [],
                drop: "minecraft:cherry_log",
            },
            {
                name: "minecraft:cherry_wood",
                mineable: [],
                drop: "minecraft:cherry_wood",
            },
            {
                name: "minecraft:crimson_stem",
                mineable: [],
                drop: "minecraft:crimson_stem",
            },
            {
                name: "minecraft:crimson_hyphae",
                mineable: [],
                drop: "minecraft:crimson_hyphae",
            },
            {
                name: "minecraft:warped_stem",
                mineable: [],
                drop: "minecraft:warped_stem",
            },
            {
                name: "minecraft:warped_hyphae",
                mineable: [],
                drop: "minecraft:warped_hyphae",
            },
            {
                name: "better_on_bedrock:shrublog",
                mineable: [],
                drop: "better_on_bedrock:shrublog",
            },
            {
                name: "better_on_bedrock:vp_log",
                mineable: [],
                drop: "better_on_bedrock:vp_log",
            },
            {
                name: "better_on_bedrock:chorus_log",
                mineable: [],
                drop: "better_on_bedrock:chorus_log",
            },
        ],
    },
];

/** @param { import("@minecraft/server").PlayerBreakBlockAfterEvent } data */
export function treeCapitator({
    block, player, dimension,
    itemStackBeforeBreak: itemStack,
    itemStackAfterBreak: afterItemStack,
    brokenBlockPermutation: permutation,
}) {
    if (itemStack == undefined || !itemStack.getLore().includes("§r§7Tree Capitator I") || player.isSneaking)
        return;

    mine(block, permutation.type.id, player, itemStack, blocks);
};