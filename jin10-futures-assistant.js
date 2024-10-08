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
        "订单流15分钟图显示",
        "热门品种观点分享",
        "量价分布与订单流复盘",
        "技术分析",
        "资金炸弹复盘",
        "品种交易逻辑",
        "期货观点汇总"
    ];
    var blacklist_image_links = [
        "https://cdn-news.jin10.com/assets/common/c0624356-4e17-4136-a4d4-f50801f82b30.jpg",// 沪铜
        "https://cdn-news.jin10.com/assets/common/df0ebd52-7eb1-457c-a3e5-95dd648e9698.jpg",// 沪铝
        "https://cdn-news.jin10.com/assets/common/a2bc392c-469c-4d4c-b8ca-96c399c8116a.jpg",// 沪镍
        "https://cdn-news.jin10.com/assets/common/d4ac9f34-09da-44c8-9dac-63c5a667c1ab.jpg",// 氧化铝
        "https://cdn-news.jin10.com/assets/common/317c5dce-0065-47d5-af04-6bd9a6a210a5.jpg",// 原油
        "https://cdn-news.jin10.com/assets/common/e93d9707-3407-439e-8cbc-5c6dca9c3c07.jpg",// 燃料油
        "https://cdn-news.jin10.com/assets/common/68e32cdf-e27e-40cc-ac2a-f9bab69b17c2.jpg",// LPG
        "https://cdn-news.jin10.com/assets/common/41195501-edba-4e8d-b4e5-9887c338c45c.jpg",// 铁矿石
        "https://cdn-news.jin10.com/assets/common/a889cf66-4eb6-40b5-8d87-cc1a66f6d78c.jpg",// 焦煤
        "https://cdn-news.jin10.com/assets/common/17659d35-bb8b-4f59-ab97-4c2f7c8567a0.jpg",// 螺纹钢
        "https://cdn-news.jin10.com/assets/common/de4ba63c-8cbe-4af1-a4a6-0311d697bb19.jpg",// 锰硅
        "https://cdn-news.jin10.com/assets/common/318ef326-a414-4cb2-b89d-d51ab6e6350f.jpg",// 碳酸锂
        "https://cdn-news.jin10.com/assets/common/1e9e7eb1-cd6e-4609-8df1-57b69f5c8470.jpg",// 纯碱
        "https://cdn-news.jin10.com/assets/common/40d04d52-951b-4132-a0b9-7474ae814efe.jpg",// 尿素
        "https://cdn-news.jin10.com/assets/common/e6bcdc1e-a911-4346-be23-5261c5f5156d.jpg",// 玻璃
        "https://cdn-news.jin10.com/assets/common/73d61e20-bb54-44cc-87fa-43a9defc308f.jpg",// 甲醇
        "https://cdn-news.jin10.com/assets/common/7ac16be9-232f-4279-bc33-5040a8a97862.jpg",// PP
        "https://cdn-news.jin10.com/assets/common/7093a3b1-8ee9-4845-8d9d-6795096aa2b2.jpg",// PVC
        "https://cdn-news.jin10.com/assets/common/fd578307-fa2a-4b19-8551-73657c357bcd.jpg",// PTA
        "https://cdn-news.jin10.com/assets/common/779e03d9-279d-4484-b422-f322f1fc836c.jpg",// 乙二醇
        "https://cdn-news.jin10.com/assets/common/978fa203-b4b0-4e19-a4dc-b5fe89cc7e68.jpg",// 橡胶
        "https://img.jin10.com/mp/24/08/zeoHqf1_5v7JYSMz4F10m.jpg",// 20号胶
        "https://img.jin10.com/mp/24/08/m_6Nzp72jGPdtosYZt42z.jpg",// BR橡胶
        "https://cdn-news.jin10.com/assets/common/33e9e3d7-9484-47e7-bed2-f64d7f2c4e48.jpg",// 豆粕
        "https://cdn-news.jin10.com/assets/common/4200df63-143a-43ce-860d-233e1e1b73dd.jpg",// 菜粕
        "https://cdn-news.jin10.com/assets/common/4c118b32-334f-4287-b41b-8a0d1177598d.jpg",// 棕榈油
        "https://cdn-news.jin10.com/assets/common/aa0df400-b3d9-4412-8921-6664d82f3f3a.jpg",// 豆油
        "https://cdn-news.jin10.com/assets/common/2d235cbd-f851-4e40-b16b-f72bdd72a7fb.jpg",// 菜油
        "https://cdn-news.jin10.com/assets/common/13679271-9e9e-4b4f-8143-03a5524c78e9.jpg",// 棉花
        "https://cdn-news.jin10.com/assets/common/e22be1ec-bf40-4ab0-af8b-77d943bdf108.jpg",// 白糖
        "https://cdn-news.jin10.com/assets/common/35e7cfe2-8ab5-4e27-96b8-26d8c7615f09.jpg",// 玉米
        "https://cdn-news.jin10.com/assets/common/6e3e562c-fd7d-4af5-ac91-7661850ce9ad.jpg",// 生猪
        "https://cdn-news.jin10.com/assets/common/52f3ddff-d53c-488a-8370-9f62d68516f6.jpg",// 航运
        "https://flash-scdn.jin10.com/1375ec78-c99c-4aa1-a6bc-496d5d25df4c.png",
        "https://flash-scdn.jin10.com/85194ea0-b68c-49bd-8c61-c1208a3dac06.jpg",
        "https://flash-scdn.jin10.com/39a9fee1-8d0b-421f-9bb9-007f8ba48000.jpg"
    ];

    var g_last_time_id = "";
    var g_observer_list = [];

    // 隐藏header、侧边栏、水印
    const es_ushk_header = document.getElementsByClassName("ushk-header");
    es_ushk_header[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");

    const es_ushk_side = document.getElementsByClassName("ushk-side");
    es_ushk_side[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");

    const es_watermark = document.getElementsByClassName("watermark");
    es_watermark[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");

    const ushk_backtop_is_show = document.getElementsByClassName("ushk-backtop is-show");
    ushk_backtop_is_show[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");
    const ushk_backtop_ushk_feedback = document.getElementsByClassName("ushk-backtop ushk-feedback is-show");
    ushk_backtop_ushk_feedback[0].setAttribute("style", "visibility: hidden; height: 0px; width: 0px; margin: 0px; padding: 0px; display: none");

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
            document.getElementById("g_last_stop_id_" + g_last_time_id).style.border = "0px";
            target_node.style.border = "3px solid rgba(255, 128, 0, 0.5)";

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
                div.setAttribute("style", "padding-top: 5px; border-radius: 8px");
                ushk_set_item_id(div);
            } else if (find_keyword_in_list(blacklist_keywords, text) > -1) {
                console.log(text);
                div.setAttribute("style", "visibility: hidden; height: 0px;  width: 0px; margin: 0px; padding: 0px; display: none");
            } else {
                div.setAttribute("style", "padding-top: 5px; border-radius: 8px");
                ushk_set_item_id(div);
            }
        }

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

        if (g_last_time_id != "") {
            document.getElementById("g_last_stop_id_" + g_last_time_id).style.border = "3px solid rgba(255, 128, 0, 0.5)";
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

        // 默认将列表第一条消息设置为标记位置
        const ushk_group_top_item = ushk_group.getElementsByClassName("ushk-flash_item J_flash_item")[0];
        const ushk_flash_time = ushk_group_top_item.getElementsByClassName("ushk-flash_time")[0].innerText.replaceAll(":", "-");
        g_last_time_id = ushk_flash_time;
        ushk_group_top_item.setAttribute("id", "g_last_stop_id_" + ushk_flash_time);
        last_stop_button = document.getElementById("last_stop_button");
        last_stop_button.value = "跳转到上次标记：" + g_last_time_id;

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

    }, 5000);
})();


