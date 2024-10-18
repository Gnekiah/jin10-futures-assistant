// ==UserScript==
// @name         weibo-assistant
// @namespace    https://weibo.com/
// @version      2024-10-18
// @description  try to take over the world!
// @author       Gnekiah
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var myList = {};
    var myListObj = GM_getValue ("myListArray", "");
    if (myListObj) {
        myList = JSON.parse (myListObj);
    }

    var g_last_time_id = "";
    if ("last_time" in myList) {
        g_last_time_id = myList["last_time"];
    }

    function gm_save() {
        myList["last_time"] = g_last_time_id;
        GM_setValue ("myListArray", JSON.stringify(myList));
    }

    

    function replace_datetime() {
        const tmp_item_list = document.getElementsByClassName("vue-recycle-scroller__item-view");
        for (const div of tmp_item_list) {
            const tmp_head_info_time = div.getElementsByClassName("head-info_time_6sFQg")[0];
            tmp_head_info_time.text = tmp_head_info_time.title;
        }
    }

    function isAfterCurrentView (el) {
        const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const top = el.getBoundingClientRect() && el.getBoundingClientRect().top;
        console.log('top', top);
        return top  > viewPortHeight;
    }

    setTimeout(function() {
        // 添加一个按钮用来跳转，添加一个按钮用来记录
        var jump_button = document.createElement("input");
        jump_button.id = "jump_button";
        jump_button.type = "button";
        jump_button.value = "跳转: " + g_last_time_id;
        jump_button.onclick = function() {
            // TODO：do jump
        };
        var record_button = document.createElement("input");
        record_button.id = "record_button";
        record_button.type = "button";
        record_button.value = "记录浏览位置";
        record_button.onclick = function() {
            // TODO：记录
            var item_list = document.getElementsByClassName("vue-recycle-scroller__item-view");
            var listitems = [];
            for (var i = 0; i < item_list.length; i++) {
                listitems.push(item_list.item(i));
            }
            listitems.sort(function(a, b) {
                var compA = a.getElementsByClassName("head-info_time_6sFQg")[0].title;
                var compB = b.getElementsByClassName("head-info_time_6sFQg")[0].title;
                return (compA > compB) ? -1 : 1;
            });

            for (const div of listitems) {
                if (isAfterCurrentView(div)) {
                    const head_info_time = div.getElementsByClassName("head-info_time_6sFQg")[0];
                    g_last_time_id = head_info_time.title;
                    jump_button.value = "跳转: " + g_last_time_id;
                    console.log('current div datetime is', g_last_time_id);
                    gm_save();
                    break;
                }
            }
        };
        var tmp_div1 = document.createElement("div");
        var tmp_div2 = document.createElement("div");
        tmp_div1.appendChild(jump_button);
        tmp_div2.appendChild(record_button);
        tmp_div1.setAttribute("style", "padding: 10px;");
        tmp_div2.setAttribute("style", "padding: 10px;");
        document.getElementsByClassName("Nav_inner_1QCVO")[0].appendChild(tmp_div1);
        document.getElementsByClassName("Nav_inner_1QCVO")[0].appendChild(tmp_div2);

        const frame_content = document.getElementsByClassName("woo-box-flex Frame_content_3XrxZ");
        frame_content[0].setAttribute("style", "width: 80%; max-width: none;");

        const main_wrap = document.getElementsByClassName("woo-box-flex Main_wrap_2GRrG");
        main_wrap[0].parentNode.setAttribute("style", "flex: 1; display: flex;");
        main_wrap[0].setAttribute("style", "flex: 1; display: flex;");

        const main_full = document.getElementsByClassName("Main_full_1dfQX");
        main_full[0].setAttribute("style", "width: 100%;");

        const main_side = document.getElementsByClassName("Main_side_i7Vti");
        main_side[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none"); 

        new MutationObserver((mutationsList, self) => {
            replace_datetime();
        }).observe(document.getElementsByClassName("vue-recycle-scroller__item-wrapper")[0], { childList: true, attributes: true, subtree: true });

    }, 3000);

    setInterval(replace_datetime, 3000);

})();