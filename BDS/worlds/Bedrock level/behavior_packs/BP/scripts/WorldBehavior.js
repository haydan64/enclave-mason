import { world, system } from '@minecraft/server';
import * as MM from '@minecraft/server';
import * as CustomEnchants from './CustomEnchants';
import { name } from './Enchants/Smelt';

let LevelObjective = world.scoreboard.getObjective("level");
if (!LevelObjective) {
    LevelObjective = world.scoreboard.addObjective("level", "§elevel");
}


const Fling_Power = 1;
const Border_Radius = 4000;
system.afterEvents.scriptEventReceive.subscribe((ev) => {
    switch (ev.id) {
        case "enclave:despawn": {
            ev.sourceEntity?.remove();
            break;
        }
        case "enclave:border_fling": {
            const player = ev.sourceEntity;
            if (player) {
                const x = player.location.x;
                const z = player.location.z;

                const vector = { x: 0, z: 0 }

                vector.x = (x / Border_Radius) * Fling_Power;
                vector.z = (z / Border_Radius) * Fling_Power;

                player.applyKnockback(-vector.x, -vector.z, Fling_Power * 3, Fling_Power);
            }
            break;
        }
        case "enclave:agriculture_explode": {
            if (ev.sourceEntity) {
                ev.sourceEntity.dimension.createExplosion(ev.sourceEntity.location, 1, {
                    "allowUnderwater": false,
                    "breaksBlocks": false,
                    "causesFire": false,
                    "source": ev.sourceEntity
                });
                ev.sourceEntity.remove();
            }
        }
    }
})

world.afterEvents.entitySpawn.subscribe(ev => {
    world.sendMessage(`${ev.cause} ${ev.entity.typeId.split(":")[1]} ${ev.entity.location.x}, ${ev.entity.location.y}, ${ev.entity.location.z}`);
});

world.beforeEvents.itemUseOn.subscribe(ev => {
    if (ev.source.typeId !== "minecraft:player") return;
    if (["enclave:supremium_scythe", "enclave:imperium_scythe"].includes(ev.itemStack.typeId)) {
        if (ev.source.getItemCooldown("scythe_cooldown") !== 0) return;
        if (!ev.block) return;
        system.run(() => {
            ev.source.startItemCooldown("scythe_cooldown", 8);
            harvestArea(2, ev.block);
        });
    }
    if (["enclave:tertium_scythe", "enclave:prudentium_scythe", "enclave:inferium_scythe"].includes(ev.itemStack.typeId)) {
        if (ev.source.getItemCooldown("scythe_cooldown") !== 0) return;
        if (!ev.block) return;
        system.run(() => {
            ev.source.startItemCooldown("scythe_cooldown", 8);
            ev.itemStack.getComponent("minecraft:durability").damage += harvestArea(1, ev.block);
            ev.source.getComponent("inventory").container.setItem(ev.source.selectedSlotIndex, ev.itemStack);
        });
    }
})

function harvestArea(area, centerBlock) {
    let harvested = 0;
    for (let x = -area; x <= area; x++) {
        for (let z = -area; z <= area; z++) {
            let block = centerBlock.offset({ x, y: 0, z });
            if (block.permutation.getState("strat:growth_stage") === 7) {
                harvested++;
                block.setPermutation(block.permutation.withState("strat:growth_stage", 0));
                block.dimension.runCommand(`loot spawn ${centerBlock.x + x} ${centerBlock.y} ${centerBlock.z + z} loot "seeds/${block.typeId.split(":")[1]}"`);
            }
        }
    }
    return harvested;
}

world.afterEvents.entityHurt.subscribe((e) => {
    world.sendMessage(e.damage.toString())
});

let mainLoopRunTimes = 0;

