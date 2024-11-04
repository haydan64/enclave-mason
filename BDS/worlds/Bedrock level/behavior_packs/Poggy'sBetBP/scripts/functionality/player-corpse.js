import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui"
const DimensionNames = {
	"minecraft:overworld": "§aOverworld",
	"minecraft:nether": "§cNether",
	"minecraft:the_end": "§5End"
};

export function spawnCorpse(player) {
    if (world.gameRules.keepInventory == true || !player.hasTag("allow_corpse"))
        return;

	const dName = DimensionNames[player.dimension.id];
	const entity = player.dimension.spawnEntity("better_on_bedrock:player_corpse", player.location);
	entity.nameTag = ("Corpse of " + player.name);
	entity.runCommand(`tp @e[type=item, r=6] @s`);
	player.sendMessage({
		rawtext: [
			{
				translate: "bob.message.youDied",
				with: [
					Math.round(player.location.x).toString(),
					Math.round(player.location.y).toString(),
					Math.round(player.location.z).toString(),
					dName,
				],
			},
		],
	});
};

/**
 * @param { import("@minecraft/server").Player } player 
 * @param { import("@minecraft/server").Entity } hitEntity 
 */
export function corpse(player, hitEntity) {
    if (
        hitEntity.typeId != "better_on_bedrock:player_corpse"
        || hitEntity.hasTag("dusted")
    ) return;

    new ActionFormData()
    .title("Dust?")
    .body("Dusting the corpse will delete all items inside it. To recover your items, open the corpse's inventory.")
    .button("Dust It!")
    .button("Keep Corpse")
    .show(player).then(
        ({ selection }) => {
            switch (selection) {
                case 0: // Dust
                    hitEntity.triggerEvent("entity_transform");
                    hitEntity.playAnimation("animation.player_corpse.despawn");
                    hitEntity.addTag("dusted");
                    hitEntity.runCommandAsync("loot spawn ~0.5 ~ ~0.5 loot decayed_bone.loottable");
                    break;
                case 1: // Spare
                    break;
            };
        },
    );
};