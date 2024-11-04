import { world, system } from '@minecraft/server';

world.afterEvents.playerSpawn.subscribe((e) => {
    const player = e.player;
    console.info(`[Player Spawned] ${JSON.stringify({
        username: player.name,
        location: [player.location.x, player.location.y, player.location.z],
        dimension: player.dimension.id,
        gamemode: player.getGameMode(),
        tags: player.getTags()
    })}`)
});

// world.afterEvents.playerLeave.subscribe((e)=>{
// })

// MOVED to Commands/CommandSystem.js for compatibility
// world.afterEvents.messageReceive.subscribe((e)=>{
//     console.info(`[Player Message] ${e.id}|${e.player.name}|${e.message}`);
// })

world.afterEvents.playerGameModeChange.subscribe((e) => {
    console.info(`[Player Gamemode Change] ${JSON.stringify({
        player: e.player.name,
        gamemode: e.toGameMode
    })}`);
});

world.afterEvents.playerPlaceBlock.subscribe((e) => {
    console.info(`[Player Place] ${JSON.stringify({
        location: [e.block.location.x, e.block.location.y, e.block.location.z],
        dimension: e.dimension.id,
        player: e.player.name,
        block:  e.block.permutation.type.id
    })}`)
})
world.afterEvents.playerBreakBlock.subscribe((e) => {
    console.info(`[Player Break] ${JSON.stringify({
        location: [e.block.location.x, e.block.location.y, e.block.location.z],
        dimension: e.dimension.id,
        player: e.player.name,
        block: e.brokenBlockPermutation.type.id
    })}`)
})

world.afterEvents.weatherChange.subscribe((e) => {
    console.info(`[Weather] ${e.newWeather}`);
});

world.afterEvents.entityDie.subscribe((e) => {
    console.info(`[Death] ${JSON.stringify({
        "dead": e.deadEntity.typeId,
        "deadName": (e.deadEntity?.typeId === "minecraft:player") ? e.deadEntity?.name : e.deadEntity?.nameTag,
        "cause": e.damageSource.cause,
        "killer": e.damageSource.damagingEntity?.typeId,
        "killername": (e.damageSource.damagingEntity?.typeId === "minecraft:player") ? e.damageSource.damagingEntity?.name : e.damageSource.damagingEntity?.nameTag,
        "location": [e.deadEntity.location.x,e.deadEntity.location.y,e.deadEntity.location.z]
    })}`);
});

//MOVED TO WorldBehavior.js (for performace reasons).

// let players = world.getAllPlayers();
// system.runInterval(()=>{
//     const pd = [];
//     for(let i = 0; i < players.length; i++) {
//         const player = players[i];
//         pd.push({
//             location: [player.location.x, player.location.y, player.location.z],
//             gamemode: player.getGameMode(),
//             tag: player.getTags()
//         })
//     }
//     console.info(`[Players Update] ${JSON.stringify(pd)}`);
// },20)