// ==UserScript==
// @name         Camper CAT
// @namespace    http://tampermonkey.net/
// @version      4.0
// @author       CAMPER
// @description  this is only automation(work.ink best)
// @match        *://work.ink/*
// @match        *://*.work.ink/*
// @include      *work.ink*
// @require      https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/work.ink.user.js
// @updateURL    https://github.com/Chaaan0917/Camper2.0/raw/main/Main2.0.user.js
// @downloadURL  https://github.com/Chaaan0917/Camper2.0/raw/main/Main2.0.user.js
// @run-at       document-idle
// @icon         https://i.pinimg.com/736x/02/72/16/02721647f507c80673b1b8ac20a82de3.jpg
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    let speedEnabled = true; //set false to turn it off
    const SPEED_FACTOR = 5; // 2x, 5x, etc. (set the speed)

    // Wrap setTimeout
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay, ...args) {
        if (speedEnabled && typeof delay === "number") {
            delay = delay / SPEED_FACTOR;
        }
        return originalSetTimeout(fn, delay, ...args);
    };

    // Wrap setInterval
    const originalSetInterval = window.setInterval;
    window.setInterval = function(fn, delay, ...args) {
        if (speedEnabled && typeof delay === "number") {
            delay = delay / SPEED_FACTOR;
        }
        return originalSetInterval(fn, delay, ...args);
    };

    // Wrap requestAnimationFrame (optional: can speed up frame loops)
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        if (speedEnabled) {
            return originalRAF(callback); // we cannot scale frame rate directly
        }
        return originalRAF(callback);
    };

    function toggleSpeed() {
        speedEnabled = !speedEnabled;
        console.log("[Timer Speedup] " + (speedEnabled ? "Enabled x" + SPEED_FACTOR : "Disabled"));
    }

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') toggleSpeed();
    });

    console.log("[Timer Speedup] Loaded. Press Ctrl+Shift+S to toggle speed.");
})();
