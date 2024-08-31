// ==UserScript==
// @name         jin10-futures-assistant
// @namespace    http://qihuo.jin10.com/
// @version      2024-08-31
// @description  Tampermonkey script for qihuo.jin10.com
// @author       Gnekiah
// @match        https://qihuo.jin10.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none

// ==/UserScript==

(function() {
    'use strict';
    [...document.querySelectorAll('*')].forEach(item=>{
        item.oncopy = function(e){
            e.stopPropagation();
        }
    });

    let whitelist_keywords = [
        "CFTC"
    ];
    let blacklist_keywords = [
        "期货盯盘神器",
        "交易夜读",
        "订单流5分钟图显示",
        "热门品种观点分享",
        "量价分布与订单流复盘",
        "技术分析",
        "资金炸弹复盘",
        "品种交易逻辑"
    ];
    let blacklist_image_links = [
        "https://cdn-news.jin10.com/assets/common/13679271-9e9e-4b4f-8143-03a5524c78e9.jpg",
        "https://cdn-news.jin10.com/assets/common/33e9e3d7-9484-47e7-bed2-f64d7f2c4e48.jpg",
        "https://flash-scdn.jin10.com/1375ec78-c99c-4aa1-a6bc-496d5d25df4c.png"
    ];

    const es_ushk_header = document.getElementsByClassName("ushk-header");
    while(es_ushk_header.length > 0){
        es_ushk_header[0].parentNode.removeChild(es_ushk_header[0]);
    }
    const es_ushk_side = document.getElementsByClassName("ushk-side");
    while(es_ushk_side.length > 0){
        es_ushk_side[0].parentNode.removeChild(es_ushk_side[0]);
    }
    const es_watermark = document.getElementsByClassName("watermark");
    while(es_watermark.length > 0){
        es_watermark[0].parentNode.removeChild(es_watermark[0]);
    }

    function find_keyword_in_list(keywords, text) {
        for (let i = 0; i < keywords.length; i++) {
            if (text.indexOf(keywords[i]) > -1) {
                return 1;
            }
        }
        return -1;
    }

    function ushk_list_handler(target_node, max_loop) {
        const ushk_flash_item_J_flash_item = target_node.getElementsByClassName("ushk-flash_item J_flash_item");
        for(let i = 0; i < ushk_flash_item_J_flash_item.length && i < max_loop; i++) {
            const text = ushk_flash_item_J_flash_item[i].innerText;
            // 先过滤关键词白名单，再过滤关键词黑名单
            if (find_keyword_in_list(whitelist_keywords, text) > -1) {
                ushk_flash_item_J_flash_item[i].setAttribute("style", "padding-top: 5px");
            } else if (find_keyword_in_list(blacklist_keywords, text) > -1) {
                console.log(text);
                ushk_flash_item_J_flash_item[i].parentNode.removeChild(ushk_flash_item_J_flash_item[i]);
                i--;
            } else {
                ushk_flash_item_J_flash_item[i].setAttribute("style", "padding-top: 5px");
            }
        }
        const ushk_flash_data_b = target_node.getElementsByClassName("ushk-flash_data_b");
        for(let i = Math.min(max_loop, ushk_flash_data_b.length - 1); i >= 0; i--) {
            ushk_flash_data_b[i].parentNode.removeChild(ushk_flash_data_b[i]);
        }
        const dingpan_remark_bottom = target_node.getElementsByClassName("dingpan-remark_bottom");
        for(let i = Math.min(max_loop, dingpan_remark_bottom.length - 1); i >= 0; i--) {
            dingpan_remark_bottom[i].parentNode.removeChild(dingpan_remark_bottom[i]);
        }
        const imgtags = target_node.getElementsByTagName("img");
        for (var i = imgtags.length - 1; i >= 0; i--) {
            if (find_keyword_in_list(blacklist_image_links, imgtags[i].src) > -1) {
                imgtags[i].parentNode.removeChild(imgtags[i]);
            }
        }
    }

    setTimeout(function(){
        const es_ushk_page = document.getElementsByClassName("ushk-page");
        for(let i = 0; i < es_ushk_page.length; i++) {
            es_ushk_page[i].setAttribute("style", "margin-top: 0px");
        }
        const es_ushk_wrap_main = document.getElementsByClassName("ushk-wrap ushk-wrap-main");
        for(let i = 0; i < es_ushk_wrap_main.length; i++) {
            es_ushk_wrap_main[i].setAttribute("style", "width: auto; margin-left: 0px; margin-right: 0px");
        }
        const ushk_headline_top = document.getElementsByClassName("ushk-main ushk-headline-top");
        for(let i = 0; i < ushk_headline_top.length; i++) {
            ushk_headline_top[i].setAttribute("style", "margin-right: 0px;padding: 0px; margin-bottom: 0px; display: none");
        }
        const headline_top = document.getElementsByClassName("headline-top");
        for(let i = 0; i < headline_top.length; i++) {
            headline_top[i].setAttribute("style", "margin-bottom: 0px; padding: 0px; display: none");
        }
        const es_ushk_main = document.getElementsByClassName("ushk-main");
        for(let i = 0; i < es_ushk_main.length; i++) {
            es_ushk_main[i].setAttribute("style", "margin-right: 0px; padding: 0px");
        }
        const es_channel_list = document.getElementsByClassName("channel-list");
        const es_channel_list_li = es_channel_list[0].getElementsByTagName("li");
        for(let i = 0; i < es_channel_list_li.length; i++) {
            es_channel_list_li[i].setAttribute("style", "flex: 6% 0 0");
        }
        const es_channel_list_span = es_channel_list[0].getElementsByTagName("span");
        for(let i = 0; i < es_channel_list_span.length; i++) {
            es_channel_list_span[i].setAttribute("style", "padding: 0px");
        }

        const ushk_group = document.getElementsByClassName("ushk-flash__group J_flash_group")[0];
        ushk_list_handler(ushk_group, 65535);

        var is_history_date_observerred = 0;
        new MutationObserver((mutationsList, self) => {
            if (is_history_date_observerred == 0) {
                const ushk_group_historyDate = document.getElementsByClassName("ushk-flash__group J_flash_group historyDate")[0];
                if (ushk_group_historyDate) {
                    setTimeout(function(){
                        ushk_list_handler(ushk_group_historyDate, 65535);
                    }, 2000);
                    is_history_date_observerred = 1;
                }
            }
            for(const mutation of mutationsList) {
                if(mutation.type === "childList"){
                    ushk_list_handler(ushk_group, 10);
                }
            }
        }).observe(ushk_group, { childList: true });

        var g_last_time_id = ""
        const ushk_flash_item_J_flash_item = ushk_group.getElementsByClassName("ushk-flash_item J_flash_item");
        const ushk_flash_time = ushk_flash_item_J_flash_item[0].getElementsByClassName("ushk-flash_time")[0].innerText.replaceAll(":", "-");
        g_last_time_id = ushk_flash_time;
        ushk_flash_item_J_flash_item[0].setAttribute("id", "g_last_stop_id_" + ushk_flash_time);

        const ushk_news_handle = document.getElementsByClassName("ushk-news__handle")[0];
        var last_stop_button = document.createElement("input");
        last_stop_button.id = "last_stop_button";
        last_stop_button.type = "button";
        last_stop_button.value = "跳转到上次标记：" + g_last_time_id;
        last_stop_button.onclick = function() {
            var last_stop_item = document.getElementById("g_last_stop_id_" + g_last_time_id);
            last_stop_item.scrollIntoView({ behavior: "smooth", block: "start" }, true);
        };
        ushk_news_handle.appendChild(last_stop_button);

        for(let i = 0; i < ushk_flash_item_J_flash_item.length; i++) {
            ushk_flash_item_J_flash_item[i].onclick = function() {
                const ushk_flash_time = ushk_flash_item_J_flash_item[i].getElementsByClassName("ushk-flash_time")[0].innerText.replaceAll(":", "-");
                g_last_time_id = ushk_flash_time;
                ushk_flash_item_J_flash_item[i].setAttribute("id", "g_last_stop_id_" + g_last_time_id);
                last_stop_button = document.getElementById("last_stop_button");
                last_stop_button.value = "跳转到上次标记：" + g_last_time_id;
            };
            //ushk_flash_item_J_flash_item[i].setAttribute("id", "you id")
        }



    }, 2000);
})();


