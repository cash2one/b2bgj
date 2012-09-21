/*
*http://a.tbcdn.cn/??
apps/et/common/js/slide.js,
apps/et/common/js/placeholder.js,
apps/et/common/widgets/suggest/js/trip-autocomplete.js,
apps/et/common/widgets/calendar/js/calendar.js,
apps/et/common/widgets/calendar/js/trip-calendar.v1.1.js,
apps/et/common/widgets/box/js/box.js,
apps/et/common/js/mustache.js,
apps/et/common/js/search-form.js,
apps/et/common/js/storage-lite-v1.1.js,
apps/et/common/js/modernizr.js,
*/


/**********************
* implement html5 placeholder
*/
YUI.add("trip-placeholder", function(Y) {
    //判断浏览器是否原生支持placeholder属性
    //&& "placeholder" in document.createElement("textarea"); //判断一个就够了
    if (Y.Modernizr.input.placeholder) {
        Y.TripPlaceholder = {
            init: function() {}
        };
        return;
    }
    var Node = Y.Node,
    NodeList = Y.NodeList;
    var fnGet = Node.prototype.get;

    Node.prototype.get = function(attr) {
        if (attr === "value" && this.getAttribute("placeholder")) {
            return (this._node.value == this.getAttribute("placeholder")) ? "": this._node.value;
        } else {
            return fnGet.apply(this, arguments);
        }
    };

    Y.TripPlaceholder = function() {
        function _init(elems) {

            elems.on("focus", function(evt) {
                var node = evt.target;
                var str = node.getAttribute("placeholder");
                if (node._node.value == str) {
                    node.set("value", "");
                    node.removeClass("trip-placeholder");
                }
            });

            elems.on("blur", function(evt) {
                var node = evt.target;
                var str = node.getAttribute("placeholder");
                if (node._node.value == "") {
                    node.set("value", str);
                    node.addClass("trip-placeholder");
                }
            });

            function getValue() {
                var ythis = Y.one(this);
                var val = ythis.get("value"),
                plhTxt = ythis.getAttribute("placeholder");
                return (val && val == plhTxt) ? "": val;
            }

            //init
            (function() {
                elems.each(function(node) {
                    if (node._node.value == node.getAttribute("placeholder") || node._node.value == "") {
                        node.addClass("trip-placeholder");
                        node.set("value", node.getAttribute("placeholder"));
                    } else {
                        node.removeClass("trip-placeholder");
                    }
                    node.getValue = node._node.getValue = getValue;

                });
            })()
        }
        return {
            init: function(elems) {
                if (!elems) {
                    _init(Y.all(".trip-placeholder"));
                } else if ((elems instanceof NodeList)) {
                    _init(elems);
                } else {
                    _init(Y.all(elems));
                }
            }
        }
    } ();
},
'1.0.0', {
    requires: ['node-base', 'event-base', 'trip-modernizr']
});


/*********************
* @fileOverview 日历控件，主要功能是日历的生成，日历显示。没有其他的交互行为
* @author lanmeng
* @version 1.0
* @requires ［"widget", "widget-position"］
*/

YUI.namespace('Y.Calendar');
YUI.add('calendar', function(Y) {

    /**
    * @description {String} 日历显示样式控制
    * @field
    */
    var calandarHtml = '<div class="oneCalendar">' + '<s class="J_pre pre <% if(!isFirstNode) {%>hidden<% } %>">上</s>' + '<s class="J_next next <% if(!isLastNode) {%>hidden<% } %>">下</s>' + '<h5>' + '<% if(isSelect) {%>' + '<select class="J_selectYear">' + '<% for(var i = (limitBeginDate.getFullYear() - date.getFullYear()), len = (limitEndDate.getFullYear() - date.getFullYear()); i < len; i++) {%>' + '<option value="<%=date.getFullYear() + i%>"  <% if(date.getFullYear() + i == date.getFullYear()) {%>selected="true"<%}%>><%=date.getFullYear() + i%></option>' + '<% } %>' + '</select>年' + '<select class="J_selectMonth">' + '<% for(var i = 1; i < 13; i++) {%>' + '<option value="<%=i%>" <% if(i == date.getMonth() + 1) {%>selected="true"<%}%>><%=i%></option>' + '<% } %>' + '</select>月' + '<% } else {%>' + '<span class="J_selectYear"><%=date.getFullYear()%></span>年<span class="J_selectMonth"><%=date.getMonth()+1%></span>月' + '<% } %>' + '</h5>' + '<h6><em>日</em><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><em>六</em></h6>' + '<ul class="calendar-day">' + '<% for(var i = 0, len = days.length; i < len; i ++) { %>' + '<% var nowDay = new Date(date.getFullYear(), date.getMonth(), days[i]); %>' + '<li class="<% if(beginDate && beginDate.toString() == nowDay.toString()){%>select-begin-date<% } else if(endDate && endDate.toString() == nowDay.toString()){%>select-end-date<% } else if(beginDate && beginDate.getTime() < nowDay.getTime() && endDate && endDate.getTime() > nowDay.getTime()){%>select-date<% } %>">' + '<% if(days[i] && (!limitBeginDate || nowDay.getTime() >= limitBeginDate.getTime()) && (!limitEndDate || nowDay.getTime() <= limitEndDate.getTime())) {%>' + '<a href="javascript:;" <% if(nowDay.getTime() == toDay.getTime()){%> class="current" <%}%>><%=days[i]%></a>' + '<% } else { %>' + '<span class="disable" <% if(days[i] && (!limitEndDate || nowDay.getTime() > limitEndDate.getTime())) {%>title="<%=titleTips%>"<%}%>><%=days[i]%></span>' + '<% } %>' + '</li>' + '<% } %>' + '</ul>' + '</div>';

    /**
    * @name Y.Calendar
    * @class Y.Calendar
    * @constructor
    * @public
    * @param {Date} [beginDate] 开始时间，默认为空，即日历初始化没有选中的日期
    * @param {Date} [endDate]  结束时间，默认为空，即日历初始化没有选中的日期
    * @param {Date} [limitBeginDate] 最小时间，为空则不作限制，默认为空
    * @param {Date} [limitEndDate]  最大时间，为空则不作限制，默认为空
    * @param {Date} [date] 当前第一个呈现的月
    * @param {String} [id] 日历的id，目前没有使用
    * @param {Boolean} [isSelect] 是否有下拉框可以切换日期，目前较少测试
    * @example new Y.Calendar({beginDate: null, endDate: null});
    * @description 日历构造函数，使用的是widget中的base和position定位
    */
    Y.Calendar = Y.Base.create("calendar", Y.Widget, [Y.WidgetPosition], {

        /**
        * @name Y.Calendar#initializer
        * @function
        * @public
        * @description 初始化日历信息，主要是日历外边框样式，日历IE的hack
        */
        initializer: function() {
            var t = this;

            /*
            * @description {Boolean} 日历当前是否是显示的
            * @field
            */
            t.render();

            t.get("contentBox").set("className", "calendar-main clearfix");
            t.calendarNode = t.get("contentBox").get("parentNode");
            t.calendarNode.addClass("calendar shadow").append("<span class='cal-close J_close'>关闭</span>");
            t._iehack();

        },
        //angtian add
        festival: {
            'today': '今天',
            '2012-01-01': '元旦',
            '2012-01-22': '除夕',
            '2012-01-23': '春节',
            '2012-04-04': '清明节',
            '2012-05-01': '劳动节',
            '2012-06-23': '端午节',
            '2012-09-30': '中秋节',
            '2012-10-01': '国庆节',
            '2013-01-01': '元旦',
            '2013-02-09': '除夕',
            '2013-02-10': '春节',
            '2013-04-04': '清明节',
            '2013-05-01': '劳动节',
            '2013-06-12': '端午节',
            '2013-09-19': '中秋节',
            '2013-10-01': '国庆节',
            '2014-01-01': '元旦',
            '2014-01-30': '除夕',
            '2014-01-31': '春节',
            '2014-04-05': '清明节',
            '2014-05-01': '劳动节',
            '2014-06-02': '端午节',
            '2014-09-08': '中秋节',
            '2014-10-01': '国庆节',
            '2015-01-01': '元旦',
            '2015-02-18': '除夕',
            '2015-02-19': '春节',
            '2015-04-05': '清明节',
            '2015-05-01': '劳动节',
            '2015-06-20': '端午节',
            '2015-09-27': '中秋节',
            '2015-10-01': '国庆节',
            '2016-01-01': '元旦',
            '2016-02-07': '除夕',
            '2016-02-08': '春节',
            '2016-04-04': '清明节',
            '2016-05-01': '劳动节',
            '2016-06-09': '端午节',
            '2016-09-15': '中秋节',
            '2016-10-01': '国庆节',
            '2017-01-01': '元旦',
            '2017-01-27': '除夕',
            '2017-01-28': '春节',
            '2017-04-04': '清明节',
            '2017-05-01': '劳动节',
            '2017-05-30': '端午节',
            '2017-10-04': '中秋节',
            '2017-10-01': '国庆节',
            '2018-01-01': '元旦',
            '2018-02-15': '除夕',
            '2018-02-16': '春节',
            '2018-04-05': '清明节',
            '2018-05-01': '劳动节',
            '2018-06-18': '端午节',
            '2018-09-24': '中秋节',
            '2018-10-01': '国庆节',
            '2019-01-01': '元旦',
            '2019-02-04': '除夕',
            '2019-02-05': '春节',
            '2019-04-05': '清明节',
            '2019-05-01': '劳动节',
            '2019-06-07': '端午节',
            '2019-09-13': '中秋节',
            '2019-10-01': '国庆节',
            '2020-01-01': '元旦',
            '2020-01-24': '除夕',
            '2020-01-25': '春节',
            '2020-04-04': '清明节',
            '2020-05-01': '劳动节',
            '2020-06-25': '端午节',
            '2020-10-01': '国庆节'
        },

        /**
        * @name Y.Calendar#renderUI
        * @function
        * @description 初始化日历，让日历渲染出来
        */
        renderUI: function() {
            var t = this;

            if (!t.calendarNode) {
                t.get("contentBox").get("parentNode").setStyles({
                    position: "absolute",
                    display: "none"
                });
            }

            /*
            * @description {Date} 日历数据，主要保存当前第一个日历需要显示的日期
            * @field
            */
            var date = t.get("date");
            var html = [];

            /*
            * @description {String} 获取当前所需要展示的多个日历中所有日历的天数数组
            * @field
            */
            var htmlDay = t.getHtmlDay();

            for (var i = 0, len = t.get("calendarCount"); i < len;) {
                t.set("days", htmlDay[i]);
                t.set("isFirstNode", false);
                t.set("isLastNode", false);
                i == 0 && (t.set("isFirstNode", true)); ++i == len && (t.set("isLastNode", true));

                html.push(t.tempReplace(calandarHtml, t.getAttrs()));
                t.set("date", new Date(t.get("date").getFullYear(), t.get("date").getMonth() + 1, 1));
            }

            /*
            * angtian add
            * 将特殊日期转为文字/图片显示
            */
            for (var i = html.length; i--;) { (function() {
                var iYear = html[i].match(/<span class="J_selectYear">(\d+)<\/span>/)[1];
                var iMonth = html[i].match(/<span class="J_selectMonth">(\d+)<\/span>/)[1].replace(/^(\d)$/, "0$1");
                var reg = /(<a[^>]+>)(\d+)(<\/a>)/g;
                html[i] = html[i].replace(reg, function() {
                    var aClass = ["jiantian", "shiyi", "qingming"]
                    var oDate = new Date();
                    var sToday = oDate.getFullYear() + "-" + (oDate.getMonth() + 1).toString().replace(/^(\d)$/, "0$1") + "-" + oDate.getDate().toString().replace(/^(\d)$/, "0$1");
                    var args = arguments;
                    var iDate = iYear + "-" + iMonth + "-" + args[2].replace(/^(\d)$/, "0$1");
                    iDate == sToday && (iDate = "today");

                    //添加class时使用
                    var tmp = args[1]
                    var sss = ["yuandan", "chuxi", "chunjie", "yuanxiao", "qingming", "wuyi", "duanwu", "zhongqiu", "guoqing", "today"];
                    var index = 0;
                    if (iDate in t.festival) {
                        switch (t.festival[iDate].substr(0, 2)) {
                            case "元旦":
                                index = 0;
                            break;
                            case "除夕":
                                index = 1;
                            break;
                            case "春节":
                                index = 2;
                            break;
                            case "元宵":
                                index = 3;
                            break;
                            case "清明":
                                index = 4;
                            break;
                            case "劳动":
                                index = 5;
                            break;
                            case "端午":
                                index = 6;
                            break;
                            case "中秋":
                                index = 7;
                            break;
                            case "国庆":
                                index = 8;
                            break;
                            case "今天":
                                index = 9;
                            break;
                        }
                        args[1] = "<a href=\"javascript:;\" class=\"" + sss[index] + "\">";
                    }
                    return args[1] + args[2] + args[3]

                    //return args[1] + (iDate in t.festival ? t.festival[iDate] : args[2]) + args[3]
                });
            })(i);
            }

            t.get("contentBox").set("innerHTML", html.join(""));

            t.set("date", date);
        },

        /**
        * @name Y.Calendar#bindUI
        * @function
        * @description 事件绑定，主要是上一个月，下一个月的事件绑定以及如果有下拉框，下拉框事件绑定
        */
        bindUI: function() {
            var t = this;
            Y.delegate("click", t.showPreDays, t.get("contentBox"), ".J_pre", t);
            Y.delegate("click", t.showNextDays, t.get("contentBox"), ".J_next", t);
            Y.delegate("change", t.selectDate, t.get("contentBox"), ".J_selectYear", t);
            Y.delegate("change", t.selectDate, t.get("contentBox"), ".J_selectMonth", t);
            Y.delegate("click", t.hide, t.get("contentBox"), ".J_close", t);
        },

        /**
        * @name Y.Calendar#show
        * @function
        * @param ｛Int｝［x］左边距
        * @param ｛Int｝［y］上边距
        * @description 显示日历控件，其中IE6hack一下
        */
        show: function(x, y) {
            var t = this;
            t.calendarNode.setStyles({
                display: "block",
                position: "absolute"
            });
            t._iehack();

            y = Y.UA.ie == 6 ? (y - 1) : y;
            t.move(x, y);
        },

        /**
        * @name Y.Calendar#hide
        * @function
        * @description 隐藏日历控件
        */
        hide: function() {
            var t = this;
            t.fire("close", {});
            t.calendarNode.setStyle("display", "none");
        },

        /**
        * @name Y.Calendar#setNowShowDays
        * @function
        * @param ｛Date｝［date］当前选中的天，即第一个日历中被选中的那天
        * @description 设置日历当前选中的天
        */
        setNowShowDays: function(date) {
            var t = this;
            t.set("date", date);
        },

        /**
        * @name Y.Calendar#setLimitDays
        * @function
        * @param ｛Date｝［limitBeginDate］最小日期
        * @param ｛Date｝［limitEndDate］最大日期
        * @description 设置日历中需要限制的范围，如果为空，则没有限制
        */
        setLimitDays: function(limitBeginDate, limitEndDate) {
            var t = this;
            t.set("limitBeginDate", limitBeginDate);
            t.set("limitEndDate", limitEndDate);
        },

        /**
        * @name Y.Calendar#setBeginAndEndDate
        * @function
        * @param ｛Date｝［beginDate］开始时间
        * @param ｛Date｝［endTime］结束时间
        * @description 设置日历中的开始时间和结束时间，主要是为了给这个时间段加一个范围
        */
        setBeginAndEndDate: function(beginDate, endTime) {
            var t = this;
            t.set("beginDate", beginDate);
            t.set("endDate", endTime);
        },

        /**
        * @name Y.Calendar#showPreDays
        * @function
        * @description 获取上一个月日历信息，呈现
        */
        showPreDays: function(e) {
            var t = this;
            t.set("date", t.getPreAndNextMonth(t.get("date"), - 1));
            t.renderUI();
            e.halt();
        },

        /**
        * @name Y.Calendar#showNextDays
        * @function
        * @param ｛YUIDom｝［node］触发事件的节点
        * @param ｛Obj｝［t］日历对象
        * @description 获取下一个月日历信息，呈现
        */
        showNextDays: function(e) {
            var t = this;
            t.set("date", t.getPreAndNextMonth(t.get("date"), 1));
            t.renderUI();
            e.halt();
        },

        /**
        * @name Y.Calendar#selectDate
        * @function
        * @param ｛Event｝［e］触发事件
        * @description 下拉框选中某个年份或者月份
        */
        selectDate: function(e) {
            var t = this;
            var node = e.currentTarget;
            var year = node.ancestor("h5").one(".J_selectYear").get("value");
            var month = node.ancestor("h5").one(".J_selectMonth").get("value");
            t.set("date", new Date(year, month - 1, 1));
            t.renderUI();
        },

        /**
        * @name Y.Calendar#getPreAndNextMonth
        * @function
        * @param ｛Date｝［date］当前的日期
        * @param ｛Date｝［flag］1为下一个月，－1为上一个月
        * @return ｛Date｝
        * @description 通过当前日期，或者上一个月的信息或者下一个月的信息
        */
        getPreAndNextMonth: function(date, flag) {
            var month = date.getMonth() + flag;
            if (month > 11) {
                return new Date(date.getFullYear() + 1, 0, date.getDate());
            }
            if (month < 0) {
                return new Date(date.getFullYear() - 1, 11, date.getDate());
            }
            return new Date(date.getFullYear(), month, date.getDate());
        },

        /**
        * @name Y.Calendar#getHtmlDay
        * @function
        * @description 通过第一个月需要显示的天数，获取后面各个月的天数信息。需要注意保持所有的月份所占方格数一致。
        * @return ｛Array｝ 返回所有的月份需要显示的天数信息
        */
        getHtmlDay: function() {
            var t = this;
            var firstItem = t.get("date");
            var count = t.get("calendarCount");
            var daysArr = [];
            var dateArr = [];
            var htmlDayArr = {};

            for (var i = 0; i < count; i++) {
                dateArr.push(new Date(firstItem.getFullYear(), firstItem.getMonth() + i, 1));
                daysArr.push(t.getOneMonthDay(firstItem.getFullYear(), firstItem.getMonth() + i + 1) + dateArr[i].getDay());
                htmlDayArr[i] = [];
            };

            daysArr.sort(function(a, b) {
                return b - a;
            });

            for (var i = 0; i < count; i++) {

                var startDay = new Date(dateArr[i].getFullYear(), dateArr[i].getMonth(), 1).getDay();

                for (var j = 0; j < startDay; j++) {
                    htmlDayArr[i].push("");
                };
                for (var j = 0, len = t.getOneMonthDay(dateArr[i].getFullYear(), dateArr[i].getMonth() + 1); j < len;) {
                    htmlDayArr[i].push(++j);
                }

                var maxLength = daysArr[0] + (daysArr[0] % 7 == 0 ? 0: 1) * 7 - daysArr[0] % 7;
                for (var j = htmlDayArr[i].length; j < maxLength; j++) {
                    htmlDayArr[i].push("");
                }
            }
            return htmlDayArr;

        },

        /**
        * @name Y.Calendar#getOneMonthDay
        * @function
        * @param ｛Int｝［year］年
        * @param ｛Int｝［month］月
        * @description 通过年和月获取这个月的天数
        * @return ｛Int｝ 天数
        */
        getOneMonthDay: function(year, month) {
            return 32 - new Date(year, month - 1, 32).getDate();
        },

        /**
        * @name Y.Calendar#_iehack
        * @function
        * @description IE下面需要添加iframe，同时需要去掉投影
        */
        _iehack: function() {
            if (Y.UA.ie == 6) {
                var t = this;
                if (!t.calendarNode.one("iframe")) {
                    this.calendarNode.append('<iframe></iframe>');
                }
                var width = t.calendarNode.get("offsetWidth");
                var height = t.calendarNode.get("offsetHeight");
                t.calendarNode.removeClass("shadow");
                t.calendarNode.one("iframe").setStyles({
                    width: width,
                    height: height
                });
            }
        },

        /**
        * @name Y.Calendar#tempReplace
        * @function
        * @param ｛String｝［str］模板
        * @param ｛Json｝［data］处理的数据
        * @description 模板函数
        * @return ｛String｝ 代码片段
        */
        tempReplace: function(str, data) {
            var fn = ! /\W/.test(str) ? cache[str] = cache[str] || tmpl(str) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");

            return data ? fn(data) : fn;
        }
    },
    {
        ATTRS: {
            beginDate: {
                value: null
            },
            endDate: {
                value: null
            },
            limitBeginDate: {
                value: null
            },
            limitEndDate: {
                value: null
            },
            calendarCount: {
                value: 2
            },
            toDay: {
                value: new Date(new Date().setHours(0, 0, 0, 0))
            },
            date: {
                value: new Date()
            },
            days: [],
            isFirstNode: {
                value: false
            },
            isLastNode: {
                value: false
            },
            id: {
                value: "J_calendar"
            },
            isSelect: {
                value: false
            },
            titleTips: {
                value: ""
            }
        }
    });

},
'1.0', {
    requires: ["widget", "widget-position"]
});

