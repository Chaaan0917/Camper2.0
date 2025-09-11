// ==UserScript==
// @name         Camper CAT
// @namespace    http://tampermonkey.net/
// @version      3.8
// @author       CAMPER
// @description  lootlink, work.ink, & lockr --supported
// @match        *://loot-link.com/s*
// @match        *://loot-links.com/s*
// @match        *://lootlink.org/s*
// @match        *://lootlinks.co/s*
// @match        *://lootdest.info/s*
// @match        *://lootdest.org/s*
// @match        *://lootdest.com/s*
// @match        *://links-loot.com/s*
// @match        *://linksloot.net/s*
// @match        *://work.ink/*
// @match        *://*.work.ink/*
// @match        *://lockr.so/*
// @match        *://blox-script.com/get-key*
// @match        *://keyrblx.com/getkey*
// @match        *://www.keyrblx.com/getkey*
// @include      *keyrblx.com/getkey*
// @include      *loot*
// @include      *work.ink*
// @include      *blox-script.com/gey-key*
// @include      *lockr.so*
// @require      
// @updateURL    https://github.com/Chaaan0917/Camper2.0/raw/main/Main.user.js
// @downloadURL  https://github.com/Chaaan0917/Camper2.0/raw/main/Main.user.js
// @run-at       document-idle
// @icon         https://i.pinimg.com/736x/02/72/16/02721647f507c80673b1b8ac20a82de3.jpg
// @grant        none
// ==/UserScript==


// SPEEDUP WORK.INK.
if (window.location.hostname.includes('work.ink')) {
(function() {
  'use strict';

  // --- SPEEDUP SETUP ---
  let speedupActive = false;

  // Save originals
  const realSetTimeout = window.setTimeout;
  const realSetInterval = window.setInterval;

  function enableSpeedup() {
    if (speedupActive) return;
    speedupActive = true;

    window.setTimeout = function(fn, delay, ...args) {
      return realSetTimeout(fn, delay / 10, ...args);
    };
    window.setInterval = function(fn, delay, ...args) {
      return realSetInterval(fn, delay / 10, ...args);
    };

    const style = document.createElement('style');
    style.id = "speedup-style";
    style.textContent = `* { transition: none !important; animation: none !important; }`;
    document.head.appendChild(style);

    console.log("[Workink Speed Booster] ✅ Enabled");
  }

  function disableSpeedup() {
    if (!speedupActive) return;
    speedupActive = false;

    window.setTimeout = realSetTimeout;
    window.setInterval = realSetInterval;

    document.getElementById("speedup-style")?.remove();

    console.log("[Workink Speed Booster] ❌ Disabled");
  }

  // Start with speedup ON
  enableSpeedup();

  // --- WATCH STEP CLICK ---
  const STEP_CONT_SELECTOR = "div.stepcont.svelte-ck84f7";

  document.addEventListener("click", (e) => {
    const stepCont = e.target.closest(STEP_CONT_SELECTOR);
    if (stepCont) {
      console.log("[Workink Speed Booster] Stepcont clicked — will disable in 3s");
      setTimeout(disableSpeedup, 2000); // ⏳ wait 3 seconds after click
    }
  }, true);

})():
  function isWorkInkLoading() {
  return /Checking your browser\. This takes about 5 seconds\./i.test(document.body?.innerText || '');
}

// ====== EARLY EXIT (if Cloudflare active) ======
if (window.location.hostname.includes('work.ink') && isWorkInkLoading()) {
  log("Cloudflare check active, stopping script.");
  return;
}
    }
