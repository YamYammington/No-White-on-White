// HELPER FUNCTIONS

function mapCallback(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}

function parseRGBString(str) {
    // let match = str.match(/^((?:rgb|hsl)a?)\((\d+),\s*([\d%]+),\s*([\d%]+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    let match = str.match(/^(rgba?)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    // REGEX EXPLANATION
    // Purpose: parse rgb(a) strings, to extract the values.
    // Example: rgba(255, 10, 0, 0.9)
    // Matches: ^^^^ ^^^  ^^  ^  ^^^
    // Groups:  1    2    3   4  5
    // The commented regex does the same, but it also factors in hsl.
    return {
        r: parseInt(match[2]),
        g: parseInt(match[3]),
        b: parseInt(match[4])
    }
}


// MAIN FUNCTIONS

function invert(color) {
    if (!color) {return null;}
    let rgb = parseRGBString(color);
    return '#' + [rgb.r, rgb.g, rgb.b].map((c) => { return mapCallback((255 - c).toString(16)); }).join('');
}

window.onload = () => {
    document.getElementById("cvc").addEventListener('change', (e) => {
        let color = e.target.value;
        document.getElementById('inverted').style.backgroundColor = invert(color);
    });
}