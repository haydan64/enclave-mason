import { world } from "@minecraft/server";

import { amethystKnockback } from "../../functionality/armor_effects/amethyst";

world.afterEvents.entityHurt.subscribe(
    ({ damage, damageSource, hurtEntity }) => {
        amethystKnockback(damageSource, hurtEntity);
    },
);