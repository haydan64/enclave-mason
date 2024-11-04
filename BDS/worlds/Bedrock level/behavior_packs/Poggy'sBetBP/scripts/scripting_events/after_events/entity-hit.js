import { world, Player } from "@minecraft/server";

import { corpse } from "../../functionality/player-corpse";
import { chorusBehimeth } from "../../functionality/entities/chorus_behimeth";
import { swordEffects } from "../../functionality/items/sword-effects";

world.afterEvents.entityHitEntity.subscribe(
    ({ damagingEntity, hitEntity }) => {
        if (damagingEntity instanceof Player) {
            corpse(damagingEntity, hitEntity);
            swordEffects(damagingEntity, hitEntity);
        }
        else {
            chorusBehimeth(damagingEntity, hitEntity);
            if (
                hitEntity instanceof Player
                && (damagingEntity.typeId == "better_on_bedrock:flame_beam" || damagingEntity.typeId == "better_on_bedrock:inferno_shield_boss")
            ) hitEntity.setOnFire(3, true);
        };
    },
);