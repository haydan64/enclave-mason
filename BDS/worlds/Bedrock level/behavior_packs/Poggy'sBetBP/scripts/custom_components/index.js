import { BlockComponentRegistry, ItemComponentRegistry } from "@minecraft/server";

// Items
import { events as coconut } from "./pog/items/coconut";
import { events as compost } from "./pog/items/compost";
import { events as endPodium } from "./pog/items/end_podium";
import { events as foodEffects } from "./pog/items/food_effects";
import { events as ghostNecklace } from "./pog/items/ghost_necklace";
import { events as stripLog } from "./pog/items/strip_log_sfx";
import { events as toolDurability } from "./pog/items/tool_durability";
import { events as wand } from "./pog/items/wand";
import { events as waystoneKey } from "./pog/items/waystone_key";

/** @param { ItemComponentRegistry } registry */
function registerItemComponents(registry) {
    registry.registerCustomComponent("pog:coconut", coconut);
    registry.registerCustomComponent("pog:compost", compost);
    registry.registerCustomComponent("pog:end_podium", endPodium);
    registry.registerCustomComponent("pog:food_effects", foodEffects);
    registry.registerCustomComponent("pog:ghost_necklace", ghostNecklace);
    registry.registerCustomComponent("pog:strip_log_sfx", stripLog);
    registry.registerCustomComponent("pog:tool_durability", toolDurability);
    registry.registerCustomComponent("pog:wand", wand);
    registry.registerCustomComponent("pog:waystone_key", waystoneKey);
};



// Blocks
import { events as turnToAir } from "./content/blocks/turn_to_air";
import { events as onInteract } from "./kai/blocks/on_interact";
import { events as onPlayerDestroy } from "./kai/blocks/on_player_destroy";
import { events as customDoor } from "./pog/blocks/custom_door";
import { events as dummyChest } from "./pog/blocks/dummy_chest";
import { events_chair as eventChair } from "./pog/blocks/dummy_chest";
import { events as enchantUi } from "./pog/blocks/enchant_ui";
import { events as forger } from "./pog/blocks/forger";
import { events as int } from "./pog/blocks/int";
import { events as interactPlaceholder } from "./pog/blocks/interact_placeholder";
import { events as leaves } from "./pog/blocks/leaves";
import { events as placed } from "./pog/blocks/placed";
import { events as randomParticle } from "./pog/blocks/random_particle";
import { events as tick } from "./pog/blocks/tick";
import { events as ticking } from "./pog/blocks/ticking";
import { events as waystoneBehaviors } from "./pog/blocks/waystone_behaviors";
import { events as waystoneemitter } from "./pog/blocks/waystoneemitter";

/** @param { BlockComponentRegistry } registry */
function registerBlockComponents(registry) {
    registry.registerCustomComponent("content:turn_to_air", turnToAir);
    registry.registerCustomComponent("kai:on_interact", onInteract);
    registry.registerCustomComponent("kai:on_player_destroy", onPlayerDestroy);
    registry.registerCustomComponent("pog:custom_door", customDoor);
    registry.registerCustomComponent("pog:dummy_chest", dummyChest);
    //registry.registerCustomComponent("pog:spawn_entity", eventChair);
    registry.registerCustomComponent("pog:enchant_ui", enchantUi);
    registry.registerCustomComponent("pog:forger", forger);
    registry.registerCustomComponent("pog:int", int);
    registry.registerCustomComponent("pog:interact_placeholder", interactPlaceholder);
    registry.registerCustomComponent("pog:leaves", leaves);
    registry.registerCustomComponent("pog:placed", placed);
    registry.registerCustomComponent("pog:random_particle", randomParticle);
    registry.registerCustomComponent("pog:tick", tick);
    registry.registerCustomComponent("pog:ticking", ticking);
    registry.registerCustomComponent("pog:waystone_behaviors", waystoneBehaviors);
    registry.registerCustomComponent("pog:waystoneemitter", waystoneemitter);
};

export {
    registerItemComponents,
    registerBlockComponents,
};