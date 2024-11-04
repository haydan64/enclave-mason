const blocks = [
    "better_on_bedrock:bottom_tall_chorus",
    "better_on_bedrock:bottom_tall_abyss_grass_block",
    "better_on_bedrock:custom_tall_plant",
    "better_on_bedrock:bluegrod_bottom",
    "better_on_bedrock:lush_grass_bottom",
    "better_on_bedrock:tall_lavender_bottom",
    "myname:tall_ashen_fungus"
];

/** @type { import("@minecraft/server").BlockCustomComponent } */
export const events = {
    beforeOnPlayerPlace: (data) => {
        const { block, permutationToPlace } = data;
        if (!blocks.includes(permutationToPlace.type.id))
            return;

        const above = block.above();
        if (!above.isAir) {
            data.cancel = true;
            return;
        };

        above.setPermutation(permutationToPlace.withState("pog:double_plant", "top_bit"));
    },
    onPlayerDestroy: ({ block, destroyedBlockPermutation }) => {
        const below = block.below();
        if (below.typeId == destroyedBlockPermutation.type.id)
            below.setType("minecraft:air");
    },
};