// ==UserScript==
// @name         Camper Wonk.Ink Cat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       CAMPER
// @description  automate work.ink (not the best)
// @match        *://work.ink/*
// @match        *://*.work.ink/*
// @include      *work.ink*
// @require      https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/work.ink.user.js
// @run-at       document-idle
// @icon         https://i.kym-cdn.com/entries/icons/original/000/043/403/cover3.jpg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ====== CLOUDflare CHECK ======
    function isWorkInkLoading() {
        return /Checking your browser\. This takes about 5 seconds\./i.test(document.body?.innerText || '');
    }

    // Poll until Cloudflare check is done
    if (isWorkInkLoading()) {
        console.log("[Cloudflare] Waiting for browser check...");
        const interval = setInterval(() => {
            if (!isWorkInkLoading()) {
                clearInterval(interval);
                console.log("[Cloudflare] Check complete, resuming script.");
                runSpeedup();
            }
        }, 1000);
        return; // exit early until check passes
    } else {
        runSpeedup(); // run immediately if no check
    }

    // ====== SPEEDUP CODE ======
    function runSpeedup() {
        let speedEnabled = true; // set false to turn it off
        const SPEED_FACTOR = 5; // 2x, 5x, etc.

        // Wrap setTimeout
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(fn, delay, ...args) {
            if (speedEnabled && typeof delay === "number") delay /= SPEED_FACTOR;
            return originalSetTimeout(fn, delay, ...args);
        };

        // Wrap setInterval
        const originalSetInterval = window.setInterval;
        window.setInterval = function(fn, delay, ...args) {
            if (speedEnabled && typeof delay === "number") delay /= SPEED_FACTOR;
            return originalSetInterval(fn, delay, ...args);
        };

        // Wrap requestAnimationFrame (optional)
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            return originalRAF(callback); // cannot scale frame rate directly
        };

        function toggleSpeed() {
            speedEnabled = !speedEnabled;
            console.log("[Timer Speedup] " + (speedEnabled ? "Enabled x" + SPEED_FACTOR : "Disabled"));
        }

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') toggleSpeed();
        });

        console.log("[Timer Speedup] Loaded. Press Ctrl+Shift+S to toggle speed.");
    }

})();
