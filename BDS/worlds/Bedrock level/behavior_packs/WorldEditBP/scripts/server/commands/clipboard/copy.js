import { assertCuboidSelection } from "./../../modules/assert.js";
import { Jobs } from "./../../modules/jobs.js";
import { Mask } from "./../../modules/mask.js";
import { RawText, Vector } from "./../../../library/Minecraft.js";
import { BlockPermutation } from "@minecraft/server";
import { registerCommand } from "../register_commands.js";
const registerInformation = {
    name: "copy",
    permission: "worldedit.clipboard.copy",
    description: "commands.wedit:copy.description",
    usage: [
        {
            flag: "a",
        },
        {
            flag: "e",
        },
        {
            flag: "m",
            name: "mask",
            type: "Mask",
        },
    ],
};
/**
 * Copies a region into a buffer (session's clipboard by default). When performed in a job, takes 1 step to execute.
 * @param session The session whose player is running this command
 * @param args The arguments that change how the copying will happen
 * @param buffer An optional buffer to place the copy in. Leaving it blank copies to the clipboard instead
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* copy(session, args, buffer = null) {
    assertCuboidSelection(session);
    const player = session.getPlayer();
    const dimension = player.dimension;
    const [start, end] = session.selection.getRange();
    const usingItem = args.get("_using_item");
    const includeEntities = usingItem ? session.includeEntities : args.has("e");
    const includeAir = usingItem ? session.includeAir : !args.has("a");
    const mask = usingItem ? Mask.clone(session.globalMask) : args.has("m") ? args.get("m-mask") : undefined;
    if (!buffer) {
        if (session.clipboard)
            session.deleteRegion(session.clipboard);
        session.clipboard = session.createRegion(true);
        session.clipboardTransform = {
            rotation: Vector.ZERO,
            flip: Vector.ONE,
            originalLoc: Vector.add(start, end).mul(0.5),
            originalDim: player.dimension.id,
            relative: Vector.sub(Vector.add(start, end).mul(0.5), Vector.from(player.location).floor()),
        };
        buffer = session.clipboard;
    }
    let error = false;
    if (buffer.isAccurate) {
        const airBlock = BlockPermutation.resolve("minecraft:air");
        const filter = mask || !includeAir;
        yield Jobs.nextStep("Copying blocks...");
        const blocks = (block) => {
            const isAir = block.isAir;
            const willBeAir = isAir || (mask ? !mask.matchesBlock(block) : false);
            if (includeAir && mask && !isAir && willBeAir) {
                return airBlock;
            }
            else if (!includeAir && willBeAir) {
                return false;
            }
            return true;
        };
        error = yield* buffer.save(start, end, dimension, { includeEntities }, filter ? blocks : "all");
    }
    else {
        error = yield* buffer.save(start, end, dimension, { includeEntities });
    }
    return error;
}
registerCommand(registerInformation, function* (session, builder, args) {
    assertCuboidSelection(session);
    if (yield* Jobs.run(session, 1, copy(session, args))) {
        throw RawText.translate("commands.generic.wedit:commandFail");
    }
    return RawText.translate("commands.wedit:copy.explain").with(`${session.clipboard.getBlockCount()}`);
});