/*****************
* @fileOverview 旅行日历控件，主要结合旅行有关的需求做的个性化设置
* @requires ［"widget",  "calendar"］
*/
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};

YUI.namespace('Y.TripCalandar');
YUI.add('trip-calendar', function(Y) {
    var trim = Y.Lang.trim;

    /**
    * @namespace 常量以及配置信息
    */

    var config = {
        weekStr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        today: new Date(new Date().setHours(0, 0, 0, 0)),
        dataExp: /^(\d{2,4})-(?:[0]?)(\d{1,2})-(?:[0]?)(\d{1,2})$/,
        time: 24 * 60 * 60 * 1000
    };

    /**
    * @name Y.TripCalendar
    * @constructor
    * @param isWeek 是否显示星期
    * @param isFestival  是否显示节假日
    * @param calendarCount 日历的个数，默认为2
    * @param limitBeginDate 最小时间，为空则不作限制，默认为空
    * @param limitEndDate  最大时间，为空则不作限制，默认为空
    * @param limitDays 限制天数，主要酒店使用
    * @param beginNode 开始日期节点，不可以为空
    * @param endNode 结束日期节点，可选
    * @param isSelect 是否有下拉框可以切换日期，目前较少测试
    * @description 日历构造函数，使用的是widget中的base和position定位
    */
    Y.TripCalendar = function() {
        Y.TripCalendar.superclass.constructor.apply(this, arguments);
    };

    Y.TripCalendar.NAME = "tripCalendar";

    Y.TripCalendar.ATTRS = {
        isWeek: {
            value: true
        },
        isFestival: {
            value: true
        },
        calendarCount: {
            value: 2
        },
        limitBeginDate: {
            value: ''
        },
        limitEndDate: {
            value: ''
        },
        limitDays: {
            value: 0
        },
        beginNode: {
            value: ""
        },
        endNode: {
            value: ""
        },
        beginDate: {
            value: ""
        },
        endDate: {
            value: ""
        },
        isSelect: {
            value: false
        },
        titleTips: {
            value: ""
        },
        limitBox: {
            value: ""
        }
    };

    /**
    * @name Y.TripCalendar#initializer
    * @function
    * @description 初始化日历，绑定事件
    */
    Y.extend(Y.TripCalendar, Y.Widget, {

        initializer: function() {
            var t = this;
            var oInputB = null;
            var oInputE = null;
            t.isCalendarShow = false;
            t.hideCalendar = false;
            t.calendarTimeout = null;
            t.limitBox = Y.one(t.get("limitBox") ? t.get("limitBox") : "body");
            t.beginNode = Y.one(t.get("beginNode"));
            t.endNode = Y.one(t.get("endNode"));
            t.beginDate = t.beginNode.get("value");
            t.endDate = t.endNode ? t.endNode.get("value") : "";
            oInputB = t.beginNode.one("input[type=text]");
            oInputB.addClass("J_DateInput");
            oInputE = t.endNode && t.endNode.one("input[type=text]");
            oInputE && oInputE.addClass("J_DateInput");

            oInputB.calendarObj = this;
            t.endNode && (oInputE.calendarObj = this);

            TG.SearchForm['#' + oInputB.get('id')] = this;
            oInputE && (TG.SearchForm['#' + oInputE.get('id')] = this);

            Y.TripPlaceholder.init(t.beginNode.one("input"));
            t.endNode && Y.TripPlaceholder.init(t.endNode.one("input"));

            t.oneCalendar = new Y.Calendar({
                calendarCount: t.get("calendarCount"),
                isSelect: t.get("isSelect"),
                beginDate: t.formatDate(t.beginDate),
                endDate: t.formatDate(t.endDate),
                limitBeginTime: "",
                limitEndTime: "",
                titleTips: t.get("titleTips")
            });

            t.calendarNode = t.oneCalendar.calendarNode;
            t.calendarNode.addClass('has-anim-fast');
            t.calendarNode.setStyle("width", 453);
            t.renderUI();
            t.bindUI();

            var oBeginWeek = t.beginNode.one("span");
            var oEndWeek = t.endNode ? t.endNode.one("span") : null;
            oBeginWeek && oBeginWeek.addClass("b");
            oEndWeek && oEndWeek.addClass("e");
        },

        /**
        * @name Y.TripCalendar#renderUI
        * @function
        * @description 设置input不可以有提示，且设置当前输入框的选中时间对应的星期或节日
        */
        renderUI: function() {
            var t = this;
            t.beginNode.one("input").setAttribute("autocomplete", "off");
            t.endNode && t.endNode.one("input").setAttribute("autocomplete", "off");
            t.setDateInputDayInfo(t.beginNode, t.beginDate);
            t.setDateInputDayInfo(t.endNode, t.endDate);
        },

        /**
        * @name Y.TripCalendar#bindUI
        * @function
        * @description 事件绑定，鼠标在时间输入框内点击或者tab切换选中都需要弹出日历控件；
        * 鼠标在日历控件中及日历输入可外点击，日历消失；
        * 窗口变化，日历位置移动；
        * 日历时间点击，触发事件
        */
        bindUI: function() {
            var t = this;
            var doc = Y.one("document");
            t.onSelectBoxBindEvent(t.beginNode);
            t.onSelectBoxBindEvent(t.endNode);

            doc.on("mousedown", function(e) {
                var nowNode = e.target;
                clearTimeout(t.calendarTimeout);

                if (!t.beginNode.one("input")) {
                    return;
                }

                if (nowNode.ancestor(".calendar") == t.calendarNode && ! nowNode.hasClass("J_close")) {
                    e.halt();
                    t.ieTimeout();
                    return;
                }
                t.hideCalendar = true;
                t.inputBlur();
            });
            t.calendarNode.delegate("click", function(e) {
                t.selectDay(e);
                t.hideCalendar = true;
                t.inputBlur();
            },
            "a", t);

            var aResizeTimeout = null;
            Y.one("window").on("resize", function() {
                aResizeTimeout && clearTimeout(aResizeTimeout);
                aResizeTimeout = setTimeout(function() {
                    t.isCalendarShow && t.showClalender();
                },
                10);
            },
            t);

            //
            Y.all(".J_DateInput").on("keyup", function(e) {
                var sValue = e.target.get("value");
                t.setDateInfo(sValue);
                e.target.get("id") == "J_jipiao_depDate" && t.oneCalendar.setBeginAndEndDate(t.formatDate(sValue), t.formatDate(t.endDate));
                e.target.get("id") == "J_jipiao_endDate" && t.oneCalendar.setBeginAndEndDate(t.formatDate(t.beginDate), t.formatDate(sValue));
                t.oneCalendar.renderUI();
            });
        },

        /**
        * @name Y.TripCalendar#onSelectBoxBindEvent
        * @function
        * @param ｛YUIDom｝［selectBox] 点击会弹出日历的div
        * @description 给div绑定事件
        */
        onSelectBoxBindEvent: function(selectBox) {
            var t = this;
            if (selectBox) {
                selectBox.one("input").on("focus", t.inputFocus, t);

                selectBox.one("input").on("blur", function() {
                    t.hideCalendar = true;
                    t.calendarTimeout = setTimeout(function() {
                        t.inputBlur();
                    },
                    10);
                });

                selectBox.on("mousedown", function(e) {
                    if (e.target != selectBox.one("input")) {
                        e.halt();
                        t.ieTimeout();
                        selectBox.one("input").focus();
                    } else {
                        e.stopPropagation();
                    }

                });
            }
        },

        /**
        * @name Y.TripCalendar#setDateInputDayInfo
        * @function
        * @param ｛YUIDom｝［node］节点
        * @param ｛String｝［dateStr］节点日期信息
        * @description 设置选择日期的input的值以及星期（这个方法可以修改）
        */
        setDateInputDayInfo: function(node, dateStr) {
            if (node) {
                var t = this;
                t.nowSelNode = node;
                t.setDateInfo(dateStr);
            }
        },

        /**
        * @name Y.TripCalendar#inputFocus
        * @function
        * @param ｛event｝［e］触发事件
        * @param ｛Boolean｝［isBeginDate］是否是开始节点
        * @description 当出发或者结束时间被选中以后，弹出日历控件
        * 需要判断日历控件是否已经显示
        * 日历控件的日期需要修改（开始点击，显示开始时间；结束点击，显示结束时间）
        */
        inputFocus: function(e) {
            var t = this;
            var nowNode = e.target.get("parentNode");
            e.target.addClass("yui3-acinput-focus");

            clearTimeout(t.calendarTimeout);
            if (nowNode != t.nowSelNode) {
                t.hideCalendar = true;
                t.inputBlur();
            }

            t.beginDate = t.getInputVal(t.beginNode);
            t.endDate = t.endNode ? t.getInputVal(t.endNode) : "";

            if (!t.isCalendarShow || (t.getInputVal(nowNode) != t.getInputVal(t.nowSelNode))) {
                var nowDate = t.getInputVal(nowNode) || config.today;
                if (t.endDate == "" && nowNode == t.endNode) {
                    nowDate = t.beginDate || nowDate;
                }
                t.oneCalendar.setNowShowDays(t.formatDate(nowDate) || new Date());
            }
            if (nowNode == t.endNode) {
                t.calendarNode.addClass("end-select");
                t.setLimitDate(t.get("limitBeginDate"), t.get("limitEndDate"), true);
            } else {
                t.setLimitDate(t.get("limitBeginDate"), t.get("limitEndDate"), false);
            }

            t.nowSelNode = nowNode;
            t.nowSelNode.addClass("cal-input-focus");
            t.oneCalendar.setBeginAndEndDate(t.formatDate(t.beginDate), t.formatDate(t.endDate));
            t.showClalender();

            var oInput = nowNode.one("input");
            setTimeout(function() {
                oInput.select()
            },
            50);

            t.calendarNode.all(".oneCalendar li").set("title", "");
            var oSelectBegin = Y.one(".select-begin-date");
            var oSelectEnd = Y.one(".select-end-date");
            oSelectBegin && oSelectBegin.set("title", "出发时间");
            oSelectEnd && oSelectEnd.set("title", "返程时间");
        },

        /**
        * @name Y.TripCalendar#inputBlur
        * @function
        * @description 操作移出时间选择框
        */
        inputBlur: function() {
            var t = this;
            var oCal = t.calendarNode;
            if (t.hideCalendar) {
                t.setDateInfo();
                t.oneCalendar.hide();
                t.isCalendarShow = false;
                t.nowSelNode.one("input").removeClass("yui3-acinput-focus");
                t.calendarNode.removeClass("end-select");
                t.hideCalendar = false;
                oCal.one(".message-tips") && oCal.one(".message-tips").remove();
                oCal.one('.calendar-main').setStyle('paddingTop', 20);
                oCal.one('.J_close').setStyle("top", 8);
            }
        },

        /**
        * @name Y.TripCalendar#getInputVal
        * @function
        * @param ｛YUIDom｝［node］输入框节点
        * @description 获取输入框中的信息
        */
        getInputVal: function(node) {
            return trim(node.one("input").get("value"));
        },

        /**
        * @name Y.TripCalendar#showClalender
        * @function
        * @description 显示日历控件，获取当前操作的元素的位置，传递给日历控件
        */
        showClalender: function() {
            var t = this;
            t.isCalendarShow = true;
            t.oneCalendar.renderUI();
            t.calendarNode.setStyles({
                display: "block",
                visibility: "hidden",
                top: "0px",
                left: "0px"
            });

            var position = t.getShowXY();
            t.oneCalendar.show(position.x, position.y);
            t.calendarNode.setStyle("visibility", "visible");
        },

        getShowXY: function() {
            var t = this;
            var oCal = t.calendarNode;
            var nodeH = t.nowSelNode.get("region").height - 1; //get('region')
            var winW = parseInt(t.oneCalendar.calendarNode.get("scrollWidth"));
            var winH = parseInt(t.oneCalendar.calendarNode.get("scrollHeight"));
            var limitW = t.limitBox == Y.one("body") ? Y.DOM.docWidth() : t.limitBox.get("scrollWidth");
            var limitH = t.limitBox == Y.one("body") ? Y.DOM.docHeight() : t.limitBox.get("scrollHeight");

            var position = {};
            if ((t.nowSelNode.getX() - t.limitBox.getX()) > (limitW - winW)) {
                position.x = t.limitBox.getX() + limitW - winW - 2;
            } else {
                position.x = t.nowSelNode.getX();
            }
            if ((t.nowSelNode.getY() + nodeH - t.limitBox.getY()) > (limitH - winH)) {
                position.y = t.nowSelNode.getY() - winH;
            } else {
                position.y = t.nowSelNode.getY() + nodeH;
            }
            return position;
        },

        /**
        * @name Y.TripCalendar#setLimitDate
        * @function
        * @param ｛String｝［limitBeginDate］最小日期
        * @param ｛String｝［limitEndDate］最大日期
        * @description 如果有限制天数，则以最小日期加上天数处理
        */
        setLimitDate: function(limitBeginDate, limitEndDate, isLimited) {
            var t = this;
            limitBeginDate = t.formatDate(limitBeginDate);
            if (isLimited && limitBeginDate && t.get("limitDays") && t.formatDate(t.beginDate)) {
                limitEndDate = new Date(t.formatDate(t.beginDate).getTime() + config.time * parseInt(t.get("limitDays")));
            }
            if (isLimited && limitEndDate) {
                limitEndDate = t.formatDate(limitEndDate);
            }
            t.oneCalendar.setLimitDays(limitBeginDate, limitEndDate);
        },

        /**
        * @name Y.TripCalendar#selectDay
        * @function
        * @param ｛event｝［e］当前触发事件
        * @description 选中某天，输入框中日期变化，对应的星期或者节日变化
        */
        selectDay: function(e) {
            var t = this;
            e.preventDefault();

            var node = e.currentTarget;
            var oneCalendar = node.ancestor("div");
            var year = oneCalendar.one(".J_selectYear").get("value") || oneCalendar.one(".J_selectYear").get("innerHTML");
            var month = oneCalendar.one(".J_selectMonth").get("value") || oneCalendar.one(".J_selectMonth").get("innerHTML");
            var day = node.get("innerHTML");

            var nowDate = year + "-" + t.gerDoubleNum(month) + "-" + t.gerDoubleNum(day);
            t.fire("select", {
                dateStr: nowDate,
                inputNode: t.nowSelNode.one("input[type=text]")
            });
            t.nowSelNode.one("input").set("value", year + "-" + t.gerDoubleNum(month) + "-" + t.gerDoubleNum(day));
            t.nowSelNode.one("input").removeClass("trip-placeholder");

            t.setDateInfo(nowDate);
            t.inputBlur();

            //angtian add
            t.nowSelNode.one("input").blur();
            if (t.nowSelNode.get("id") == "J_jipiao_depDateBox" && Y.one("#J_jipiao_FlightTypeRadio_2").get("checked")) {
                setTimeout(function() {
                    Y.one("#J_jipiao_endDate")._node.focus();
                },
                0)
            }
        },

        /**
        * @name Y.TripCalendar#setDateInfo
        * @function
        * @param ｛Date｝［nowDate］当前选中的天
        * @description 通过当前选中的天获取对应的星期或者节日信息
        */
        setDateInfo: function(nowDate, node) {
            var t = this;
            var inputNode = node || t.nowSelNode.one("input");
            var dayInfo = "";
            var oHoliday = {
                '2012-01-01': '元旦',
                '2012-01-19': '除夕前三天',
                '2012-01-20': '除夕前二天',
                '2012-01-21': '除夕前一天',
                '2012-01-22': '除夕',
                '2012-01-23': '春节',
                '2012-01-24': '春节后一天',
                '2012-01-25': '春节后二天',
                '2012-01-26': '春节后三天',
                '2012-04-01': '清明节前三天',
                '2012-04-02': '清明节前二天',
                '2012-04-03': '清明节前一天',
                '2012-04-04': '清明节',
                '2012-04-05': '清明节后一天',
                '2012-04-06': '清明节后二天',
                '2012-04-07': '清明节后三天',
                '2012-04-28': '劳动节前三天',
                '2012-04-29': '劳动节前二天',
                '2012-04-30': '劳动节前一天',
                '2012-05-01': '劳动节',
                '2012-05-02': '劳动节后一天',
                '2012-05-03': '劳动节后二天',
                '2012-05-04': '劳动节后三天',
                '2012-06-20': '端午节前三天',
                '2012-06-21': '端午节前二天',
                '2012-06-22': '端午节前一天',
                '2012-06-23': '端午节',
                '2012-06-24': '端午节后一天',
                '2012-06-25': '端午节后二天',
                '2012-06-26': '端午节后三天',
                '2012-09-27': '中秋节前三天',
                '2012-09-28': '中秋节前二天',
                '2012-09-29': '中秋节前一天',
                '2012-09-30': '中秋节',
                '2012-10-01': '国庆节',
                '2012-10-02': '国庆节后一天',
                '2012-10-03': '国庆节后二天',
                '2012-10-04': '国庆节后三天',
                '2012-12-29': '元旦前三天',
                '2012-12-30': '元旦前二天',
                '2012-12-31': '元旦前一天',
                '2013-01-01': '元旦',
                '2013-01-02': '元旦后一天',
                '2013-01-03': '元旦后二天',
                '2013-01-04': '元旦后三天',
                '2013-02-06': '除夕前三天',
                '2013-02-07': '除夕前二天',
                '2013-02-08': '除夕前一天',
                '2013-02-09': '除夕',
                '2013-02-10': '春节',
                '2013-02-11': '春节后一天',
                '2013-02-12': '春节后二天',
                '2013-02-13': '春节后三天',
                '2013-04-01': '清明节前三天',
                '2013-04-02': '清明节前二天',
                '2013-04-03': '清明节前一天',
                '2013-04-04': '清明节',
                '2013-04-05': '清明节后一天',
                '2013-04-06': '清明节后二天',
                '2013-04-07': '清明节后三天',
                '2013-04-28': '劳动节前三天',
                '2013-04-29': '劳动节前二天',
                '2013-04-30': '劳动节前一天',
                '2013-05-01': '劳动节',
                '2013-05-02': '劳动节后一天',
                '2013-05-03': '劳动节后二天',
                '2013-05-04': '劳动节后三天',
                '2013-06-09': '端午节前三天',
                '2013-06-10': '端午节前二天',
                '2013-06-11': '端午节前一天',
                '2013-06-12': '端午节',
                '2013-06-13': '端午节后一天',
                '2013-06-14': '端午节后二天',
                '2013-06-15': '端午节后三天',
                '2013-09-16': '中秋节前三天',
                '2013-09-17': '中秋节前二天',
                '2013-09-18': '中秋节前一天',
                '2013-09-19': '中秋节',
                '2013-09-20': '中秋节后一天',
                '2013-09-21': '中秋节后二天',
                '2013-09-22': '中秋节后三天',
                '2013-09-28': '国庆节前三天',
                '2013-09-29': '国庆节前二天',
                '2013-09-30': '国庆节前一天',
                '2013-10-01': '国庆节',
                '2013-10-01': '国庆节后一天',
                '2013-10-01': '国庆节后二天',
                '2013-10-01': '国庆节后三天',
                '2014-01-01': '元旦',
                '2014-01-30': '除夕',
                '2014-01-31': '春节',
                '2014-04-05': '清明节',
                '2014-05-01': '劳动节',
                '2014-06-02': '端午节',
                '2014-09-08': '中秋节',
                '2014-10-01': '国庆节',
                '2015-01-01': '元旦',
                '2015-02-18': '除夕',
                '2015-02-19': '春节',
                '2015-04-05': '清明节',
                '2015-05-01': '劳动节',
                '2015-06-20': '端午节',
                '2015-09-27': '中秋节',
                '2015-10-01': '国庆节',
                '2016-01-01': '元旦',
                '2016-02-07': '除夕',
                '2016-02-08': '春节',
                '2016-04-04': '清明节',
                '2016-05-01': '劳动节',
                '2016-06-09': '端午节',
                '2016-09-15': '中秋节',
                '2016-10-01': '国庆节',
                '2017-01-01': '元旦',
                '2017-01-27': '除夕',
                '2017-01-28': '春节',

                '2017-04-04': '清明节',
                '2017-05-01': '劳动节',
                '2017-05-30': '端午节',
                '2017-10-04': '中秋节',
                '2017-10-01': '国庆节',
                '2018-01-01': '元旦',
                '2018-02-15': '除夕',
                '2018-02-16': '春节',
                '2018-04-05': '清明节',
                '2018-05-01': '劳动节',
                '2018-06-18': '端午节',
                '2018-09-24': '中秋节',
                '2018-10-01': '国庆节',
                '2019-01-01': '元旦',
                '2019-02-04': '除夕',
                '2019-02-05': '春节',
                '2019-04-05': '清明节',
                '2019-05-01': '劳动节',
                '2019-06-07': '端午节',
                '2019-09-13': '中秋节',
                '2019-10-01': '国庆节',
                '2020-01-01': '元旦',
                '2020-01-24': '除夕',
                '2020-01-25': '春节',
                '2020-04-04': '清明节',
                '2020-05-01': '劳动节',
                '2020-06-25': '端午节',
                '2020-09-28': '国庆节前三天',
                '2020-09-29': '国庆节前两天',
                '2020-09-30': '国庆节前一天',
                '2020-10-01': '国庆节',
                '2020-10-02': '国庆节后一天',
                '2020-10-03': '国庆节后两天',
                '2020-10-04': '国庆节后三天'
            };

            nowDate = nowDate ? nowDate: inputNode.get("value");

            if (t.get("isFestival")) {
                var nowDateObj = t.formatDate(nowDate);
                if (nowDate && nowDateObj) {
                    dayInfo = config.weekStr[nowDateObj.getDay()] ? config.weekStr[nowDateObj.getDay()] : "";
                }
                if (nowDateObj) {
                    var disDays = (nowDateObj.getTime() - config.today.getTime()) / config.time + 1;
                    switch (disDays) {
                        case 1:
                            dayInfo = "今天";
                        break;
                        case 2:
                            dayInfo = "明天";
                        break;
                        case 3:
                            dayInfo = "后天";
                        break;
                    }

                }
                if (oHoliday[nowDate]) {
                    dayInfo = oHoliday[nowDate];
                }

            }
            // inputNode.get('parentNode').one("span").set("innerHTML", dayInfo);
        },

        ieTimeout: function() {
            var t = this;
            setTimeout(function() {
                t.hideCalendar = false;
            },
            1);

        },

        /**
        * @name Y.TripCalendar#gerDoubleNum
        * @function
        * @param ｛Int}［num］数字
        * @return {Int}
        * @description 获取双数
        */
        gerDoubleNum: function(num) {
            if (num.length < 2) {
                return "0" + num;
            }
            return num;
        },

        /**
        * @name Y.TripCalendar#formatDate
        * @function
        * @param ｛String｝［dateStr］将字符串转化为date
        * @return {obj}
        * @description 时间信息
        */
        formatDate: function(dateStr) {
            if (typeof dateStr == "object") {
                return new Date(dateStr.getFullYear(), dateStr.getMonth(), dateStr.getDate());
            }
            var date = dateStr.match(config.dataExp);
            if (dateStr && date) {
                return new Date(date[1], date[2] - 1, date[3]);
            }
            return null;
        },
        showMessage: function(message, input) {
            var oCal = this.calendarNode,
            that = this;
            input._node.focus();
            oCal.prepend('<div class="message-tips"><p>' + message + '</p></div>');
            oCal.one('.calendar-main').setStyle('paddingTop', oCal.one('.message-tips').get('offsetHeight') + 20);
            oCal.one('.J_close').setStyle("top", oCal.one(".message-tips").get("offsetHeight") + 8);
            oCal.setStyle('zoom', 1);
            this.calendarNode.addClass('anim-shake');
            setTimeout(function() {
                that.calendarNode.removeClass('anim-shake');
            },
            100);
        }
    });
},
'1.0', {
    requires: ["widget", "calendar"]
});