system.runInterval(() => {
    mainLoopRunTimes++;

    const players = world.getAllPlayers();
    const pd = [];
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        pd.push({
            name: player.name,
            location: [player.location.x, player.location.y, player.location.z],
            gamemode: player.getGameMode(),
            tag: player.getTags()
        });



        /*
        titleraw @a title {"rawtext":[{"text":"§z§dWelcome To Enclave"},{"text":"\nName: "},{"selector":"*"},{"text":"\n§6Silver: $"},{"score":{"name":"*","objective":"Money"}}]}
        execute as @a[tag=leg] at @s run titleraw @s subtitle {"rawtext":[{"text":"§z§1Legion\n§aOnline Members: \n§p"}, {"selector":"@a[tag=leg]"}]}
        execute as @a[tag=kam] at @s run titleraw @s subtitle {"rawtext":[{"text":"§z§6Kamereons\n§aOnline Members: \n§p"}, {"selector":"@a[tag=kam]"}]}
        execute as @a[tag=mer] at @s run titleraw @s subtitle {"rawtext":[{"text":"§z§2Mercenaries\n§aOnline Members: \n§p"}, {"selector":"@a[tag=mer]"}]}
        execute as @a[tag=war] at @s run titleraw @s subtitle {"rawtext":[{"text":"§z§4Warriors\n§aOnline Members: \n§p"}, {"selector":"@a[tag=war]"}]}
        */

        let nameColor = "§r";

        if (player.hasTag("kam")) nameColor = "§g";
        if (player.hasTag("war")) nameColor = "§4";
        if (player.hasTag("leg")) nameColor = "§b";
        if (player.hasTag("mer")) nameColor = "§q";



        player.nameTag = `${nameColor}${player.name}\n${player.hasTag("staff") ?
            `§a§lStaff` :
            `§eLevel §c${LevelObjective.getScore(player) ?? 0}`
            }`

        player.onScreenDisplay.setTitle({
            "rawtext":
                [
                    {
                        "text": `§z§dEnclave Kingdoms\nName: ${player.name}\n§6Silver: $`
                    },
                    {
                        "score": {
                            "name": "*",
                            "objective": "Money"
                        }
                    },
                    {
                        "text": `\n§rPosition: §c${Math.floor(player.location.x)}§r,§a${Math.floor(player.location.y)}§r,§b${Math.floor(player.location.z)}`
                    },
                ]
        });

        let text = [{ "text": "§z" }];
        if (player.hasTag("protect")) text.push({ "text": "§c§lYou are in a\nprotected area!§r\n\n" });

        if (player.hasTag("leg")) text.push({ "text": "§1Legion\n§aOnline Members: \n§p" }, { "selector": "@a[tag=leg]" });
        if (player.hasTag("kam")) text.push({ "text": "§6Kamereons\n§aOnline Members: \n§p" }, { "selector": "@a[tag=kam]" });
        if (player.hasTag("mer")) text.push({ "text": "§2Mercenaries\n§aOnline Members: \n§p" }, { "selector": "@a[tag=mer]" });
        if (player.hasTag("war")) text.push({ "text": "§4Warriors\n§aOnline Members: \n§p" }, { "selector": "@a[tag=war]" });

        if (player.hasTag("inspector")) {
            text.push({ "text": "\n§g§lINSPECTOR:§r" });
            let block = player.getBlockFromViewDirection({
                "includeLiquidBlocks": false,
                "maxDistance": 30
            });

            text.push({ "text": `\n§9${Math.round(player.getRotation().y)} - ${getDirection(player.getRotation().y)}` })

            if (block && block.block) {
                text.push({ "text": `\n§a${block.block.type.id.replace("minecraft:", "").split("_").map((w) => { return w.slice(0, 1).toUpperCase() + w.slice(1) }).join(" ")}${block.block.type.canBeWaterlogged ? "\n§aWaterloggable" : ""}` });
                const tags = block.block.getTags();
                if (tags.length > 0) text.push({ "text": `\n§dTags: §e${tags.join(",\n")}` });
                const inventory = block.block.getComponent("inventory");
                if (inventory && inventory.isValid() && inventory.container) {
                    const contains = [];
                    for (let i = 0; i < inventory.container.size; i++) {
                        let item = inventory.container.getItem(i);
                        if (item) contains.push(`§r${item.typeId.replace("minecraft:", "").split("_").map((w) => { return w.slice(0, 1).toUpperCase() + w.slice(1) }).join(" ")} §c*${item.amount}`);
                    }
                    text.push({ "text": `\n§dContains:\n${contains.join("\n")}` });
                }
                const states = Object.entries(
                    block.block.permutation.getAllStates()
                ).map((entry) => {
                    return `§b${entry[0].replace("minecraft:", "").split("_").map((w) => {
                        return w.slice(0, 1).toUpperCase() + w.slice(1)
                    }).join(" ")}: §e${entry[1].toString().split("_").map((w) => {
                        return w.slice(0, 1).toUpperCase() + w.slice(1)
                    }).join(" ")
                        }`
                });
                if (states.length > 0) text.push({ "text": `\n§dStates:\n${states.join("\n")}` });
            }
        }


        player.onScreenDisplay.updateSubtitle({
            "rawtext": [
                ...text
            ]
        })
        //getSweepEntities(player, 0.7, 0.7, 6);
    }
    if (mainLoopRunTimes > 20) {
        mainLoopRunTimes = 0;
        console.info(`[Players Update] ${JSON.stringify(pd)}`);
    }
}, 2)

