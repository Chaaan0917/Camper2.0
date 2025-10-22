// ==UserScript==
// @name         Camper Wonk.Ink Cat
// @namespace    http://tampermonkey.net/
// @version      2.7
// @author       CAMPER
// @description  Automate Work.ink (not the best)
// @match        *://work.ink/*
// @match        *://*.work.ink/*
// @match        *://key.volcano.wtf/*
// @match        *://key.thanhub.com/*
// @match        *://therealasu.pythonanywhere.com/*
// @match        *://blox-script.com/*
// @match        *://loot-link.com/s?*
// @match        *://loot-links.com/s?*
// @match        *://lootlink.org/s?*
// @match        *://lootlinks.co/s?*
// @match        *://lootdest.info/s?*
// @match        *://lootdest.org/s?*
// @match        *://lootdest.com/s?*
// @match        *://links-loot.com/s?*
// @match        *://linksloot.net/s?*
// @match        *://rekonise.com/*
// @match        *://link-unlock/*
// @match        *://linkvertise.com/*/*
// @match        *://socialwolvez.com/*
// @match        *://scwz.me/*
// @match        *://adfoc.us/*
// @match        *://unlocknow.net/*
// @match        *://sub2get.com/*
// @match        *://sub4unlock.com/*
// @match        *://sub2unlock.net/*
// @match        *://sub2unlock.com/*
// @match        *://mboost.me/*
// @match        *://paste-drop.com/paste/*
// @match        *://pastebin.com/*
// @match        *://deltaios-executor.com/ads.html*
// @match        *://rentry.co/*
// @match        *://rekonise.com/*
// @match        *://rkns.link/*
// @match        *://bit.ly/*
// @match        *://rb.gy/*
// @match        *://is.gd/*
// @match        *://rebrand.ly/*
// @match        *://6x.work/*
// @match        *://boost.ink/*
// @match        *://booo.st/*
// @match        *://bst.gg/*
// @match        *://bst.wtf/*
// @match        *://linkunlocker.com/*
// @match        *://unlk.link/*
// @match        *://pandadevelopment.net/getkey*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @include      *key.thanhub.com/*
// @include      *work.ink/*
// @include      *therealasu.pythonanywhere.com/*
// @include      *blox-script.com/*
// @connect      trw.lat
// @connect      abysm.lat
// @require      https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/Camper.js
// @updateURL    https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/Main2.0.user.js
// @icon         https://i.kym-cdn.com/entries/icons/original/000/043/403/cover3.jpg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (!location.hostname.includes("work.ink")) {
        console.log("[Work.ink Auto] Skipping script, not on work.ink.");
        return;
    }

    // --- volcano work.inks ---
    const disableSpeedupUrls = [
        "https://work.ink/22hr/42rk6hcq",
        "https://work.ink/22hr/ito4wckq",
        "https://work.ink/22hr/pzarvhq1"
    ];

    // Decide speedup default
    let speedEnabled = true;
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
        runSpeedup(); 
    }

    // ================================================================ SPEEDUP CODE ==========================================
    function runSpeedup() {
        const SPEED_FACTOR = 5; // 2x, 5x, etc.

        if (!speedEnabled) {
            console.log("[Timer Speedup] Disabled for this page.");
            return;
        }

        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(fn, delay, ...args) {
            if (speedEnabled && typeof delay === "number") delay /= SPEED_FACTOR;
            return originalSetTimeout(fn, delay, ...args);
        };

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
