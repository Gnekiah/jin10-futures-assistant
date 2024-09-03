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

    var whitelist_keywords = [
        "CFTC"
    ];
    var blacklist_keywords = [
        "期货盯盘神器",
        "交易夜读",
        "订单流5分钟图显示",
        "热门品种观点分享",
        "量价分布与订单流复盘",
        "技术分析",
        "资金炸弹复盘",
        "品种交易逻辑"
    ];
    var blacklist_image_links = [
        "https://cdn-news.jin10.com/assets/common/13679271-9e9e-4b4f-8143-03a5524c78e9.jpg",
        "https://cdn-news.jin10.com/assets/common/33e9e3d7-9484-47e7-bed2-f64d7f2c4e48.jpg",
        "https://cdn-news.jin10.com/assets/common/52f3ddff-d53c-488a-8370-9f62d68516f6.jpg",
        "https://cdn-news.jin10.com/assets/common/40d04d52-951b-4132-a0b9-7474ae814efe.jpg",
        "https://cdn-news.jin10.com/assets/common/e6bcdc1e-a911-4346-be23-5261c5f5156d.jpg",
        "https://cdn-news.jin10.com/assets/common/c0624356-4e17-4136-a4d4-f50801f82b30.jpg",
        "https://cdn-news.jin10.com/assets/common/317c5dce-0065-47d5-af04-6bd9a6a210a5.jpg",
        "https://cdn-news.jin10.com/assets/common/73d61e20-bb54-44cc-87fa-43a9defc308f.jpg",
        "https://cdn-news.jin10.com/assets/common/2d235cbd-f851-4e40-b16b-f72bdd72a7fb.jpg",
        "https://cdn-news.jin10.com/assets/common/7ac16be9-232f-4279-bc33-5040a8a97862.jpg",
        "https://cdn-news.jin10.com/assets/common/17659d35-bb8b-4f59-ab97-4c2f7c8567a0.jpg",
        "https://cdn-news.jin10.com/assets/common/4c118b32-334f-4287-b41b-8a0d1177598d.jpg",
        "https://cdn-news.jin10.com/assets/common/e6bcdc1e-a911-4346-be23-5261c5f5156d.jpg",
        "https://cdn-news.jin10.com/assets/common/1e9e7eb1-cd6e-4609-8df1-57b69f5c8470.jpg",
        "https://cdn-news.jin10.com/assets/common/41195501-edba-4e8d-b4e5-9887c338c45c.jpg",
        "https://cdn-news.jin10.com/assets/common/978fa203-b4b0-4e19-a4dc-b5fe89cc7e68.jpg",
        "https://cdn-news.jin10.com/assets/common/318ef326-a414-4cb2-b89d-d51ab6e6350f.jpg",
        "https://cdn-news.jin10.com/assets/common/fd578307-fa2a-4b19-8551-73657c357bcd.jpg",
        "https://cdn-news.jin10.com/assets/common/aa0df400-b3d9-4412-8921-6664d82f3f3a.jpg",
        "https://flash-scdn.jin10.com/1375ec78-c99c-4aa1-a6bc-496d5d25df4c.png",
        "https://flash-scdn.jin10.com/85194ea0-b68c-49bd-8c61-c1208a3dac06.jpg"
    ];

    var g_last_time_id = "";
    var g_observer_list = [];

    // 隐藏header、侧边栏、水印
    const es_ushk_header = document.getElementsByClassName("ushk-header");
    es_ushk_header[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");

    const es_ushk_side = document.getElementsByClassName("ushk-side");
    es_ushk_side[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");

    const es_watermark = document.getElementsByClassName("watermark");
    es_watermark[0].setAttribute("style", "visibility: hidden; height: 0px;  width: 0px; margin: 0px; padding: 0px; display: none");

    // 添加一个按钮用来跳转
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

    // 关键词匹配
    function find_keyword_in_list(keywords, text) {
        for (const k of keywords) {
            if (text.indexOf(k) > -1) {
                return 1;
            }
        }
        return -1;
    }

    // 对每条消息div添加一个点击事件，用来更新跳转信息
    function ushk_set_item_id(target_node) {
        target_node.onclick = function() {
            g_last_time_id = target_node.getElementsByClassName("ushk-flash_time")[0].innerText.replaceAll(":", "-");
            target_node.setAttribute("id", "g_last_stop_id_" + g_last_time_id);
            last_stop_button = document.getElementById("last_stop_button");
            last_stop_button.value = "跳转到上次标记：" + g_last_time_id;
        };
    }

    // 处理全部消息
    function ushk_list_handler(target_node) {
        const ushk_flash_item_J_flash_item = target_node.getElementsByClassName("ushk-flash_item J_flash_item");
        for(const div of ushk_flash_item_J_flash_item) {
            const text = div.innerText;
            // 先过滤关键词白名单，再过滤关键词黑名单
            if (find_keyword_in_list(whitelist_keywords, text) > -1) {
                div.setAttribute("style", "padding-top: 5px");
                ushk_set_item_id(div);
            } else if (find_keyword_in_list(blacklist_keywords, text) > -1) {
                console.log(text);
                div.setAttribute("style", "visibility: hidden; height: 0px;  width: 0px; margin: 0px; padding: 0px; display: none");
            } else {
                div.setAttribute("style", "padding-top: 5px");
                ushk_set_item_id(div);
            }
        }
        //const ushk_flash_h = target_node.getElementsByClassName("ushk-flash_h");
        //for (const div of ushk_flash_h) {
        //    div.setAttribute("style", "padding: 0px");
        //}
        //const ushk_flash_b = target_node.getElementsByClassName("ushk-flash_b");
        //for (const div of ushk_flash_b) {
        //    div.setAttribute("style", "padding: 0px");
        //}

        const ushk_flash_data_b = target_node.getElementsByClassName("ushk-flash_data_b");
        for (const div of ushk_flash_data_b) {
            div.setAttribute("style", "visibility: hidden; height: 0px;  width: 0px; margin: 0px; padding: 0px; display: none");
        }

        const dingpan_remark_bottom = target_node.getElementsByClassName("dingpan-remark_bottom");
        for (const div of dingpan_remark_bottom) {
            div.setAttribute("style", "visibility: hidden; height: 0px;  width: 0px; margin: 0px; padding: 0px; display: none");
        }

        const imgtags = target_node.getElementsByTagName("img");
        for (const img of imgtags) {
            console.log(img.src);
            if (find_keyword_in_list(blacklist_image_links, img.src) > -1) {
                img.setAttribute("style", "visibility: hidden; height: 0px;  width: 0px; margin: 0px; padding: 0px; display: none");
            }
        }
    }

    setTimeout(function() {
        const es_ushk_page = document.getElementsByClassName("ushk-page");
        for(const div of es_ushk_page) {
            div.setAttribute("style", "margin-top: 0px");
        }
        const es_ushk_wrap_main = document.getElementsByClassName("ushk-wrap ushk-wrap-main");
        for(const div of es_ushk_wrap_main) {
            div.setAttribute("style", "width: auto; margin-left: 0px; margin-right: 0px");
        }
        const ushk_headline_top = document.getElementsByClassName("ushk-main ushk-headline-top");
        for(const div of ushk_headline_top) {
            div.setAttribute("style", "margin-right: 0px;padding: 0px; margin-bottom: 0px; display: none");
        }
        const headline_top = document.getElementsByClassName("headline-top");
        for(const div of headline_top) {
            div.setAttribute("style", "margin-bottom: 0px; padding: 0px; display: none");
        }
        const es_ushk_main = document.getElementsByClassName("ushk-main");
        for(const div of es_ushk_main) {
            div.setAttribute("style", "margin-right: 0px; padding: 0px");
        }
        const es_channel_list_li = document.getElementsByClassName("channel-list")[0].getElementsByTagName("li");
        for(const li of es_channel_list_li) {
            li.setAttribute("style", "flex: 6% 0 0");
        }
        const es_channel_list_span = document.getElementsByClassName("channel-list")[0].getElementsByTagName("span");
        for(const span of es_channel_list_span) {
            span.setAttribute("style", "padding: 0px");
        }

        const ushk_group = document.getElementsByClassName("ushk-flash__group J_flash_group")[0];
        const ushk_group_parent = ushk_group.parentNode;
        ushk_list_handler(ushk_group_parent);

        // 添加消息更新的监听事件
        new MutationObserver((mutationsList, self) => {
            ushk_list_handler(ushk_group);
        }).observe(ushk_group, { childList: true });
        g_observer_list.push(ushk_group);

        // 添加包含history更新的监听事件
        new MutationObserver((mutationsList, self) => {
            const ushk_group_history = document.getElementsByClassName("ushk-flash__group J_flash_group historyDate");
            for (const div of ushk_group_history) {
                ushk_list_handler(div);
                if (g_observer_list.indexOf(div) == -1) {
                    new MutationObserver((mutationsList, self) => {
                        ushk_list_handler(div);
                    }).observe(div, { childList: true });
                    g_observer_list.push(div);
                }
            }
        }).observe(ushk_group_parent, { childList: true });
        g_observer_list.push(ushk_group_parent);

        // 默认将列表第一条消息设置为标记位置
        const ushk_group_top_item = ushk_group.getElementsByClassName("ushk-flash_item J_flash_item")[0];
        const ushk_flash_time = ushk_group_top_item.getElementsByClassName("ushk-flash_time")[0].innerText.replaceAll(":", "-");
        g_last_time_id = ushk_flash_time;
        ushk_group_top_item.setAttribute("id", "g_last_stop_id_" + ushk_flash_time);
        last_stop_button = document.getElementById("last_stop_button");
        last_stop_button.value = "跳转到上次标记：" + g_last_time_id;

    }, 2000);
})();


