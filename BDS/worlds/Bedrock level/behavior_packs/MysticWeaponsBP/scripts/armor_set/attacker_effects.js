import { system, TicksPerSecond, world } from '@minecraft/server';
import { Vec3 } from "../vec3";

world.afterEvents.entityHitEntity.subscribe((eventData) => {
    const {damagingEntity: attacker, hitEntity: victim} = eventData;
    const equipment = victim.getComponent('equippable');
    const armors = ['Head', 'Chest', 'Legs', 'Feet'].map(slot => equipment?.getEquipment(slot));
    const armorTags = armors.map(armor => armor?.getTags()[0]);
    const armorSetType = armorTags.every(tag => tag === armorTags[0]) ? armorTags[0] : undefined;

    if(Math.random() < 0.25) {
        switch(armorSetType) {
            case 'obstruction':
                attacker.addEffect('weakness', TicksPerSecond * 12);
            break;
            case 'firaga':
                attacker.removeEffect('fire_resistance');
                attacker.setOnFire(12, false);
            break;
            case 'azurelean':
                attacker.addEffect('mining_fatigue', TicksPerSecond * 12, {amplifier: 1});
            break;
            case 'viridescent':
                attacker.addEffect('levitation', TicksPerSecond * 2, {amplifier: 5});
            break;
            case 'glacial':
                attacker.addEffect('slowness', TicksPerSecond * 12, {amplifier: 2});
            break;
            case 'thundersurge':
                const vector = Vec3.normalize(Vec3.subtract(attacker.location, victim.location));
                attacker.applyKnockback(vector.x, vector.z, 4, vector.y);
                system.runTimeout(() => {
                    attacker.dimension.spawnEntity('minecraft:lightning_bolt', attacker.location);
                }, 10)
            break;
            case 'divine':
                const offset = victim.location;
                const x = Math.floor(Math.random() * 17) - 8;
                const y = Math.floor(Math.random() * 3) + 1;
                const z = Math.floor(Math.random() * 17) - 8;

                attacker.applyDamage(4, {cause: 'magic', damagingEntity: victim});
                attacker.teleport({x: offset.x + x, y: offset.y + y, z: offset.z + z}, {checkForBlocks: true});
                victim.runCommandAsync('playsound mob.endermen.portal @a[r=10]');
            break;
            case 'shadow':
                attacker.addEffect('blindness', TicksPerSecond * 6);
                attacker.dimension.createExplosion(
                    attacker.location, 1, {
                        allowUnderwater: true,
                        breaksBlocks: false,
                        source: victim
                    }
                )
            break;
        }
    }
})