import { world, system, TicksPerSecond } from '@minecraft/server';
import { mysticArmors, mysticWeapons } from '../system/data';

const enterStealth = {};
const tempLocs = [];

system.runInterval(() => {
    world.getAllPlayers().forEach((player) => {
        const equipment = player.getComponent('equippable');
        const equipmentSlots = ['Head', 'Chest', 'Legs', 'Feet'];
        const armors = equipmentSlots.map(slot => equipment.getEquipment(slot));
        const armorTags = armors.map(armor => armor?.getTags()[0]);
        const armorSetType = armorTags.every(tag => tag === armorTags[0]) ? armorTags[0] : undefined;
        const {x, y, z} = player.location;
        const playerTempLoc = {
            id: player.id,
            flooredLoc: {x: Math.floor(x), y: Math.floor(y), z: Math.floor(z)},
        }
        const playerTempLocString = JSON.stringify(playerTempLoc);
        const isDivineArmor = armorSetType === 'divine';

        switch(armorSetType) {
            case 'obstruction':
                player.addEffect('resistance', TicksPerSecond * 2, {showParticles: false});
            break;
            case 'firaga':
                player.extinguishFire();
                player.addEffect('fire_resistance', TicksPerSecond * 2, {showParticles: false});
                player.runCommandAsync('fill ~2 ~-1 ~2 ~-2 ~-1 ~-2 mystic:firaga_magma_block [] replace lava');
                player.runCommandAsync('fill ~2 ~-1 ~2 ~-2 ~-1 ~-2 mystic:firaga_magma_block [] replace mystic:firaga_magma_block');
            break;
            case 'azurelean':
                if(player.isInWater) {
                    player.addEffect('conduit_power', TicksPerSecond * 2, {showParticles: false});
                    if(player.removeEffect('mining_fatigue')) {
                        displayActionBar(player, 'mystic.armor.dispellEffect', {
                            rawtext: [{translate: 'effect.mining_fatigue'}]
                        });
                    }
                }
            break;
            case 'viridescent':
                const jumpBoostLevel = player.getEffect('jump_boost') ? player.getEffect('jump_boost').amplifier + 1 : 0;
                if(player.isFalling && player.isJumping && player.getDynamicProperty('canDoubleJump')) {
                    player.applyKnockback(0, 0, 0, 0.52 + (jumpBoostLevel * 0.25));
                    player.setDynamicProperty('canDoubleJump', false);
                    player.dimension.spawnParticle('mystic:double_jump.particle', player.location);
                }
                if(player.isOnGround) {
                    player.setDynamicProperty('canDoubleJump', true);
                }
                if(player.fallDistance >= 3 + jumpBoostLevel) {
                    player.addEffect('slow_falling', TicksPerSecond * 3, {showParticles: false});
                }
            break;
            case 'glacial':
                player.runCommandAsync('fill ~2 ~-1 ~2 ~-2 ~-1 ~-2 mystic:glacial_ice [] replace water');
                player.runCommandAsync('fill ~2 ~-1 ~2 ~-2 ~-1 ~-2 mystic:glacial_ice [] replace mystic:glacial_ice');
            break;
            case 'thundersurge':
                if(player.isSprinting) {
                    player.addEffect('speed', TicksPerSecond * 2, {showParticles: false});
                }
                if(player.removeEffect('slowness')) {
                    displayActionBar(player, 'mystic.armor.dispellEffect', {
                        rawtext: [{translate: 'effect.slowness'}]
                    });
                }
            break;
            case 'divine':
                const commands = [
                    'fill ~ ~ ~ ~ ~1 ~ light_block ["block_light_level"=15] replace air',
                    'fill ~ ~ ~ ~ ~1 ~ light_block ["block_light_level"=15] replace water'
                ]

                for(const command of commands) {
                    player.runCommandAsync(command);
                    const hasLoc = tempLocs.map(loc => JSON.stringify(loc)).includes(playerTempLocString);
                    if(!hasLoc) {
                        tempLocs.push(playerTempLoc);
                    }
                }

                if(player.removeEffect('blindness')) {
                    displayActionBar(player, 'mystic.armor.dispellEffect', {
                        rawtext: [{translate: 'effect.blindness'}]
                    });
                }
            break;
            case 'shadow':
                const stealthState = player.getDynamicProperty('stealthState');
                const exitStealth = player.getDynamicProperty('exitStealth');
                const stealthTime = world.getMoonPhase() == 0 ? 3 : 5;
                const {x: vx, y: vy, z: vz} = player.getVelocity();
                const isMoving = vx + vy + vz;

                switch(stealthState) {
                    default:
                        player.setDynamicProperty('exitStealth', false);
                        enterStealth[player.id] = (!player.isSneaking || exitStealth || isMoving) ? 0 : (enterStealth[player.id] || 0) + 1;
                        if(enterStealth[player.id] == TicksPerSecond * stealthTime || player.getEffect('invisibility')) {
                            player.setDynamicProperty('stealthState', 'stealth');
                        }
                    break;
                    case 'stealth':
                        displayActionBar(player, 'mystic.stealth.active');
                        player.addEffect('invisibility', TicksPerSecond * 2, {showParticles: false});
                        player.addTag('Stealth Mode');
                        if(player.isSprinting || exitStealth) {
                            player.removeTag('Stealth Mode');
                            player.setDynamicProperty('stealthState', 'exiting');
                        }
                    break;
                    case 'exiting':
                        if(player.removeEffect('invisibility')) {
                            player.setDynamicProperty('stealthState', undefined);
                            displayActionBar(player, 'mystic.stealth.deactivate');
                        }
                    break;
                }
            break;
        }

        if(armorSetType !== 'shadow') {
            if(player.removeTag('Stealth Mode')) {
                displayActionBar(player, 'mystic.stealth.deactivate');
                player.removeEffect('invisibility');
                player.setDynamicProperty('stealthState', undefined);
            }
        }

        for(let i = tempLocs.length - 1; i >= 0; i--) {
            const tempLoc = tempLocs[i];
            if(tempLoc.id === player.id) {
                const {x: tx, y: ty, z: tz} = tempLoc.flooredLoc;
                const removeLoc = JSON.stringify(tempLoc);

                if(playerTempLocString !== removeLoc && isDivineArmor) {
                    player.runCommandAsync(`fill ${tx} ${ty} ${tz} ${tx} ${ty + 1} ${tz} air replace light_block`);
                    tempLocs.splice(i, 1);
                }
                else if(!isDivineArmor) {
                    player.runCommandAsync('fill ~ ~ ~ ~ ~1 ~ air replace light_block');
                    tempLocs.pop();
                }
            }
        }

        //Item lore
        const inv = player.getComponent('inventory').container;
        const infoLore = mysticArmors.infoLore();
        const showDesc = player.getDynamicProperty('showDesc');

        //Set lore in inventory
        for(let i = 0; i < inv.size; i++) {
            const item = inv.getItem(i);
            const itemType = item?.getTags()[0];

            let updateLore = false;
            let loreToSet = [];

            if(mysticArmors.hasOwnProperty(itemType)) {
                const {armorIds, armorlore} = mysticArmors[itemType];
                if(armorIds.includes(item?.typeId)) {
                    const defaultArmorLore = armorlore.concat(infoLore);
                    updateLore = showDesc ? item?.getLore()?.join(' ') !== defaultArmorLore.join(' ') : item?.getLore();
                    loreToSet = defaultArmorLore;
                }
            }
            else {
                const weaponLore = mysticWeapons[itemType]?.[item?.typeId];
                if(weaponLore) {
                    updateLore = showDesc ? item?.getLore()?.join(' ') !== weaponLore.join(' ') : item?.getLore();
                    loreToSet = weaponLore;
                }
            }

            if(updateLore) {
                item.setLore(showDesc ? loreToSet : undefined);
                inv.setItem(i, item);
            }
        }

        //Set lore in armor slots
        armors.forEach((armor, i) => {
            const {armorIds, armorlore} = mysticArmors[armor?.getTags()[0]] || {};
            const loreToSet = mysticArmors.hasOwnProperty(armorSetType) ? armorlore : armorlore?.concat(infoLore);
            const updateLore = showDesc ? armor?.getLore()?.join(' ') !== loreToSet?.join(' ') : armor?.getLore();
            if(armorIds?.includes(armor?.typeId) && updateLore) {
                armor.setLore(showDesc ? loreToSet : undefined);
                equipment.setEquipment(equipmentSlots[i], armor);
            }
        });
    })
});

world.beforeEvents.playerLeave.subscribe(({player}) => {
    const {x, y, z} = player.location;
    const equipment = player.getComponent('equippable');
    const armors = ['Head', 'Chest', 'Legs', 'Feet'].map(slot => equipment?.getEquipment(slot));
    const armorTags = armors.map(armor => armor?.getTags()[0]);
    const isDivineArmor = armorTags.every(tag => tag === 'divine');

    if(isDivineArmor) {
        const flooredLoc = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
        const playerTempLoc = { id: player.id, flooredLoc: flooredLoc };
        const playerTempLocString = JSON.stringify(playerTempLoc);
        const {x: fx, y: fy, z: fz} = flooredLoc;
        const index = tempLocs.map(loc => JSON.stringify(loc)).indexOf(playerTempLocString);

        player.dimension.runCommandAsync(`fill ${fx} ${fy} ${fz} ${fx} ${fy + 1} ${fz} air replace light_block`);
        if(index !== -1) {
            tempLocs.splice(index, 1);
        }
    }
});

function displayActionBar(player, message, withMessage) {
    player.onScreenDisplay.setActionBar({
        translate: message,
        with: withMessage
    })
}