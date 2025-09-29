// ==UserScript==
// @name         Camper Rinku Cat
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  rinku automate (no bypass)
// @author       Camper
// @match        *://*/*
// @exclude      https://ads.luarmor.net/*
// @updateURL    https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/rinku.user.js
// @icon         https://www.meme-arsenal.com/memes/5d5de8ce95563be209d54774b3c56505.jpg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {

        function waitForCloudflareToFinish(callback) {
            const checkInterval = setInterval(() => {
                const cfActive = document.getElementById('cf-wrapper') ||
                                 document.querySelector('div[id^="cf-"]') ||
                                 document.body.textContent.includes("Checking your browser");
                if (!cfActive) {
                    clearInterval(checkInterval);
                    callback();
                }
            }, 500);
        }

        waitForCloudflareToFinish(() => {
            const clickedSteps = new WeakSet();

            function simulateClick(element) {
                if (!element) return;
                const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                element.dispatchEvent(event);
            }

            function clickStepButtonIfReady(btn) {
                if (clickedSteps.has(btn)) return; // already clicked
                if (btn.disabled || btn.offsetParent === null) return; // not visible or disabled

                const counterEl = document.querySelector('#count');
                if (counterEl) {
                    const countdown = parseInt(counterEl.textContent.trim(), 10);
                    if (!isNaN(countdown) && countdown > 0) return; // still waiting
                }

                simulateClick(btn);
                clickedSteps.add(btn);
                console.log(`[Camper] Clicked Step button: "${btn.textContent.trim()}"`);
            }

            function scanStepButtons() {
                document.querySelectorAll('button').forEach(btn => {
                    if (/Step \d\/2/.test(btn.textContent.trim())) {
                        clickStepButtonIfReady(btn);
                    }
                });
            }

            // Observe DOM changes dynamically
            const observer = new MutationObserver(scanStepButtons);
            observer.observe(document.body, { childList: true, subtree: true });

            // Initial + continuous loop
            scanStepButtons();
            const interval = setInterval(scanStepButtons, 500);

            console.log('[Camper] Script initialized: Cloudflare-safe + Step 0/2 only.');
        });
    });
})();
