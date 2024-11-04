/** @type { import("@minecraft/server").ItemCustomComponent } */
export const events = {
    onConsume: ({ itemStack, source }) => {
        switch (itemStack.typeId) {
            case "better_on_bedrock:healthy_carrot_item":
                source.addEffect("regeneration", 100, {
                    amplifier: 3,
                    showParticles: true
                });
            break;
        };
    },
};