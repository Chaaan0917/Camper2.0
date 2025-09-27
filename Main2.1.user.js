// ==UserScript==
// @name         Camper Rinku Cat
// @namespace    http://tampermonkey.net/
// @author       Camper
// @version      1.0
// @description  Automate rinku(not bypass)
// @match        *://*/*
// @icon         https://tse2.mm.bing.net/th/id/OIP.L5yCQIs4iE6WKHXZs8-j1QHaDt?rs=1&pid=ImgDetMain&o=7&rm=3
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const verifyingText = "Verifying you are human. This may take a few seconds.";

    if (document.body.textContent.includes(verifyingText)) {
        console.log("[Camper] Verifying page detected → script will NOT run.");
        return; // stop here
    }

    // otherwise, dynamically load your script
    const script = document.createElement("script");
    script.src = "https://github.com/Chaaan0917/Camper2.0/raw/refs/heads/main/rinkyuu.user.js";
    script.onload = () => console.log("[Camper] Rinku script loaded.");
    document.head.appendChild(script);

})();
