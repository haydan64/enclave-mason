import { world, system, TicksPerSecond, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

system.runInterval(() => {
    const players = world.getAllPlayers();
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const equipmentInventory = player.getComponent(EntityEquippableComponent.componentId);
        if (
            equipmentInventory.getEquipment(EquipmentSlot.Head)?.typeId !== "better_on_bedrock:stardust_helmet"
            || equipmentInventory.getEquipment(EquipmentSlot.Chest)?.typeId !== "better_on_bedrock:stardust_chestplate"
            || equipmentInventory.getEquipment(EquipmentSlot.Legs)?.typeId !== "better_on_bedrock:stardust_leggings"
            || equipmentInventory.getEquipment(EquipmentSlot.Feet)?.typeId !== "better_on_bedrock:stardust_boots"
        ) continue;

        player.addEffect("health_boost", TicksPerSecond * 5, { amplifier: 2, showParticles: false });
        player.addEffect("resistance", TicksPerSecond * 5, { amplifier: 2, showParticles: false });
    };
}, TicksPerSecond * 1);