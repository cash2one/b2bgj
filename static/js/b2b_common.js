YUI.Env.JSONP = {
    getHotCityData: function(o) {
        backHotCityData = o;
    }
}

/**
*http://a.tbcdn.cn/??apps/et/trip-home/js/kezhan_v1.1.js
* @path: apps/et/trip-home/js/kezhan_v1.1.js
* @author: zining@taobao.com
* @data: 2012/04/13
*/
YUI().use('gallery-form-values','io','trip-search-form', 'trip-autocomplete', 'trip-calendar', 'node', 'trip-box', 'jsonp', 'event', 'trip-mustache','autocomplete','autocomplete-filters','autocomplete-highlighters', 'imageloader', function(Y) {
    
    Y.one('body').addClass('yui3-skin-sam');

    /*iframe高度自定义,解决跨域问题*/
    /*
    var getDomain = function() {
    var arr = location.hostname.split('.'),
    len = arr.length;
    return arr.slice(len - 2).join('.');
    };
    document.domain = getDomain();
    */

    /* added by shaobo 提前初始化搜索 */
    var _toCity = null,
    _searchKeyword = null,
    _searchForm = null,
    _submitInnSearch = function() {
        // 针对不支持placeholder的浏览器，需要在提交表单前判断是否有用户输入
        if (_toCity._node.value === _toCity.getAttribute('placeholder')) {
            _toCity.set('value', '')
        };
        if (_searchKeyword._node.value === _searchKeyword.getAttribute('placeholder')) {
            _searchKeyword.set('value', '')
        };
        _searchForm.submit();
    };

    Y.on('domready',function(){
        Y.one("body").delegate("click", function(e) {
            var lightboxID = this.getAttribute("data-lightboxid");
            Y.all(".lightbox").each(function(i) {
                if (i.getAttribute("data-lightboxid") == lightboxID) {
                    i.setStyle('display','block');
                }
            })
        },".show-lightbox");

        Y.all('.lightbox [rel=close]').on("click",function(e) {
            e.target.ancestor('.lightbox').hide();
        });

        function changeStyle(name, filepath) {
            var href = filepath;
            if (name === "default") {
                Y.one('#skins').remove();
                return;
            }

            if (Y.one('#skins')==null) {
                Y.one('head').append('<link id="skins" rel="stylesheet" href="' + href + '"  />');
            } else {
                Y.one('#skins').set("href", href);
            }
        }

        Y.all('.change-style').on('click', function(e) {
            var that = e.currentTarget;
            // var path = that.getData('filepath');
            // var color = that.getData('color');
            var path = that.getAttribute('data-filepath')
            var color = that.getAttribute('data-color')
            changeStyle(color, path);
        });

        Y.one('.arrow5').on('click', function() {
            Y.one('.head').toggleView();
            this.toggleClass('arrow5h');
        });

        Y.one('.arrow4').on('click', function() {
            Y.one('.sidebar').toggleView();
            this.toggleClass('arrow4h');
            Y.one('body').toggleClass('hide-sidebar');
        });

        Y.all(".mo-jptj .dropdown").on("hover", function(i) {
            Y.one(".box").setStyle("display", "block");
        },function(i) {
            Y.one(".box").setStyle("display", "none");
        });

        // 酒店搜索模块日历和placeholder控件初始化							
        var hotelDate = new Y.TripCalendar({
            beginNode: '#depDateNode',
            endNode: '#arrDateNode',
            limitBeginDate: new Date(),
            limitDays: 28,
            isWeek: false,
            isFestival: false,
            titleTips: "XXXXXXXXXXXX"
        }),
        depCity = new Y.TripAutoComplete({
            inputNode: '.depcity',
            codeInputNode: '.depcity_hidden',
            source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
            // source: 'ajax/citysearch.js?&callback={callback}&q=',
            hotSource: 'ajax/hotcity.js'
        }),
        toCity = new Y.TripAutoComplete({
            inputNode: '.arrcity',
            codeInputNode: '.arrcity_hidden',
            source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
            hotSource: 'ajax/hotcity.js'
        });
        //全局保存城市，关键字element
        // _toCity = Y.all('.endcity');
        // _searchKeyword = Y.one('#J_search_keyword');
        // _searchForm = Y.one('#J_kezhan_form');
        // 
        // Y.TripPlaceholder.init('#J_search_keyword');
        // 
        // new Y.SearchForm({node:'#J_kezhan_form', 'storage':false, 'afterValidate':function(){
            // 	_submitInnSearch();
    // }});

    /*异步获取数据 列表
    function showList(k){
    //变量初始化
    var tabPannel =Y.all('#J_box .tab-pannel'), //客栈相关产品容器
    cityhotelnum = tabPannel.item(k).one("span.J_cityhotelnum"), //tab下的客栈数量信息
    pdid = [], //数组
    productId, //产品ID			
    items, //callback客栈ID列表
    configUrl, //请求jsonp
    getUrl; //转化jsonp

    productId = tabPannel.item(k).all('li').get('id');									
    for(var i=0; i<productId.length; i++){
    pdid.push(productId[i].replace('pd_',''));
    }				
    pdid=pdid.join('|');
    //var configUrl ="http://kezhan.trip.daily.taobao.net/getKezhanList.htm?depCity={{cityCode}}&productId={{productId}}&callback={callback}";	
    configUrl ="http://kezhan.trip.taobao.com/getKezhanList.htm?depCity={{cityCode}}&productId={{productId}}&callback={callback}";								
    getUrl = Y.Mustache.to_html(configUrl, {productId: pdid,cityCode: Y.one('#J_changeNav li.selected a').getAttribute('data-code')});
    if(getUrl){
    Y.jsonp(getUrl, {					
    on : {							
    success : function(response){									
    if(response.code == 200){																															
    cityhotelnum.setContent('<em>' + response.data.hotelnum + '</em>'+ '家客栈,共<em>'+ response.data.peoplenum +'</em>人去过');
    items = response.data.pdlist;																		
    Y.each(items,function(pdcomment, pdid){
    Y.one("#pd_" + pdid + " .J_commentNum").setContent(pdcomment);											
    });										 																				
    }else{																													
    Y.all('#J_box .J_cnone').remove(); 
    }
    }															
    }
    });
    }																																				
    };
    //showList(0);
    /* 列表 end*/

    /*屏幕滚动，延时加载
    var sImg = function(index){
    var ImageLazyloader, 
    rendered = false;

    function renderImageLazyloader(){
    ImageLazyloader = new Y.ImgLoadGroup({
    name: 'insure-imageloader',
    foldDistance: 50
    });
    }

    function registerImages(len){
    var tabPannel = Y.all('.tab-pannel');               
    tabPannel.item(len).all('.J_imglist').each(function(node) {
    node.setAttribute('id', Y.stamp(node));
    ImageLazyloader.registerImage({ 
    domId: node.get('id'),
    srcUrl: node.getAttribute('image-lazyload') 
    });
    });
    }

    function render(len){
    renderImageLazyloader();
    registerImages(len);
    rendered = true;
    }

    render(index);

    };
    //sImg(0);	
    /*屏幕滚动 图片延迟 end*/

    /*tab切换
    var TabClick = new Y.Slide('J_tablist',{
    autoSlide:false,
    eventype:'click'
    });
    // 点击tab获得索引值执行showList;
    TabClick.on('switch',function(data){		
    var index = parseInt(data.index);						

    setTimeout(function(){
    //延时加载
    showList(index);
    sImg(index);												
    },10);
    });				
    /*tab切换 end*/

    /*顶部图片hover效果
    Y.one('.adImgBox table').delegate('hover', function(e){
    var tar = e.currentTarget;		
    var spanInMe = tar.one('.J_spanbox');		
    spanInMe.removeClass('hide');
    },function(e) {		
    var tar = e.currentTarget;		
    var spanInMe = tar.one('.J_spanbox');		
    spanInMe.addClass('hide');		
    }, '.J_hoverA');
    /*顶部图片hover效果 end*/

    /*分享收藏
    Y.on('click',function(e){
    e.halt();
    if(!e.target.getAttribute('data-url')) return;
    //var tbToken = '&_tb_token_=' + Y.one('.J_tbToken')._node.value;
    var box = new Y.Box({
    head:'添加收藏<a class="close closebtn" style="cursor: pointer;"><img border="0" src="http://img01.taobaocdn.com/tps/i1/T1DeKaXcBxXXXXXXXX-10-10.png"></a>',
    body:'<iframe id="J_BoxIframe" src="'+e.target.getAttribute('data-url')+'" frameborder="0" width="445px" height="100%" scrolling="no"></iframe>',
    width:450,
    height:265
    });
    box.render();

    var inter;			
    Y.on('click',function(e){
    e.halt();
    box.close();
    clearInterval(inter);
    },'.close');

    var tmp = Y.one("#J_BoxIframe"),
    scIframe = tmp._node;
    setTimeout(function(){
    tmp.on("load", function(){
    setIHeight();
    inter = setInterval(setIHeight, 3000);
    if(Y.UA.ie){
    var closeNode = scIframe.contentWindow.document.getElementById("J_ClosePopup");
    } else {
    var closeNode = scIframe.contentDocument.getElementById('J_ClosePopup');					
    }	
    closeNode && (Y.one(closeNode).setStyle("display", "none"));				  
    });
    }, 100);

    function setIHeight(){
    if (!Y.Cookie.get('_nk_')) {
    var hh = 275;
    }
    else {
    var hh = document.getElementById('J_BoxIframe').contentWindow.document.body.scrollHeight;
    }				
    Y.one('#J_BoxIframe').setAttribute('height',hh+'px');
    Y.one('.yui3-widget').setStyle('height',(hh+35));
    Y.one('.yui3-widget .yui3-overlay-content').setStyle('height',(hh+35));
    Y.one('.yui3-widget .yui3-widget-bd').setStyle('height',hh);
    }					
    },'.J_favourite');
    /*分享收藏 end*/

    /*回到顶部*/
    function gotop (){
        var ie6 = !window.XMLHttpRequest;
        var a = document.getElementById('J_goTop');
        a.style.position = ie6 ? 'absolute' : 'fixed';
        a.style.right = 10 + 'px';
        a.style.bottom =10 + 'px';
        if (ie6) {
            window.onscroll = function() {
                a.className = a.className;
            };
        }
    }
    //   gotop();
    /*回到顶部 end*/

    /*航班查询*/
    function init_hbcx(){
        var spin_wrap = Y.Node.create('<div style="display:none" class="loading">');
        spin_wrap.setContent('<span>数据加载中...<span>');
        Y.one(".mo-hbcx .block2").prepend(spin_wrap);
        Y.one(".J_Hbcx_Search").on('click',function(e){
            e.preventDefault();
            var url=this.getAttribute('data-url');
            if(!url)return;
            Y.io(url,{
                form:{
                    id:"aspnetForm" 
                },
                on:{
                    start:function(){
                        spin_wrap.show(); 
                    },
                    error:function(){},
                    success:function(i,res){
                        spin_wrap.hide(); 
                        Y.one('#J_Hbcx_DataTable').setContent(res.responseText);
                        more_hbcx();
                    } 
                } 
            }); 
        });
    }

    function more_hbcx(){
        Y.all(".mo-hbcx .more").on('click',function(e) {
            var that = e.currentTarget;
            var ajaxurl = that.getAttribute("data-ajaxurl");
            var container = that.ancestor("tr").next().one("td");

            if (container.hasClass("loaded")) {
                container.removeClass("loaded");
                that.removeClass("more-h");
                container.all(".dancheng-ajax-wrapper").remove();
            } else {
                Y.io(ajaxurl,{
                    on:{
                        start:function(){},
                        error:function(){},
                        success: function(st,s) {
                            container.addClass("loaded");
                            d = s.response;
                            container.prepend(d);
                            that.addClass("more-h");
                        }
                    } 
                });
            }

        });
    }
    init_hbcx();
    /*航班查询 end*/

    YY=Y

    /*航空公司自动补全*/
    var airlineslist=['不限'
        ,'Z-中国国航-CA'
        ,'N-南方航空-CZ'
        ,'D-东方航空-MU'
        ,'A-奥凯航空公司-BK'
        ,'B-北京首都航空有限公司-JD'
        ,'C-成都航空有限公司-EU'
        ,'D-大新华航空公司-CN'
        ,'H-河北航空公司-NS'
        ,'H-海南航空公司-HU'
        ,'H-河南航空有限公司-VD'
        ,'H-华夏航空公司-G5'
        ,'J-吉祥航空公司-HO'
        ,'K-昆明航空有限公司-KY'
        ,'S-四川航空公司-3U'
        ,'S-山东航空公司-SC'
        ,'S-深圳航空公司-ZH'
        ,'S-上海航空公司-FM'
        ,'T-天津航空有限责任公司-GS'
        ,'X-西部航空公司-PN'
        ,'X-幸福航空有限责任公司-JR'
        ,'X-厦门航空有限公司-MF'
        ,'X-祥鹏航空公司-8L'
    ,'Z-中国联合航空公司-KN'];

    Y.one('.airlines').plug(Y.Plugin.AutoComplete, {
        // resultHighlighter: 'phraseMatch',
        resultFilters: ['charMatch', 'wordMatch'],
        source:airlineslist,
        on:{
            select:function(e){
                var arr = e.result.display.split('-');
                var input = this._inputNode.next();
                input.setAttribute('value',arr[2]);
            }
        },
        activateFirstItem:true
    });
    /*航空公司自动补全 end*/


    })


})


// YUI().use('node', 'array-extras', 'querystring-stringify', function (Y) {
//     var form = Y.one('.mo-hbcx .block1'), query;

//     query = Y.QueryString.stringify(Y.Array.reduce(Y.one(form).all('input[name],select[name],textarea[name]')._nodes, {}, function (init, el, index, array) {
//         init[el.name] = el.value;
//         return init;
    //     }));

    //     console.log(query);
    // });

