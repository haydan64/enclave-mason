import { ActionFormData } from "@minecraft/server-ui";

const credits = [
    {
        discipline: "Contributers",
        titles: [
            {
                title: "Code",
                names: [
                    "Poggy",
                    "xKingDark"
                ]
            },
            {
                title: "Music",
                names: [
                    "J. Rivers",
                    "Patchy the fox"
                ]
            },
            {
                title: "Textures & Models",
                names: [
                    "Zifix",
                    "Lulu",
                    "ToilsomeGotat",
                    "Izagam1",
                    "PenguinThold",
                    "Grimm",
                    "Yannasakanna",
                    "Poggy",
                    "Creepager15",
                    "Hachuden"
                ]
            },
            {
                title: "SFX & Animations",
                names: [
                    "Patchy the fox"
                ]
            },
            {
                title: "UI",
                names: [
                    "LeGend077"
                ]
            },
            {
                title: "World Generation",
                names: [
                    "Xorkent",
                    "Elektrika",
                    "Ciosciaa"
                ]
            },
            {
                title: "Structures",
                names: [
                    "Cude",
                    "JacktheWolf",
                    "Poggy",
                    "Creepager15",
                    "Lulu",
                    "Patchy the fox",
                    "Pan",
                    "exsilit",
                    "BugTonyMC [YT]",
                    "KingZee [YT]",
                    "Mechitecy [YT]",
                    "KoalaBuilds [YT]",
                    "Nanaroid [YT]"
                ]
            }
        ]
    },
    {
        discipline: "Special Thanks",
        titles: [
            {
                title: "Enchanted Mobs",
                names: [
                    "Xorkent"
                ]
            },
            {
                title: "Add-on Testers",
                names: [
                    "HeyIt'sBugs",
                    "ExulantBen",
                    "xKingDark",
                    "Poggy"
                ]
            }
        ]
    }
];

/** @param { import("@minecraft/server").Player } player */
function creditScreen(player) {
    let body = "Better on Bedrock is proudly owned by Poggy (XxPoggyisLitxX).\n";
    for (let i = 0; i < credits.length; i++) {
        const credit = credits[i];
        body = body.concat("\n§e§l", credit.discipline, "§r\n");
        for (let j = 0; j < credit.titles.length; j++) {
            const title = credit.titles[j];
            body = body.concat(" §7", title.title, "§r\n");
            for (let k = 0; k < title.names.length; k++) {
                const name = title.names[k];
                body = body.concat(" §8-§r ", name, "§r\n");
            };
        };
    };

    new ActionFormData()
        .title("Add-on Credits")
        .body(body)
        .button("Okay!").show(player);
};

/** @param { import("@minecraft/server").Player } player */
function progression(player) {
    let body =
        "Better on Bedrock has changed vanilla's progression, mainly for tools like the axe and pickaxe.\n"
        + "This was done for players to spend more time early game and prevent players from rushing straight to iron or diamond.\n"
        + "\nThe progression isn't that complex. For instance, you need a stone pickaxe to mine copper ore, and a copper pickaxe to mine iron ore.\n"
        + "\nThis ensure the player goes through every pickaxe or axe tier. With this, your first set of quests will guide you on this change!\n"
        + "\nThe Forger is require for tool progression because you are required to make a Tool Head.\n"
        + "\n§l§cIt is suggested you take a look at the in-game recipe book.\n"
        + "\n§l§eObtaining Stardust\n"
        + "\n§rPlayers are now required to get a §eStardust Upgrade Template§r, which can only be found within Bastion structures. These templates are rare, so you will need to explore. Players can duplicate these templates.\n"
        + "\nYou are required to have Diamond tools or Diamond armor, a Netherite Ingot, and a §eStardust Upgrade Template§r, to be able to upgrade your stuff to Stardust. Works the same way as you would upgrade Diamond to Netherite.\n"
        ;

    new ActionFormData()
        .title("Tool Progression")
        .body(body)
        .button("Okay!").show(player);
};

