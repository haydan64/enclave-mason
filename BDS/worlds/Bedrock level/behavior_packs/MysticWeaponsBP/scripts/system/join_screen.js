import { system, world } from '@minecraft/server';

world.afterEvents.playerSpawn.subscribe((eventData) => {
    const player = eventData.player;
    if(player.getDynamicProperty('showTips') === undefined) {
        player.setDynamicProperty('showTips', true);
    }
    if(!eventData.initialSpawn || !player.getDynamicProperty('showTips')) return;
    player.onScreenDisplay.setTitle(
        { translate: 'mystic.join.title'},
        {
            stayDuration: 70,
            fadeInDuration: 2,
            fadeOutDuration: 4,
            subtitle: {translate: 'mystic.join.subtitle'}
        }
    )
    system.runTimeout(() => {
        player.playSound('random.pop');
        player.sendMessage({translate: 'mystic.join.openConfig'});
    }, 100)

    //deleting old patch data
    player.removeTag('join_player');
    player.setDynamicProperty('currentState', undefined);
    world.setDynamicProperty('pvpScepter', undefined);
})