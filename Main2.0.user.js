// ==UserScript==
// @name         Camper Wonk.Ink Cat (Auto Volcano Detect)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       CAMPER
// @description  Automate work.ink with Cloudflare check + Volcano auto detect
// @match        *://work.ink/*
// @match        *://*.work.ink/*
// @match        *://key.volcano.wtf/*
// @require      https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/work.ink.user.js
// @icon         https://i.kym-cdn.com/entries/icons/original/000/043/403/cover3.jpg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- URLs where speedup should be disabled ---
    const disableSpeedupUrls = [
        "https://work.ink/22hr/42rk6hcq",
        "https://work.ink/22hr/ito4wckq",
        "https://work.ink/22hr/pzarvhq1"
    ];

    // Decide speedup default
    let speedEnabled = true;
    if (location.hostname.includes("key.volcano.wtf")) {
        speedEnabled = false;
        console.log("[Work.ink Auto] Disabled speedup (volcano).");
    }
    if (disableSpeedupUrls.some(u => location.href.startsWith(u))) {
        speedEnabled = false;
        console.log("[Work.ink Auto] Disabled speedup (blocked work.ink URL).");
    }

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
    } else {
        runSpeedup(); // run immediately if no check
    }

    // ====== SPEEDUP CODE ======
    function runSpeedup() {
        const SPEED_FACTOR = 5; // 2x, 5x, etc.

        if (!speedEnabled) {
            console.log("[Timer Speedup] Disabled for this page.");
            return;
        }

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
