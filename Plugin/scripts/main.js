// VARS

const DEFAULT_BW = {
    black: '#000000',
    white: '#ffffff',
    threshold: Math.sqrt(1.05 * 0.05) - 0.05
};

// HELPER FUNCTIONS

function storageHandler(action, request, subject) {
    if (action === 'get') {
        switch (request) {
            case 'colormode':
                chrome.storage.sync.get(['colormode'], (result) => {return result.colormode});
                break;
        }
    } else {
        switch (request) {
            case 'colormode':
                chrome.storage.sync.set({'colormode': subject});
                break;
        }
    }
    return true;
}

function getParents(elem) {
  let parents = [];
  while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() !== 'body') {
    elem = elem.parentNode;
    parents.push(elem);
  }
  return parents;
}

function mapCallback(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}

function isCloserToWhite(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    // returns true if the given color is closer to
    // white, false if it is closer to black
    return (r + g + b) / 3 >= 0.5;
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
    const rgb = parseRGBString(color);

    if (rgb) {
        let colormode = storageHandler('get', 'colormode');
        colormode = colormode ? colormode : 'cl'
        if (colormode === 'bw') {
            return isCloserToWhite(rgb.r, rgb.g, rgb.b) ?
                DEFAULT_BW.black :
                DEFAULT_BW.white;
        }
        return '#' + rgb.map(c => { return mapCallback((255 - c).toString(16)); }).join('')
    } else {
        return null;
    }
}

window.onload = () => {
    try {
        let p = document.getElementsByTagName('p');
        for (let x = 0; x < p.length; x++) {
            let color = p[x].style.color;
            let parents = getParents(p[x]);
            for (let i = 0; i < parents.length; i++) {
                if (parents[i].style.backgroundColor === color) {
                    p[x].style.color = invert(p[x].style.color);
                    break;
                }
            }
        }
    } catch {}
}
