import { world, ItemStack } from '@minecraft/server';
const slabs = [
    { id: "better_on_bedrock:chorus_slab" },
    { id: "better_on_bedrock:dusk_slab" },
    { id: "better_on_bedrock:malbite_bricks_slab" },
    { id: "better_on_bedrock:malbite_smooth_slab" },
    { id: "better_on_bedrock:malbite_smoother_slab" },
    { id: "better_on_bedrock:voiding_slab" }
];

/** @type { import("@minecraft/server").BlockCustomComponent } */
export const events = {
    onPlayerInteract: ({ block, player, face }) => {
        // Get the equipment component for the player
        const equipment = player.getComponent('equippable');

        // Get the selected item from the player's mainhand
        const selectedItem = equipment.getEquipment('Mainhand');
        //tallBottomDoors.find((door) => ev.block.permutation.matches(door.id));
        const isSlab = slabs.find((slab) => selectedItem.matches(slab.id))

        // Check if the selected item is a slab and the block is not already double
        if ((isSlab) && !block.permutation.getState('kai:double')) {

            // Check if the interaction is valid based on vertical half and face
            const verticalHalf = block.permutation.getState('minecraft:vertical_half');
            const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
            const isTopDown = verticalHalf === 'top' && face === 'Down';
            if (isBottomUp || isTopDown) {
                // Reduces item count if not in creative mode
                if (player.getGameMode() !== "creative") {
                    selectedItem.amount -= 1;
                    // Clear or update selected slot based on item count
                    if (selectedItem.amount === 0) {
                        equipment.setEquipment('Mainhand', undefined);
                    } else {
                        equipment.setEquipment('Mainhand', selectedItem);
                    }
                }
                // Set block to double and remove water if present
                block.setPermutation(block.permutation.withState('kai:double', true));
                block.setWaterlogged(false);
                // Play sound effect
                player.playSound('use.stone');
            }
        }

        // Check if the selected item is a water bucket and the block is not waterlogged or double
        if (selectedItem?.typeId === 'minecraft:water_bucket' && !block.permutation.getState('kai:waterlogged') && !block.permutation.getState('kai:double')) {
            // If not in creative mode, replace water bucket with empty bucket
            if (player.getGameMode() !== "creative") {
                equipment.setEquipment('Mainhand', new ItemStack('minecraft:bucket', 1));
            }
            // Set block to waterlogged and place corresponding structure
            block.setPermutation(block.permutation.withState('kai:waterlogged', true));
            const verticalHalf = block.permutation.getState('minecraft:vertical_half');
            const structureName = (verticalHalf === 'bottom') ? 'mystructure:bottomSlab' : 'mystructure:topSlab'; // These structures contains your slab waterlogged, made with an NBT editor
            const { x, y, z } = block;
            world.structureManager.place(structureName, e.dimension, { x, y, z });
        }
    },
};