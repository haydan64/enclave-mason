import { world } from "@minecraft/server";

/** @param {number} playerYRotation */
function getPreciseRotation(playerYRotation) {
    // Transform player's head Y rotation to a positive
    if (playerYRotation < 0) playerYRotation += 360;
    // How many 16ths of 360 is the head rotation? - rounded
    const rotation = Math.round(playerYRotation / 22.5);

    return rotation !== 16 ? rotation : 0;
}


/** @type {import("@minecraft/server").BlockCustomComponent} */
const blueprintRotationBlockComponent = {
    beforeOnPlayerPlace(event) {
        const { player } = event;
        if (!player) return;

        const blockFace = event.permutationToPlace.getState("minecraft:block_face");
        if (blockFace !== "up") return;

        const playerYRotation = player.getRotation().y;
        const rotation = getPreciseRotation(playerYRotation);

        event.permutationToPlace = event.permutationToPlace.withState("htc:rotation", rotation);
    },
};

world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "htc:blueprint_rotation",
        blueprintRotationBlockComponent
    );
});