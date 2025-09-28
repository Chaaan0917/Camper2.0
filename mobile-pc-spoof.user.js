// ==UserScript==
// @name         Work.ink Mobile -> Desktop Spoof
// @namespace    http://tampermonkey.net/
// @author       Camper
// @version      1.3
// @description  let the browser think you are in pc
// @match        *://work.ink/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- Configure the desktop values you want --- //
    const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
    const DESKTOP_PLATFORM = 'Win32';
    const DESKTOP_APPVERSION = '5.0 (Windows)';
    const DESKTOP_VENDOR = 'Google Inc.';
    const DESKTOP_LANGS = ['en-US','en'];
    const DESKTOP_HARDWARE_CONCURRENCY = 8; // cpu cores
    const DESKTOP_DEVICE_MEMORY = 8; // GB
    const DESKTOP_SCREEN = { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24 };
    const FORCE_DESKTOP_TOUCH_POINTS = 0; // 0 means no touch
    // ------------------------------------------------//

    // Helper to safely define a property
    function define(obj, prop, value) {
        try {
            Object.defineProperty(obj, prop, {
                get: () => value,
                configurable: true,
                enumerable: true
            });
        } catch (e) {
            // Some properties non-configurable on some browsers — ignore
            //console.warn('cannot define', prop, e);
        }
    }

    // 1) Spoof navigator properties
    const nav = window.navigator;
    define(nav, 'userAgent', DESKTOP_UA);
    define(nav, 'platform', DESKTOP_PLATFORM);
    define(nav, 'appVersion', DESKTOP_APPVERSION);
    define(nav, 'vendor', DESKTOP_VENDOR);
    define(nav, 'languages', DESKTOP_LANGS);
    define(nav, 'language', DESKTOP_LANGS[0]);
    define(nav, 'hardwareConcurrency', DESKTOP_HARDWARE_CONCURRENCY);
    define(nav, 'deviceMemory', DESKTOP_DEVICE_MEMORY);
    // WebDriver / automation checks
    define(nav, 'webdriver', false);

    // 2) Spoof screen
    try {
        const s = window.screen;
        define(s, 'width', DESKTOP_SCREEN.width);
        define(s, 'height', DESKTOP_SCREEN.height);
        define(s, 'availWidth', DESKTOP_SCREEN.availWidth);
        define(s, 'availHeight', DESKTOP_SCREEN.availHeight);
        define(s, 'colorDepth', DESKTOP_SCREEN.colorDepth);
        define(s, 'pixelDepth', DESKTOP_SCREEN.pixelDepth);
    } catch (e) {}

    // 3) Spoof window.innerWidth / innerHeight early access
    try {
        define(window, 'innerWidth', DESKTOP_SCREEN.width);
        define(window, 'innerHeight', DESKTOP_SCREEN.height);
        // optional: visualViewport if present
        if (window.visualViewport) {
            define(window.visualViewport, 'width', DESKTOP_SCREEN.width);
            define(window.visualViewport, 'height', DESKTOP_SCREEN.height);
        }
    } catch (e) {}

    // 4) Spoof touch capabilities
    try {
        define(navigator, 'maxTouchPoints', FORCE_DESKTOP_TOUCH_POINTS);
        // remove ontouchstart / touch event handlers detection
        define(window, 'ontouchstart', undefined);
        define(window, 'ontouchmove', undefined);
        define(window, 'ontouchend', undefined);
    } catch (e) {}

    // 5) Spoof Pointer Events if site checks pointer type
    try {
        if (window.PointerEvent) {
            // Don't replace the constructor; but change maxTouchPoints already helps.
            // Optionally, set pointerEnabled if checked
            define(window, 'PointerEvent', window.PointerEvent);
        }
    } catch (e) {}

    // 6) Spoof navigator.plugins and mimeTypes (some checks look for empty length as suspicious)
    try {
        const fakePluginArray = {
            length: 3,
            item: (i) => ({ name: 'Chrome PDF Viewer' }),
            namedItem: () => null
        };
        define(navigator, 'plugins', fakePluginArray);

        const fakeMimeTypes = {
            length: 1,
            item: (i) => ({ type: 'application/pdf' }),
            namedItem: () => null
        };
        define(navigator, 'mimeTypes', fakeMimeTypes);
    } catch (e) {}

    // 7) Spoof WebGL vendor/renderer strings — many fingerprint scripts use this
    (function spoofWebGL() {
        try {
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function (param) {
                // 37445 = UNMASKED_VENDOR_WEBGL, 37446 = UNMASKED_RENDERER_WEBGL
                if (param === 37445) return 'Intel Inc.'; // vendor
                if (param === 37446) return 'Intel Iris OpenGL Engine'; // renderer
                return getParameter.call(this, param);
            };
            // also for WebGL2
            if (window.WebGL2RenderingContext) {
                const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
                WebGL2RenderingContext.prototype.getParameter = function (param) {
                    if (param === 37445) return 'Intel Inc.';
                    if (param === 37446) return 'Intel Iris OpenGL Engine';
                    return getParameter2.call(this, param);
                };
            }
        } catch (e) {}
    })();

    // 8) Intercept navigator.userAgentData if present (newer chromium)
    try {
        if ('userAgentData' in navigator) {
            const fakeUAD = {
                brands: [{brand: "Chromium", version: "140"}, {brand: "Google Chrome", version: "140"}],
                mobile: false,
                platform: "Windows"
            };
            define(navigator, 'userAgentData', fakeUAD);
        }
    } catch (e) {}

    // 9) Patch touch-related detection via event listeners: trick code that uses 'ontouchstart' in window
    (function overrideHasOwnPropertyTouch() {
        try {
            const originalHas = Object.prototype.hasOwnProperty;
            Object.prototype.hasOwnProperty = function (k) {
                if ((k === 'ontouchstart' || k === 'ontouchmove' || k === 'ontouchend') && this === window) {
                    return false;
                }
                return originalHas.call(this, k);
            };
        } catch (e) {}
    })();

    // 10) Optional: override navigator.maxTouchPoints descriptor on documentElement for some libs
    try {
        define(Document.prototype, 'maxTouchPoints', FORCE_DESKTOP_TOUCH_POINTS);
    } catch (e) {}

    // 11) Prevent some libraries from detecting "mobile" via user-agent sniffing by rewriting navigator.toString
    try {
        // make navigator.toString give something consistent
        if (Navigator.prototype && Navigator.prototype.toString) {
            define(Navigator.prototype, 'toString', function () { return '[object Navigator]'; });
        }
    } catch (e) {}

    // 12) A tiny delay re-check: if site already ran scripts very early, attempt a final patch after DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {
        try {
            // re-apply just in case
            define(navigator, 'userAgent', DESKTOP_UA);
            define(navigator, 'platform', DESKTOP_PLATFORM);
            define(navigator, 'maxTouchPoints', FORCE_DESKTOP_TOUCH_POINTS);
            define(window, 'innerWidth', DESKTOP_SCREEN.width);
            define(window, 'innerHeight', DESKTOP_SCREEN.height);
        } catch (e) {}
    }, { once: true });

    // Done.
})();
