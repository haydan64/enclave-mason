import { system, TicksPerSecond, world} from '@minecraft/server';
import { Vec3 } from "../vec3";

world.afterEvents.entityHitEntity.subscribe(async(eventData) => {
    const {damagingEntity: attacker, hitEntity: victim} = eventData;
    const weapon = attacker.getComponent('equippable')?.getEquipment('Mainhand');
    const effectChance = Math.round(Math.random() * 100);
    const isFullMoon = world.getMoonPhase() == 0;

    if(attacker.typeId === 'minecraft:player') {
        attacker.setDynamicProperty('exitStealth', true);
    }

    switch(weapon?.typeId) {
        //swords
        case 'mystic:evocation_blade':
            if(effectChance < 45) {
                victim.runCommandAsync('execute at @s run summon evocation_fang ~ ~ ~');
                victim.addEffect('weakness', TicksPerSecond * 5, {amplifier: 1});
            }
        break;
        case 'mystic:blazing_sword':
            if(effectChance < 43) {
                victim.dimension.spawnParticle('mystic:bursting_flames.particle', victim.location);
                victim.removeEffect('fire_resistance');
                victim.setOnFire(8, false);
            }
        break;
        case 'mystic:aqueous_blade':
            if(effectChance < 30) {
                const health = attacker.getComponent('health');
                attacker.playSound('healing.sfx');
                if(health.currentValue === health.defaultValue) {
                    attacker.addEffect('absorption', TicksPerSecond * 7, {showParticles: false});
                }
                else {
                    health.setCurrentValue(health.currentValue + 6);
                }
            }
        break;
        case 'mystic:galeforce_blade':
            if(effectChance < 40) {
                const vector = Vec3.normalize(Vec3.subtract(victim.location, attacker.location));
                victim.applyKnockback(vector.x, vector.z, 6, vector.y);
                system.runTimeout(() => {
                    const {x, y, z} = victim.location;
                    victim.applyDamage(3, {cause: 'magic', damagingEntity: attacker});
                    victim.dimension.spawnParticle('mystic:bursting_wind.particle', {x: x, y: y + 0.5, z: z});
                },10)
            }
        break;
        case 'mystic:shattered_blade':
            if(effectChance < 33 && !victim.hasTag('immobilized')) {
                victim.addTag('immobilized');
                const immobilize = system.runInterval(() => {
                    if(victim.isValid() && victim.hasTag('immobilized')) {
                        victim.teleport(victim.location);
                        if(system.currentTick % TicksPerSecond == 0) {
                            victim.dimension.spawnParticle('mystic:freezing_effect.particle', victim.location);
                        }
                    }
                    else {
                        system.clearRun(immobilize);
                    }
                })
                system.runTimeout(() => {
                    system.clearRun(immobilize);
                    if(victim.isValid()) {
                        victim.addEffect('slowness', TicksPerSecond * 3);
                    }
                }, TicksPerSecond * 3)
            }
        break;
        case 'mystic:lightning_sword':
            const isElectrocuted = victim.getTags().find(tag => tag.includes('electrocutedBy'));

            if(effectChance < 38 && !isElectrocuted) {
                let electrocute = 0;
                attacker.playSound('electrocute.sfx', {volume: 0.5});
                victim.addTag(`electrocutedBy${attacker.nameTag}`);
                victim.dimension.spawnParticle('mystic:electrocute.particle', victim.location);

                const electrocuted = system.runInterval(() => {
                    if(victim.isValid() && victim.hasTag(`electrocutedBy${attacker.nameTag}`)) {
                        electrocute++;
                        victim.dimension.spawnParticle('mystic:electrocute.particle', victim.location);
                        if(electrocute % 2 == 0) {
                            victim.applyDamage(1, {cause: 'lightning', damagingEntity: attacker})
                        }
                    }
                    else {
                        system.clearRun(electrocuted);
                    }
                }, TicksPerSecond);

                system.runTimeout(() => {
                    if(victim.isValid()) {
                        victim.removeTag(`electrocutedBy${attacker.nameTag}`);
                        system.clearRun(electrocuted);
                    }
                }, TicksPerSecond * 10)
            }
        break;
        case 'mystic:sunflicker_sword':
            if(effectChance < 40) {
                victim.setOnFire(10, false);
                attacker.playSound('solar_beam.sfx', {volume: 0.25});
                victim.dimension.spawnParticle('mystic:solar_beam.particle', victim.location);
            }
        break;
        case 'mystic:cataclysm_blade':
            if(effectChance < 40) {
                if(isFullMoon) {
                    const impactedEntities = victim.dimension.getEntities({
                        location: victim.location, maxDistance: 2,
                        excludeNames: [attacker.nameTag],
                        excludeTypes: [
                            'armor_stand', 'arrow', 'evocation_fang','falling_block',
                            'item', 'painting', 'tnt', 'xp_orb'
                        ]
                    });
                    impactedEntities.forEach(entity => entity.addEffect('blindness', TicksPerSecond * 5));
                }

                victim.setOnFire(4, true);
                victim.dimension.createExplosion(
                    victim.location, isFullMoon ? 1.5 : 2, {
                        allowUnderwater: true,
                        breaksBlocks: isFullMoon,
                        causesFire: true,
                        source: attacker
                    }
                )
            }
        break;

        //battleaxes
        case 'mystic:terraforge_axe':
            victim.addEffect('weakness', TicksPerSecond * 4, {amplifier: 1});
            if(effectChance < 50) {
                victim.addEffect('nausea', 20 * 4, {amplifier: 1});
            }
        break;
        case 'mystic:incinerator_axe':
            victim.setOnFire(6, false);
            if(effectChance < 45) {
                victim.runCommandAsync('setblock ~ ~ ~ fire [] keep');
            }
        break;
        case 'mystic:cerulean_edge':
            victim.addEffect('mining_fatigue', TicksPerSecond * 4, {amplifier: 1});
        break;
        case 'mystic:galeshatter_axe':
            victim.addEffect('levitation', TicksPerSecond * 2, {amplifier: 3, showParticles: false});
        break;
        case 'mystic:frozen_axe':
            victim.addEffect('slowness', TicksPerSecond * 3, {amplifier: 2});
        break;
        case 'mystic:electrosurge_axe':
            const mainDamage = await getDamage();
            const impactDamage = parseFloat((mainDamage / 2).toFixed(1));
            const electroblast = victim.dimension.getEntities({
                location: victim.location, maxDistance: 2,
                excludeNames: [attacker.nameTag],
                excludeTypes: [
                    'armor_stand', 'arrow', 'evocation_fang','falling_block',
                    'item', 'painting', 'tnt', 'xp_orb'
                ]
            }).filter(entity => entity.id !== victim.id);
            
            if(electroblast.length > 0) {
                attacker.playSound('electrocute.sfx');
                victim.dimension.spawnParticle('mystic:electrocute.particle', victim.location);
                for(const blast of electroblast) {
                    blast.applyDamage(impactDamage, {cause: 'entityAttack', damagingEntity: attacker});
                    blast.dimension.spawnParticle('mystic:electrocute.particle', blast.location);
                }
            }
        break;
        case 'mystic:luminarax_edge':
            const offset = victim.location;
            let x = Math.floor(Math.random() * 17) - 8;
            let y = Math.floor(Math.random() * 3) + 1;
            let z = Math.floor(Math.random() * 17) - 8;

            victim.runCommandAsync('playsound mob.endermen.portal @a[r=10]');
            victim.teleport({x: offset.x + x, y: offset.y + y, z: offset.z + z}, {checkForBlocks: true});
        break;
        case 'mystic:abyssal_axe':
            if(isFullMoon) {
                victim.addEffect('wither', TicksPerSecond * 6);
                victim.dimension.createExplosion(
                    victim.location, 1.5, {
                        allowUnderwater: true,
                        breaksBlocks: false,
                        source: attacker
                    }
                )
            }
            else {
                victim.addEffect('wither', TicksPerSecond * 4, {amplifier: 1});
            }
        break;
    }
});

function getDamage() {
    return new Promise((resolve) => {
        world.afterEvents.entityHurt.subscribe(async(eventData) => {
            const {damage, damageSource} = eventData;
            const attacker = damageSource.damagingEntity;
            const weapon = attacker?.getComponent('equippable')?.getEquipment('Mainhand')?.typeId;

            if(weapon === 'mystic:electrosurge_axe') {
                resolve(damage);
            }
        });
    });
}