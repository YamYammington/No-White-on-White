// VARS

var DEFAULT_BW = {
    black: '#000000',
    white: '#ffffff',
    threshold: Math.sqrt(1.05 * 0.05) - 0.05
};


// HELPER FUNCTIONS

function storageHandler(action, request, subject) {
    if (action == 'get') {
        switch (request) {
            case 'colormode':
                chrome.storage.sync.get(['colormode'], function(result) {
                    return result.colormode;
                });
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
  var parents = [];
  while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
    elem = elem.parentNode;
    parents.push(elem);
  }
  return parents;
}

function HSLToRGB(h, s, l) {
    s /= 100;
    l /= 100;
    var k = n => (n + h / 30) % 12;
    var a = s * Math.min(l, 1 - l);
    var f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
};

function padz(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}

function getLuminance(c) {
    var i, x;
    var a = []; // so we don't mutate
    for (i = 0; i < c.length; i++) {
        x = c[i] / 255;
        a[i] = x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function invertToBW(color, bw, asArr) {
    var options = (bw === true)
        ? DEFAULT_BW
        : Object.assign({}, DEFAULT_BW, bw);
    return getLuminance(color) > options.threshold
        ? (asArr ? hexToRgbArray(options.black) : options.black)
        : (asArr ? hexToRgbArray(options.white) : options.white);
}


// MAIN FUNCTIONS

function invert(color) {
    if (!color) {return null;}

    var regex = /^((?:rgb|hsl)a?)\((\d+),\s*([\d%]+),\s*([\d%]+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
    // example: rgba(255, 10, 0, 0.9)
    // matches: ^^^^ ^^^  ^^  ^  ^^^
    // it does match for the A value (match[5]), but it is not used

    var match = color.match(regex);
    if (match) {
        var rgb = [match[2], match[3], match[4]];
    } else {
        return null;
    }
    colormode = storageHandler('get', 'colormode');
    colormode = colormode ? colormode : 'cl'
    if (colormode == 'bw')
        return invertToBW(color, true);
    return color ? '#' + rgb.map(function (c) { return padz((255 - c).toString(16)); }).join('') : null;
}

function main() {
    try {
        p = document.getElementsByTagName('p');
    } catch (err) {
        return;
    }
    for (var x = 0; x < p.length; x++) {
        color = p[x].style.color;
        parents = getParents(p[x]);
        for (var i = 0; i < parents.length; i++) {
            if (parents[i].style.backgroundColor == color) {
                p[x].style.color = invert(p[x].style.color);
                break;
            }
        }
    }
}

window.onload = main;
