// HELPER FUNCTIONS

function padz(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}

function hexToRgbArray(hex) {
    if (hex.slice(0, 1) === '#')
        hex = hex.slice(1);
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return [
        parseInt(hex.slice(0, 2), 16), // r
        parseInt(hex.slice(2, 4), 16), // g
        parseInt(hex.slice(4, 6), 16)  // b
    ];
}

// MAIN FUNCTIONS

function invert(color) {
    if (!color) {return null;}
    if (color.includes("#")) {
        var rgb = hexToRgbArray(color);
    } else {
        var regex = /^((?:rgb|hsl)a?)\((\d+),\s*([\d%]+),\s*([\d%]+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
        var match = color.match(regex);
        if (match) {
            var rgb = [match[2], match[3], match[4]];
        } else {
            return null;
        }
    }
    return '#' + rgb.map(function (c) { return padz((255 - c).toString(16)); }).join('');
}

window.onload = function () {
    document.getElementById("cvc").addEventListener('change', (e) => {
        let color = e.target.value;
        document.getElementById('inverted').style.backgroundColor = invert(color);
    });
    var invertButton = document.getElementById("parse");
    invertButton.onclick = function () {
        var color = document.getElementById("parse_t").value;
        var invertedColor = invert(color);
        if (invertedColor) {
            var color = invert(invertedColor)
            var text = document.getElementById("parsed_result");
            text.innerHTML = `<span class="text" style="color: ${invertedColor}; background-color: ${color}">&nbsp;${invertedColor}&nbsp;</span>`;
        } else {
            alert("Invalid color");
        }
    }
}

console.log('yo')