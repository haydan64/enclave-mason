import { world, system, ItemStack, EquipmentSlot, ItemDurabilityComponent, EntityEquippableComponent } from "@minecraft/server";

/**
 * @param { import("@minecraft/server").Block } block 
 * @returns { import("@minecraft/server").Block[] }
 */
function getDiamondShape(block) {
    const above = block.above();
    const below = block.below();
    const north = block.north();
    const south = block.south();
    const east = block.east();
    const west = block.west();

    return [
        above, below,
        north, south,
        east, west,
    ];
};

/**
 * @param { import("@minecraft/server").Block } block
 * @param { string } blockType
 * @returns { import("@minecraft/server").Block[] }
 */
export function searchForVein(start, blockType, states = {}, maxBlocks, durability = Number.MIN_SAFE_INTEGER, maxDurability = Number.MAX_SAFE_INTEGER) {
    const blocks = [];
    const locations = [ start.location ];
    const search = [ start ];

    while (
        blocks.length < maxBlocks
        && search.length > 0
        && (durability !== undefined && durability + blocks.length <= maxDurability)
    ) {
        const currentSearch = search.shift();
        blocks.push(currentSearch);

        const shape = getDiamondShape(currentSearch);
        for (let i = 0; i < shape.length; i++) {
            const block = shape[i];
            const { x, y, z } = block.location;
            if (locations.find(
                (location) =>
                    x == location.x
                    && y == location.y
                    && z == location.z
            ) !== undefined)
                continue;

            if (
                block.matches(blockType, states)
                || block.matches(blockType.replace("lit_", ""), states)
            ) {
                locations.push({ x, y, z });
                search.push(block);
            };
        };
    };

    return blocks;
};

/** @param { import("@minecraft/server").Block[] } blocks */
export function veinMine(blocks) {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        block.setType("minecraft:air");
    };
};

/**
 * @param { boolean } isPickaxe
 * @param { import("@minecraft/server").Dimension } dimension
 * @param { string } drop
 * @param { any[] } drops
 * @param { import("@minecraft/server").Block } block
 * @param { import("@minecraft/server").Block[] } blocks
 * @param { number } brokenBlocks
 */
export function applyBlockDrops(
    blockDrops, blockType, drops, block,
    itemStack, blocks, brokenBlocks, shouldUseSilk
) {
    let drop = blockDrops?.drop ?? blockType;
    if (itemStack.getLore().includes("§r§7Ore Smelter I") && blockDrops?.smelted !== undefined) {
        drop = blockDrops.smelted;
        blockDrops.xp = true;
    };
    
    const enchantable = itemStack.getComponent("enchantable");
    const hasFortune = enchantable.hasEnchantment("fortune");
    const hasSilktouch = enchantable.hasEnchantment("silk_touch");
    const fortuneLevel = hasFortune ? enchantable.getEnchantment("fortune").level : 0;
    if (drops.drop !== undefined) {
        const amount = Math.random() * ((drops.drop.max * (fortuneLevel + 1)) - drops.drop.min) + drops.drop.min;
        brokenBlocks = brokenBlocks * amount;
    };

    if (blockDrops.xp) {
        for (let i = 0; i < blocks.length / 2; i++) {
            block.dimension.spawnEntity("minecraft:xp_orb", block.location);
        };
    };

    const items = [];
    if (hasSilktouch && shouldUseSilk)
        drop = blockType;
    
    const stackAmount = Math.floor(brokenBlocks / 64);
    const blocksLeft = (brokenBlocks / 64) - stackAmount;
    function dropItems(itemType) {
        if (blocksLeft > 0) {
            items.push(new ItemStack(itemType, (64 * blocksLeft) ?? 1));
        };
    
        for (let i = 1; i <= stackAmount; i++)
            items.push(new ItemStack(itemType, 64));
    };

    if (blockDrops?.drops !== undefined) {
        for (let item of blockDrops.drops)
            dropItems(item);
    }
    else {
        dropItems(drop);
    };
    
    for (let i = 0; i < items.length; i++) {
        const itemStack = items[i];
        block.dimension.spawnItem(itemStack, block.location);
    };
};

export function mine(block, blockType, player, itemStack, blocksArray, shouldUseSilk = true) {
    const drops = blocksArray.find(({ blocks }) =>
        blocks.find(({ name }) => name === blockType)
    );

    const blockDrops = drops?.blocks?.find(({ name }) => name === blockType);
    if (
        blockDrops === undefined
        || (blockDrops.mineable.length !== 0 && !itemStack.getTags().some((tag) => blockDrops.mineable.includes(tag)))
    ) return;

    const durability = itemStack.getComponent(ItemDurabilityComponent.componentId);
    const blocks = searchForVein(block, blockType, blockDrops.states, 128, durability?.damage, durability?.maxDurability);
    veinMine(blocks, block.dimension);

    let brokenBlocks = blocks.length - 1;
    const equippable = player.getComponent(EntityEquippableComponent.componentId);
    if (durability !== undefined) {
        if ((durability.damage + brokenBlocks) < durability.maxDurability) {
            durability.damage += brokenBlocks;
            equippable.setEquipment(EquipmentSlot.Mainhand, itemStack);
        } else {
            equippable.setEquipment(EquipmentSlot.Mainhand);
            world.playSound("random.break", player.location);
        };
    };

    applyBlockDrops(
        blockDrops, blockType, drops, block,
        itemStack, blocks, brokenBlocks, shouldUseSilk
    );
};