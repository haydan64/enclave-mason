import { world, system } from '@minecraft/server';
import * as MM from '@minecraft/server';

world.beforeEvents.worldInitialize.subscribe((ev)=>{
    ev.blockComponentRegistry.registerCustomComponent("enclave:ignite", {
        "onPlayerInteract": (ev)=>{
            let comp = ev.player.getComponent("equippable");
            let equip = comp.getEquipment(MM.EquipmentSlot.Mainhand);
            if(["minecraft:flint_and_steel","minecraft:fire_charge"].includes(equip.typeId)) {
                ev.block.setType("minecraft:air");
                ev.block.dimension.spawnEntity("enclave:agriculture_tnt", ev.block.location)
                ev.block.dimension.playSound("random.fuse", ev.block.location)
            }
        }
    });
    ev.blockComponentRegistry.registerCustomComponent("enclave:rotation", {
        "beforeOnPlayerPlace": (ev)=>{
            if(ev.player) {
                let lookingDirection = ev.player.getRotation();
                let cardinal = CardinalDirection[getDirection(lookingDirection.y)];
                let upDown;
                if(ev.face === "Up") upDown = 0;
                else if(ev.face === "Down") upDown = 1;
                else {
                    let block = ev.player.getBlockFromViewDirection();
                    upDown = block.faceLocation.y > 0.5 ? 1 : 0;
                }

                ev.permutationToPlace = ev.permutationToPlace.withState("enclave:rotation", cardinal).withState("enclave:upsidedown", upDown);


            }
        }
    });
});

const CardinalDirection = {
    "North": 2,
    "East": 5,
    "South": 3,
    "West": 4
}
function getDirection(y) {
    if(y > 135 || y < -135) {
        return "North"

    }
    if(y <= 135 && y > 45) {
        return "West"

    }
    if(y > -45 && y <= 45) {
        return "South"

    }
    if(y <= -45 && y >= -135) {
        return "East"
    }
}