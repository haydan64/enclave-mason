import './armor_set/attacker_effects.js';
import './armor_set/wearer_effects.js';
import './durability/breaking_block.js';
import './system/config.js';
import './system/join_screen.js';
import './weapons_skills/active_skills.js';
import './weapons_skills/passive_skills.js';
import { system, world } from '@minecraft/server';

system.afterEvents.scriptEventReceive.subscribe((eventData) => {
    const {id, sourceBlock} = eventData;
    if(id === 'mystic:firaga_magma_block_effect') {
        const {x, y, z} = sourceBlock.location;
        const dimensionId = sourceBlock.dimension.id;
        const dimension = world.getDimension(dimensionId);
        const entities = dimension.getEntitiesAtBlockLocation({x: x, y: y + 1, z: z});

        for(const entity of entities) {
            const equipmentSlots = ['Head', 'Chest', 'Legs', 'Feet'];
            const armors = equipmentSlots.map(slot => entity.getComponent('equippable')?.getEquipment(slot));
            const armorTags = armors.map(armor => armor?.getTags()[0]);
            const isFiragaArmor = armorTags.every(tag => tag === 'firaga');

            if(isFiragaArmor) return;
            entity.applyDamage(2, {cause: 'magma'});
            if(!entity.hasComponent('onfire')) {
                entity.setOnFire(3, true);
            }
        }
    }
});

world.afterEvents.playerInteractWithBlock.subscribe((eventData) => {
    eventData.player.setDynamicProperty('exitStealth', true);
});

world.afterEvents.entityHitBlock.subscribe((eventData) => {
    const entity = eventData.damagingEntity;
    if(entity.typeId === 'minecraft:player') {
        entity.setDynamicProperty('exitStealth', true);
    }
});

world.afterEvents.entityHurt.subscribe((eventData) => {
    const {hurtEntity: entity} = eventData;
    if(entity.typeId === 'minecraft:player') {
        entity.setDynamicProperty('exitStealth', true);
    }
})