/**
* box.js | cubee 弹出框控件
* @class Y.Box
* @param { object } 配置项
* @return { object } 生成一个box实例
* @requires { 'node','event','overlay','dd-plugin' }
* @requires { box-skin-default或者box-skin-sea } 皮肤
*
* Y.Box：
*	说明：	窗口构造器，通过new Y.Box来render一个box，可以使用Y.Box定制自己的alert、comfirm、prompt等等
*	使用：	new Y.Box(options);
*	配置：	head:{string} box头部
*			body:{string} box主题部分
*			foot:{string} box尾部
*			fixed:{boolean} true,box不会随着窗口滚动而滚动，false，box会随着窗口滚动而滚动，默认为true（ie6下始终会跟随页面滚动而滚动）
*			afterDrag:{function} 拖拽结束的回调，参数为box本身
*			draggable:{boolean} 是否可拖拽,默认为true
*			resizeable:{boolean} 是否可resize，默认为false
*			afterResize:{function} resize结束的回调，参数为box，（未实现）
*			shownImmediately:{boolean} 是否初始化完成立即显示，默认为true
*			afterHide:{function} 隐藏完毕后的回调，参数为box
*			afterShow:{function} 显示完成后的回调，参数为box
*			onload:{function} 初始化完成后的回调，在render后立即执行，参数为box
*			modal:{boolean} 是否带阴影，默认为false，阴影的动画效果未实现
*			beforeUnload:{function} 窗口关闭之前的回调,参数为box
*			afterUnload:{function} 窗口关闭之后的回调,参数为box
*			antijam:{boolean} 是否隐藏media干扰物，默认为false
*			maskOpacity:{float} 设定遮盖层的透明度，范围是[0,1]，默认为0.6，当modal为true时才起作用
*		Y.Box的实例的方法：
*			init:初始化，参数为options
*			bringToTop:将box的z-index调到所有box之上
*			render:渲染，init在new的时候调用，render可以在运行时任意时刻调用，参数为options，其成员可覆盖原参数
*			close:关闭，并将窗口删除
*			hide:隐藏，不会删除窗口
*			show:显示窗口
*			buildParam:构造配置项，在init的时候调用
*			parseParam:重置配置项，在render的时候调用
*			addMask:添加遮罩
*			removeMask:删除遮罩
*			hideMedias:隐藏media干扰物
*			showMedias:解除media干扰物隐藏
*
*/
YUI.namespace('Y.Box');
YUI.add('trip-box', function(Y) {

    /*
    兼容老版本的yui
    */

    if (typeof Y.Node.prototype.queryAll == 'undefined') {
        Y.Node.prototype.queryAll = Y.Node.prototype.all;
        Y.Node.prototype.query = Y.Node.prototype.one;
        Y.Node.get = Y.Node.one;
        Y.get = Y.one;
    }

    /**
    * Y.Box构造器
    * @class Y.Box
    */
    Y.Box = function() {
        this.init.apply(this, arguments);
    };
    /**
    * 全局的overlays存储
    * @static { Array }
    */
    Y.Box.overlays = [];

    Y.Box.prototype = {
        /**
        * 初始化
        * @memberof Y.Box
        * @param { object } 配置项
        * @return this
        */
        init: function(opt) {
            var that = this;
            that.buildParam(opt);

            that.overlay = new Y.Overlay({
                contentBox: "myContent",
                height: that.height,
                width: that.width,
                zIndex: 1000,
                visible: false,
                shim: true,
                centered: true,
                align: that.align,
                headerContent: that.head,
                bodyContent: that.body,
                footerContent: that.foot
            });

            Y.Box.overlays.push(that.overlay);
            //处理zindex
            that.bringToTop();
            that.overlay._posNode.on('focus', function(e) {
                //e.target.blur();
            });
            that.overlay._posNode.on('mousedown', function(e) {
                var widget = Y.Widget.getByNode(e.target);
                if (widget && widget instanceof Y.Overlay) {
                    that.bringToTop();
                    Y.log('bringToTop()');
                }
                Y.Box._xy = widget._posNode.getXY();
            });
            //处理afterdrag
            that.overlay._posNode.on('mouseup', function(e) {
                var widget = Y.Widget.getByNode(e.target);
                if (widget && widget instanceof Y.Overlay) {
                    var _xy = widget._posNode.getXY();
                    if (_xy[0] != Y.Box._xy[0] || _xy[1] != Y.Box._xy[1]) {
                        that.afterDrag(widget);
                        Y.log('拖拽结束')
                    }
                }
            });

            if (that.resizeable) {
                that.resize = new Y.Resize({
                    node: that.overlay._posNode
                });
            }

            return this;
        },
        /**
        * 处理层级关系
        * @memberof Y.Box
        * @return this
        */
        bringToTop: function() {
            var that = this;
            if (Y.Box.overlays.length == 1) {
                return undefined;
            }
            var topIndex = 0;
            for (var i = 0; i < Y.Box.overlays.length; i++) {
                var t = Number(Y.Box.overlays[i].get('zIndex'));
                if (t > topIndex) topIndex = t;
            }
            that.overlay.set('zIndex', topIndex + 1);
            return this;
        },
        /**
        * 渲染弹层
        * @memberof Y.Box
        * @param { object }配置项
        * @return this
        */
        render: function(opt) {
            var that = this;
            that.parseParam(opt);
            that.overlay.render("#overlay-align");
            var __x = that.overlay.get('x');
            var __y = that.overlay.get('y');
            if (that.height == 'auto' || that.width == 'auto') {
                var _R = that.overlay._posNode.get('region');
                if (that.height == 'auto') {
                    __y -= Number(_R.height / 2);
                }
                if (that.width == 'auto') {
                    if (Y.UA.ie < 7 && Y.UA.ie > 0) { //hack for ie6 when width was auto
                        //that.overlay._posNode.query('div.yui3-widget-bd').setStyle('width','100%');
                        that.overlay.set('width', that.overlay._posNode.query('div.yui3-widget-bd').get('region').width);
                    }
                    if (Y.UA.ie >= 7) { //hack for ie7 when width was auto
                        that.overlay._posNode.query('div.yui3-widget-bd').setStyle('width', '100%');
                        that.overlay.set('width', that.overlay._posNode.query('div.yui3-widget-bd').get('region').width);
                    }
                    __x -= Number(that.overlay._posNode.get('region').width / 2);
                }
                that.overlay.move([__x, __y < 0 ? 0: __y]);
            }
            if (that.shownImmediately) that.overlay.set('visible', true);
            if (that.fixed) {
                //ie6始终是absolute
                if (/6/i.test(Y.UA.ie)) {
                    that.overlay._posNode.setStyle('position', 'absolute');
                } else {
                    //若fixed则需要减去滚动条的top
                    __y -= Y.get('docscrollY').get('scrollTop');
                    __x -= Y.get('docscrollX').get('scrollLeft');
                    that.overlay.move([__x, __y < 0 ? 0: __y]);
                    that.overlay._posNode.setStyle('position', 'fixed');
                }
            }
            if (that.x) that.overlay.set('x', Number(that.x));
            if (that.y) that.overlay.set('y', Number(that.y) < 0 ? 0: Number(that.y));
            if (that.draggable) {
                that.overlay.headerNode.setStyle('cursor', 'move');
                if (!that.overlay._posNode.dd) {
                    that.overlay._posNode.plug(Y.Plugin.Drag);
                    that.overlay._posNode.dd.addHandle('.yui3-widget-hd');
                }
            }
            that.onload(that);
            //Y.log('load()');
            if (that.modal) {
                that.addMask();
            }
            if (that.antijam) {
                that.hideMedias();
            }
            if (that.resizeable) {
                try {
                    var _hd = that.overlay._posNode.query('.yui3-widget-hd');
                    var _bd = that.overlay._posNode.query('.yui3-widget-bd');
                    var _ft = that.overlay._posNode.query('.yui3-widget-ft');
                    that.resize.on('resize:resize', function(e) {
                        var o_height = that.overlay._posNode.get('region').height;
                        var h_height = _hd.get('region').height;
                        var f_height = _ft.get('region').height;
                        var b_height = o_height - h_height - f_height - 20 - 2; //减去body的上下内边距,减去边界
                        _bd.setStyle('height', b_height + 'px');
                    });
                } catch(e) {}
            }
            return this;
        },
        /**
        * 删除数组项，应当在base中
        * @memberof Y.Box
        * @param { value }值
        * @param { array }数组
        * @return this
        */
        removeArray: function(v, a) {
            for (var i = 0, m = a.length; i < m; i++) {
                if (a[i] == v) {
                    a.splice(i, 1);
                    break;
                }
            }
        },
        /**
        * 关闭弹层
        * @method Y.Box.close
        * @memberof Y.Box
        * @return this
        */
        close: function() {
            var that = this;
            that.beforeUnload(that);
            that.overlay.hide();
            that.showMedias();
            that.removeArray(that.overlay, Y.Box.overlays);
            that.overlay._posNode.remove();
            that.removeMask();
            that.afterUnload(that);
            that = null;
            Y.log('close()');
            return this;
        },
        /**
        * 隐藏弹层
        * @method Y.Box.hide
        * @memberof Y.Box
        * @return this
        */
        hide: function() {
            var that = this;
            that.overlay.hide();
            that.showMedias();
            that.afterHide(that);
            return this;
        },
        /**
        * 显示弹层
        * @method Y.Box.show
        * @memberof Y.Box
        * @return this
        */
        show: function() {
            var that = this;
            that.overlay.show();
            that.hideMedias();
            that.afterShow(that);
            return this;
        },
        /**
        * 构造参数列表
        * @method Y.Box.buildParam
        * @memberof Y.Box
        * @return this
        */
        buildParam: function(o) {
            var o = o || {};
            this.head = (typeof o.head == 'undefined' || o.head == null) ? '': o.head;
            this.body = (typeof o.body == 'undefined' || o.body == null) ? '': o.body;
            this.foot = (typeof o.foot == 'undefined' || o.foot == null) ? '': o.foot;
            //this.anim = (typeof o.anim == 'undefined'||o.anim == null)?true:o.anim;
            this.skin = (typeof o.skin == 'undefined' || o.skin == null) ? 'default': o.skin;
            this.draggable = (typeof o.draggable == 'undefined' || o.draggable == null) ? true: o.draggable;
            this.fixed = (typeof o.fixed == 'undefined' || o.fixed == null) ? true: o.fixed;
            this.shownImmediately = (typeof o.shownImmediately == 'undefined' || o.shownImmediately == null) ? true: o.shownImmediately;
            this.modal = (typeof o.modal == 'undefined' || o.modal == null) ? false: o.modal;
            this.maskOpacity = (typeof o.maskOpacity == 'undefined' || o.maskOpacity == null) ? 0.6: o.maskOpacity;
            this.x = (typeof o.x == 'undefined' || o.x == null) ? false: o.x;
            this.y = (typeof o.y == 'undefined' || o.y == null) ? false: o.y;
            this.align = o.align || null;
            this.width = (typeof o.width == 'undefined' || o.width == null) ? '300px': o.width;
            this.height = (typeof o.height == 'undefined' || o.height == null) ? 'auto': o.height;
            this.clickToFront = (typeof o.clickToFront == 'undefined' || o.clickToFront == null) ? '': o.clickToFront;
            this.behaviours = (typeof o.behaviours == 'undefined' || o.behaviours == null) ? '': o.behaviours;
            this.afterHide = (typeof o.afterHide == 'undefined' || o.afterHide == null) ? new Function: o.afterHide;
            this.afterDrag = (typeof o.afterDrag == 'undefined' || o.afterDrag == null) ? new Function: o.afterDrag;
            this.afterShow = (typeof o.afterShow == 'undefined' || o.afterShow == null) ? new Function: o.afterShow;
            this.beforeUnload = (typeof o.beforeUnload == 'undefined' || o.beforeUnload == null) ? new Function: o.beforeUnload;
            this.afterUnload = (typeof o.afterUnload == 'undefined' || o.afterUnload == null) ? new Function: o.afterUnload;
            this.onload = (typeof o.onload == 'undefined' || o.onload == null) ? new Function: o.onload; //load ok后的回调,参数为box
            this.duration = (typeof o.duration == 'undefined' || o.duration == null) ? 0.3: o.duration;
            this.antijam = (typeof o.antijam == 'undefined' || o.antijam == null) ? false: o.antijam; //是否隐藏干扰因素
            this.resizeable = (typeof o.resizeable == 'undefined' || o.resizeable == null) ? false: o.resizeable; //是否隐藏干扰因素
            return this;
        },
        /**
        * 重设参数
        * @method Y.Box.parseParam
        * @memberof Y.Box
        * @return this
        */
        parseParam: function(opt) {
            var opt = opt || {};
            for (var i in opt) {
                this[i] = opt[i];
            }
            return this;
        },
        /**
        * 隐藏干扰因素
        * @method Y.Box.hideMedias
        * @memberof Y.Box
        * @return this
        */
        hideMedias: function() {
            var that = this;
            if (that.antijam == false) return this;
            that.hiddenMedia = [];
            var obj_array = document.body.getElementsByTagName('object');
            for (var i = 0, m = obj_array.length; i < m; i++) {
                if (obj_array[i].type.indexOf("x-oleobject") > 0) {
                    that.hiddenMedia.push(obj_array[i]);
                    obj_array[i].style.visibility = 'hidden';
                }
            }
            return this;
        },
        /**
        * 关闭后的解除隐藏
        * @method Y.Box.showMedias
        * @memberof Y.Box
        * @return this
        */
        showMedias: function() {
            var that = this;
            if (that.antijam == false) return this;
            if (that.hiddenMedia.length > 0) {
                for (var i = 0, m = that.hiddenMedia.length; i < m; i++) {
                    that.hiddenMedia[i].style.visibility = 'visible';
                }
                that.hiddenMedia = new Array();
            }
            return this;
        },
        /**
        * 添加遮罩
        * @method Y.Box.addMask
        * @memberof Y.Box
        * @return this
        */
        addMask: function() {
            var that = this;
            if (Y.one('#t-shade-tmp')) return this;
            var node = Y.Node.create('<div id="t-shade-tmp" style="display: block; z-index: 999;background-color:black;left:0;position:absolute;top:0;width:100%;display:none"></div>');
            node.setStyle('opacity', that.maskOpacity.toString());
            node.setStyle('height', Y.one('body').get('docHeight') + 'px');
            Y.one("html").setStyle('overflow', 'hidden');
            Y.one('body').append(node);
            node.setStyle('display', 'block');
            return this;
        },
        /**
        * 删除遮罩
        * @method Y.Box.removeMask
        * @memberof Y.Box
        * @return this
        */
        removeMask: function() {
            var that = this;
            if (Y.Box.overlays.length == 0 && Y.one('#t-shade-tmp')) {
                Y.one('#t-shade-tmp').remove();
                Y.one("html").setStyle('overflow', '');
            }
            return this;
        }
    }; //box prototype end
    /**
    * Y.Box.alert提示框
    * @method Y.Box.alert
    *	Y.Box.alert：
    *		说明：	alert弹出框，基于Y.Box的一种定制
    *		使用：	Y.Box.alert(msg,callback,options)
    *		参数：	msg:{string} 消息体
    *				callback:{function} 点击确定的回调，参数为box，默认点击确定会关闭窗口
    *				options:{
    *					title:{string} 标题
    *					closeable:{boolean} 是否有关闭按钮，默认为true
    *					closeText:{string} 可以自定义按钮
    *					btnText:{string} 确定按钮的文案
    *					（其他字段同Y.Box的options）
    *				}
    */
    Y.Box.alert = function(msg, callback, opt) {
        if (typeof msg == 'undefined' || msg == null) var msg = '';
        if (typeof callback == 'undefined' || callback == null) var callback = new Function;
        if (typeof opt == 'undefined' || opt == null) var opt = {};
        var title = (typeof opt.title == 'undefined' || opt.title == null) ? '提示': opt.title;

        var closeable = (typeof opt.closeable == 'undefined' || opt.closeable == null) ? true: opt.closeable;
        var closeText = (typeof opt.closeText == 'undefined' || opt.closeText == null) ? '<img src="http://img04.taobaocdn.com/tps/i4/T1m6tpXfxBXXXXXXXX-14-14.gif" border=0>': opt.closeText;
        var btnText = (typeof opt.btnText == 'undefined' || opt.btnText == null) ? '确定': opt.btnText;

        var closestr = closeable ? '<a class="close closebtn">' + closeText + '</a>': '';
        var headstr = '<span class="title">' + title + '</span>' + closestr;
        opt.head = headstr;
        opt.body = msg;
        opt.foot = '<div align=right><button class="okbtn">' + btnText + '</div>';
        opt._onload = opt.onload || new Function;
        opt.onload = function(box) {
            var node = box.overlay._posNode;
            node.query('.okbtn').on('click', function(e) {
                e.halt();
                callback(box);
                box.close();
            });
            try {
                node.query('.closebtn').setStyle('cursor', 'pointer');
                node.query('.closebtn').on('click', function(e) {
                    e.halt();
                    box.close();
                });
            } catch(e) {}
            opt._onload(box);
        };

        var box = new Y.Box(opt);
        return box.render();
    };

    /**
    * Y.Box.confirm
    * @method Y.Box.confirm
    *
    *	Y.Box.confirm：
    *		说明：	comfirm弹出框，基于Y.Box的一种定制
    *		使用：	Y.Box.confirm(msg,callback,options)
    *		参数：	msg:{string} 消息体
    *				callback:{function} 点击确定的回调，参数为box，默认点击确定会关闭窗口
    *				options:{
    *					title:{string} 标题
    *					yes:{function} 点击是的回调，参数为box，默认点击会关闭，此项会覆盖callback
    *					no:{function} 点击否的回调，参数为box
    *					yesText:{string} 按钮“是”的文案
    *					noText:{string} 按钮"否"的文案
    *					cancleBtn:{boolean} 是否显示"关闭"按钮，默认为true
    *					cancleText:{string} 按钮“取消”的文案
    *					（其他字段同Y.Box的options）
    *				}
    */
    Y.Box.confirm = function(msg, callback, opt) {
        if (typeof msg == 'undefined' || msg == null) var msg = '';
        if (typeof callback == 'undefined' || callback == null) var callback = new Function;
        if (typeof opt == 'undefined' || opt == null) var opt = {};
        var title = (typeof opt.title == 'undefined' || opt.title == null) ? '提示': opt.title;

        var closeable = (typeof opt.closeable == 'undefined' || opt.closeable == null) ? true: opt.closeable;
        var closeText = (typeof opt.closeText == 'undefined' || opt.closeText == null) ? '<img src="http://img04.taobaocdn.com/tps/i4/T1m6tpXfxBXXXXXXXX-14-14.gif" border=0>': opt.closeText;
        opt.yes = (typeof opt.yes == 'undefined' || opt.yes == null) ? callback: opt.yes;
        opt.no = (typeof opt.no == 'undefined' || opt.no == null) ? new Function: opt.no;
        var yesText = (typeof opt.yesText == 'undefined' || opt.yesText == null) ? '确定': opt.yesText;
        var noText = (typeof opt.noText == 'undefined' || opt.noText == null) ? '取消': opt.noText;
        var cancleBtn = (typeof opt.cancleBtn == 'undefined' || opt.cancleBtn == null) ? false: opt.cancleBtn;
        var cancleText = (typeof opt.cancleText == 'undefined' || opt.cancleText == null) ? '关闭': opt.cancleText;

        var canclestr = cancleBtn ? '<button class="canclebtn">' + cancleText + '</button>': '';
        var closestr = closeable ? '<a class="close closebtn">' + closeText + '</a>': '';
        var headstr = '<span class="title">' + title + '</span>' + closestr;
        opt.head = headstr;
        opt.body = msg;
        opt.foot = '<div align=right><button class="yesbtn">' + yesText + '</button>&nbsp;<button class="nobtn">' + noText + '</button>&nbsp;' + canclestr + '</div>';
        opt._onload = opt.onload || new Function;
        opt.onload = function(box) {
            var node = box.overlay._posNode;
            node.query('.yesbtn').on('click', function(e) {
                e.halt();
                opt.yes(box);
                box.close();
            });
            node.query('.nobtn').on('click', function(e) {
                e.halt();
                opt.no(box);
                box.close();
            });
            if (cancleBtn) {
                node.query('.canclebtn').on('click', function(e) {
                    e.halt();
                    box.close();
                });
            }
            try {
                node.query('.closebtn').setStyle('cursor', 'pointer');
                node.query('.closebtn').on('click', function(e) {
                    e.halt();
                    box.close();
                });
            } catch(e) {}
            opt._onload(box);
        };

        var box = new Y.Box(opt);
        return box.render();

    };

},
'0.1', {
    requires: ['node-base', 'event-base', 'overlay', 'dd-plugin']
});


