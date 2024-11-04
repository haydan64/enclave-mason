import { world } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';

const playerBeingShown = {};
import('@minecraft/server-ui').then((ui) => {
    var [userBusy, userClosed] = Object.values(ui.FormCancelationReason), formData;
    for (formData of [ui.ActionFormData, ui.MessageFormData, ui.ModalFormData]) {
        const formShow = Object.getOwnPropertyDescriptor(formData.prototype, "show").value;
        Object.defineProperty(formData.prototype, "show", {
            value: function (player, persistent = false, trials = 100) {
                const show = formShow.bind(this,player);
                if (player.id in playerBeingShown) return;
                playerBeingShown[player.id] = true;
                return new Promise(async(resolve) => {
                    let result;
                    do {
                        result = await show();
                        if(!trials-- || persistent && result.cancelationReason === userClosed) return delete playerBeingShown[player.id];
                    }
                    while (result.cancelationReason === userBusy);
                    delete playerBeingShown[player.id];
                    resolve(result);
                })
            }
        })
    }
});

world.afterEvents.playerLeave.subscribe(({playerId}) => delete playerBeingShown[playerId]);

world.beforeEvents.chatSend.subscribe(async(eventData) => {
    const {message, sender} = eventData;
    if(message.toLowerCase().trim() === '!config') {
        await (eventData.cancel = true);
        if(sender.getDynamicProperty('showTips')) {
            sender.sendMessage({translate: 'mystic.config.closeChat'});
        }
        const config = new ModalFormData();
        config.title({translate: 'mystic.config.title'});
        config.toggle({translate: 'mystic.config.friendlyFire'}, sender.getDynamicProperty('pvp'));
        config.toggle({translate: 'mystic.config.showDesc'}, sender.getDynamicProperty('showDesc'));
        config.toggle({translate: 'mystic.config.showTips'}, sender.getDynamicProperty('showTips'));

        config.show(sender).then(result => {
            if(result.canceled) return;
            const [pvp, showDesc, showTips] = result.formValues;
            sender.setDynamicProperty('pvp', pvp);
            sender.setDynamicProperty('showDesc', showDesc);
            sender.setDynamicProperty('showTips', showTips);
        })
    }
});