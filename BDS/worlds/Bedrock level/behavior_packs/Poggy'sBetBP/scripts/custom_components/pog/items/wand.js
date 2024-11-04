import { EntityEquippableComponent, EquipmentSlot, system, world } from "@minecraft/server";

function getClosestEntityFromViewDirection(entity, distance) {
    const entityRaycastHit_list = entity.getEntitiesFromViewDirection({ maxDistance: distance });
    if (entityRaycastHit_list.length === 0)
        return undefined;
    let entityClosest = undefined;
    let maxDistance = distance;
    entityRaycastHit_list.forEach((entityRaycastHit) => {
        if (entityRaycastHit.distance < maxDistance) {
            maxDistance = entityRaycastHit.distance;
            entityClosest = entityRaycastHit.entity;
        };
    });
    return entityClosest;
};

/** @type { import("@minecraft/server").ItemCustomComponent } */
export const events = {
    onUse: ({ source, itemStack }) => {
        switch (itemStack.typeId) {
            case "better_on_bedrock:staff_of_the_seas": {
                if (source.isSneaking) {
                    source.dimension.spawnParticle("pog:ice", source.location);
                    
                    const entities = source.dimension.getEntities({ families: [ "mob" ], location: source.location, maxDistance: 5 });
                    for (let i = 0; i < entities.length; i++) {
                        const entity = entities[i];
                        entity.addEffect("slowness", 120, { amplifier: 15, showParticles: false });
                        entity.addEffect("wither", 120, { amplifier: 3, showParticles: false });
                        entity.dimension.spawnEntity("better_on_bedrock:icestaffsrozen", entity.location);
                    };
                }
                else {
                    
                };
                break;
            };
        };
    },
};

world.afterEvents.itemStartUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId !== "better_on_bedrock:staff_of_the_seas")
        return;

    const interval = system.runInterval(() => {
        const players = world.getAllPlayers();
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.id !== source.id || player.isSneaking)
                continue;

            const equippable = source.getComponent(EntityEquippableComponent.componentId);
            const offhand = equippable.getEquipment(EquipmentSlot.Offhand);
            const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
            if (offhand?.typeId != "better_on_bedrock:scroll_of_the_kinglvl2" || mainhand?.typeId != "better_on_bedrock:staff_of_the_seas")
                continue;

            const entity = getClosestEntityFromViewDirection(source, 7);
            if (entity !== undefined) {
                entity.applyDamage(8);
                entity.addEffect("slowness", 100);
            };

            const stop = world.afterEvents.itemStopUse.subscribe(run);
            const complete = world.afterEvents.itemCompleteUse.subscribe(run);
            const release = world.afterEvents.itemReleaseUse.subscribe(run);
            function run() {
                system.clearRun(interval);
                player.startItemCooldown("iceStaff", 400);

                world.afterEvents.itemStopUse.unsubscribe(stop);
                world.afterEvents.itemCompleteUse.unsubscribe(complete);
                world.afterEvents.itemReleaseUse.unsubscribe(release);
            };

            system.runTimeout(() => {
                const offhand = equippable.getEquipment(EquipmentSlot.Offhand);
                const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
                if (offhand?.typeId != "better_on_bedrock:scroll_of_the_kinglvl2" || mainhand?.typeId != "better_on_bedrock:staff_of_the_seas")
                    return;

                run();
            }, 80);
        };
    }, 5);
});