/**
* @fileOverview 表单功能模块 包含功能 1.搜索表单验证 2.默认填入用户当前城市（依赖开发的COOKIES） 3.用户搜索历史记录和回填 4.城市切换
* @author shuke.cl
* version 1.0
* @requires ［"widget",  "calendar"］
*/
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};
YUI.add('trip-search-form', function(Y) {
    var isSupportPlaceholder = Y.Modernizr.input.placeholder,
    Array = Y.Array,
    Cookie = Y.Cookie;
    var dateReg = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/;

    var SearchForm = Y.Base.create('searchForm', Y.Base, [], {
        allSubmit: true,
        initializer: function() {
            this.form = this.get('node');
            this.radioNodes = this.form.all('.J_type_radio');
            this.inputNodes = this.form.all('.J_TripCityInput ,.J_DateInput');
            this._syncUI();
            this._bindUI();
        },
        _syncUI: function() {
            this.setDefaultValue();
        },
        _bindUI: function() {
            var _form = this.form,
            tradeBtn = _form.one('.search-trade'),
            SELF = this;
            _form.on('submit', this.doSubmit, this);
            _form.delegate('click', this.setFlightType, '.J_type_radio', this);
            if (tradeBtn) {
                tradeBtn.on('click', this._trade, this);
            }

            //选择返程时间，自动重置航程类型为往返
            var backNode = this.form.one('.search-backitem'),
            radioNodes = this.radioNodes,
            backDateInput = null;
            var doCheckFlightType = function() {
                if (radioNodes.size() < 1) {
                    return false;
                }
                radioNodes.item(1).set('checked', true);
                SELF.setFlightType();
            };
            if (backNode) {
                backDateInput = backNode.one('.J_endDate');
                backDateInput && backDateInput.on('keyup', this.checkOneWay, this);
            }
            /*
            当INPUT有data-autotab属性时，绑定自动切换事件
            */
            this.inputNodes.each(function(item) {
                var curAc, curCal;
                if (item.hasClass('J_TripCityInput') && item.hasAttribute('data-autotab')) { //自动完成组件自动切换
                    curAc = TG.SearchForm['#' + item.get('id')];
                    curAc && curAc.on('select', function() {
                        var el = Y.one('#' + item.getAttribute('data-autotab'));
                        setTimeout(function() {
                            el && el.focus();
                        },
                        200);
                    })
                } else if (item.hasClass('J_DateInput')) {
                    curCal = TG.SearchForm['#' + item.get('id')];
                    curCal && curCal.on('select', function(e) {
                        if (item.hasAttribute('data-autotab')) {
                            var el = Y.one('#' + item.getAttribute('data-autotab'));
                            if (!e.inputNode.hasClass('J_endDate') && el && el.hasClass('required')) {
                                setTimeout(function() {
                                    el.focus();
                                },
                                200);
                            }
                        }
                        //如果SELECT事件被返程日历选框触发
                        if (e.inputNode.hasClass('J_endDate')) {
                            doCheckFlightType();
                        }

                    });
                }
            });
        },
        /**
        * 用户删除返程时间内的值时，自动切换为单程
        */
        checkOneWay: function(e) {
            var target = e.currentTarget;
            if (e.keyCode == 8 && target.get('value') == '') {
                this.radioNodes.item(0).set('checked', true);
                this.setFlightType();
            }
        },
        /**
        * 表单提交验证
        * @param e
        */
        doSubmit: function(e) {
            e.halt(); //阻止提交
            if (this._validateForm()) {
                if (this.get('storage')) { //存储用户搜索结果
                    this._storageForm();
                }
                //恶心的国际搜索：当选择航程类型为单程时，仍必须传入返程时间字段，值为yyyy-mm-dd
                var ieBackInput = this.form.one('.J_ieEndDate'),
                flightType = this.getTypeValue();
                if (ieBackInput && flightType == '0') {
                    //ieBackInput.set('disabled' , false);
                    ieBackInput.set('value', 'yyyy-mm-dd');
                }
                if (typeof this.get('afterValidate') === 'function') { //回调
                    this.get('afterValidate')(this.form);
                } else {
                    this.form.submit();
                }
                setTimeout(function() {
                    if (ieBackInput && flightType == '0') {
                        ieBackInput.set('value', '');
                    }
                },
                100);
            }
        },
        /**
        * 验证表单
        * @type function
        */
        _validateForm: function() {
            var _form = this.form,
            SELF = this,
            bDate, eDate, bDateDesc, formType = 'flight',
            nowTime;
            var inputNodes = _form.all('input'),
            requiresNodes = [],
            dateFormatNodes = [],
            cityNodes = [];
            var bindWidget = null,
            curNode, AC, msgStr;
            /*
            //返程时间为空，则自动切换为单程
            var endDateInput =_form.one('.J_endDate') ;
            if (endDateInput && _form.one('.J_type_radio')) {
            if (endDateInput.get('value')=='') {
            this.radioNodes.each(function (item){
            if (item.get('value') == '0') {
            item.set('checked' , true) ;
            }
            });
            this.setFlightType();
            }
            }
            */
            inputNodes.each(function(item, index) {
                if (item.hasClass('required')) { //必填项检查
                    if (!SELF._requiredItemCheck(item)) {
                        requiresNodes.push(item);
                        return false;
                    }
                }
                var nodeVal = item.get('value');
                if (item.hasClass('dateformat')) { //日期格式必须正确
                    if (!dateReg.test(nodeVal)) {
                        dateFormatNodes.push(item);
                        return false;
                    }
                }
                else if ((item.hasClass('J_TripCityInput'))) {
                    cityNodes.push(item);
                }
            });
            if (requiresNodes.length > 0) {
                curNode = requiresNodes[0];
                curNode.select();
                bindWidget = TG.SearchForm['#' + requiresNodes[0].get('id')];
                if (bindWidget && curNode.hasAttribute('data-description')) { //需要显示错误信息
                    bindWidget.showMessage && bindWidget.showMessage('请选择' + curNode.getAttribute('data-description'), curNode);
                }
                return false;
            }
            if (dateFormatNodes.length > 0) {
                bindWidget = TG.SearchForm['#' + dateFormatNodes[0].get('id')];
                bindWidget && bindWidget.showMessage('日期格式为：yyyy-mm-dd', dateFormatNodes[0]);
                dateFormatNodes[0].select();
                return false;
            }
            /*验证返程时间不能早于出发时间*/
            bDate = _form.one('.J_depDate');
            eDate = _form.one('.J_endDate');
            if (eDate && bDate && eDate.hasAttribute('data-description') && bDate.hasAttribute('data-description')) {
                bDateDesc = bDate.getAttribute('data-description');
                msgStr = "不能早于";
                nowTime = new Date();
                if (bDateDesc.indexOf('入住') > - 1) {
                    msgStr = '不能早于/等于';
                    formType = 'hotel';
                }
                //出发日期不能早于今天
                if (this._toMs(bDate.get('value')) < new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate())) {
                    bindWidget = TG.SearchForm['#' + bDate.get('id')];
                    bindWidget && bindWidget.showMessage(bDate.getAttribute('data-description') + '不能早于今天，请重新选择', bDate);
                    return false;
                }
                //出发日期不能早于今天
                if ((formType == 'flight' && this._toMs(eDate.get('value')) < this._toMs(bDate.get('value'))) || (formType == 'hotel' && this._toMs(eDate.get('value')) <= this._toMs(bDate.get('value')))) {
                    bindWidget = TG.SearchForm['#' + eDate.get('id')];
                    Y.later(50, this, function() {
                        eDate.select();
                        bindWidget && bindWidget.showMessage(eDate.getAttribute('data-description') + msgStr + bDate.getAttribute('data-description') + '，请重新选择', eDate);
                    });
                    return false;
                }
            }

            //验证出发到达城市是否相同
            if (typeof cityNodes[1] != 'undefined') { //可能只有一个城市输入框
                cityNodes[1].get && (AC = TG.SearchForm['#' + cityNodes[1].get('id')]);
            }
            if (AC && cityNodes.length > 1 && cityNodes[0].get('value') == cityNodes[1].get('value') && cityNodes[0].hasClass('required') && cityNodes[1].hasClass('required')) {
                if (AC.showMessage) {
                    AC.inputNode.focus();
                    AC.showMessage('出发城市和到达城市不能相同，请重新输入');
                    return false;
                }
            }
            return true;
        },
        /*
        *将日期转化为毫秒
        */
        _toMs: function(date) {
            date = date.split('-');
            return new Date(date[0] / 1, date[1] / 1 - 1, date[2] / 1);
        },
        /**
        * 保存表单数据
        */
        _storageForm: function() {
            var inputNodes = this.form.all('input'),
            storageArr = [],
            itemStr = '';
            inputNodes.each(function(node, i) {
                var attr = node.getAttribute('type'),
                nodeValue = node.get('value');
                if (attr == 'text' || attr == 'hidden') { //文本框
                    if (nodeValue != '' && ! node.get('disabled')) {
                        itemStr = node.get('id') + ':' + nodeValue;
                        storageArr.push(itemStr);
                    }

                } else if (attr == 'radio') { //radio
                    if (node.get('checked')) {
                        itemStr = node.get('id') + ':' + nodeValue;
                        storageArr.push(itemStr);
                    }
                }
            });
            //保存到本地
            Y.StorageLite.setItem(this.form.get('id'), storageArr.join(','));
        },
        /**
        * 填充表单默认数据 1.用户当前所在城市 2.用户搜索历史记录
        */
        setDefaultValue: function() {
            var userCityInput = this.get('defaultCity'); //用户当前所在城市要填入的INPUT
            var userCity = '';
            if (userCityInput) {
                if (!this.get('storage') && Cookie.get('ect') && this.get('fillCurrentCity')) {
                    userCity = Cookie.get('ect').split('|')[1];
                    userCityInput.set('value', userCity);
                }
            }
            if (this.get('storage') && Y.StorageLite.getItem(this.form.get('id'))) { //搜索记录数据
                this.storageToInput(Y.StorageLite.getItem(this.form.get('id')));
            }
        },
        /**
        * 本地数据回填
        * @param node
        */
        storageToInput: function(data) {
            var SELF = this,
            isResetDate = false;
            data = data.split(',');
            Array.each(data, function(item, i) {
                var item = item.split(':');
                var node = Y.one('#' + item[0]),
                nodeValue = item[1],
                bindWidget;
                if (node) {
                    switch (node.getAttribute('type')) {
                        case 'text':
                            bindWidget = TG.SearchForm['#' + node.get('id')];
                        if (node.hasClass('J_DateInput')) { //输入框为日历时
                            if (node.hasClass('J_depDate')) { //出发日期
                                if (SELF.isResetDate(nodeValue)) { //如果日期早于今天则设置出发日期为明天
                                    nodeValue = SELF.getDate(1);
                                }
                            } else if (node.hasClass('J_endDate')) { //返程日期
                                if (SELF.isResetDate(nodeValue)) {
                                    nodeValue = SELF.getDate(3);
                                }
                            }
                        }
                        node.set('value', nodeValue);
                        if (node.hasClass('J_DateInput')) {
                            bindWidget && bindWidget.setDateInfo(false, node);
                        }
                        if (!isSupportPlaceholder) {
                            node.removeClass('trip-placeholder');
                        }
                        break;
                        case 'hidden':
                            node.set('value', nodeValue);
                        break;
                        case 'radio':
                            node.set('checked', true);
                        //往返输入框切换
                        SELF.setFlightType();
                        break;
                        default:
                            break;
                    }
                }
            });
        },
        /**
        * 日期检查,返回
        * @param aData 日期 ['2011-05-14','2011-06-14']
        * @return Array
        */
        isResetDate: function(date) {
            date = date.split('-');
            return new Date() > new Date(date[0], date[1] - 1, date[2]);
        },
        /*
        *获取指定日期的
        *@num_date 指定日期的前后天数 1为明天,2为后天,-1为昨天...
        */
        getDate: function(num_date) {
            function formatdate(str) {
                str += '';
                if (str.length == 1) {
                    return '0' + str;
                } else {
                    return str;
                }
            }
            num_date = num_date || 0;
            var _y, _m, _d;
            var _T = new Date();
            _T.setDate(_T.getDate() + num_date);
            _y = _T.getFullYear();
            _m = formatdate(_T.getMonth() + 1);
            _d = formatdate(_T.getDate());
            return [_y, _m, _d].join('-');
        },
        /**
        * 必填项检查
        *@parm node
        *@return boolean
        */
        _requiredItemCheck: function(node) {
            if (node.get('value') == '') {
                return false;
            } else {
                return true;
            }
        },
        /**
        * 出发到达城市互换
        */
        _trade: function() {
            var _form = this.form;
            tradeNodes = _form.all('input[data-trade]');
            var arr1 = [],
            arr2 = [];
            tradeNodes.each(function(item, i) {
                var _tradeNode = Y.one('#' + item.getAttribute('data-trade'));
                if (_tradeNode) {
                    arr1.push(item);
                    arr2.push(_tradeNode);
                }
            });
            this.tradeAction(arr1, arr2);
        },
        /**
        * 互换INPUT节点的VALUE
        * @param arr1 nodeArray
        * @param arr2	nodeArray
        */
        tradeAction: function(arr1, arr2) {
            var _tmp = "",
            _tmp2 = "";
            Array.each(arr1, function(item, i) {
                _tmp = item.get('value');
                _tmp2 = arr2[i].get('value');
                item.set('value', _tmp2);
                arr2[i].set('value', _tmp);
                if (!isSupportPlaceholder) {
                    if (_tmp2 == '') {
                        item.addClass('trip-placeholder');
                        item.set('value', item.getAttribute('placeholder'));
                    } else {
                        item.removeClass('trip-placeholder');
                    }
                    if (_tmp == '') {
                        arr2[i].addClass('trip-placeholder');
                        arr2[i].set('value', arr2[i].getAttribute('placeholder'));
                    } else {
                        arr2[i].removeClass('trip-placeholder');
                    }
                }
            });
        },
        /**
        * 单程往返类型切换
        */
        setFlightType: function() {
            var _type = this.getTypeValue(),
            backNode = this.form.one('.search-backitem'),
            backDateNode = backNode.one('input[type=text]');

            if (_type == '1') {
                backNode.removeClass('disabled');
                //backDateNode.set('disabled',false);
                backDateNode.addClass('required');
                backDateNode.addClass('dateformat');
            } else {
                backNode.addClass('disabled');
                backDateNode.removeClass('required');
                backDateNode.removeClass('dateformat');

                if (!Y.Modernizr.input.placeholder) {
                    backDateNode.set('value', backDateNode.getAttribute('placeholder'));
                    backDateNode.addClass('trip-placeholder');
                } else {
                    backDateNode.set('value', '');
                }
                //backDateNode.set('disabled' , true);
            }
        },
        /**
        * 获取往返radio值
        */
        getTypeValue: function() {
            var radioNodes = this.radioNodes;
            for (var i = 0; i < radioNodes.size(); i++) {
                if (radioNodes.item(i).get('checked')) {
                    return radioNodes.item(i).get('value');
                    break;
                }
            }
        }
    },
    {
        ATTRS: {
            node: {
                setter: Y.one
            },
            fillCurrentCity: {
                value: false
            },
            storage: {
                value: false
            },
            defaultCity: {
                value: '',
                setter: Y.one
            },
            afterValidate: {
                value: null
            }
        }
    });
    Y.SearchForm = SearchForm;
},'', {
    requires: ['node-base', 'event-base', 'cookie', 'base', 'trip-modernizr','gallery-storage-lite']
});


