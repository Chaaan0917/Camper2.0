// ==UserScript==
// @name         Camper Rinku Cat 
// @namespace    http://tampermonkey.net/
// @author       Camper
// @version      2.0
// @description  automate rinku
// @match        *://*/*
// @exclude      https://ads.luarmor.net/*
// @updateURL    https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/rinku.user.js
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
            let stableButtonClicked = false;
            const clickedSteps = new WeakSet();
            let articleClicked = false;

            function simulateClick(element) {
                if (!element) return;
                const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                element.dispatchEvent(event);
            }

            // Stable button
            function clickStableButton() {
                if (!stableButtonClicked) {
                    const btn = document.querySelector('button.btn');
                    if (btn) {
                        simulateClick(btn);
                        stableButtonClicked = true;
                        console.log('[Camper] Stable button clicked!');
                    }
                }
            }

            // Step buttons (use #count element to wait)
            function clickStepButtonIfReady(btn) {
                if (clickedSteps.has(btn)) return; // already clicked
                if (btn.disabled) return;

                const counterEl = document.querySelector('#count');
                if (counterEl) {
                    const countdown = parseInt(counterEl.textContent.trim(), 10);
                    if (!isNaN(countdown) && countdown > 0) {
                        return; // still waiting
                    }
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

            // Article click
            function clickOneArticle() {
                if (articleClicked) return;

                const prompt = Array.from(document.querySelectorAll('div, span, p'))
                    .some(el => el.textContent.includes(
                        "If Any Article Redirecting The Page Then Right Click On Mouse To Open It In New Tab"
                    ));
                if (!prompt) return;

                const links = Array.from(document.querySelectorAll('a[href]'))
                    .filter(el => el.href && !el.href.startsWith("javascript:"));

                if (links.length > 0) {
                    const article = links[0];
                    article.removeAttribute("target");

                    const oldOpen = window.open;
                    window.open = () => null;

                    simulateClick(article);

                    setTimeout(() => { window.open = oldOpen; }, 100);

                    articleClicked = true;
                    console.log('[Camper] Clicked ONE article (same tab).');
                }
            }

            // Observe DOM changes
            const observer = new MutationObserver(() => {
                clickStableButton();
                scanStepButtons();
                clickOneArticle();
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // Initial run + continuous loop
            clickStableButton();
            scanStepButtons();
            clickOneArticle();

            setInterval(() => {
                scanStepButtons();
            }, 500);

            console.log('[Camper] Script initialized with real #count countdown support.');
        });
    });
})();
