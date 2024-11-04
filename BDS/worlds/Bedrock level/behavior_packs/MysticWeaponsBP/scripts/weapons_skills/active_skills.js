import { Player, system, TicksPerSecond, world } from '@minecraft/server';
import { looseDurability } from '../durability/loose_durability.js';
import { iceCage, mysticWeapons } from '../system/data.js';
import { Vec3 } from "../vec3";

world.afterEvents.itemUse.subscribe((eventData) => {
    const {itemStack: item, source: player} = eventData;
    const {cooldownTicks: duration, cooldownCategory: category} = item.getComponent('cooldown') || {};
    const cooldown = player.getItemCooldown(category || 'none');
    const isScepter = mysticWeapons.scepter.hasOwnProperty(item.typeId);

    player.setDynamicProperty('exitStealth', true);

    function getTargets(minRange, maxRange) {
        const isSneaking = player.isSneaking;
        const locationParams = {
            location: player.location,
            minDistance: minRange,
            maxDistance: maxRange,
            excludeNames: [player.name],
        };
    
        const entitiesParams = {
            ...locationParams,
            excludeTypes: [
                'armor_stand', 'arrow', 'evocation_fang','falling_block',
                'item', 'painting', 'player', 'tnt', 'xp_orb'
            ]
        }
    
        const targetEntities = isSneaking
            ? player.dimension.getEntities({ ...entitiesParams, families: ['monster'] })
            : player.dimension.getEntities(entitiesParams);
    
        const targetPlayers = player.dimension.getPlayers({
            ...locationParams,
            excludeGameModes: ['creative', 'spectator']
        });
        if(player.getDynamicProperty('pvp')) {
            return {
                target: targetEntities.concat(targetPlayers),
                attackMode: isSneaking ? 'target_player_and_monster' : 'target_all'
            };
        }
        else {
            return {
                target: targetEntities,
                attackMode: isSneaking ? 'target_monster' : 'target_exclude_player'
            };
        }
    }

    const weaponAbilities = {
        'mystic:evocation_staff': function() {
            const targets = getTargets(1, 10).target;
            if(targets.length > 0) {
                for(const entity of targets) {
                    entity.runCommandAsync('execute at @s run summon evocation_fang ~ ~ ~');
                    system.runTimeout(() => {
                        entity.runCommandAsync('execute at @s run summon evocation_fang ~ ~ ~');
                        entity.addEffect('weakness', TicksPerSecond * 5, {amplifier: 1});
                    }, 20);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:pyrelight_scepter': function() {
            const targets = getTargets(1, 10).target;
            if(targets.length > 0) {
                for(const entity of targets) {
                    entity.removeEffect('fire_resistance');
                    entity.applyDamage(5, {cause: 'fire', damagingEntity: player});
                    entity.dimension.spawnParticle('mystic:bursting_flames.particle', entity.location);
                    system.runTimeout(() => {
                        entity.setOnFire(6, true);
                        entity.runCommandAsync('execute at @s run setblock ~ ~ ~ fire [] keep');
                    }, 5);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:hydroburst_scepter': function() {
            const targets = getTargets(0, 10).target.filter(entity => {
                const playerY = player.location.y;
                const headY = entity.getHeadLocation().y + 0.5;
                const feetY = entity.location.y - 0.5;
                return playerY >= feetY && playerY <= headY;
            });
    
            if(targets.length > 0) {
                player.dimension.spawnParticle('mystic:surging_water.particle', player.location);
                player.playSound('water_splash.sfx', {volume: 0.25});
                player.runCommandAsync('fill ~-1 ~ ~-1 ~1 ~ ~1 air [] replace fire');
    
                for(const entity of targets) {
                    const vector = Vec3.normalize(Vec3.subtract(entity.location, player.location));
                    entity.applyKnockback(vector.x, vector.z, 1, 0.4);
                    entity.runCommandAsync('fill ~-1 ~ ~-1 ~1 ~ ~1 air [] replace fire');
    
                    system.runTimeout(() => {
                        const damageProperty = {cause: 'entityAttack', damagingEntity: player}
                        if(entity.hasComponent('onfire')) {
                            entity.extinguishFire();
                            entity.applyDamage(15, damageProperty);
                        }
                        else {
                            entity.applyDamage(12, damageProperty);
                        }
                    }, 10);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:tempest_staff': function() {
            const targets = getTargets(0, 10).target;
            if(targets.length > 0) {
                for(const entity of targets) {
                    entity.addEffect('levitation', TicksPerSecond * 2, {amplifier: 5});
                    system.runTimeout(() => {
                        if(entity.isValid()) {
                            entity.dimension.spawnParticle('mystic:bursting_wind.particle', entity.location);
                            entity.applyDamage(10, {cause: 'entityAttack', damagingEntity: player});
                        }
                    }, 40);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:thawed_scepter': function() {
            const targets = getTargets(0, 10).target;
            if(targets.length > 0) {
                for(const entity of targets) {
                    const loc = entity.location;
                    const entityType = entity.typeId.replace('minecraft:', '');
                    let range = 1;
                    player.playSound('mob.evocation_illager.cast_spell');
                    entity.addEffect('slowness', TicksPerSecond * 12, {amplifier: 1});
                    entity.applyDamage(3, {cause: 'freezing', damagingEntity: player});
                    for(let i = 0; i < 12; i++) {
                        switch(entityType) {
                            case 'allay': case 'axolotl': case 'chicken': case 'cod':
                            case 'endermite': case 'frog': case 'pufferfish': case 'tadpole':
                            case 'rabbit': case 'salmon': case 'silverfish': case 'tropicalfish':
                                entity.runCommandAsync(iceCage.small[i]);
                            break;
                            case 'enderman':
                                entity.runCommandAsync(iceCage.tall[i]);
                            break;
                            case 'elder_guardian': case 'iron_golem': case 'sniffer':
                            case 'ravager': case 'warden': case 'wither':
                                range = 3;
                                entity.runCommandAsync(iceCage.large[i]);
                            break;
                            default:
                                entity.runCommandAsync(iceCage.normal[i]);
                            break;
                        }
                    }
                    system.runTimeout(() => {
                        const cageEntities = player.dimension.getEntities({location: loc, maxDistance: range});
                        for(const cageEntity of cageEntities) {
                            cageEntity.applyDamage(6, {cause: 'freezing', damagingEntity: player});
                        }
                    }, TicksPerSecond * 8);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:lightning_scepter': function() {
            const targets = getTargets(2, 10).target;
            if(targets.length > 0) {
                for(const entity of targets) {
                    entity.dimension.spawnEntity('minecraft:lightning_bolt', entity.location);
                    system.runTimeout(() => {
                        entity.dimension.spawnEntity('minecraft:lightning_bolt', entity.location);
                    }, TicksPerSecond);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:solarflare_scepter': function() {
            const targets = getTargets(0, 10).target;
            if(targets.length > 0) {
                for(const entity of targets) {
                    let hits = 0;
                    const damageProperty = {cause: 'entityAttack', damagingEntity: player};

                    player.playSound('solar_beam.sfx');
                    entity.applyDamage(5, damageProperty);
                    entity.dimension.spawnParticle('mystic:solar_beam.particle', entity.location);
                    const followUpAttack = system.runInterval(() => {
                        if(entity.isValid()) {
                            player.playSound('solar_beam.sfx', {volume: 0.25});
                            entity.applyDamage(2, damageProperty);
                            entity.dimension.spawnParticle('mystic:solar_beam.particle', entity.location);
                            hits++;
                            if(hits == 3) {
                                system.clearRun(followUpAttack);
                            }
                        }
                        else {
                            system.clearRun(followUpAttack);
                        }
                    }, 10);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:necromancy_staff': function() {
            if(getTargets(0, 10).target.length > 0) {
                const targetMode = getTargets(0, 10).attackMode;
                const smokeEffect = [
                    'particle mystic:summoning_smoke.particle ~3 ~ ~',
                    'particle mystic:summoning_smoke.particle ~ ~ ~3',
                    'particle mystic:summoning_smoke.particle ~3 ~ ~-3',
                    'particle mystic:summoning_smoke.particle ~-3 ~ ~'
                ]
    
                const summonUndead = [
                    `summon mystic:undead ~3 ~ ~ ~ ~ mystic:${targetMode} ${player.name}`,
                    `summon mystic:undead ~ ~ ~3 ~ ~ mystic:${targetMode} ${player.name}`,
                    `summon mystic:undead ~3 ~ ~-3 ~ ~ mystic:${targetMode} ${player.name}`,
                    `summon mystic:undead ~-3 ~ ~ ~ ~ mystic:${targetMode} ${player.name}`,
                ]
    
                smokeEffect.forEach(smoke => player.runCommandAsync(smoke));
                system.runTimeout(() => {
                    summonUndead.forEach(summon => player.runCommandAsync(summon));
                }, 5);
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:evocation_blade': function() {
            const action =
                (player.isGliding && !player.isSwimming && !player.isClimbing) ? 'unusable.gliding' :
                (!player.isGliding && player.isSwimming && !player.isClimbing) ? 'unusable.swimming' :
                (!player.isGliding && !player.isSwimming && player.isClimbing) ? 'unusable.climbing' : false;
    
            if(action) {
                return {
                    translate: 'mystic.weapon.unusable',
                    with: {
                        rawtext: [{translate: action}]
                    }
                }
            }
            else {
                player.applyKnockback(0,0,0,1.1);
                system.runTimeout(() => {
                    player.runCommandAsync('fill ~ ~-1 ~ ~ ~-6 ~ mystic:temporary_dirt [] replace air');
                }, 8);
                return true;
            }
        },
        'mystic:blazing_sword': function() {
            const direction = Math.floor((player.getRotation().y + 255) / 90) % 4;
    
            player.playSound('fire.ignite');
            let command;
    
            switch(direction) {
                case 0: //north
                    command = 'fill ~-1 ~1 ~-2 ~1 ~-1 ~-6 fire [] replace air';
                break;
                case 1: //east
                    command = 'fill ~2 ~1 ~-1 ~6 ~-1 ~1 fire [] replace air';
                break;
                case 2: //south
                    command = 'fill ~-1 ~1 ~2 ~1 ~-1 ~6 fire [] replace air';
                break;
                case 3: //west
                    command = 'fill ~-2 ~1 ~-1 ~-6 ~-1 ~1 fire [] replace air';
                break;
            }
    
            const result = player.runCommand(command).successCount;
            return result > 0 ? true : {translate: 'mystic.unable.placeFire'};
        },
        'mystic:aqueous_blade': function() {
            const negativeEffects = new Set(['hunger', 'mining_fatigue', 'nausea', 'poison', 'wither']);
            const playerEffects = new Set(player.getEffects().map(effect => effect.typeId));
            const dispellEffects = Array.from(negativeEffects).filter(effect => playerEffects.has(effect));
            if(dispellEffects.length > 0 || player.hasComponent('onfire')) {
                dispellEffects.push('fatal_poison');
                player.playSound('purified.sfx');
                player.dimension.spawnParticle('mystic:purified_effect.particle', player.location);
                for(const dispell of dispellEffects) {
                    player.removeEffect(dispell);
                }
                player.extinguishFire();
                player.onScreenDisplay.setActionBar({translate: 'mystic.effect.purified'});
                return true;
            }
            else {
                return {translate: 'mystic.noEffect.found'};
            }
        },
        'mystic:galeforce_blade': function() {
            const galeforceAttack = getTargets(0, 5).target;
            if(galeforceAttack.length > 0) {
                player.playSound('gust_forcefield.sfx');
                player.dimension.spawnParticle('mystic:gusting_forcefield.particle', player.location);
                for(const entity of galeforceAttack) {
                    const vector = Vec3.normalize(Vec3.subtract(entity.location, player.location));
                    entity.applyKnockback(vector.x, vector.z, 7, vector.y);
                    entity.applyDamage(3, {cause: 'entityAttack', damagingEntity: player});
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:shattered_blade': function() {
            const direction = Math.floor((player.getRotation().y + 255) / 90) % 4;
    
            player.playSound('mob.evocation_illager.cast_spell');
            switch(direction) {
                case 0: //north
                    player.runCommandAsync('fill ~-2 ~ ~-3 ~2 ~3 ~-3 mystic:temporary_ice [\"ice:has_water\"=true] replace water');
                    player.runCommandAsync('fill ~-2 ~ ~-3 ~2 ~3 ~-3 mystic:temporary_ice [\"ice:has_water\"=false] replace air');
                break;
                case 1: //east
                    player.runCommandAsync('fill ~3 ~ ~2 ~3 ~3 ~-2 mystic:temporary_ice [\"ice:has_water\"=true] replace water');
                    player.runCommandAsync('fill ~3 ~ ~2 ~3 ~3 ~-2 mystic:temporary_ice [\"ice:has_water\"=false] replace air');
                break;
                case 2: //south
                    player.runCommandAsync('fill ~-2 ~ ~3 ~2 ~3 ~3 mystic:temporary_ice [\"ice:has_water\"=true] replace water');
                    player.runCommandAsync('fill ~-2 ~ ~3 ~2 ~3 ~3 mystic:temporary_ice [\"ice:has_water\"=false] replace air');
                break;
                case 3: //west
                    player.runCommandAsync('fill ~-3 ~ ~2 ~-3 ~3 ~-2 mystic:temporary_ice [\"ice:has_water\"=true] replace water');
                    player.runCommandAsync('fill ~-3 ~ ~2 ~-3 ~3 ~-2 mystic:temporary_ice [\"ice:has_water\"=false] replace air');
                break;
            }
            return true;
        },
        'mystic:lightning_sword': function() {
            const electrocuted = player.dimension.getEntities({
                location: player.location, 
                maxDistance: 8,
                tags: [`electrocutedBy${player.name}`]
            });
    
            if(electrocuted.length > 0) {
                for(const entity of electrocuted) {
                    entity.removeTag(`electrocutedBy${player.name}`);
                    entity.dimension.spawnEntity('minecraft:lightning_bolt', entity.location);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        },
        'mystic:sunflicker_sword': function() {
            player.playSound('mob.endermen.portal');
            const viewBlock = player.getBlockFromViewDirection({maxDistance: 8, includePassableBlocks: false});
    
            if(viewBlock) {
                const tpLoc = viewBlock.block.location;
                tpLoc.x += 1; tpLoc.y++; tpLoc.z += 1;
                player.teleport(tpLoc, {checkForBlocks: true});
            }
            else {
                player.teleport(Vec3.add(player.getHeadLocation(), Vec3.multiply(player.getViewDirection(), 8)));
            }
            return true;
        },
        'mystic:cataclysm_blade': function() {
            const entityDraw = player.getEntitiesFromViewDirection({maxDistance: 8});
            if(entityDraw.length > 0) {
                player.playSound('sword_slash.sfx');
                for(const target of entityDraw) {
                    const distance = target.distance;
                    const vector = Vec3.normalize(Vec3.subtract(player.location, target.entity.location));
                    target.entity.applyKnockback(vector.x, vector.z, distance, vector.y);
                }
                return true;
            }
            else {
                return {translate: 'mystic.weapon.noTarget'};
            }
        }
    }
    
    if(!weaponAbilities.hasOwnProperty(item.typeId)) return;

    Player.prototype.isGameMode = function(gamemode) {
        return world.getPlayers({name: this.name, gameMode: gamemode}).length > 0;
    }

    if(cooldown === 0) {
        const ability = weaponAbilities[item.typeId];
        const isCreative = player.isGameMode('creative');

        if(isScepter && (player.level >= 1 || isCreative)) {
            const onUse = ability();
            if(onUse === true) {
                player.startItemCooldown(category, duration);
                if(isCreative) return;
                looseDurability(item, player, 1);
                player.addLevels(-1);
            }
            else {
                player.onScreenDisplay.setActionBar(onUse);
            }
        }
        else if(!isScepter) {
            const onUse = ability();
            if(onUse === true) {
                player.startItemCooldown(category, duration);
                if(isCreative) return;
                looseDurability(item, player, 2);
            }
            else {
                player.onScreenDisplay.setActionBar(onUse);
            }
        }
        else {
            player.onScreenDisplay.setActionBar({translate: 'mystic.weapon.noXp'});
        }
    }
    else {
        player.onScreenDisplay.setActionBar({translate: 'mystic.weapon.cooldown'});
    }
});