/** @param { import("@minecraft/server").Player } player */
function eyes(player) {
    let body =
        "Better on Bedrock changed the way player obtain Eyes of Ender.\n"
        + "Players require to defeat every boss within the Overworld and Nether. These bosses will drop their eye upon defeat. Player require 5 of these eyes to craft 16 Eyes of Ender.\n"
        + "\nThis change forces players to explore and to preapre themselves for each boss because they ain't easy!\n"
        + "\nPlayers will be rewarded with a trophy and sometimes a usefull boss item.\n"
        + "\nThe following Bosses drops their eye: Willager, Enchantaegis, Flender, Inferior, and Withered Samurai.\n"
        + "\n§e§lWhere do they spawn?§r\n"
        + "Well, the Willagerm Flender and Enchantaegis all spawn in the Overworld, but they are really rare to find, but not too rare!\n"
        + "\nThe 2 Nether bosses spawn all over the Nether, also a bit rare, but was made a bit common to find! They won't go down easy without a fight!"
        ;

    new ActionFormData()
        .title("End Progression")
        .body(body)
        .button("Okay!").show(player);
};

/** @param { import("@minecraft/server").Player } player */
function staffs(player) {
    let body =
        "Better on Bedrock adds a few magic staffs which can help players in combat.\n"
        + "These staffs are craftabale, but they require a rune. These runes can be bought from a wizard somewhere in the Taiga biome.\n"
        + "\n§c§lWARNING§r\n"
        + "When wanting to use the Ice Breath attack, you have to be at least 4 blocks away from the target you're looking at due to bedrock limitations.\n"
        + "\n§e§lHow to use§r\n"
        + "In order for a staff to work, the player has to have a rune in their offhand. The rune has to match the staff.\n"
        + "\nThe player can use the staff by using it like a bow.\n"
        + "\n§e§lUpgraded Runes§r\n"
        + "They work the same as regular runes, but they grant an extra main attack. For the Ice Staff, it has a second attack when the player sneaks."
        ;

    new ActionFormData()
        .title("Staffs")
        .body(body)
        .button("Okay!").show(player);
};

/** @param { import("@minecraft/server").Player } player */
function trophies(player) {
    let body =
        "Better on Bedrock adds a few useful trophies that drops from Bosses.\n"
        + "For this guide, we're focusing on the Ghost Necklace. While it might seem confusing at first, the way you use it is pretty simple.\n"
        + "\n§e§lHow to use§r\n"
        + "You require to have souls in your off-hand in order to use the effect of the Ghost Necklace. You have 10 uses of this item before it breaks, but it can easily repeared by using 4 gold ingots in the crafting table."
        ;

    new ActionFormData()
        .title("Staffs")
        .body(body)
        .button("Okay!").show(player);
};

/**
 * @param { import("@minecraft/server").ItemStack } itemStack
 * @param { import("@minecraft/server").Player } player
 */
export function lostJournal(itemStack, player) {
    if (itemStack.typeId !== "better_on_bedrock:lost_journal")
        return;

    new ActionFormData()
        .title("Add-on Info")
        .body("Welcome to the info book!\nHere you will find important information regarding Better on Bedrock")
        .button("Contributions", "textures/items/misc/poggy_boss/the_ardent_crystal")
        // .button("Progression", "textures/items/tool_progression/stardust_upgrade")
        .button("End Eyes", "textures/items/ender_eye")
        .button("Staffs", "textures/items/staffs/staff_of_the_seas")
        .button("Trophies", "textures/items/trophies/fixed_ghost_necklace")
        .show(player).then((response) => {
            if (response.canceled)
                return;

            switch (response.selection) {
                case 0: creditScreen(player); break;
                // case 1: progression(player); break;
                case 1: eyes(player); break;
                case 2: staffs(player); break;
                case 3: trophies(player); break;
            };
        });
};