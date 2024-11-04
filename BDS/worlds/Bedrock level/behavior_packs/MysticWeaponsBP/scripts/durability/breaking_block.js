import { world, Player } from '@minecraft/server';
import { looseDurability } from './loose_durability.js';
import { mysticWeapons } from '../system/data.js';

world.afterEvents.playerBreakBlock.subscribe((eventData) => {
    Player.prototype.isGameMode = function(gamemode) {
        return world.getPlayers({name: this.name, gameMode: gamemode}).length > 0;
    }

    const {player, itemStackAfterBreak: item} = eventData;
    if(player.isGameMode('creative')) return;
    function getDamage(itemName) {
        for(const weaponType in mysticWeapons) {
            if(mysticWeapons[weaponType].hasOwnProperty(itemName)) {
                return {'battleaxe': 1, 'sword': 2, 'scepter': 3}[weaponType] || false;
            }
        }
        return false;
    }

    const damage = getDamage(item?.typeId);
    if(damage) looseDurability(item, player, damage);
})