import { BlockPermutation, BlockStates, EntityEquippableComponent, EquipmentSlot, GameMode } from "@minecraft/server";

/** @type { import("@minecraft/server").BlockCustomComponent } */
export const events = {
    onRandomTick: ({ block, dimension }) => {
        if (Math.random() < 0.7)
            return;
        
        switch (block.typeId) {
            case "better_on_bedrock:quetzacaw_egg_block": {
                if (block.permutation.getState("better_on_bedrock:crack_stage") == 3) {
                    block.setType("minecraft:air");
                    block.dimension.playSound("block.turtle_egg.crack", block.location);
                    block.dimension.spawnEntity("better_on_bedrock:quetzacaw_friendly", block.location);
                    return;
                };
        
                block.dimension.playSound("block.turtle_egg.break", block.location);
                break;
            };
        };

        getValidValuesForBlock(block.typeId, block);
    },
    onPlayerInteract: ({ block, dimension, player }) => {
        const mainHand = player.getComponent(EntityEquippableComponent.componentId).getEquipment(EquipmentSlot.Mainhand);
        const currentGrowth = block.permutation.getState("better_on_bedrock:growth_stage");
        if (currentGrowth == undefined)
            return;
        
        switch (mainHand?.typeId) {
            case "minecraft:bone_meal": {
                if (player.getGameMode() == GameMode.survival) {
                    player.runCommandAsync("clear @s minecraft:bone_meal 0 1"); // Remove used bone meal
                };

                dimension.playSound("item.bone_meal.use", block.location); // Play bone meal sound
                dimension.spawnParticle("minecraft:crop_growth_emitter", {
                    x: block.location.x + 0.5,
                    y: block.location.y + 0.5,
                    z: block.location.z + 0.5,
                });  // Spawn growth particles
                getValidValuesForBlock(block.typeId, block); // Update block state on bone meal use
                break;
            };
        };

        if (currentGrowth <= 1)
            return;

        let lootTable;
        let sound;
        switch (block.typeId) {
            case "better_on_bedrock:blueberry_block": {
                sound = "block.sweet_berry_bush.pick";
                switch (currentGrowth) {
                    case 2: lootTable = "blocks/blueberry_half"; break;
                    case 3: lootTable = "blocks/blueberry"; break;
                };

                break;
            };
            case "better_on_bedrock:grape": {
                sound = "block.sweet_berry_bush.pick";
                switch (currentGrowth) {
                    case 2: lootTable = "blocks/grape_half"; break;
                    case 3: lootTable = "blocks/grape"; break;
                };

                break;
            };

            default: return;
        };

        const { x, y, z } = block.location;
        dimension.runCommandAsync(`loot spawn ${x + 0.5} ${y + 0.5} ${z + 0.5} loot "`.concat(lootTable).concat('"'));
        dimension.playSound(sound, block.location);
        block.setPermutation(block.permutation.withState("better_on_bedrock:growth_stage", 1));
    },
};

// This function checks if a specific block state with a given value is valid.
function isBlockStateValid(blockId, blockState, blockValue) {
    const state = {}; // Create a temporary state object
    state[blockState] = blockValue; // Set the state with the provided value

    const permutation = BlockPermutation.resolve(blockId, state); // Create a permutation based on the state
    return permutation.getState(blockState) === blockValue; // Check if the permutation matches the provided value
};

/**
 * @param {string} blockId - The unique identifier of the block.
 * @param {object} block - The block object representing the crop block.
 * @returns {object} An object containing valid values for each block state, or an empty object if no valid values are found.
 */
function getValidValuesForBlock(blockId, block) {
    const states = {}; // Empty object to store valid state values

    // Iterate through all available states for the block
    for (const stateName in BlockPermutation.resolve(blockId).getAllStates()) {
        const validValuesForState = BlockStates.get(stateName)?.validValues; // Get valid values for the current state

        if (!validValuesForState)
            continue; // Skip if no valid values for this state

        validValuesForState.forEach((value) => {
            // Check if the block state with the current value is valid
            if (isBlockStateValid(blockId, stateName, value)) {
                if (!states[stateName]) {
                    states[stateName] = []; // Initialize an array for this state's values
                };

                states[stateName].push(value); // Add the valid value to the state's array
            };
        });

        // Logic to determine and potentially update the block's state
        const firstKey = Object.keys(states)[0];
        const currentState = block.permutation.getState(firstKey)
        const maxStage = states[stateName].length - 1
        const nextStage = Math.min(currentState + 1, maxStage);
        block.setPermutation(block.permutation.withState(firstKey, nextStage))
    };

    return states;
};