//tripmodernizer
YUI.namespace('Y.Modernizr');
YUI.add('trip-modernizr', function(Y) {
    /*!
    * Modernizr JavaScript library 1.2
    * http://modernizr.com/
    */
    Y.Modernizr = {
        input: {}
    };
    if ("placeholder" in document.createElement("input")) {
        Y.Modernizr.input.placeholder = true;
    } else {
        Y.Modernizr.input.placeholder = false;
    }
},
'', {
    requires: ['node-base']
});


YUI.add('fieldsetFormat', function(Y) {
    //todo fill fieldset with an object
    var output = {};

    Y.fieldsetFormat = function(type,settings){
        var type = type || 'get';
        var params={
            selector:'fieldset',
            item:'.group-item',
            items:'.group-items',
            data:''
        };

        params = Y.merge(params,arguments[1]);

        var data = params.data;
        var selector = (typeof params.selector=='string')?Y.all(params.selector):params.selector;
        var item = params.item;
        var items = params.items;
        var loop = function(nodeList,parent,pindex){
            var gobj = {};
            nodeList.each(function() {
                var name = this.getAttribute('name');
                var eleType = this.get('type');
                var isDisabled= this.get('disabled');

                if (name == '' ||  name=='__MYVIEWSTATE' || isDisabled){
                    return false;
                }

                var value = this.get('value');

                if (isDisabled || name == '' ||  name=='__MYVIEWSTATE'){
                    return false;
                }

                if ( (eleType == 'checkbox' || eleType == 'radio') && this.get('checked')==false ){
                    return false;
                }

                if(type=="get"){
                    gobj[name] = value;
                }

                if(type=="set"){
                    if(pindex!=undefined){
                        this.set('value',data[parent][pindex][name]);
                    }else{
                        this.set('value',data[parent][name]);
                    }
                }
            });

            return gobj;
        };

        // Y.NodeList.addMethod
        selector.each(function(i, index) {
            if(index==0 &&i.get('tagName')!='FIELDSET'){
                Y.log('only support fieldset element');
                return false;
            }
            if (i.getAttribute('name') == '') {
                return false;
            }
            if (this.all(item).size()>0) {
                if(this.all(items).size()>0){
                    var obj = loop(this.all('input,select,textarea').filter(':not('+items+' input)').filter(':not('+items+' select)').filter(':not('+items+' textarea)'));

                    this.all(items).each(function(vp){
                        var arr = [];
                        vp.all(item).each(function(v,pindex) {
                            if(v.hasClass('disabled')||v.get('disabled')) return false;
                            var vpobj = loop(v.all('input,select,textarea'),vp.getAttribute('rel'),pindex);
                            if(Y.Object.size(vpobj)){
                                arr.push(vpobj);
                            }

                        });

                        obj[vp.getAttribute('rel')] = arr;

                    });

                    output[i.getAttribute('name')] = obj;
                }else{
                    var arr = [];
                    this.all(item).each(function(v,pindex) {
                        var obj = loop(v.all('input,select,textarea'),i.get('name'),pindex);
                        arr.push(obj);
                    });

                    output[i.getAttribute('name')] = arr;
                }

            } else {
                var obj = loop(i.all('input,select,textarea'),i.get('name'));
                output[i.getAttribute('name')] = obj;
            }

        });
        return output;
    };

},
'',{
    requires:['node-base']
});


