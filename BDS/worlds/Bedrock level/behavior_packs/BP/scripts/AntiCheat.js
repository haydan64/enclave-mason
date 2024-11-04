import { world, system } from '@minecraft/server';

world.beforeEvents.playerBreakBlock.subscribe((e) => {
    if (e.player.hasTag("protect")) {
        e.cancel = true;
    }
});

//Zaddy XR was here. (XR-442)
world.beforeEvents.playerPlaceBlock.subscribe((e) => {
    if (e.player.hasTag("protect")) {
        e.cancel = true;
        return;
    }
});

world.beforeEvents.playerInteractWithBlock.subscribe((e) => {
    if (e.player.hasTag("protect")) {
        let bypassBlock = e.block.above()
        if (!bypassBlock.typeId === "minecraft:light_block") {
            e.cancel = true;
        } else if (bypassBlock.permutation.getState("block_light_level") !== 0) {
            e.cancel = true;
        }
    }

    if(e.cancel) return;
});

world.beforeEvents.playerInteractWithEntity.subscribe((e)=>{
    if (e.player.hasTag("protect")) {
        e.cancel = true;
    }
})

world.beforeEvents.playerLeave.subscribe((e) => {
    if (e.player.hasTag("in-combat")) {

    }
})