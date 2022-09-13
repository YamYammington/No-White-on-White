window.onload = () => {
    let colormode = document.getElementById('colormode');
    let colormode_desc = document.getElementById('cm-desc');
    let demo_btn = document.getElementById('demo-btn');
    let demo_color = document.getElementById('demo-color');
    let demo_bg = document.getElementById('demo-bg');
    let demo_text = document.getElementById('demo-text');
    let color_text = document.getElementById('selected-color');
    color_text.innerHTML = 'Selected color: #000000';

    demo_btn.onclick = () => {
        let demo_bg = document.getElementById('demo-bg');
        let demo_text = document.getElementById('demo-text');
        demo_text.innerHTML = 'You can see me now!';
        invert_demo(demo_bg.style.backgroundColor);
    }

    chrome.storage.sync.get(['colormode'], (result) => {
        if (result.colormode === 'cl') {
            colormode_desc.innerText = 'If text color matches the background color, change the text color the opposite color of the background.';
        } else {
            colormode_desc.innerText = 'If text color matches the background color, change the text color to black or white, whichever gives more contrast.';
        }
        colormode.value = result.colormode ? result.colormode : 'cl';
    });
    colormode.addEventListener('change', () => {
        if (colormode.value === 'cl') {
            colormode_desc.innerText = 'If text color matches the background color, change the text color the opposite color of the background.';
        } else {
            colormode_desc.innerText = 'If text color matches the background color, change the text color to black or white, whichever gives more contrast.';
        }

        chrome.storage.sync.set({'colormode': colormode.value});
    });

    demo_color.addEventListener('change', () => {
        demo_bg.style.backgroundColor = demo_color.value;
        demo_text.style.color = demo_color.value;
        if (demo_text.innerHTML === 'You can see me now!') {
            demo_text.innerHTML = 'You can\'t see me!'
        }
        color_text.innerHTML = 'Selected color: ' + demo_color.value;
    });
}

const DEFAULT_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;
const DEFAULT_BW = {
    black: '#000000',
    white: '#ffffff',
    threshold: DEFAULT_THRESHOLD
};

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

function invert_demo(color) {
    if (!color) {return null;}
    const rgb = parseRGBString(color);
    chrome.storage.sync.get(['colormode'], (result) => {
        let c = result.colormode ? result.colormode : 'cl'
        switch (c) {
            case 'bw':
                document.getElementById('demo-text').style.color = isCloserToWhite(rgb.r, rgb.b, rgb.b) ?
                    DEFAULT_BW.black :
                    DEFAULT_BW.white;
                break;
            case 'cl':
                document.getElementById('demo-text').style.color = '#' + [rgb.r, rgb.b, rgb.b].map(c => {
                    return mapCallback((255 - c).toString(16));
                }).join('');
        }
    return true;
    });
}