YUI.add('node-clone', function(Y) {

    Y.Node.addMethod('clone',function(){
        // var node = this.cloneNode(true);
        var node = Y.Node.getDOMNode(this);
        return jQuery(node).clone(true);
    });
    /*
    //todo

    var  DOM = {};
    DOM.query = function(){
        return Y.all(arguments[0])._nodes;
    };
    DOM.get = function(){
        return Y.one(arguments[0])._node;
    }
    DOM.data = function(){
        var alen = arguments.length;
        if(alen==1){
            return Y.one(arguments[0]).getData();
        }

        if(alen==2){
            return Y.one(arguments[0]).getData(arguments[1]);
        }

        if(alen==3){
            Y.one(arguments[0]).setData(arguments[1],arguments[2]);
        }
    };
    DOM.hasData = function(){
        return (Y.Object.size(Y.one(arguments[0]).getData())!=0);
    };

    var _Event= {};

    DD=DOM;

    _Event._removeData = function (elem) {
        // Y.log(arguments);
        var args = makeArray(arguments);
        args.splice(1, 0, EVENT_GUID);
        return DOM.removeData.apply(DOM, args);
    };

    _Event._clone = function (src, dest) {
        if (dest.nodeType !== DOM.ELEMENT_NODE ||
            !_data._hasData(src)) {
            return;
        }
        var eventDesc = _data._data(src),
        events = eventDesc.events;
        S.each(events, function (handlers, type) {
            S.each(handlers, function (handler) {
                // scope undefined 时不能写死在 handlers 中，否则不能保证 clone 时的 this
                Event.on(dest, type, {
                    fn:handler.fn,
                    scope:handler.scope,
                    data:handler.data,
                    originalType:handler.originalType,
                    selector:handler.selector
                });
            });
        });
    }

    var NodeType = {
        ATTRIBUTE_NODE: 2,
        CDATA_SECTION_NODE: 4,
        COMMENT_NODE: 8,
        DOCUMENT_FRAGMENT_NODE: 11,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        ELEMENT_NODE: 1,
        ENTITY_NODE: 6,
        ENTITY_REFERENCE_NODE: 5,
        NOTATION_NODE: 12,
        PROCESSING_INSTRUCTION_NODE: 7,
        TEXT_NODE: 3
    }

    function processAll(fn, elem, clone) {
        if (elem.nodeType == NodeType.DOCUMENT_FRAGMENT_NODE) {
            var eCs = elem.childNodes,
            cloneCs = clone.childNodes,
            fIndex = 0;

            while (eCs[fIndex]) {
                if (cloneCs[fIndex]) {
                    processAll(fn, eCs[fIndex], cloneCs[fIndex]);
                }
                fIndex++;
            }
        } else if (elem.nodeType == NodeType.ELEMENT_NODE) {
            var elemChildren = document.getElementsByTagName(elem),
            cloneChildren = document.getElementsByTagName(clone),
            cIndex = 0;
            while (elemChildren[cIndex]) {
                if (cloneChildren[cIndex]) {
                    fn(elemChildren[cIndex], cloneChildren[cIndex]);
                }
                cIndex++;
            }
        }
    }

    // 克隆除了事件的 data
    function cloneWithDataAndEvent(src, dest) {

        // Y.log(!DOM.hasData('body'));

        if (dest.nodeType == NodeType.ELEMENT_NODE && DOM.hasData(src)) {
            return;
        }

        var srcData = DOM.data(src);

        // 浅克隆，data 也放在克隆节点上
        for (var d in srcData) {
            DOM.data(dest, d, srcData[d]);
        }

        // 事件要特殊点
        if (_Event) {
            // remove event data (but without dom attached listener) which is copied from above DOM.data
            _Event._removeData(dest);
            // attach src's event data and dom attached listener to dest
            _Event._clone(src, dest);
        }
    }

    // wierd ie cloneNode fix from jq
    function fixAttributes(src, dest) {

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        if (dest.clearAttributes) {
            dest.clearAttributes();
        }

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        if (dest.mergeAttributes) {
            dest.mergeAttributes(src);
        }

        var nodeName = dest.nodeName.toLowerCase(),
        srcChilds = src.childNodes;

        // IE6-8 fail to clone children inside object elements that use
        // the proprietary classid attribute value (rather than the type
        // attribute) to identify the type of content to display
        if (nodeName === 'object' && !dest.childNodes.length) {
            for (var i = 0; i < srcChilds.length; i++) {
                dest.appendChild(srcChilds[i].cloneNode(true));
            }
            // dest.outerHTML = src.outerHTML;
        } else if (nodeName === 'input' && (src.type === 'checkbox' || src.type === 'radio')) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set
            if (src.checked) {
                dest['defaultChecked'] = dest.checked = src.checked;
            }

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of 'on'
            if (dest.value !== src.value) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if (nodeName === 'option') {
            dest.selected = src.defaultSelected;
            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if (nodeName === 'input' || nodeName === 'textarea') {
            dest.defaultValue = src.defaultValue;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        // 自定义 data 根据参数特殊处理，expando 只是个用于引用的属性
        dest.removeAttribute(DOM.__EXPANDO);
    }

    //source: https://github.com/aufula/kissy/blob/master/build/dom.js
    // todo nodelist
    // Y.NodeList.addMethod('clone',cloneFun);
    Y.Node.addMethod('clone',cloneFun);

    function cloneFun (selector, deep, withDataAndEvent, deepWithDataAndEvent) {
        var elem = DOM.get(selector);

        if (typeof deep === 'object') {
            deepWithDataAndEvent = deep['deepWithDataAndEvent'];
            withDataAndEvent = deep['withDataAndEvent'];
            deep = deep['deep'];
        }

        if (!elem) {
            return null;
        }

        // TODO
        // ie bug :
        // 1. ie<9 <script>xx</script> => <script></script>
        // 2. ie will execute external script
        var clone = elem.cloneNode(deep);

        if (elem.nodeType == NodeType.ELEMENT_NODE ||
            elem.nodeType == NodeType.DOCUMENT_FRAGMENT_NODE) {
            // IE copies events bound via attachEvent when using cloneNode.
            // Calling detachEvent on the clone will also remove the events
            // from the original. In order to get around this, we use some
            // proprietary methods to clear the events. Thanks to MooTools
            // guys for this hotness.
            if (elem.nodeType == NodeType.ELEMENT_NODE) {
                fixAttributes(elem, clone);
            }

            if (deep) {
                processAll(fixAttributes, elem, clone);
            }
        }
        // runtime 获得事件模块
        if (withDataAndEvent) {
            cloneWithDataAndEvent(elem, clone);
            if (deep && deepWithDataAndEvent) {
                processAll(cloneWithDataAndEvent, elem, clone);
            }
        }
        return clone;

    }

    */
},
'',{
    requires:['node-base']
});

