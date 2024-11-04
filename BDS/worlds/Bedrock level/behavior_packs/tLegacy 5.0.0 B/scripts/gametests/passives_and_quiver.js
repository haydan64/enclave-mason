import { Entity, EntityEquippableComponent, EntityInventoryComponent, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";

world.afterEvents.entityHitEntity.subscribe((evd) => {
    const damagingEntity = evd.damagingEntity;
    const hitEntity = evd.hitEntity;
    if (damagingEntity.typeId !== "minecraft:player") return;
    if (damagingEntity && hitEntity) {
        const playerEquipment = damagingEntity.getComponent(EntityEquippableComponent.componentId);
        const mainHandItem = playerEquipment?.getEquipment(EquipmentSlot.Mainhand);
        const playerHealth = damagingEntity.getComponent("minecraft:health").currentValue;

        /*const entityHealth = hitEntity.getComponent("minecraft:health").currentValue;
        const entityDefaultHealth = hitEntity.getComponent("minecraft:health").defaultValue;
        const entityMaxHealth = hitEntity.getComponent("minecraft:health").effectiveMax;*/
        if (mainHandItem) {
            if (mainHandItem.typeId.includes("cobalt_")) {
                const chance = Math.floor(Math.random()*4);
                if ((mainHandItem.typeId.includes("dagger") || mainHandItem.typeId.includes("kama") || mainHandItem.typeId.includes("katana") || mainHandItem.typeId.includes("nunchaku") || mainHandItem.typeId.includes("rapier"))) {
                    if (chance < 1.5) { damagingEntity.addEffect("speed", 60, {amplifier:0, showParticles:false}); }
                } else { if (chance < 1) { damagingEntity.addEffect("speed", 60, {amplifier:0, showParticles:false}); } }
            }
            if (mainHandItem.typeId.includes("dragonscale_")) {
                const entityHealth = hitEntity.getComponent("minecraft:health").currentValue;
                const entityMaxHealth = hitEntity.getComponent("minecraft:health").effectiveMax;

                const entityHealthPercent = entityHealth/entityMaxHealth
                const bossCheck = (hitEntity.getComponent("minecraft:health").effectiveMax >= 35)
                const damageMult = (entityHealthPercent*entityHealthPercent*entityHealthPercent/**/)
                if (bossCheck) { hitEntity.applyDamage((damageMult*32), {cause:"override", damagingEntity: damagingEntity}); 
                } else { hitEntity.applyDamage((damageMult*16), {cause:"override", damagingEntity: damagingEntity}); }
            }
            if (mainHandItem.typeId.includes("lead_")) {
                const chance = Math.floor(Math.random()*25);
                if (chance < 9 && (hitEntity.typeId !== "minecraft:armor_stand")) { hitEntity.addEffect("fatal_poison", 60, {amplifier:0, showParticles:true}); }
                else if (chance == 10) { damagingEntity.addEffect("poison", 80, {amplifier:0, showParticles:true}); }
            }
            if (mainHandItem.typeId.includes("obsidian_")) {
                const chance = Math.floor(Math.random()*5);
                if ((mainHandItem.typeId.includes("dagger") || mainHandItem.typeId.includes("kama") || mainHandItem.typeId.includes("khopesh") || mainHandItem.typeId.includes("spade"))) {
                    if (chance < 1.5 && playerHealth.currentValue <= 8 && (hitEntity.typeId !== "minecraft:armor_stand")) { (playerHealth.setCurrentValue(playerHealth.currentValue + 2)); hitEntity.applyDamage(2, {cause:"wither", damagingEntity: damagingEntity}); }
                } else { if (chance < 1 && playerHealth.currentValue <= 6 && (hitEntity.typeId !== "minecraft:armor_stand")) { (playerHealth.setCurrentValue(playerHealth.currentValue + 2)); hitEntity.applyDamage(2, {cause:"wither", damagingEntity: damagingEntity}); }}
            }
            if (mainHandItem.typeId.includes("silver_")) {
                if ((hitEntity.typeId == "minecraft:drowned" || hitEntity.typeId == "minecraft:evocation_illager" || hitEntity.typeId == "minecraft:ghast" || hitEntity.typeId == "minecraft:husk" || hitEntity.typeId == "minecraft:phantom" ||
                hitEntity.typeId == "minecraft:skeleton" || hitEntity.typeId == "minecraft:skeleton_horse" || hitEntity.typeId == "minecraft:stray" || hitEntity.typeId == "minecraft:vex" || hitEntity.typeId == "minecraft:wither" ||
                hitEntity.typeId == "minecraft:wither_skeleton" || hitEntity.typeId == "minecraft:zoglin" || hitEntity.typeId == "minecraft:zombie" || hitEntity.typeId == "minecraft:zombie_horse" || hitEntity.typeId == "minecraft:zombie_pigman" ||
                hitEntity.typeId == "minecraft:zombie_villager" || hitEntity.typeId == "hax:draugr" || hitEntity.typeId == "hax:parched")) {
                    const entityMaxHealth = hitEntity.getComponent("minecraft:health").effectiveMax;
                    hitEntity.addEffect("slowness", 30, {amplifier:0, showParticles:true});
                    if ((mainHandItem.typeId.includes("battleaxe") || mainHandItem.typeId.includes("claymore") || mainHandItem.typeId.includes("lance"))) {
                        if (hitEntity.typeId === "minecraft:wither") {
                            hitEntity.applyDamage((entityMaxHealth/20), {cause:"entityAttack", damagingEntity: damagingEntity});
                        } else { hitEntity.applyDamage((entityMaxHealth/4), {cause:"entityAttack", damagingEntity: damagingEntity}); hitEntity.addEffect("weakness", 60, {amplifier:0, showParticles:true}); }
                    } else {
                        if (hitEntity.typeId === "minecraft:wither") {
                            hitEntity.applyDamage((entityMaxHealth/25), {cause:"entityAttack", damagingEntity: damagingEntity});
                        } else { hitEntity.applyDamage((entityMaxHealth/6), {cause:"entityAttack", damagingEntity: damagingEntity}); hitEntity.addEffect("weakness", 60, {amplifier:0, showParticles:true}); }
                    }
                }
            }
        }
}});

const itemTypeIdQuiver = "hax:quiver";
const quiverArrowsDynamicPropertyId = "hax:quiver_arrows";
const quiverMaxArrows = 192;
const maintainArrowsInInventory = 2;
const runEveryNTicks = 4;

function getPlayerQuiverArrows(player) {
    return player.getDynamicProperty(quiverArrowsDynamicPropertyId) ?? 0;
}

function setPlayerQuiverArrows(player, arrowCount) {
    player.setDynamicProperty(quiverArrowsDynamicPropertyId, arrowCount);
}

function playerHasQuiver(player) {
    const inventoryComponent = player.getComponent(EntityInventoryComponent.componentId);
    const container = inventoryComponent.container;
    for (let slot = 35; slot >= 0; slot--) {
        const itemStack = container.getItem(slot);
        if (itemStack?.typeId == itemTypeIdQuiver) {
            return true;
        }
    };
    const equippableComponent = player.getComponent(EntityEquippableComponent.componentId);
    const chestItemStack = equippableComponent.getEquipment(EquipmentSlot.Chest);
    if ((chestItemStack?.typeId?.includes("_ranger_chestplate") || chestItemStack?.typeId?.includes("quiver"))) { return true; /**/
    } return false;
}

function countArrowsInInventory(player) {
    const inventoryComponent = player.getComponent(EntityInventoryComponent.componentId);
    const container = inventoryComponent.container;
    let arrowCount = 0;
    for (let slot = 35; slot >= 0; slot--) {
        const itemStack = container.getItem(slot);
        if (itemStack?.typeId == "minecraft:arrow") {
            arrowCount += itemStack.amount;
        }
    };
    return arrowCount;
}

function hasFreeSlotOrArrows(player) {
    const inventoryComponent = player.getComponent(EntityInventoryComponent.componentId);
    const container = inventoryComponent.container;
    for (let slot = 35; slot >= 0; slot--) {
        const itemStack = container.getItem(slot);
        if (itemStack === undefined || itemStack?.typeId == "minecraft:arrow") {
            return true;
        }
    };
    return false;
}

function giveArrowsTo(player, count) {
    //const inventoryComponent = player.getComponent(EntityInventoryComponent.componentId);
    //const container = inventoryComponent.container;
    //container.addItem(new ItemStack("minecraft:arrow", count));
    player.runCommand(`give @s arrow ${count}`);
}

function tickPlayer(player) {
    if (!player.isValid()) return;
    const hasQuiver = playerHasQuiver(player);
    if (!hasQuiver) return;
    let arrowsInQuiver = getPlayerQuiverArrows(player);
    let arrowsInInventory = countArrowsInInventory(player);
    if (arrowsInInventory < maintainArrowsInInventory) {
        const requireArrows = maintainArrowsInInventory-arrowsInInventory;
        const takeArrowsFromQuiver = Math.max(Math.min(requireArrows, arrowsInQuiver), 0);
        if (takeArrowsFromQuiver > 0 && hasFreeSlotOrArrows(player)) {
            giveArrowsTo(player, takeArrowsFromQuiver);
            arrowsInQuiver -= takeArrowsFromQuiver;
            setPlayerQuiverArrows(player, arrowsInQuiver);
            player.onScreenDisplay.setActionBar(`Quiver: ${arrowsInQuiver}`);
        }
    } else if (arrowsInInventory > maintainArrowsInInventory) {
        const putArrowsInQuiver = Math.min(quiverMaxArrows-arrowsInQuiver, arrowsInInventory-maintainArrowsInInventory);
        if (putArrowsInQuiver > 0) {
            player.runCommand(`clear @s arrow 0 ${putArrowsInQuiver}`);
            arrowsInQuiver += putArrowsInQuiver;
            setPlayerQuiverArrows(player, arrowsInQuiver);
            player.onScreenDisplay.setActionBar(`Quiver: ${arrowsInQuiver}`);
        }
    }
}

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        tickPlayer(player);
    }
}, runEveryNTicks);