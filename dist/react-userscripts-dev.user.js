// ==UserScript==
// @name     Artist's Dashboard Dev
// @namespace https://github.com/siefkenj/react-userscripts
// @version  1.1
// @description A sample userscript built using react
// @include https://*.popmundo.com/World/Popmundo.aspx/Artist*
// @grant    none
// ==/UserScript==


"use strict";

function log(...args) {
    console.log("%cUserscript:", "color: purple; font-weight: bold", ...args);
}



async function main() {
    const resp = await fetch("http://localhost:8124/react-userscripts.user.js");
    const script = await resp.text();
    if (script.trim() === "") {
        log("No user script found");
        return;
    }
    eval(script);
}

// Make sure we run once at the start
main.bind({})().catch((e) => {

});