/**
 * @fileOverview 旅行通用自动完成组件
 * @author shuke.cl
 * version 1.0
 * @requires ［"widget",  "autocomplete"］
 */
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};
YUI.namespace('Y.TripAutoComplete');
YUI.add('trip-autocomplete',function(Y){
	/*
	*默认设置
	 */
	var DEF_CONFIG = {
		resultTemplate :'<span class="ac-cityname">{cityName}</span><span class="ac-citypy">{py}</span>',
		resultFormatter : acFormatter ,
		requestTemplate : function(query){
			return query;
		},
		maxResults: 10,
		resultListLocator: 'result',
		resultTextLocator: 'cityName',
		activateFirstItem : true,
		width : 250,
		noResultMessage : '对不起，没有找到"<span class="highlight">{query}</span>"',
		hotWidth : 320,
		source: 'http://jipiao.trip.taobao.com/remote/livesearch.do?callback={callback}&q=',
		hotSource : 'http://www.taobao.com/go/rgn/trip/chinahotcity.php'
	};
	/*
	热门城市数据
	 */
	var HOT_CITY_DATA={},//缓存热门城市数据
		bakHotCityData ,//返回数据临时存储
		TEMPLATE = '<div class="yui3-hot-city"><div class="yui3-acinput-hot-tit">热门城市/国家(支持汉字/拼音/英文字母)</div><ul class="tab-nav">{{#results}}<li>{{tabname}}</li>{{/results}}</ul><div class="tab-content">{{#results}}<div class="tab-pannel">{{#tabdata}}<dl><dt>{{dt}}</dt><dd>{{#dd}}<span><a data-code="{{cityCode}}" href="#">{{cityName}}</a></span>{{/dd}}</dd></dl>{{/tabdata}}</div>{{/results}}</div></div>',//热门城市模板
		PLACEHOLDER_CLASS = 'trip-placeholder',
		INPUT_FOCUS_CLASS = 'yui3-acinput-focus',
		isSupportPlaceHolder = Y.Modernizr.input.placeholder ;
	YUI.Env.JSONP.getHotCityData = function(o){
		backHotCityData =  o ;
	};
	/*
	*格式化和高亮搜索结果内容
	 */
	function highLight(str,key){
		//return str.replace(key,'<span class="yui3-highlight">'+ key +'</span>');
		return str;
	}
	function acFormatter(query, results) {
	  return Y.Array.map(results, function (result) {
		result = result.raw ;
		return Y.Lang.sub(DEF_CONFIG.resultTemplate, {
		  cityName: highLight(result.cityName,query),
		  py : highLight(result.py, query)
		});
	  });
	}
	/*
	*旅行定制SUGGEST构造函数
	 */
	var TripAutoComplete = Y.Base.create('tripAutoComplete' , Y.Base , [] , {
			initializer : function (arg){
				this.config = arg ;
				Y.mix(this.config,DEF_CONFIG);

				this.AC = new Y.AutoComplete(this.config);

				var AC= this.AC;
				AC.DEF_PARENT_NODE = null ;
				AC.render();

				this.inputNode = AC.get('inputNode');
				this.listNode = AC.get('listNode');
				this.contentBox = AC.get('contentBox');
        this.boundingBox = AC.get('boundingBox');
        this.msgBox = Y.Node.create('<div class="yui3-msg-box" style="display:none"></div>');
        this.contentBox.insertBefore(this.msgBox ,this.contentBox.get('firstChild'));
        this.boundingBox.setStyle('position' , 'absolute');
				AC.set('zIndex' , '99999');
				var codeInputNode = this.config.codeInputNode;
				this.codeInputNode = typeof codeInputNode  !== 'undefined' ? Y.one(codeInputNode) : null ;

				this.isAllowFocus = true  ; //是否允许出发FOCUS事件
				this.isFillFirstItem = true ;//是否需要用第一条数据填充
				this.isLoadedHotData = false ;//热门城市是否已加载
				this.isHotVisible = false ; //热门城市是否可见
				this.isMouseOverHot = false ;//鼠标是否在热门城市框区域内
				this.hotNode = null ;
        this.doc = Y.one(document);
				Y.TripPlaceholder.init(this.inputNode);//自动填充
        this.config.createIcon && this._createIcon();//创建ICON
        this.inputNode.addClass('J_TripCityInput');
				//自定义事件
				this.publish('select');
				this._bindUI();
				this._syncUI();
        TG.SearchForm['#'+this.inputNode.get('id')] = this ;//将实例存储到全局对象，将ID作为KEY
			},
			_syncUI : function (){
         this.inputNode.setAttribute('x-webkit-speech','x-webkit-speech');
         this.boundingBox.addClass('has-anim-fast');
			},
      _createIcon : function (){
          var parent = this.inputNode.get('parentNode');
          var node = Y.Node.create('<div class="yui3-acinput-box"><s class="yui3-acinput-icon"></s></div>');
          parent.insertBefore(node,this.inputNode);
          node.appendChild(this.inputNode);
          this.inputBoxNode = node ;
          return this;
      },
      /*
      显示错误或者提示信息
       */
      showMessage : function(msg){
        var that = this ;
        this.msgBox.setContent(msg);
        this.msgBox.show();
        this.AC.show();
        this.boundingBox.addClass('anim-pulse');
        setTimeout(function (){
          that.boundingBox.removeClass('anim-pulse');
        },100);
        return this ;
      },
      //显示自动完成组件
      show : function (){
        this.AC.show();
      },
      //隐藏自动完成组件
      hide : function (){
        this.AC.hide();
      },
      //获取焦点
      focus : function (){
        this.inputNode.focus();
      },
			/*
			同步默认城市数据 同步后展示
			 */
			_syncHot : function(htmlStr){
				var SELF = this ;
				this.hotNode = this.contentBox.appendChild(htmlStr);
				this.hotNode.hide();
				this.hotNode.setAttrs({
					id : Y.stamp(this.hotNode)
				});
				var tabView = new Y.Slide(this.hotNode.get('id'));
				tabView.on('switch',function(){
                    SELF.AC.sizeShim && SELF.AC.sizeShim();
				});
				this._bindHot() ;
				if (this.listNode.get('children').size() < 1) {//可能出现热门城市数据返回比用户输入后的匹配城市数据慢，出现这种情况时，不再默认展示热梦城市
					this.hotNode && this.hotNode.show();
					this.AC.render();
					this.AC.show();
                    this.AC.sizeShim && this.AC.sizeShim();
					this.isHotVisible = true;
					this.AC.set('width' ,this.config.hotWidth);
				}
        return this ;
			},
			_bindUI : function (){
				var inputNode = this.AC.get('inputNode');
        inputNode.on('keyup' , function (){
            if (inputNode.get('value')=='') {
                this.msgBox && this.msgBox.hide();
                this.showHot();
            }
        } , this);
				this._bindAC();
				this._bindInput();
        return this ;
			},
			/*
			*给autoComplete对象绑定自定义事件
			 */
			_bindAC : function(){
				var AC = this.AC  , SELF =  this ;
        var selectHoverItem = function (e){//选中鼠标HOVER的ITEM
            AC.set('activeItem' , e.currentTarget);
        };
				AC.on('select' , this._fillInput , this );//填充数据
				AC.on('results', this._afterResults , this);//显示错误提示
				AC.on('visibleChange', this._visibleChange , this);
        AC.on('hoveredItemChange' , selectHoverItem, this);
				//用户鼠标选择时，不触发默认填充功能
				this.listNode.on('mousedown' , function (e){
					SELF.isFillFirstItem = false ;
				});
			},
			_bindHot : function(){
				var hotNode = this.hotNode ;
				Y.delegate('click' , this._afterHotItemClick , hotNode , 'a', this);
				hotNode.on('mouseenter' , this._afterHotMouseOver , this );
				hotNode.on('mouseleave' , this._afterHotMouseOut , this );
				hotNode.on('click' , this._afterHotClick, this);
			},
			/*
			输入框事件绑定
			 */
			_bindInput : function (){
				var inputNode = this.inputNode , SELF = this;
        var focusInput = function (){
            setTimeout(function (){
                inputNode.focus();
            },10)
        };
				inputNode.on('focus' , this._afterFocus , this);
				inputNode.on('blur' , this._afterBlur , this);//如果用户没做选择，隐藏SUGGEST时默认用第一条数据填充
        this.config.createIcon && this.inputBoxNode.on('click' , focusInput);
			},
			/*
			没有结果时，返回无结果提示信息
			 */
			_afterResults : function (e){
				var AC = this.AC ,SELF = this ;
				var contentBox = this.AC.get('contentBox');
				var qReg = new RegExp('{query}','g');
				//用户输入关键字后返回数据时隐藏热门城市
				this.listNode.removeClass('hidden');
				if(this.isHotVisible){
					this.hotNode.hide();
				}
				//显示无结果提示
				if (e.results.length < 1) {
					e.preventDefault();
					//contentBox.get('firstChild').setContent('<li class="yui3-aclist-noresult">'+ SELF.config.noResultMessage.replace(qReg, e.query) +'</li>');
          this.showMessage(SELF.config.noResultMessage.replace(qReg, e.query));//显示错误信息
					this.codeInputNode && this.codeInputNode.set('value','');//重置三字码为空
					//AC.show();
				}else{
          this.msgBox.hide();
					this.isFillFirstItem = true ;
					//默认填入返回数据的第一个城市
					this.codeInputNode && this.codeInputNode.set('value',e.data.result[0].cityCode);
				}
				AC.set('width' ,SELF.config.width);
			},
			_visibleChange : function(e){
				if (e.newVal == true ) {
					this.doc.on('click' , this._afterDocClick , this);
                    this.AC.sizeShim && this.AC.sizeShim();
				}else{
					if (this.isHotVisible && this.isMouseOverHot) {
						e.preventDefault();
					}
				}
			},
			/*
			*选中后填充选中数据到input
			 */
			_fillInput : function (e){
				var _data = e.result.raw ,o={},
					codeInputNode = this.codeInputNode,
					SELF = this ;
				//填充附加代码
				if (codeInputNode) {
					codeInputNode.set('value',_data.cityCode);
					o.cityCode = _data.cityCode;
				}
				if (!isSupportPlaceHolder) {
					this.inputNode.removeClass(PLACEHOLDER_CLASS);
				}
				this.isFillFirstItem = false ;

				//由于IE6下会触发FOCUS，做一个变量短时间内不允许执行FOCUS事件
				this.isAllowFocus = false ;
				o.value =  _data.cityName;
				o.data = _data ;
				setTimeout(function(){
					SELF.isAllowFocus = true ;
					SELF.fire('select',o);
				},200);
			},
			/*
			获得焦点时，需要显示热门城市
			foucs被触发的一些条件：
			1.用户点击输入框
			2.TAB切换至输入框
			3.IE6在SUGGEST里选择完城市以后重新获得焦点:此时不需要显示热门推荐城市
			 */
			_afterFocus : function(e){
        this.msgBox.hide();
				var SELF = this , target = e.target ;
				target.addClass(INPUT_FOCUS_CLASS);
				setTimeout(function(){
					if (SELF.isAllowFocus) {
						target.select();
						SELF.showHot();
						SELF.isAllowFocus = false ;
					}
				},100);
			},
			/*
			inputNode失去焦点时，检查是否要隐藏热门推荐
			以下情况会触发此事件
			1.用户点击外部区域
			2.ie下用户点击热门推荐区域
			 */
			_afterBlur : function(e){
				var listNode = this.listNode , SELF = this ;
				e.target.removeClass(INPUT_FOCUS_CLASS);
				if (this.isFillFirstItem) {
					//用户没做选择则默认填充第一条数据
					setTimeout(function(){
						if(listNode && listNode.get('children').size() > 0 && SELF.isFillFirstItem){
							SELF.AC.selectItem(listNode.get('firstChild'));
						}
					},100);
				}
				setTimeout(function(){
					SELF.isAllowFocus = true ;
				},300);
			},
			_afterDocClick : function(e){
				var target = e.target , SELF = this;
				if (!this.isMouseOverHot && target != this.inputNode) {
					SELF.hideHot('doc');
          //Y.log('doc listener has moved '  + this.isMouseOverHot );
				}
			},
			_afterHotClick :function(e){
				e.stopPropagation();
			},
			_afterHotMouseOver :function(){
				this.isMouseOverHot = true ;
			},
			_afterHotMouseOut : function(){
				this.isMouseOverHot = false ;
			},
			/*
			加载热门城市数据
			 */
			_loadHotData : function(){
				var SELF = this , urlStr = this.config.hotSource;
				this.isLoadedHotData = true;
				if (typeof HOT_CITY_DATA[urlStr] !== 'undefined') {
					SELF._syncHot(Y.mustache(TEMPLATE , HOT_CITY_DATA[urlStr]));
					return this ;
				}
				Y.Get.script( urlStr ,{
					charset : 'gbk',
					onSuccess: function(o){
						var data = o.data ;
						if (typeof backHotCityData === 'object') {
							HOT_CITY_DATA[data.url] = backHotCityData ;
							SELF._syncHot(Y.mustache(TEMPLATE , backHotCityData));
						}
					},
					data : {
						url : urlStr
					}
				});
			},
      /*
      *显示热门城市
       */
			showHot : function(){
				var listNode = this.listNode ;
				listNode.empty();//要显示热门城市先清空LISTNODE
				listNode.addClass('hidden');
				if (!this.isLoadedHotData) {
					this._loadHotData();
          return this ;
				}
        this.AC.set('width' ,this.config.hotWidth);
        if(this.hotNode){
            this.hotNode.show();
            //IE6 7触发 reflow
            this.hotNode.setStyle('zoom' , '0.95');
            this.hotNode.setStyle('zoom' , '1');
        }
        this.AC.render();
        this.AC.show();
        this.isHotVisible = true;
        return this;

			},
      /*
      *隐藏热门城市
       */
			hideHot : function(){
				this.isHotVisible = false ;
				this.isMouseOverHot = false ;
				this.hotNode && this.hotNode.hide();
			  this.doc.detach('click' , this._afterDocClick);
				this.AC.hide();
			},
			/*
			热点城市点击链接后填充数据
			*/
			_afterHotItemClick : function(e){
				var SELF = this ,o = {};
				e.halt();
				var node = e.currentTarget ;
				if (!isSupportPlaceHolder) {
					this.inputNode.removeClass(PLACEHOLDER_CLASS);
				}
				var val = node.get('innerHTML') ;
				o.value = val ;
        o.node = node;
				this.inputNode.set('value' , val);
				var codeInputNode = this.codeInputNode,
					codeValue = node.getAttribute('data-code');
				if (codeValue && codeInputNode) {
					codeInputNode.set('value' , codeValue);
					o.cityCode = codeValue ;
				}
				this.hideHot();
				setTimeout(function(){
					SELF.fire('select',o);
				},200);
			}
		},{
			ATTRS:{
				config : {
					value : null
				}
			}
		});
	Y.TripAutoComplete = TripAutoComplete;
},'0.0.1',{requires:['autocomplete','gallery-mustache','trip-slide','trip-placeholder']});