system.runInterval(() => {
    world.getDimension("overworld").runCommand("function 20tick");
}, 20);

system.runInterval(() => {
    world.getDimension("overworld").runCommand("function 10tick");
}, 10);


function getDirection(y) {
    if (y > 135 || y < -135) {
        return "North"

    }
    if (y <= 135 && y > 45) {
        return "West"

    }
    if (y > -45 && y <= 45) {
        return "South"

    }
    if (y <= -45 && y >= -135) {
        return "East"
    }
}




system.afterEvents.scriptEventReceive.subscribe((e) => {
    if(e.id === "enclave:testSweep")
    getSweepEntities(e.sourceEntity, 2, 2, 6);
});


/**
 * 
 * @param {MM.Entity} entity 
 * @param {Number} horizontal In Radians
 * @param {Number} vertical In Radians
 * @param {Number} maxDistance In Blocks
 */
function getSweepEntities(entity, horizontal, vertical, maxDistance) {
    //world.sendMessage(`Finding entities.`)
    const entityPos = entity.location;
    const entityAngle = entity.getRotation();

    const ents = entity.dimension.getEntities({
        "maxDistance": maxDistance,
        "location": entityPos,
        "minDistance": 0.01
    });
    if(!ents.length > 0) return;
    
    const headPos = entity.getHeadLocation();
    ents.filter((e)=>{
        return isPointInView(headPos, {x: entityAngle.y* (Math.PI/180), y: entityAngle.x* (Math.PI/180)}, horizontal, vertical, e.location);
    }).forEach((e)=>{
        //do the thing
        world.sendMessage(e.typeId)
    })
    


    // const basePoints = [
    //     // {
    //     //     x: x + maxDistance * Math.sin(horizontal+(-entityAngle.y * (Math.PI/180))),
    //     //     z: z + maxDistance * Math.cos(horizontal+(-entityAngle.y * (Math.PI/180))),
    //     //     y: y
    //     // },
    //     // {
    //     //     x: x + maxDistance * Math.sin((-horizontal)+(-entityAngle.y * (Math.PI/180))),
    //     //     z: z + maxDistance * Math.cos((-horizontal)+(-entityAngle.y * (Math.PI/180))),
    //     //     y: y
    //     // },
    //     {
    //         x: x + maxDistance * Math.cos((-entityAngle.x * (Math.PI/180))) * Math.sin(horizontal+(-entityAngle.y * (Math.PI/180))),
    //         z: z + maxDistance * Math.cos((-entityAngle.x * (Math.PI/180))) * Math.cos(horizontal+(-entityAngle.y * (Math.PI/180))),
    //         y: y + maxDistance * Math.sin((-entityAngle.x * (Math.PI/180))),
    //     },
    //     {
    //         x: x + maxDistance * Math.cos((-entityAngle.x * (Math.PI/180))) * Math.sin((-horizontal)+(-entityAngle.y * (Math.PI/180))),
    //         z: z + maxDistance * Math.cos((-entityAngle.x * (Math.PI/180))) * Math.cos((-horizontal)+(-entityAngle.y * (Math.PI/180))),
    //         y: y + maxDistance * Math.sin((-entityAngle.x * (Math.PI/180)))
    //     },
    //     {
    //         x: x + maxDistance * Math.cos(vertical+(-entityAngle.x * (Math.PI/180))) * Math.sin((-entityAngle.y * (Math.PI/180))),
    //         z: z + maxDistance * Math.cos(vertical+(-entityAngle.x * (Math.PI/180))) * Math.cos((-entityAngle.y * (Math.PI/180))),
    //         y: y + maxDistance * Math.sin(vertical+(-entityAngle.x * (Math.PI/180))),
    //     },
    //     {
    //         x: x + maxDistance * Math.cos((-vertical)+(-entityAngle.x * (Math.PI/180))) * Math.sin((-entityAngle.y * (Math.PI/180))),
    //         z: z + maxDistance * Math.cos((-vertical)+(-entityAngle.x * (Math.PI/180))) * Math.cos((-entityAngle.y * (Math.PI/180))),
    //         y: y + maxDistance * Math.sin((-vertical)+(-entityAngle.x * (Math.PI/180)))
    //     }
    // ];

    // basePoints.forEach((point)=>{
    //     entity.dimension.spawnParticle("minecraft:endrod", {x:point.x, y:point.y, z: point.z})
    // })

    // //console.log(JSON.stringify(basePoints));

    // ents.map((e) => {
    //     let { x, y, z } = e.location;
    //     //return isPointInTriangle({x,z}, ...horizontalTriangle) && isPointInTriangle({x,z}, ...verticalTriangle)
    // });
}

