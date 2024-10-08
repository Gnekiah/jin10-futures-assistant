// ==UserScript==
// @name         eastmoney-assistant
// @namespace    https://data.eastmoney.com/
// @version      2024-10-08
// @description  input description
// @author       Gnekiah
// @match        https://data.eastmoney.com/zjlx/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eastmoney.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function hidden_by_class(tag) {
        const tag_class_name = document.getElementsByClassName(tag);
        for (const div of tag_class_name) {
            div.setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");
        }
    }

    function hidden_by_id(tag) {
        const tag_id = document.getElementById(tag);
        if (tag_id) {
            tag_id.setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");
        }
    }

    setTimeout(function() {
        hidden_by_class("emleftfloattg");
        hidden_by_id("topgg");
        hidden_by_class("top2gg");
        hidden_by_class("picker_wrap");
        hidden_by_id("hisWrap");
        hidden_by_class("mainnav");
        hidden_by_class("centerbox");
        hidden_by_class("mainnav-type");
        
    }, 3000);

})();