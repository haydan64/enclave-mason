import { Jobs } from "./../../modules/jobs.js";
import { RawText } from "./../../../library/Minecraft.js";
import { registerCommand } from "../register_commands.js";
import { TorusShape } from "server/shapes/torus.js";
const registerInformation = {
    name: "torus",
    permission: "worldedit.generation.torus",
    description: "commands.wedit:torus.description",
    usage: [
        {
            flag: "h",
        },
        {
            flag: "d",
            name: "direction",
            type: "Direction",
        },
        {
            name: "pattern",
            type: "Pattern",
        },
        {
            name: "outerRadius",
            type: "float",
            range: [0.01, null],
        },
        {
            name: "innerRadius",
            type: "float",
            range: [0.01, null],
        },
    ],
};
registerCommand(registerInformation, function* (session, builder, args) {
    const pattern = args.get("pattern");
    const outerRadius = args.get("outerRadius");
    const innerRadius = args.get("innerRadius");
    const isHollow = args.has("h");
    const loc = session.getPlacementPosition();
    const cylShape = new TorusShape(outerRadius, innerRadius, args.get("d-direction")?.getDirection(builder));
    const count = yield* Jobs.run(session, 2, cylShape.generate(loc, pattern, null, session, { hollow: isHollow }));
    return RawText.translate("commands.blocks.wedit:created").with(`${count}`);
});
