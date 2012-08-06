/**
 *http://a.tbcdn.cn/??p/global/1.0/global.js
 * 全局模块
 * @desc 仅处理吊顶和一些全局功能的载入
 * @creater 云谦 <yunqian@taobao.com>
 * @depends seed
 */

var TB = window['TB'] || {};
TB.namespace = TB.namespace || function() {
    KISSY.namespace.apply(TB, arguments);
};

(function() {

    var S = KISSY,
        isIE76 = !'0'[0],
        isIE6 = isIE76 && !window.XMLHttpRequest,
        isIE = !!window.ActiveXObject,
        doc = document, win = window, assetsHost, urlConfig,
        SPACE = ' ', HOVER = 'hover',

        siteNavElem,
        APPID = 'g_config' in win ? ('appId' in win['g_config'] ? parseInt(win['g_config']['appId']): undefined) : undefined ,
        MINICART_CLS = 'mini-cart', MINICART_NO_LAYER_CLS = 'mini-cart-no-layer',
        hostname = location.hostname.split('.'),
        domain = doc.domain,
        IS_TMALL = domain.indexOf('tmall.com') > -1,
        IS_DAILY = ~location.hostname.indexOf('daily.taobao.net') || ~location.hostname.indexOf('daily.tmall.net'),
        HOSTNAME = IS_DAILY ? '.daily.taobao.net' : '.taobao.com',
        EMPTY = '',
        IS_INIT = false, // 是否已经初始化了 TB.Global 标志

        savedLogoutUrl = null,

        // https 请求 (登录注册页面)
        isHTTPS = (doc.location.href.indexOf("https://") === 0),

        // 所有用到的 cookie
        COOKIES = {},

        // 初始化函数队列
        runItems = {

            /**
             * 顶通
             */
            siteNav: function() {
                if (!siteNavElem) return;
                siteNavElem.setAttribute("role","navigation");
                S.each(getElementsByClassName('menu', '*', siteNavElem), function(el) {
                    TB.Global._addMenu(el);
                });
                // 监听顶部搜索提交
                var form = doc.forms['topSearch'];
                addEvent(form, 'submit', function() {
                    if (form['q'].value == EMPTY) { // 空搜索，跳转到我要买
                        form.action = 'http://list.taobao.com/browse/cat-0.htm';
                    }
                });

                // 购物车登陆前置
                var cartElem = getElementsByClassName('cart', 'li', siteNavElem)[0];
                addEvent(cartElem, 'click', function(e) {
                  var tg = e.target || e.srcElement;
                  if (tg.nodeName != 'A' && tg.parentNode.nodeName === 'A') {
                    tg = tg.parentNode;
                  }
                  if (tg.nodeName === 'A' && tg.href.indexOf('my_cart.htm') > -1) {
                    preventDefault(e);
                    removeClass(cartElem, 'hover');
                    TB.Cart && TB.Cart.redirect(tg, tg.href);
                    if (win.MiniCart) {
                      win.MiniCart._clicked = false;
                    }
                  }
                });

                //我的淘宝最新动态
                var MyRemind = "g_mytaobao_set_dynamic_count";
                var has_mouseovered = false;
                var mytaobaoElem = getElementsByClassName('mytaobao', 'li', siteNavElem)[0];
                addEvent(mytaobaoElem,'mouseover',function(e){
                    if (has_mouseovered) return;
                    if (!TB.Global.isLogin()) return;
                    has_mouseovered = true;
                    window[MyRemind] = function(data) {
                        if (!data || !data[5] || data[5]==0 ) return;
                        el = document.getElementById('myTaobaoPanel').getElementsByTagName("a")[2]
                        el.innerHTML += "<span style=\"color:#f50;\"> "+data[5]+"</span>";
                    };
                    var url="http://i"+HOSTNAME+"/json/my_taobao_remind_data.htm?from=site&t="
                    S.getScript(url + S.now() + "&callback="+MyRemind);
                });

                //获取VIP会员特权图标    
                var Viphas_mouseovered = false;
                var myVipElem = getElementsByClassName('user', 'span', siteNavElem)[0];
                

                addEvent(myVipElem,'mouseover',function(e){

                    var myVipStepLeftElem=getElementsByClassName('vip-stepleft', 'a', siteNavElem)[0];
                    var myVipStepRightElem=getElementsByClassName('vip-stepright', 'a', siteNavElem)[0];
                    var myVipPage;
                    var MyVipIcon = 'g_my_vip_icon';


                    if (!TB.Global.isLogin()) return;
                    if (Viphas_mouseovered) return;
                    Viphas_mouseovered = true;
                    window[MyVipIcon] = function(data) {

                        var vip_content_el = document.getElementById('J_VipContent');
                        var vip_medal_el=document.getElementById('J_VipMedal');

                        //如果接口返回有误，或者没有勋章直接删除节点并重置Content的高度
                        if (!data || data.isSuccess === false ){
                            vip_content_el.removeChild(vip_medal_el);
                            vip_content_el.style.height="100px";
                            return;
                        }
                        // el = document.getElementById('myTaobaoPanel').getElementsByTagName("a")[2]
                        // el.innerHTML += "<span style=\"color:#f50;\">"+data[5]+"</span>";
                        //console.log(data)
                        
                        //获取勋章最大屏数
                        myVipPage=Math.ceil(data.userMedals.length/5);

                        var vip_icons = [];
                        for(var i=0;i<data.userMedals.length;i++){
                            vip_icons.push('<a title="'+data.userMedals[i].medalName+'" target="_self" href="'+ data.userMedals[i].medalUrl +'"><img src="'+ data.userMedals[i].pic +'" /></a>');
                        }
                        if (vip_icons.length === 0) {
                            vip_content_el.removeChild(vip_medal_el);
                            vip_content_el.style.height = "100px";
                        }
                        else{
                            var vip_medal_content_el = document.getElementById('J_VipMedalContent');

                            //移除loading样式
                            var loading_reg = new RegExp('(\\s|^)'+'vip-loading'+'(\\s|$)');
                            vip_medal_el.className=vip_medal_el.className.replace(loading_reg,'');
                            
                            vip_medal_content_el.innerHTML = vip_icons.join('');

                            
                            //如果勋章数量不超过5个，则隐藏翻页按钮
                            if(vip_icons.length<=5){
                                myVipStepRightElem.style.display=myVipStepLeftElem.style.display='none';
                            }




                            //默认第一页
                            vip_medal_content_el.setAttribute("pageid","1");
                            
                            var pageid=parseInt(vip_medal_content_el.getAttribute("pageid"));

                            addEvent(myVipStepLeftElem,'click',function(e){
                                if(pageid>1){
                                    //turn left 200px;
                                    pageid=pageid-1;
                                    vip_medal_content_el.style.left='-'+ (pageid-1)*205 +'px';
                                    vip_medal_content_el.setAttribute("pageid",pageid);
                                }

                            });
                            addEvent(myVipStepRightElem,'click',function(e){
                                if(pageid<myVipPage){
                                    
                                    //turn right 200px;
                                    vip_medal_content_el.style.left='-'+ pageid*205 +'px';
                                    pageid=pageid+1;
                                    vip_medal_content_el.setAttribute("pageid",pageid);
                                }

                            });
                        }
                        
                    };
                    var nick = getCookie('_nk_') || getCookie('tracknick'); // 用户昵称，Session 内有效
                    var url='http://vipservice'+ HOSTNAME +'/medal/GetUserVisibleMedals.do?from=diaoding&nick=';
                    S.getScript(url + nick +'&t='+ S.now() + "&callback="+MyVipIcon,{ charset: 'utf-8'});
                });
            },

            /**
             * WebWW (tdog)
             */
            tDog: function() {
                // 加载 webww js 的开关：
                // （url 中有 tstart/tdog 参数） 或 （有 g_config 全局变量，且 appId 值不为 -1）
                if ((APPID && APPID != -1) || 'tstart' in urlConfig || 'tdog' in urlConfig) {
                    var url = 'http://' + assetsHost + '/p/header/webww-min.js?t=20110629.js',
                        times = 0;
                    S.ready(function() {
                        if (S.DOM) {
                            S.getScript(url);
                        } else {
//                            S.log('webww: try ' + times);
                            if (times < 10) {
                                setTimeout(arguments.callee, 1000);
                                times++;
                            }
                            // 如果实在没有 ks-core
                            else {
                                S.use('core', function() {
                                    S.getScript(url);
                                });
                            }
                        }
                    });
                }
            },

            /**
             * 淘宝实验室
             * cc @macji xiaomacji@gmail.com
             */
            tLabs: function() {
                // 没有登录, return 流程见 http://img03.taobaocdn.com/tps/i3/T1EAigXlXhXXXXXXXX-660-673.png
                //if (!TB.Global.isLogin()) return;
                if (location.href.indexOf("tms.taobao.com") !== -1) return;

                S.ready(function() {
                    var url = 'http://' + assetsHost + '/p/tlabs/1.0.0/tlabs-min.js?t=1.0.0.js',
                        nick = getCookie('_nk_') || getCookie('tracknick');
                    nick = encodeURIComponent(escapeHTML(unescape(nick.replace(/\\u/g, '%u'))));
                    S.getScript(url, function() {
                        if (typeof TLabs !== 'undefined') {
                            TLabs.init({nick: nick});
                        }
                    });
                });
            },

            /**
             * POC Monitor
             *
             * @author Macji xiaohu@taobao.com
             */
            POCMonitor: function() {
              var _poc = win['_poc'] || [], option, i = 0,
                  config = [
					['_setAccount', (win['g_config'] || 0).appId],
                    ['_setStartTime', (win['g_config'] || 0).startTime || win['HUBBLE_st'] || win['g_hb_monitor_st']]
                  ],
                  rate = 10000; // 设置命中率

              while ((option = _poc[i++])) {
                if (option[0] === '_setRate') {
                  rate = option[1];
                } else if (option[0] === '_setAccount') {
                  config[0] = option;
                } else if (option[0] === '_setStartTime') {
                  config[1] = option;
                } else {
                  config.push(option);
                }
              }

              // 有帐号 && 命中
              if (parseInt(Math.random() * rate) === 0) {
                win['_poc'] = config;
                S.getScript('http://a.tbcdn.cn/p/poc/m.js?v=0.0.1.js');
              }
            },

            /**
             * 测试环境中替换页头链接taobao.com为{test}.taobao.net
             */
            initHeaderLinks: function () {
                if (domain.indexOf('.taobao.net') === -1) return;
                var els = siteNavElem ? siteNavElem.getElementsByTagName('a') : [],
                    i = 0,
                    len = els.length,
                    hn = hostname;

                while (hn.length > 3) {
                    hn.shift();
                }

                hn = hn.join('.');

                for (; i < len; i++) {
                    els[i].href = els[i].href.replace('taobao.com', hn);
                }
            },

            /**
             * 初始化登出链接
             */
            // initLogout: function() {
            //     /* 如果用户已登录，给[退出]链接注册事件，先发送注销请求到taobao，再跳转至淘宝首页 */
            //     var logoutEl = doc.getElementById('J_Logout');
                
            //     if (!logoutEl) return;

            //     addEvent(logoutEl, 'click', function(ev) {
            //         preventDefault(ev);
                    
            //         var logoutUrl = logoutEl.href;

            //         var img_el = new Image();

            //         img_el.src='http://login.taobao.com/member/logout.jhtml?f=top&out=true&t='+S.now();

            //         img_el.onload = img_el.onerror = function (){
         
            //             location.href = logoutUrl;
            //         }
            //     });
            // },

            /**
             * 初始化网站导航异步加载
             */
            initSiteNav: function() {
                var trigger = doc.getElementById('J_Service'), container = doc.getElementById('J_ServicesContainer'), node,
                    URL = 'http://www.taobao.com/index_inc/2010c/includes/get-services.php', CALLBACK = '__services_results';

                if (!trigger || !container) return;

                addEvent(trigger, 'mouseover', handler);
                /*aria support by 承玉*/
                addEvent(trigger,'keydown',handler);

                function handler(e) {
                    if (e.type === 'keydown' && e.keyCode !== 39 && e.keyCode !== 40) {
                        return;
                    }
                    node = S.getScript(URL + '?cb=' + CALLBACK, {
                        charset: 'gbk'
                    });
                    preventDefault(e);
                }

                window[CALLBACK] = function(html) {
                    if (node) node.parentNode.removeChild(node);
                    node = null;
                    // 确保一定的容错，但考虑到可能的使用率，故只简单地处理可能出现的错误
                    try {
                        container.innerHTML = html;
                        container.style.height = 'auto';
                        removeEvent(trigger, 'mouseover', handler);
                        removeEvent(trigger, 'keydown', handler);
                    } catch(e) {
                        container.style.display = 'none';
                    }
                };
            },

            /**
             * 前端单元测试框架载入
             */
            test: function() {
                var loaded = false;
                var load = function() {
                    if (loaded) return;
                    loaded = true;
                    if (location.href.indexOf('__cloudyrun__') > -1) {
                        S.getScript('http://assets.daily.taobao.net/p/cloudyrun/1.0/cloudyrun-taobao-pkg.js?t='+(+new Date()));
                    }
                };
                S.ready(load);
                setTimeout(load, 4000);
            },

            assist: function() {
                if (getCookie('test_accouts') && document.domain.indexOf('taobao.net') > -1) {
                    S.ready(function() {
                        S.getScript('http://assets.daily.taobao.net/p/assist/login/login.js');
                    });
                }
            },

            /**
             * 初始化 mini 购物车
             * @author 乔花<qiaohua@taobao.com>
             */
            miniCart: function() {
                var TG = TB.Global;
                if (TG._OFF) return;

                if (IS_TMALL || domain.indexOf('tmall.net') > -1) {
                    if (S.isUndefined(APPID)) {
                        // 等待, 商城 php 获取不到 cookie , 但吊顶每次都会给 http://www.taobao.com/go/app/tmall/login-api.php 发请求
                        return;
                    }
                    else if (!(getCookie('uc2') && getCookie('mt'))) {
                        // 商城应用 不能实时同步 cookie, 需要发送http://www.taobao.com/go/app/tmall/login-api.php 发请求
                        S.getScript('http://www'+HOSTNAME+'/go/app/tmall/login-api.php'+'?t='+S.now());
                        return;
                    }
                }
                TG.initMiniCart();
            },

            /**
             * 全局载入 tb-mpp.js 脚本
             * 20110831 qiaohua: 暂时注释掉
             */
            mpp: function() {
                S.getScript('http://' + assetsHost + '/p/tstart/1.0/build/tb-mpp-min.js?t=201107210.js', function() {
                    // 安全中心推送消息, 使用mpp接口
                    S.ready(function() {
                        // 未登录的不需要提示安全信息
                        if (!TB.Global.isLogin()) return;

                        //type 填 1010, subType 1, java 和 js 都用此参数, 由消息通道分配的参数.
                        Mpp.Notify.register({appId:1010, type:1, callback: function() {
                            /*这儿是消息回调所要求，用JSONP取回消息实体*/
                            S.getScript('http://'+(IS_DAILY?'webww.daily.taobao.net:8080':'webwangwang.taobao.com') + '/getOtherSystem.do?callback=TB.Global.setUserMsg&t=' + S.now());
                        }});
                    });
                });
            },

            fpLBSBacon: function() {
                if (parseFloat(S.version) >= 1.2) {
                    var url = "http://a.tbcdn.cn/p/fp/2012/misc/lbs/??flashstorage.js,lbs.js?t=20120802.js";
                    S.getScript(url);
                }
            }

        };

    // {{{ yubo 20110817 for speeding up first screen
    var lazyItems = [ 'tDog', 'tLabs', 'test', 'mpp' ];
    for (var i = 0; i < lazyItems.length; i++) {
        (function(item) {
            var old = runItems[item];
            runItems[item] = function() {
                setTimeout(old, 1000);
            };
        })(lazyItems[i]);
    }
    // yubo }}}

    TB.Global = {

        // aria support by 承玉
        _addMenu: function(menuEl) {
            if (!menuEl) return;
            var self = this,
                menuHdEl = getElementsByClassName('menu-hd', '*', menuEl)[0],
                menuBdEl = getElementsByClassName('menu-bd', '*', menuEl)[0];

            if (!menuBdEl || !menuHdEl) return;

            menuHdEl.tabIndex = 0;
            self._subMenus.push(menuBdEl);

            menuBdEl.setAttribute("role", "menu");
            menuBdEl.setAttribute("aria-hidden", "true");

            if (!menuBdEl.getAttribute("id")) {
                menuBdEl.setAttribute("id", S.guid("menu-"));
            }

            menuHdEl.setAttribute("aria-haspopup", menuBdEl.getAttribute("id"));
            menuHdEl.setAttribute("aria-label", "右键弹出菜单，tab键导航，esc关闭当前菜单");

            // 添加 iframe shim 层
            // 在 https 页面，当 iframe 的 src 设为 about:blank 会使得 IE 弹出"安全确认框"，而
            // 登陆注册页的下拉覆盖区域并没有 SELECT 元素需要覆盖，所以在这些页面中不创建对应的 iframe
            var iframe = false;
            if (!isHTTPS && isIE6) {
                iframe = doc.createElement('iframe');
                iframe.src = 'about: blank';
                iframe.className = 'menu-bd';
                menuEl.insertBefore(iframe, menuBdEl);
            }

            //var prt = el.parentNode;
            addEvent(menuEl, 'mouseover', function(event) {
                // Check if mouse(over|out) are still within the same parent element
                var parent = event.relatedTarget;

                // Traverse up the tree
                while (parent && parent !== menuEl) {
                    parent = parent.parentNode;
                }

                if (parent !== menuEl) {
                    S.each(self._subMenus, function(submenu) {
                        if (submenu !== menuBdEl) {
                            removeClass(submenu.parentNode, HOVER);
                            submenu.setAttribute("aria-hidden", "true");
                        }
                    });

                    //addClass(prt, HOVER);
                    addClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "false");

                    if (!iframe) return;
                    // 只有 menulist 显示出来后，才能获取 offset 值
                    // 高度减 5 是因为 ie6 下，iframe 处理 padding - bottom 的一个 bug
                    iframe.style.height = parseInt(menuBdEl.offsetHeight) + 25 + 'px';
                    iframe.style.width = parseInt(menuBdEl.offsetWidth) + 1 + 'px';
                }
            });

            addEvent(menuEl, 'mouseout', function(event) {
                // Check if mouse(over|out) are still within the same parent element
                var parent = event.relatedTarget;

                // Traverse up the tree
                while (parent && parent !== menuEl) {
                    parent = parent.parentNode;
                }

                if (parent !== menuEl) {
                    removeClass(menuEl, HOVER);

                    menuBdEl.setAttribute("aria-hidden", "true");

                    // 浮层隐藏后, 将 el 包含的 input 去除焦点
                    S.each(menuBdEl.getElementsByTagName('input'), function(el) {
                        if (el.getAttribute('type') !== 'hidden') {
                            el.blur();
                        }
                    });
                }
            });

            addEvent(menuEl, 'keydown', function(event) {
                var key = event.keyCode;
                // esc
                if (key == 27 || key == 37 || key == 38) {
                    removeClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "true");
                    menuHdEl.focus();
                    preventDefault(event);
                } else if (key == 39 || key == 40) {
                    addClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "false");
                    preventDefault(event);
                }
            });

            var hiddenTimer;
            addEvent(menuEl, isIE ? "focusin" : "focus", function() {
                if (hiddenTimer) {
                    clearTimeout(hiddenTimer);
                    hiddenTimer = null;
                }
            }, !isIE);

            addEvent(menuEl, isIE ? "focusout" : "blur", function() {
                hiddenTimer = setTimeout(function() {
                    removeClass(menuEl, HOVER);
                    menuBdEl.setAttribute("aria-hidden", "true");
                }, 100);
            }, !isIE);
        },

        /**
         * 初始化 Global 模块
         */
        init: function(cfg) {
            // 防止重复初始化 TB.Global
            if (IS_INIT) return;
            IS_INIT = true;

            assetsHost = IS_DAILY ? 'assets.daily.taobao.net' : 'a.tbcdn.cn';
            urlConfig = S.unparam(location.search.substring(1));
            siteNavElem = doc.getElementById('site-nav');

            // minicart 开关标志
            this._OFF = !!!siteNavElem;
            this.config = cfg;
            if (cfg && cfg.mc && cfg.mc === -1)  this._OFF = true;

            // 页面被嵌入时, 不需要进行初始化
            if (window.top !== window.self) {
//                S.log(['in frame, exit']);
                this._OFF = true;
            }

            // aria 中记录所有菜单
            this._subMenus = [];

            for (var k in runItems) {
                runItems[k]();
            }

            // add test for global.js
            if (~location.search.indexOf('__test__=global.js')) {
              S.ready(function() {
                S.later(_test, 3000);
              });
              function _test() {
                var globalVars = ['Light', 'TLabs'];
                for (var i=0; i<globalVars.length; i++) {
                  if (typeof globalVars === 'undefined') {
                    alert('test case: failure');
                    return;
                  }
                }
                alert('test case: success');
              }
            }
        },

        /**
         * 登录信息
         * config: {memberServer:'', loginServer:'', redirectUrl:'', loginUrl:'', logoutUrl:'', forumServer:'',outmemServer:''}
         * 注：config 的各项都是可选项
         */
        writeLoginInfo: function(config, async) {
            config = config || {};

            var self = this,
                nick = getCookie('_nk_') || getCookie('tracknick'), // 用户昵称，Session 内有效
                ucMap = unparam(getCookie('uc1')),// user cookie 用户的配置信息
                msgCount = parseInt(ucMap['_msg_']) || 0, // 站内信未读数量
                timeStamp = S.now(), // 时间戳
                logoutServer = 'http://login.taobao.com',

                memberServer = config['memberServer'] || 'http://member1.taobao.com',
                outmemServer = config['outmemServer'] || 'http://outmem.taobao.com',
                loginServer = config['loginServer'] || 'https://login.taobao.com',
                loginUrl = config['loginUrl'] || loginServer + '/member/login.jhtml?f=top', // 对于彩票等应用，直接传入loginUrl

                defaultRedirectUrl = location.href,
                redirectUrl, logoutUrl, regUrl, pMsgUrl, spaceUrl, output = EMPTY;

            // 对于登录页面，登录后默认跳转到我的淘宝。其它页面跳回当前页面
            if (/^http.*(\/member\/login\.jhtml)$/i.test(defaultRedirectUrl)) {
                // 为空时，后端会默认跳转到我的淘宝
                defaultRedirectUrl = EMPTY;
            }

            redirectUrl = config['redirectUrl'] || defaultRedirectUrl;
            if (redirectUrl) loginUrl += '&redirectURL=' + encodeURIComponent(redirectUrl);

            logoutUrl = config['logoutUrl'] || logoutServer + '/member/logout.jhtml?f=top&out=true&redirectURL=' + encodeURIComponent(redirectUrl); // 注销url
            regUrl = memberServer + '/member/newbie.htm'; // 注册url
            pMsgUrl = outmemServer + '/message/list_private_msg.htm?t=' + timeStamp;
            spaceUrl = 'http://i.taobao.com/my_taobao.htm?t=' + timeStamp;

            // 保存 logoutUrl，run() 函数里有用.
            savedLogoutUrl = logoutUrl;

            if (self.isLogin()) { // 已登录，显示：hi，XXX！[退出] 站内信(n)
                output = self.showVIP(logoutUrl);

                    // + '<a id="J_Logout" href="' + logoutUrl + '" target="_top">退出</a>'
                    // + '<a href="' + pMsgUrl + '" target="_top">站内信';
                // if (msgCount) {
                //     output += '(' + msgCount + ')';
                // }
                // output += '</a>';
            } else { // 未登录，显示：亲，欢迎来淘宝！[请登录] [免费注册]
                output = '亲，欢迎来淘宝！请<a href="' + loginUrl + '" target="_top">登录</a>';
                output += '<a href="' + regUrl + '" target="_top">免费注册</a>';
            }
          // {{{ added by yubo for async loading @20110816
          if (async) {
            var nav = document.getElementById('site-nav');
            if (nav) {
              var p = getElementsByClassName('login-info', '*', nav)[0];
           
              if (p && p.className === 'login-info') {
                p.innerHTML = output;
              }
            }

            return;
          }
        
          // }}}
          doc.write(output);

			if(self.showVIP(logoutUrl).length<1) return;
			
			var vipareas = document.getElementById('J_Vip_Areas');
            var timer = null;
			
            addEvent(vipareas, 'mouseover', function(e) {
                if(checkHover(e,this)){
                    timer && timer.cancel();
                    addClass(vipareas, 'user-hover');
                }
			});

			addEvent(vipareas, 'mouseout', function(e) {   
                if(checkHover(e,this)){     
                    timer && timer.cancel();
                    timer = S.later(function(){
                        removeClass(vipareas, 'user-hover'); 
                    }, 300);
                }
			});

            function contains(parentNode, childNode) {
                // if (parentNode.contains) {
                //     return parentNode != childNode && parentNode.contains(childNode);
                // } else {
                    while (childNode.nodeName !== 'BODY') {
                        if (parentNode === childNode.parentNode) {
                            return true;
                        }
                        childNode = childNode.parentNode;
                    }
                    return false;
                // }
            }

            function checkHover(e,target){
                if (getEvent(e).type=="mouseover")  {
                    return !contains(target,getEvent(e).relatedTarget||getEvent(e).fromElement) && !((getEvent(e).relatedTarget||getEvent(e).fromElement)===target);
                } else {
                    return !contains(target,getEvent(e).relatedTarget||getEvent(e).toElement) && !((getEvent(e).relatedTarget||getEvent(e).toElement)===target);
                }
            }

            function getEvent(e){
                return e||window.event;
            }
			

        },


        /**
         * 登录用户显示VIP 图标
         * 0：V0会员
         * 1：V1会员
         * 2：V2会员
         * 3：V3会员
         * 4：V4会员
         * 5：V5会员
         * 6：V6会员
         * 7：需要激活的会员
         * V3-V6会员增加“我的客服”图标
         * -1：普通会员，不展示
         */
		showVIP: function(logoutUrl) {
            var tag = parseInt(unparam(getCookie('uc1'))['tag']),
                ret = EMPTY,
                vip_my_power=EMPTY,
				vip_my_service=EMPTY,
                vip_host = 'http://vip' + HOSTNAME,
                timeStamp = S.now(),
                nick = getCookie('_nk_') || getCookie('tracknick'), // 用户昵称，Session 内有效
                spaceUrl = 'http://i.taobao.com/my_taobao.htm?t=' + timeStamp;

            
            if(tag===0 || tag===-1){
                vip_my_power='<a class="vip-my-power" href="http://vip.taobao.com/new.htm" rel="nofollow" target="_top">新手特训营购物入门</a>';
            }
            else if(tag===7){
                vip_my_power='<a class="vip-my-power" href="http://vip.taobao.com/vip_club.htm" rel="nofollow" target="_top">立刻激活我的身份</a>';
            }
            else{
                vip_my_power='<a class="vip-my-power" href="http://vip.taobao.com/growth_info.htm" rel="nofollow" target="_top">查看我的会员特权</a>';
            }

            if(tag===0 || tag===-1){
                vip_my_service='<a class="vip-my-service" href="http://vip.taobao.com/newuser/newGift.htm" rel="nofollow" target="_top">快去领新人礼金!</a>';
            }
            else if(tag>2&&tag<7){
                vip_my_service='<a class="vip-my-service" href="http://service.taobao.com/support/minerva/robot_main.htm?dcs=2&sourceId=400&businessId=100&moduleGroupId=taobaocrm" rel="nofollow" target="_top">我的客服</a>';
            }
            else{
                vip_my_service='<a class="vip-my-service" href="http://vip.taobao.com/growth_info.htm" rel="nofollow" target="_top">我的成长</a>';
            }
           

            if (S.indexOf(tag, [0, 1, 2, 3, 4, 5, 6, 7]) > -1) {
				//如果会员等级大于2，显示我的客服图标
				
                //ret = '<span class="menu"><a href="'+vip_host+'" rel="nofollow" target="_top"  class="user-vip vip-icon'+tag+'"> </a></span>';
			    ret = '<span class="vip-areas user" id="J_Vip_Areas">'
                    + '<span class="vip-head">'
                    +'<a class="user-nick" href="' + spaceUrl + '" target="_top">'
                    + escapeHTML(unescape(nick.replace(/\\u/g, '%u'))) + '</a>'
					+ '<a class="vip-icon'+ tag +'" id="J_VipIcon" rel="nofollow" target="_top" href="http://vip.taobao.com/"></a>'
                    + '<b></b>'
                    + '</span>'
					+ '<span class="vip-content" id="J_VipContent">'
                    + '<a href="http://i.taobao.com/my_taobao.htm" class="avatar"><img src="http://wwc.taobaocdn.com/avatar/getAvatar.do?userNick='+encodeGBK(escapeHTML(unescape(nick.replace(/\\u/g, '%u'))))+ '&width=80&height=80&type=sns" width="80" height="80"/></a>'
					+ '<span class="vip-operate"><a href="http://member1.taobao.com/member/fresh/account_security.htm" target="_top">帐号管理</a><a target="_top" href="'+ logoutUrl +'" id="J_Logout">退出</a></span>'
                    + '<span class="vip-my-level"><a class="vip-my-level'+ tag +'" target="_top" href="http://vip.taobao.com/growth_info.htm" rel="nofollow" target="_top"></a></span>'
					+ vip_my_power
					+ vip_my_service
                    + '<span class="vip-medal vip-loading" id="J_VipMedal">'
                    + '<span class="vip-medalgroup">'
                    + '<span class="vip-medal-content" id="J_VipMedalContent">'
                    + '</span>'
                    + '</span>'
                    + '<span class="vip-step"><a href="javascript:;" target="_self" class="vip-stepleft"><s class="arrow arrow-lthin"><s></s></s></a><a href="javascript:;" target="_self" class="vip-stepright"><s class="arrow arrow-rthin"><s></s></s></a></span>'
                    + '</span>'
					+ '</span>'
                    // + '<span class="vip-login">'
                    // + '<a href="" class="vip-login-back">返回<s class="arrow arrow-lthin"><s></s></s></a>'
                    // + '<iframe src="https://login.taobao.com/member/login.jhtml?style=mini&full_redirect=true&redirectURL=http%3A%2F%2Fwww.taobao.com%2F" frameborder="0" width="260" height="" scrolling="no"></iframe>'
                    // + '</span>'
					+ '</span>';
            }
            else{
                ret = '<span class="vip-areas user user-special" id="J_Vip_Areas">'
                    + '<span class="vip-head vip-head-special">'
                    +'<a class="user-nick" href="' + spaceUrl + '" target="_top">'
                    + escapeHTML(unescape(nick.replace(/\\u/g, '%u'))) + '</a>'                
                    + '<b></b>'
                    + '</span>'
                    + '<span class="vip-content vip-content-special" id="J_VipContent">'
                    + '<a href="http://i.taobao.com/my_taobao.htm" class="avatar"><img src="http://wwc.taobaocdn.com/avatar/getAvatar.do?userNick='+encodeURIComponent(nick)+ '&width=80&height=80&type=sns" width="80" height="80"/></a>'
                    + '<span class="vip-operate"><a href="http://member1.taobao.com/member/fresh/account_security.htm" target="_top">帐号管理</a><a target="_top" href="'+ logoutUrl +'" id="J_Logout">退出</a></span>'
                    + vip_my_power
                    + vip_my_service
                    + '<span class="vip-medal vip-loading" id="J_VipMedal">'
                    + '<span class="vip-medalgroup">'
                    + '<span class="vip-medal-content" id="J_VipMedalContent">'
                    + '</span>'
                    + '</span>'
                    + '<span class="vip-step"><a href="javascript:;" target="_self" class="vip-stepleft"><s class="arrow arrow-lthin"><s></s></s></a><a href="javascript:;" target="_self" class="vip-stepright"><s class="arrow arrow-rthin"><s></s></s></a></span>'
                    + '</span>'
                    + '</span>'
                    // + '<span class="vip-login">'
                    // + '<a href="" class="vip-login-back">返回<s class="arrow arrow-lthin"><s></s></s></a>'
                    // + '<iframe src="https://login.taobao.com/member/login.jhtml?style=mini&full_redirect=true&redirectURL=http%3A%2F%2Fwww.taobao.com%2F" frameborder="0" width="260" height="" scrolling="no"></iframe>'
                    // + '</span>'
                    + '</span>'; 
            }

            function encodeGBK(s) {
                var img = document.createElement("img");
                // escapeDBC 对多字节字符编码的函数
                function escapeDBC(s) {
                    if (!s) return ""
                    if (window.ActiveXObject) {
                        // 如果是 ie, 使用 vbscript
                        execScript('SetLocale "zh-cn"', 'vbscript');
                        return s.replace(/[\d\D]/g, function($0) {
                            window.vbsval = "";
                            execScript('window.vbsval=Hex(Asc("' + $0 + '"))', "vbscript");
                            return "%" + window.vbsval.slice(0,2) + "%" + window.vbsval.slice(-2);
                        });
                    }
                    // 其它浏览器利用浏览器对请求地址自动编码的特性
                    img.src = "http://www.atpanel.com/jsclick?globaljs=1&separator=" + s;
                    return img.src.split("?separator=").pop();
                }
                // 把 多字节字符 与 单字节字符 分开，分别使用 escapeDBC 和 encodeURIComponent 进行编码
                return s.replace(/([^\x00-\xff]+)|([\x00-\xff]+)/g, function($0, $1, $2) {
                    return escapeDBC($1) + encodeURIComponent($2||'');
                });
            }


   //           else if (tag === 7) { //如果用户需要激活或升级，只显示升级GIF动画
			//     ret = '<span class="vip-areas" id="J_Vip_Areas">'
			// 		+'<a class="vip-icon'+ tag +'" id="J_VipIcon" rel="nofollow" target="_top" href="http://vip.taobao.com"></a></span>';
   //          } else if (tag === 0) { //用户等级为V0，默认没有浮层
			// 	ret = '<span class="vip-areas" id="J_Vip_Areas">'
			// 		+ '<a class="vip-icon'+ tag +'" id="J_VipIcon" rel="nofollow" target="_top" href="http://vip.taobao.com/"></a></span>';
			// }
			
            return ret;
        },

        /**
         * 判断是否是登录用户
         * 用户是否已经登录。注意：必须同时判断 nick 值，因为 _nk_ 和 _l_g_ 有时不同步
         */
        isLogin: function() {
            /*if (win.userCookie) {
                return !!(win.userCookie._nk_);
            }*/
            var trackNick = getCookie('tracknick'),
                nick = getCookie('_nk_') || trackNick;

            return !!(getCookie('_l_g_') && nick || getCookie('ck1') && trackNick);
        },

        /**
        * 吊顶是否具有购物车元素
        */
        getCartElem: function() {
            return siteNavElem  && getElementsByClassName('cart', 'li', siteNavElem)[0];
        },

        /**
         * 初始化 mini 购物车
         */
        initMiniCart: function() {
            // 到此 要保证有 cookie or userCookie 值
            var self= this,
                CARTNUM_API = 'http://cart' + HOSTNAME
                            + '/top_cart_quantity.htm?',
                request = function() {
                    // 请求购物车数量
                    S.getScript(CARTNUM_API + 'callback=TB.Global.setCartNum' + '&t=' + S.now() + (APPID ? '&appid=' + APPID : EMPTY));
                };
            if (self._OFF = (self._OFF || !!!self.getCartElem())) return;

            var mt = unparam(getCookie('mt')), ci, cp;

            // 读取 cookie 成功
            if (mt && (ci = mt.ci)) {
                ci = ci.split('_');
                cp = parseInt(ci[1]);
                ci = parseInt(ci[0]);
                //  是否关掉, true 为 关掉, false/undefined 为 开启
                self._OFF = ci < 0;

                if (ci < 0) {
//                    S.log('ci < 0, not request and not init minicart');
                    return;
                }
                if (self.isLogin()) {
                    if (cp === 0) {
//                        S.log('login , cp = 0, ci >= 0, requesting');
                        request();
                    } else if (cp === 1) {
//                        S.log('login , cp = 1, minicart is init.');
                        TB.Global.setCartNum(ci);
                    }
                } else {
                    if (cp === 0) {
//                        S.log('not login , cp = 0, ci >= 0, minicart is init.');
                        TB.Global.setCartNum(ci);
                    }
                    else if (cp === 1) {
//                        S.log('not login , cp = 1, ci >= 0, requesting.');
                        request();
                    }
                }
            } else {
//                S.log(['no mt, requesting']);
                request();
            }

            //this.cartRedirect('http://www.taobao.com/');
        },

        /**
         * 设置 mini 购物车的数量
         */
        setCartNum: function(num) {
            //  不用this, 而用 TB.Global 是因为 detail 上, 调用 setCartNum 时 this 为 window 了
            if (!S.isNumber(num) || TB.Global._OFF) return;

            var trigger = TB.Global.getCartElem();

            if (!trigger) return;

            var elem = trigger.getElementsByTagName('a')[0],
                title = '<span class="mini-cart-line"></span><s></s>' +'购物车',
                // 在购物车页面, 不显示浮层
                showLayer = APPID !== 19;

            // 数量小于 0 时
            if (num < 0) {
                // 只要有 -1 就表示关闭
                TB.Global._OFF = num === -1;

                elem.innerHTML = title;
                removeClass(trigger, MINICART_CLS);

                win.MiniCart && win.MiniCart.hide();
                return;
            }

            elem.innerHTML = title + '<span class="mc-count' + (num < 10 ? ' mc-pt3' : EMPTY) + '">' + num + '</span>' + '件' + (showLayer?'<b></b>':EMPTY);
            elem.href = 'http://ju.atpanel.com/?url=http://cart' + HOSTNAME
                      + '/my_cart.htm?from=mini&ad_id=&am_id=&cm_id=&pm_id=150042785330be233161';
            addClass(trigger, MINICART_CLS);
            if (!showLayer) {
                addClass(trigger, MINICART_NO_LAYER_CLS);
            }
            addClass(trigger, 'menu');
            addClass(elem, 'menu-hd');
            elem.id = 'mc-menu-hd';

            if (win.MiniCart) {
                win.MiniCart.cartNum = num;
                win.MiniCart.isExpired = true;
            } else {
                S.ready(function() {
                    var times = 0;
                    S.getScript('http://' + assetsHost + '/p/global/1.0/minicart-min.js?t=20110811.js', function() {
                        // minicart.js 依赖于 ks-core, 延迟+检测S.DOM是否ok
                        if (S.DOM) {
                            win.MiniCart.init(num, showLayer);
                        } else {
//                            S.log('minicart: try ' + times);
                            if (times < 10) {
                                setTimeout(arguments.callee, 1000);
                                times++;
                            }
                            // 如果实在没有 ks-core
                            else {
                                S.use('core', function() {
                                    win.MiniCart.init(num, showLayer);
                                });
                            }
                        }
                    });
                });
            }
        },

        /**
         * 给 tmall 下运行那些依赖于 cookie 的功能, 包含 mini 购物车, Tlabs
         * @param cfg
         */
        run: function(cfg) {
            var self = this;

            self.initMiniCart();
            /*runItems.tLabs();*/

            // 显示 vip icon
            if (self.isLogin()) {
                var times = 0;

                // 等待 login-api, 设置 DOM 后, 再加入 VIP 标志, 不然的话总是没有登出元素的
                S.later(function() {
                    var logoutEl = doc.getElementById('J_Logout');
//                    S.log(['tmall vip try: ', times]);
                    if (!logoutEl) {
                        if (times < 20) {
                            setTimeout(arguments.callee, 20);
                            times++;
                        }
                        return;
                    }

                    var html = self.showVIP(savedLogoutUrl || "");
                    if (html.length < 1) return;

                    var div = doc.createElement('div');
                    div.innerHTML = html;
                    logoutEl.parentNode.insertBefore(div.firstChild, logoutEl);

                    self._addMenu(div.firstChild);
                }, 30);
            }
        },

        /**
         * 安全中心的用户提示信息接口回调
         * @param data
         */
        setUserMsg: function(data) {
            if (data.success && data.success === 'true') {
                var DOM = S.DOM;
                if (!DOM) return;

                var loginElem = DOM.get('.login-info', siteNavElem),
                    offset = DOM.offset(loginElem),
                    elem = DOM.get('#gb-msg-notice'),
                    contentElem;
                // 页面上 #gb-msg-notice 元素表示用户消息容器;
                if (!elem) {
                    elem = DOM.create('<div id="gb-msg-notice"><div class="gb-msg-inner gb-msg-info"><p class="gb-msg-content">'
                        + data['result']['messages'][0]
                        + '</p><div class="gb-msg-icon gb-msg-close" title="关闭"></div></div><div class="gb-msg-icon gb-msg-tri"><div class="gb-msg-icon gb-msg-tri-inner"></div></div></div>');
                    DOM.append(elem, siteNavElem.parentNode);
                    DOM.offset(elem, {
                        left: offset.left + 30,
                        top: offset.top + DOM.height(loginElem) + 1
                    });
                    S.Event.on(elem, 'click', function(e) {
                        var t = e.target;
                        if (DOM.hasClass(t, 'gb-msg-close')) {
                            DOM.hide(elem);
                        }
                    });
                } else {
                    contentElem = DOM.get('.gb-msg-content', elem);
                    DOM.html(contentElem, data['result']['messages'][0]);
                    DOM.show(elem);
                }
            }
        }
    };


  ////////////////////////////////////////
  // 购物车登陆前置

  TB.Cart = S.merge({}, {

    domain: document.domain.indexOf('taobao.net') > -1 ? 'daily.taobao.net' : 'taobao.com',
    API:    'http://cart.%domain%/check_cart_login.htm',
    cache:  {},
    popup:  null,

    redirect: function(trigger, url) {
      var args = S.makeArray(arguments);
      var func = arguments.callee;
      var self = this;

      if (url.indexOf('ct=') === -1 && getCookie('t')) {
        url = url + (url.indexOf('?')===-1?'?':'&') + 'ct=' + getCookie('t');
      }

      if (!S.DOM || !S.Event) {
        S.getScript('http://a.tbcdn.cn/s/kissy/1.1.6/packages/core-min.js', function() {
          func.apply(self, args);
        });
        return;
      }

      this._addStyleSheetOnce();
      var guid = S.guid();
      this.cache[guid] = S.makeArray(arguments);
      S.getScript(this.API.replace('%domain%', this.domain)+'?callback=TB.Cart.redirectCallback&guid='+guid, {
        timeout: 4000,
        error: function() {
          window.top.location.href = url;
        }
      });
    },

    redirectCallback: function(data) {
      var guid = data.guid;
      var url = S.trim(this.cache[guid][1]);
      if (!data['needLogin']) {
        window.top.location.href = url;
        return;
      }
      if (!guid) {
        throw Error('[error] guid not found in callback data');
      }
      if (!this.popup) {
        this.popup = this._initPopup();
      }
      this._initLoginIframe(url);
    },

    hidePopup: function(e) {
      e && e.preventDefault && e.preventDefault();
      S.DOM.css(this.popup, 'visibility', 'hidden');
    },

    showPopup: function() {
      this._centerPopup();
      S.DOM.css(this.popup, 'visibility', 'visible');
    },

    _centerPopup: function() {
      var top = (S.DOM.viewportHeight() - parseInt(S.DOM.css(this.popup, 'height'), 10)) / 2;
      top = top < 0 ? 0 : top;
      S.DOM.css(this.popup, 'top', top);
    },

    _addStyleSheetOnce: function() {
      if (!this._stylesheetAdded) {
        S.DOM.addStyleSheet('' +
          '#g-cartlogin{position:fixed;_position:absolute;border:1px solid #aaa;left:50%;top:120px;margin-left:-206px;width:412px;height:272px;z-index:10001;background:#fafafa;-moz-box-shadow:rgba(0,0,0,0.2) 3px 3px 3px;-webkit-box-shadow:3px 3px 3px rgba(0,0,0,0.2);filter:progid:DXImageTransform.Microsoft.dropshadow(OffX=3,OffY=3,Color=#16000000,Positive=true);} #g_minicart_login_close{position:absolute;right:5px;top:5px;width:17px;height:17px;background:url(http://img01.taobaocdn.com/tps/i1/T1krl0Xk8zXXXXXXXX-194-382.png) no-repeat -100px -69px;text-indent:-999em;overflow:hidden;}' +
          '#g-cartlogin-close{cursor:pointer;position:absolute;right:5px;top:5px;width:17px;height:17px;line-height:0;overflow:hidden;background:url(http://img03.taobaocdn.com/tps/i1/T1k.tYXadGXXXXXXXX-146-77.png) no-repeat -132px 0;text-indent:-999em;}' +
          '');
        this._stylesheetAdded = true;
      }
    },

    _initPopup: function() {
      var popup = S.DOM.create('<div id="g-cartlogin"></div>');
      S.DOM.append(popup, S.DOM.get('body'));
      return popup;
    },

    _initLoginIframe: function(url) {
      var iframeSrc = 'https://login.' + this.domain + '/member/login.jhtml?from=globalcart&style=mini' +
        '&redirectURL=' + encodeURIComponent(url) + '&full_redirect=true';
      this.popup.innerHTML = '' +
        '<iframe src="'+iframeSrc+'" width="410" height="270" frameborder="0" scrolling="0"></iframe>' +
        '<span title="关闭" id="g-cartlogin-close">关闭</span>';
      S.Event.on('#g-cartlogin-close', 'click', this.hidePopup, this);
      this.showPopup();
    }

  });


    //////////////////////////////////////////////////////
    // Utilities

    /**
     * 获取 Cookie
     */
    function getCookie(name) {
        if (win.userCookie && !S.isUndefined(win.userCookie[name])) {
            return win.userCookie[name];
        }

        if (S.isUndefined(COOKIES[name])) {
            var m = doc.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
            COOKIES[name] = (m && m[1]) ? decodeURIComponent(m[1]) : EMPTY;
        }
        return COOKIES[name];
    }

    /**
     * 编码 HTML (from prototype framework 1.4)
     */
    function escapeHTML(str) {
        var div = doc.createElement('div'),
            text = doc.createTextNode(str);
        div.appendChild(text);
        return div.innerHTML;
    }

    /**
     * 通过 ClassName 获取元素
     */
    function getElementsByClassName(cls, tag, context) {
        var els = context.getElementsByTagName(tag || '*'),
            ret = [], i = 0, j = 0, len = els.length, el, t;

        cls = SPACE + cls + SPACE;
        for (; i < len; ++i) {
            el = els[i];
            t = el.className;
            if (t && (SPACE + t + SPACE).indexOf(cls) > -1) {
                ret[j++] = el;
            }
        }
        return ret;
    }

    /**
     * 添加事件
     */
    function addEvent(el, type, fn, capture) {
        if (!el) return;
        if (el.addEventListener) {
            el.addEventListener(type, fn, !!capture);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, fn);
        }
    }

    /**
     * 删除事件
     */
    function removeEvent(el, type, fn, capture) {
        if (!el) return;
        if (el.removeEventListener) {
            el.removeEventListener(type, fn, !!capture);
        } else if (el.detachEvent) {
            el.detachEvent('on' + type, fn);
        }
    }

    /**
     * 简易版增加/删除元素的 class
     * @param elem
     * @param cls
     */
    function addClass(elem, cls) {
        var className = SPACE + elem.className + SPACE;

        if (className.indexOf(SPACE + cls + SPACE) === -1) {
            className += cls;
            elem.className = S.trim(className);
        }
    }

    function removeClass(elem, cls) {
        var className = SPACE + elem.className + SPACE;

        if (className.indexOf(SPACE + cls + SPACE) !== -1) {
            className = className.replace(SPACE + cls + SPACE, SPACE);
            elem.className = S.trim(className);
        }
    }

    /**
     * unparam
     */
    function unparam(str) {
        if (win.userCookie && win.userCookie.version == "2") {
            return S.unparam(str, "&amp;");
        }
        return S.unparam(str);
    }

    function preventDefault(e){
        // if preventDefault exists run it on the original event
        if (e.preventDefault) {
            e.preventDefault();
        }
        // otherwise set the returnValue property of the original event to false (IE)
        else {
            e.returnValue = false;
        }
    }

})();
