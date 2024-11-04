import { world, system, Player } from "@minecraft/server"

world.afterEvents.entityHitEntity.subscribe(
    ({ damagingEntity, hitEntity }) => {
        if (!(damagingEntity instanceof Player) || hitEntity.typeId !== "better_on_bedrock:inferior")
            return;
        
        const hitAmount = hitEntity.getProperty("pog:hit_amount");
        if (hitAmount === 5)
            return;
        
        hitEntity.setProperty("pog:hit_amount", hitAmount + 1);
        system.runInterval(() => {
            if (hitAmount <= 3 || !hitEntity.isValid())
                return;
            
            hitEntity.setProperty("pog:hit_amount", 0);
            hitEntity.triggerEvent("stun_mode");
        }, 20);
    },
);