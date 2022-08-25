window.onload = function() {
    var colormode = document.getElementById('colormode');
    var colormode_desc = document.getElementById('cm-desc');
    var demo_btn = document.getElementById('demo-btn');
    var demo_color = document.getElementById('demo-color');
    var demo_bg = document.getElementById('demo-bg');
    var demo_text = document.getElementById('demo-text');
    var color_text = document.getElementById('selected-color');
    color_text.innerHTML = 'Selected color: #000000';

    demo_btn.onclick = demo;

    chrome.storage.sync.get(['colormode'], function(result) {
        console.log('Value currently is ' + result.colormode);
        if (result.colormode === 'cl') {
            colormode_desc.innerText = 'If text color matches the background color, change the text color the opposite color of the background.';
        } else {
            colormode_desc.innerText = 'If text color matches the background color, change the text color to black or white, whichever gives more contrast.';
        }
        var cm = result.colormode ? result.colormode : 'cl';
        colormode.value = cm;
    });
    colormode.addEventListener('change', function() {
        if (colormode.value === 'cl') {
            colormode_desc.innerText = 'If text color matches the background color, change the text color the opposite color of the background.';
        } else {
            colormode_desc.innerText = 'If text color matches the background color, change the text color to black or white, whichever gives more contrast.';
        }

        chrome.storage.sync.set({'colormode': colormode.value});
        console.log('Value changed to ' + colormode.value);
    });

    demo_color.addEventListener('change', function() {
        demo_bg.style.backgroundColor = demo_color.value;
        demo_text.style.color = demo_color.value;
        color_text.innerHTML = 'Selected color: ' + demo_color.value;

    });
}

var DEFAULT_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;
var DEFAULT_BW = {
    black: '#000000',
    white: '#ffffff',
    threshold: DEFAULT_THRESHOLD
};

function padz(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}

function getLuminance(c) {
    var i, x;
    var a = [];
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

function demo() {
    // fix needed: black/white only returns white
    var demo_bg = document.getElementById('demo-bg');
    var demo_text = document.getElementById('demo-text');
    demo_text.innerHTML = 'You can see me now!';
    var c = demo_bg.style.backgroundColor;
    invert_demo(c);
}

function invert_demo(color) {
    // regex to extract color values from a rgb() style string
    var regex = /^((?:rgb)a?)\((\d+),\s*([\d%]+),\s*([\d%]+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
    var match = color.match(regex);
    var rgb = [match[2], match[3], match[4]];
    chrome.storage.sync.get(['colormode'], function(result) {
        c = result.colormode ? result.colormode : 'cl'
        if (c == 'bw') {
            console.log('converting to bw')
            var new_C = invertToBW(color, true);
            var demo_text = document.getElementById('demo-text');
            demo_text.style.color = new_C;
        } else {
            var new_C = color ? '#' + rgb.map(function (c) { return padz((255 - c).toString(16)); }).join('') : null;
            var demo_text = document.getElementById('demo-text');
            demo_text.style.color = new_C;
        }
    return true;
    });
}