// HELPER FUNCTIONS

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
    const rgb = parseRGBString(color);
    return '#' + rgb.map((callbackVar) => {
        return (new Array(2).join('0') + (255 - callbackVar).toString(16)).slice(-2);
    }).join('')
}

window.onload = () => {
    document.getElementById("cvc").addEventListener('change', (e) => {
        let color = e.target.value;
        document.getElementById('inverted').style.backgroundColor = invert(color);
    });
}