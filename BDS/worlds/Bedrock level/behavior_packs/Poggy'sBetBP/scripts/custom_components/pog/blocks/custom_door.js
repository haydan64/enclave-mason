/** @type { import("@minecraft/server").BlockCustomComponent } */
export const events = {
    beforeOnPlayerPlace: (data) => {
        const { block, permutationToPlace } = data;
        const above = block.above();
        if (!above.isAir) {
            data.cancel = true;
            return;
        };

        const north = block.north().typeId == permutationToPlace.type.id;
        const east = block.east().typeId == permutationToPlace.type.id;
        const south = block.south().typeId == permutationToPlace.type.id;
        const west = block.west().typeId == permutationToPlace.type.id;
        const mirrored = (north || east || south || west);

        data.permutationToPlace = permutationToPlace.withState("pog:mirrored", mirrored);
        above.setPermutation(permutationToPlace.withState("pog:top_bit", true).withState("pog:mirrored", mirrored));
    },
    onPlayerInteract: ({ block }) => {
        const isTopBit = block.permutation.getState("pog:top_bit");
        const isOpen = block.permutation.getState("pog:door_open");
        block.setPermutation(block.permutation.withState("pog:door_open", !isOpen));

        const other = isTopBit ? block.below() : block.above();
        if (other.typeId == block.typeId)
            other.setPermutation(other.permutation.withState("pog:door_open", !isOpen));
        block.dimension.playSound(isOpen ? "close.wooden_door" : "open.wooden_door", block.location);
    },
    onTick: ({ block, dimension }) => {
        const isTopBit = block.permutation.getState("pog:top_bit");
        if (!isTopBit && block.above().typeId !== block.typeId)
            block.setType("minecraft:air");
        console.log(`redstone: ` + block.getRedstonePower())
    },
    onPlayerDestroy: ({ block, destroyedBlockPermutation }) => {
        const below = block.below();
        if (below.typeId == destroyedBlockPermutation.type.id)
            below.setType("minecraft:air");
    },
};