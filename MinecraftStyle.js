const chalk = require("chalk");

function convertStyle(text) {
    const convColors = {
        "a": [84, 255, 84],
        "b": [84, 255, 255],
        "c": [255, 84, 84],
        "d": [255, 84, 255],
        "e": [255, 255, 84],
        "f": [255, 255, 255],
        "g": [239, 206, 22],
        "H": [226, 211, 209],
        "j": [68, 57, 58],
        "m": [150, 21, 6],
        "n": [180, 104, 77],
        "p": [222, 176, 44],
        "q": [17, 159, 54],
        "r": [255, 255, 255],
        "s": [44, 185, 168],
        "t": [32, 72, 122],
        "u": [154, 92, 197],
        "1": [0, 0, 170],
        "2": [0, 170, 0],
        "3": [0, 170, 170],
        "4": [170, 0, 0],
        "5": [170, 0, 170],
        "6": [255, 170, 0],
        "7": [255, 248, 195],
        "8": [84, 84, 84],
        "9": [84, 84, 255],
        "0": [0, 0, 0]
    };
    let segs = text.split("§");

    let color = [255,255,255];
    let bold = false;
    let italic = false;
    let res = [chalk.rgb(...color)(segs[0])];
    for(let i = 1; i < segs.length; i++) {
        let symbol = segs[i].slice(0,1);
        let selcolor = convColors[symbol];
        if(selcolor) {
            color = selcolor;
        }

        if(symbol === "l") {
            bold = true;
        }else if (symbol === "o") {
            italic = true;
        }else if (symbol === "r") {
            bold = false;
            italic = false;
        }
        let text = segs[i].slice(1);
        let stack = chalk.rgb(...color);
        if(bold) stack = stack.bold;
        if(italic) stack = stack.italic;
        res.push(stack(text));
    };
    return res.join("");
}

module.exports = convertStyle;