//作者：lijing00333@163.com
YUI.namespace('Y.Slide');
YUI.add('trip-slide',function(Y){
	if(typeof Y.Node.prototype.queryAll == 'undefined'){
		Y.Node.prototype.queryAll = Y.Node.prototype.all;
		Y.Node.prototype.query = Y.Node.prototype.one;
		Y.Node.get = Y.Node.one;
		Y.get = Y.one;
	}

	var Slide = function(){
		this.init.apply(this,arguments);
	};
	Y.mix(Slide,{
		init:function(id,config){
			var that = this;
			that.id = id;
			//接受参数
			that.buildParam(config);
			//构建事件中心
			that.buildEventCenter();
			//构造函数
			that.construct();
			//绑定事件
			that.bindEvent();

			//执行ready
			that.ready({
				index:0,
				navnode:that.tabs.item(0),
				pannelnode:that.pannels.item(0)
			});

			if(that.reverse){
				var _t ;
				_t = that.previous,
				that.previous = that.next,
				that.next = _t;
			}

			return this;
		},
		//渲染textarea中的内容，并放在与之相邻的一个div中，若有脚本，执行其中脚本
		renderLazyData:function(textarea){
			textarea.setStyle('display','none');
			if(textarea.getAttribute('lazy-data')=='1'){
				return ;
			}
			textarea.setAttribute('lazy-data','1');
			var	id = Y.stamp(div),
				html = textarea.get('innerHTML').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>').replace(/&amp;/ig,'&'),
				div = Y.Node.create('<div>'+html+'</div>');
			textarea.insert(div,'before');

			var globalEval = function(data){
				if (data && /\S/.test(data)) {
					var head = document.getElementsByTagName('head')[0],
						script = document.createElement('script');

					// It works! All browsers support!
					script.text = data;

					head.insertBefore(script, head.firstChild);
					head.removeChild(script);
				}
			};

			var id = 'K_'+new Date().getTime().toString(),
				re_script = new RegExp(/<script([^>]*)>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/ig); // 防止


			var hd = Y.Node.getDOMNode(Y.one('head')),
				match, attrs, srcMatch, charsetMatch,
				t, s, text,
				RE_SCRIPT_SRC = /\ssrc=(['"])(.*?)\1/i,
				RE_SCRIPT_CHARSET = /\scharset=(['"])(.*?)\1/i;

			re_script.lastIndex = 0;
			while ((match = re_script.exec(html))) {
				attrs = match[1];
				srcMatch = attrs ? attrs.match(RE_SCRIPT_SRC) : false;
				// script via src
				if (srcMatch && srcMatch[2]) {
					s = document.createElement('script');
					s.src = srcMatch[2];
					// set charset
					if ((charsetMatch = attrs.match(RE_SCRIPT_CHARSET)) && charsetMatch[2]) {
						s.charset = charsetMatch[2];
					}
					s.async = true; // make sure async in gecko
					hd.appendChild(s);
				}
				// inline script
				else if ((text = match[2]) && text.length > 0) {
					globalEval(text);
				}
			}

		},
		/**
		 * 事件中心
		 */
		buildEventCenter:function(){
			var that = this;
			var EventFactory = function(){
				this.publish("switch");
			};
			Y.augment(EventFactory, Y.Event.Target);
			that.EventCenter = new EventFactory();
			return this;
		},
		/**
		 * 绑定函数
		 */
		on:function(type,foo){
			var that = this;
			that.EventCenter.subscribe(type,foo);
			return this;
		},
		construct: function() {
            var that = this;
			var con = that.con = Y.one('#' + that.id);
            that.tabs = con.all('.' + that.navClass + ' li');
            var tmp_pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
            that.length = tmp_pannels.size();
            if (that.tabs.size() == 0) {
                //nav.li没有指定，默认指定1234
                var t_con = con.all('.' + that.navClass);
				var t_str = '';
                for (var i = 0; i < that.length; i++) {
                    var t_str_prefix = '';
                    if (i == 0) {
                        t_str_prefix = that.selectedClass;
                    }
                    t_str += '<li class="' + t_str_prefix + '"><a href="javascript:void(0);" target="_self">' + (i + 1) + '</a></li>';
                }
                t_con.set('innerHTML', t_str);
            }
            that.tabs = con.all('.' + that.navClass + ' li');//重新赋值
            that.animcon = con.query('.' + that.contentClass);
            that.animwrap = null;
            if (that.effect == 'none') {
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
            } else if (that.effect == 'v-slide') {
                that.animwrap = Y.Node.create('<div style="position:absolute;"></div>');
                that.animwrap.set('innerHTML', that.animcon.get('innerHTML'));
                that.animcon.set('innerHTML', '');
                that.animcon.appendChild(that.animwrap);
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
                //统一容器和item的宽高及选中默认值
                var animconRegion = that.animcon.get('region');
				var _width = that.itemWidth || animconRegion.width ;
                that.pannels.setStyles({
					'height' : animconRegion.height,
                    'float': 'none',
                    'overflow': 'hidden'
                });
                that.animwrap.setStyles({
                    'height': that.length * animconRegion.height + 'px',
                    'overflow': 'hidden',
                    'top': -1 * that.defaultTab * animconRegion.height + 'px'
                });
            } else if (that.effect == 'h-slide') {
                that.animwrap = Y.Node.create('<div style="position:absolute;"></div>');
				var _itemHtml = that.animcon.get('innerHTML');
				if(that.loop){//循环处理：复制HTML
					_itemHtml = _itemHtml + _itemHtml ;
				}
                that.animwrap.set('innerHTML', _itemHtml);
                that.animcon.set('innerHTML', '');
                that.animcon.appendChild(that.animwrap);
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
                //统一容器和item的宽高及选中默认值
                var animconRegion = that.animcon.get('region');
				var _width = that.itemWidth || animconRegion.width ;
                that.pannels.setStyles({
					'height' : animconRegion.height,
                    'float': 'left',
                    'overflow': 'hidden'
                });
				var _wrapWidth = that.length * _width ;
				if (that.loop) {
					_wrapWidth =_wrapWidth * 2;
				}
                that.animwrap.setStyles({
                    'width': _wrapWidth ,
                    'overflow': 'hidden',
					'zoom' : 1,
                    'left': -1 * that.defaultTab * _width + 'px'
                });
            } else if (that.effect == 'fade') {
                that.pannels = con.all('.' + that.contentClass + ' div.' + that.pannelClass);
                that.pannels.setStyles({
                    'position': 'absolute',
                    'zIndex': 0
                });
                that.pannels.each(function(node, i){
                    if (i == that.defaultTab) {
                        node.removeClass('hidden');
                        node.setStyle('opacity', 1);
                    } else {
                        node.addClass('hidden');
                        node.setStyle('opacity', 0);
                    }
                });
            }
            //添加选中的class
            //that.tabs.removeClass(that.selectedClass);
            //that.tabs.item(that.defaultTab).addClass(that.selectedClass);
			that.switch_to(that.defaultTab);//modify by shuke 改为默认值
            //是否自动播放
            if (that.autoSlide == true) {
                that.play();
            }
            return this;
        },

		bindEvent:function(){
			var that = this;
			if(that.eventype == 'click' || that.eventype == 'mouseover'){
				that.con.delegate(that.eventype,function(e){
					e.preventDefault();
					that.goto(Number(that.tabs.indexOf(e.currentTarget)));
					if(that.autoSlide)that.stop().play();
				},'.'+that.navClass+' li');
			}
			if(that.hoverStop){
				that.con.delegate('mouseover',function(e){
					//e.halt();
					if(that.autoSlide)that.stop();
				},'.'+that.contentClass+' div.'+that.pannelClass);
				that.con.delegate('mouseout',function(e){
					//e.halt();
					if(that.autoSlide)that.play();
				},'.'+that.contentClass+' div.'+that.pannelClass);
			}
			return this;

		},
		buildParam:function(o){
			var that = this;
			//基本参数
			var o = (typeof o == 'undefined' || o == null)?{}:o;
			that.autoSlide = (typeof o.autoSlide == 'undefined' || o.autoSlide == null)?false:o.autoSlide;
			that.speed = (typeof o.speed == 'undefined' || o.speed == null)?0.5:o.speed;
			that.timeout = (typeof o.timeout == 'undefined' || o.timeout == null)?1000:o.timeout;
			that.effect = (typeof o.effect == 'undefined' || o.effect == null)?'none':o.effect;
			that.eventype = (typeof o.eventype == 'undefined' || o.eventype == null)?'click':o.eventype;
			that.easing = (typeof o.easing == 'undefined' || o.easing == null)?'easeBoth':o.easing;
			that.hoverStop = (typeof o.hoverStop== 'undefined' || o.hoverStop == null)?true:o.hoverStop;
			that.selectedClass = (typeof o.selectedClass == 'undefined' || o.selectedClass == null)?'selected':o.selectedClass;
			that.conClass = (typeof o.conClass == 'undefined' || o.conClass == null)?'t-slide':o.conClass;
			that.navClass = (typeof o.navClass == 'undefined' || o.navClass == null)?'tab-nav':o.navClass;
			that.contentClass = (typeof o.contentClass == 'undefined' || o.contentClass == null)?'tab-content':o.contentClass;
			that.pannelClass = (typeof o.pannelClass == 'undefined' || o.pannelClass == null)?'tab-pannel':o.pannelClass;
			that.before_switch = (typeof o.before_switch== 'undefined' || o.before_switch == null)?new Function:o.before_switch;
			that.ready = (typeof o.ready == 'undefined' || o.ready == null)?new Function:o.ready;
			that.carousel = (typeof o.carousel == 'undefined' || o.carousel == null)?false:o.carousel;
			that.reverse = (typeof o.reverse == 'undefined' || o.reverse == null)?false:o.reverse;
			that.itemWidth = (typeof o.itemWidth == 'undefined' || o.itemWidth == null) ? false : o.itemWidth;//指定每次切换的移动距离，不指定时为tab-content宽度
			that.loop = (typeof o.loop == 'undefined' || o.loop == null) ? false : o.loop; //add by shuke.cl 用于无限循环
			that.id = that.id;
			//构造参数
			that.tabs = [];
			that.animcon = null;
			that.pannels = [];
			that.timer = null;
			//默认选中的tab，默认值为0，添加默认选中的功能
			//modified by huya
            that.defaultTab = (typeof o.defaultTab == 'undefined' || o.defaultTab == null) ? 0 : Number(o.defaultTab) - 1;//隐藏所有pannel
            //that.current_tab = that.defaultTab;//0,1,2,3...
			that.current_tab = -1; //bu shuke
            return this;

		},
		//接口函数
		//上一个
		previous:function(){
			var that = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(that.anim.get('running') && that.carousel){
					return this;
				}
			}catch(e){}
			var _index = that.current_tab+that.length-1;
			if(_index >= that.length){
				_index = _index % that.length;
			}
			if(that.carousel){
				if((_index%that.length) == (that.length-1) && that.current_tab == 0){
					that.fix_pre_carousel();
					arguments.callee.call(that);
					return this;
				}
			}
			if (that.loop && (_index >= that.length-1)) {//无限循环时
				_index = that.length-1;

				if(that.effect == 'v-slide'){ //垂直
					that.animwrap.setStyle('top', (-(that.length) * that.itemWidth));
				}else if(that.effect == 'h-slide'){//水平
					that.animwrap.setStyle('left', (-(that.length) * that.itemWidth));
				}
			}
			that.goto(_index);
			return this;
		},
		//下一个
		next:function(){
			var that = this;
			//防止旋转木马状态下切换过快带来的晃眼
			try{
				if(that.anim.get('running') && that.carousel){
					return this;
				}
			}catch(e){}
			var _index = that.current_tab+1;
			if(_index >= that.length){
				_index = _index % that.length;
			}
			if(that.carousel){
				if((_index%that.length) == 0 && that.current_tab == (that.length-1)){
					that.fix_next_carousel();
					arguments.callee.call(that);
					return this;
				}
			}
			if (that.loop && (_index%that.length) == 0 && that.current_tab == (that.length-1)) {//无限循环时
				_index = that.length;
			}
			that.goto(_index);
			return this;
		},
		fix_next_carousel:function(){
			var that = this;
			that.current_tab = that.current_tab -1;
			var con = that.con = Y.one('#'+that.id);
			if(that.effect != 'none'){
				that.pannels = con.all('.'+that.contentClass+' div.'+that.pannelClass);
			}
			var first_node = that.pannels.item(0);
			that.animwrap.appendChild(first_node);
			//first_node.remove();
			if(that.effect == 'v-slide'){ //垂直
				var top = that.animwrap.getStyle('top').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('top',-(Number(top)-that.animcon.get('region').height).toString()+'px');
			}else if(that.effect == 'h-slide'){//水平
				var left = that.animwrap.getStyle('left').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('left',-(Number(left)-that.animcon.get('region').width).toString()+'px');
			}

		},
		fix_pre_carousel:function(){
			var that = this;
			that.current_tab = that.current_tab + 1;
			var con = that.con = Y.one('#'+that.id);
			if(that.effect != 'none'){
				that.pannels = con.all('.'+that.contentClass+' div.'+that.pannelClass);
			}
			var last_node = that.pannels.item(that.pannels.size()-1);
			var first_node = that.pannels.item(0);
			that.animwrap.prepend(last_node);
			//first_node.remove();
			if(that.effect == 'v-slide'){ //垂直
				var top = that.animwrap.getStyle('top').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('top',-(Number(top)+that.animcon.get('region').height).toString()+'px');
			}else if(that.effect == 'h-slide'){//水平
				var left = that.animwrap.getStyle('left').replace(/[^\d]/ig,'');
				that.animwrap.setStyle('left',-(Number(left)+that.animcon.get('region').width).toString()+'px');
			}

		},
		//切换至index
		switch_to:function(index){
			var that = this;
            if (index >= that.length && !that.loop) {//不需要无限循环时还按照老方法处理
                index = index % that.length;
            }
            if (index == that.current_tab) {
                return this;
            }
            if (that.effect == 'none') {
                that.pannels.addClass('hidden');
                that.pannels.item(index).removeClass('hidden');
            }
            else if (that.effect == 'v-slide') {
                if (that.anim) {
                    try {
                        that.anim.stop();
                        //fix IE6下内存泄露的问题，仅支持3.2.0及3.3.0,3.1.0及3.0.0需修改Y.Anim的代码
						//modified by huya
                        that.anim.destroy();
                        that.anim = null;
                    } catch (e) {}
                }
                that.anim = new Y.Anim({
                    node: that.animwrap,
                    to: {
                        top: -1 * index * that.animcon.get('region').height
                    },
                    easing: that.easing,
                    duration: that.speed
                });
                that.anim.run();
            } else if (that.effect == 'h-slide') {
                if (that.anim) {
                    try {
                        that.anim.stop();
                        that.anim.destroy();
                        that.anim = null;
                    } catch (e) {}
                }
				var _animWidth = that.itemWidth || that.animcon.get('region').width;
                that.anim = new Y.Anim({
                    node: that.animwrap,
                    to: {
                        left: -1 * index * _animWidth
                    },
                    easing: that.easing,
                    duration: that.speed
                });
                that.anim.run();
				if (that.loop && index >= that.length) {
					that.anim.on('end',function(){
						that.animwrap.setStyle('left' , '0px');
					})
				}
            } else if (that.effect == 'fade') {
				//重写fade效果逻辑
				//modified by huya
                var _curr = that.current_tab == -1 ? 0 : that.current_tab;
                if (that.anim) {
                    try {
                        that.anim.stop();
                        that.anim.destroy();
                        that.anim = null;
                    } catch (e) {}
                }
                that.anim = new Y.Anim({
                    node: that.pannels.item(index),
                    to: {
                        opacity: 1
                    },
                    easing: that.easing,
                    duration: that.speed
                });
                that.anim.on('start', function(){
                    that.pannels.item(index).removeClass('hidden');
                    that.pannels.item(index).setStyle('opacity', 0);
                    that.pannels.item(_curr).setStyle('zIndex', 1);
                    that.pannels.item(index).setStyle('zIndex', 2);
                });
                that.anim.on('end', function(){
                    that.pannels.item(_curr).setStyle('zIndex', 0);
                    that.pannels.item(index).setStyle('zIndex', 1);
                    that.pannels.item(_curr).setStyle('opacity', 0);
                    that.pannels.item(_curr).addClass('hidden');
                });
                that.anim.run();
            }
			if(that.loop && index >= that.length){//重置当前TAB的索引值
				index = 0;
			}
            that.tabs.removeClass(that.selectedClass);
            that.tabs.item(index).addClass(that.selectedClass);
            that.current_tab = index;
            that.EventCenter.fire('switch', {
                index: index,
                navnode: that.tabs.item(index),
                pannelnode: that.pannels.item(index)
            });
			//延迟执行的脚本
			var scriptsArea = that.pannels.item(index).all('.lazyload');
			if(scriptsArea){
				scriptsArea.each(function(node,i){
					that.renderLazyData(node);
					//that.pannels.item(index).append(node.get('value'));
				});
				//scriptsArea.remove();
			}
		},
		//去往任意一个,0,1,2,3...
		goto:function(index){
			var that = this;
			if (!that.loop) {
				if(that.before_switch({
					index:index,
					navnode:that.tabs.item(index),
					pannelnode:that.pannels.item(index)
				}) == false){
					return;
				}
			}
			that.switch_to(index);
		},
		//自动播放
		play:function(){
			var that = this;
			if(that.timer != null)clearTimeout(that.timer);
			that.timer = setTimeout(function(){
				that.next();
				that.timer = setTimeout(arguments.callee,Number(that.timeout));
			},Number(that.timeout));
			return this;
		},
		//停止自动播放
		stop:function(){
			var that = this;
			clearTimeout(that.timer);
			that.timer = null;
			return this;
		}

	},0,null,4);

	Y.Slide = Slide;

},'',{requires:['node-base','node-event-delegate','node-screen','anim-easing']});
