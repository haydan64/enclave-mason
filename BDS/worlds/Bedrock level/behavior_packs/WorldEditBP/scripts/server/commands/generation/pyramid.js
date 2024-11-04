import { Jobs } from "./../../modules/jobs.js";
import { RawText } from "./../../../library/Minecraft.js";
import { PyramidShape } from "../../shapes/pyramid.js";
import { registerCommand } from "../register_commands.js";
const registerInformation = {
    name: "pyramid",
    permission: "worldedit.generation.pyramid",
    description: "commands.wedit:pyramid.description",
    usage: [
        {
            flag: "h",
        },
        {
            name: "pattern",
            type: "Pattern",
        },
        {
            name: "size",
            type: "int",
            range: [1, null],
        },
    ],
};
registerCommand(registerInformation, function* (session, builder, args) {
    const pattern = args.get("pattern");
    const isHollow = args.has("h");
    const size = args.get("size");
    const loc = session.getPlacementPosition();
    const pyramidShape = new PyramidShape(size);
    const count = yield* Jobs.run(session, 2, pyramidShape.generate(loc, pattern, null, session, { hollow: isHollow }));
    return RawText.translate("commands.blocks.wedit:created").with(`${count}`);
});