function isPointInView(cameraPos, cameraAngle, h_angle, v_angle, point) {
    const vec = {
        x: point.x - cameraPos.x,
        y: point.y - cameraPos.y,
        z: point.z - cameraPos.z
    };

    const distance = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    const azimuthPoint = Math.atan2(vec.y, vec.x); // Horizontal angle to point
    const elevationPoint = Math.asin(vec.z / distance); // Vertical angle to point

    // Camera angles {x, y} correspond to {azimuth, elevation}
    const cameraAzimuth = cameraAngle.x;
    const cameraElevation = cameraAngle.y;

    // Check if the point is within the horizontal and vertical FOV
    const withinHorizontal = (
        azimuthPoint >= cameraAzimuth - h_angle / 2 && 
        azimuthPoint <= cameraAzimuth + h_angle / 2
    );
    const withinVertical = (
        elevationPoint >= cameraElevation - v_angle / 2 && 
        elevationPoint <= cameraElevation + v_angle / 2
    );
    console.log(withinHorizontal, withinVertical)

    return withinHorizontal && withinVertical;
}







// Function to calculate the determinant of a 4x4 matrix
function determinant4x4(matrix) {
    const [a, b, c, d] = matrix;
    return (
        a[0] * (
            b[1] * (c[2] * d[3] - c[3] * d[2]) -
            b[2] * (c[1] * d[3] - c[3] * d[1]) +
            b[3] * (c[1] * d[2] - c[2] * d[1])
        ) -
        a[1] * (
            b[0] * (c[2] * d[3] - c[3] * d[2]) -
            b[2] * (c[0] * d[3] - c[3] * d[0]) +
            b[3] * (c[0] * d[2] - c[2] * d[0])
        ) +
        a[2] * (
            b[0] * (c[1] * d[3] - c[3] * d[1]) -
            b[1] * (c[0] * d[3] - c[3] * d[0]) +
            b[3] * (c[0] * d[1] - c[1] * d[0])
        ) -
        a[3] * (
            b[0] * (c[1] * d[2] - c[2] * d[1]) -
            b[1] * (c[0] * d[2] - c[2] * d[0]) +
            b[2] * (c[0] * d[1] - c[1] * d[0])
        )
    );
}

// Function to calculate the volume of a tetrahedron
function tetrahedronVolume(p1, p2, p3, p4) {
    const matrix = [
        [p1.x, p1.y, p1.z, 1],
        [p2.x, p2.y, p2.z, 1],
        [p3.x, p3.y, p3.z, 1],
        [p4.x, p4.y, p4.z, 1]
    ];
    return Math.abs(determinant4x4(matrix)) / 6;
}

// Function to check if a point is inside the pyramid
function isPointInPyramid(p, apex, base1, base2, base3, base4) {
    // Volume of the entire pyramid
    const pyramidVolume = tetrahedronVolume(apex, base1, base2, base3) + tetrahedronVolume(apex, base1, base3, base4);

    // Volume of the tetrahedrons formed with point p
    const vol1 = tetrahedronVolume(p, apex, base1, base2);
    const vol2 = tetrahedronVolume(p, apex, base2, base3);
    const vol3 = tetrahedronVolume(p, apex, base3, base4);
    const vol4 = tetrahedronVolume(p, apex, base1, base4);

    // Sum of the volumes with point P
    const totalVolume = vol1 + vol2 + vol3 + vol4;

    // The point is inside the pyramid if the total volume is equal to the pyramid's volume
    return Math.abs(pyramidVolume - totalVolume) < 1e-6;  // small tolerance for floating-point errors
}

