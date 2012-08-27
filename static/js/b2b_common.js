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
YUI().use('node-event-simulate','gallery-formmgr', 'io', 'node','json', 'jsonp', 'event', 'autocomplete', 'autocomplete-filters', 'imageloader', 'trip-mustache', 'trip-autocomplete', 'trip-calendar', 'trip-box', function(Y) {
    var submitedData;
    /*iframe高度自定义,解决跨域问题*/
    /*
       var getDomain = function() {
       var arr = location.hostname.split('.'),
       len = arr.length;
       return arr.slice(len - 2).join('.');
       };
       document.domain = getDomain();
       */
    Y.on('domready', function() {

        /* 调用yui默认组件皮肤 */
        Y.one('body').addClass('yui3-skin-sam');

        /*弹出窗overlay*/
        function lightbox() {
            Y.one('body').delegate('click', function(e) {
                var uid = '-' + this.get('id');
                var lightboxid = this.getAttribute('data-lightboxid');
                var lightboxID =  lightboxid + uid;

                var url = this.getAttribute('data-url');
                var buy = this.getAttribute('data-buy');
                var FlightNo = '&FlightNo=' + this.getAttribute('data-flightno');
                var Price = '&Price=' + this.getAttribute('data-price');

                submitedData = submitedData || this.getAttribute('data-params');

                if(lightboxid =='CPQR'){
                    //todo
                    show(function(i){
                        i.one('.submit').on('click',function(){
                            Y.io('#',{
                                method:'post',
                                on:{
                                    success:function(){
                                        console.log(123);
                                    },
                                    error:function(){
                                        console.log('error');
                                    }
                                }
                            }); 
                        });
                    });
                }

                function show(fn){
                    Y.all('.lightbox').each(function(i) {
                        if (i.getAttribute('data-lightboxid') + uid == lightboxID) {
                            i.setStyle('display', 'block');
                            lightboxID = null;
                            fn && fn.call(this,i);
                        }
                    });

                    Y.all('.lightbox [rel=close]').on('click', function(e) {
                        if (buy && e.target.hasClass('submit')) {
                            location.href = buy + submitedData;
                        } else {
                            e.target.ancestor('.lightbox').hide();
                        }
                    });
                };

                if (url) {
                    // Make it cached
                    if (Y.one('.lightbox' + uid)) {
                        return show();
                    }
                    Y.io(url, {
                        data: 'time=' + new Date().getTime(),
                        on: {
                            success: function(i, res) {
                                //var templ = Y.one('#TSXX-template').getContent();
                                //var data = {
                                //	uid: uid,
                                //	response: res.responseText
                                //	}

                                //	var lightboxTemplate = Y.Mustache.to_html('{{={@ @}=}}' + templ, data);
                                var lightboxTemplate=''+
                                    '<div class="lightbox lightbox-1 lightbox'+uid+'" data-lightboxid="TSXX">'+
                                    '    <table cellspacing="0">'+
                                    '       <tr>'+
                                    '           <td>'+
                                    '               <div class="lightbox-content">'+
                                    '                    <i class="close" rel="close">×</i> '+
                                    '    <div class="lightbox-head">'+
                                    '        <h3>提示信息</h3>'+
                                    '   </div>'+
                                    '    <div class="lightbox-body">'+
                                    '<p>'+res.responseText+'</p>'+
                                    '        <p>&nbsp;</p>'+
                                    '       <p class="gray">'+
                                    '           以上退改签规定以航空公司为准，或致电退改热线咨询 '+
                                    '      </p>'+
                                    '    <p>&nbsp;</p>'+
                                    '<p class="center">'+
                                    '     <input type="button" class="button button1 submit" value="确定" name="" rel="close" />'+
                                    '      <input type="button" class="button button1" value="取消" name="" rel="close" />'+
                                    '   </p>'+
                                    '</div>'+
                                    '            </div>'+
                                    '         </td>'+
                                    '      </tr>'+
                                    '   </table>'+
                                    '</div>';
                                Y.one('body').append(lightboxTemplate);
                                show();
                            }
                        }
                    });
                } else {
                    show();
                }


            },
            ".show-lightbox");

        }
        lightbox();
        /*弹出窗overlay end*/

        /*  绑定全局日历组件 */
        Y.on('available', function() {
            Y.all('.datepicker').each(function(i){
                if(i.get('parentNode').hasClass('datepicker-wrapper')){
                    return;
                }else{
                    i = i.wrap('<u>').get('parentNode');
                    new Y.TripCalendar({
                        beginNode: i
                    });
                }
            });
        },'.datepicker');

        /* 换肤 */
        function changeSkin(name, filepath) {
            var href = filepath;
            if (name === "default") {
                Y.one('#skins').remove();
                return;
            }

            if (Y.one('#skins') == null) {
                Y.one('head').append('<link id="skins" rel="stylesheet" href="' + href + '"  />');
            } else {
                Y.one('#skins').set("href", href);
            }
        }

        Y.all('.change-style').on('click', function(e) {
            var that = e.target;
            // var path = that.getData('filepath');
            // var color = that.getData('color');
            var path = that.getAttribute('data-filepath')
            var color = that.getAttribute('data-color')
            changeSkin(color, path);
        });
        /* 换肤 end */

        /* 隐藏头部菜单 */
        Y.one('.arrow5').on('click', function() {
            Y.one('.head').toggleView();
            this.toggleClass('arrow5h');
        });

        /* 隐藏左侧菜单 */
        Y.one('.arrow4').on('click', function() {
            Y.one('.sidebar').toggleView();
            this.toggleClass('arrow4h');
            Y.one('body').toggleClass('hide-sidebar');
        });

        /*机票统计页面*/
        Y.on('available', function() {
            Y.all(".dropdown").on("hover", function(i) {
                Y.one(".box").setStyle("display", "block");
            },
            function(i) {
                Y.one(".box").setStyle("display", "none");
            });
        },
        '.mo-jptj');

        /*订单详情页面*/
        Y.on('available', function(){
            Y.one('.rp-fp-checkbox').on('click',function(e){
                if(this.get('checked')){
                    Y.one('.rq-fp').setStyle('display','block'); 
                }else{
                    Y.one('.rq-fp').setStyle('display','none');  
                }
            });

            Y.one('.pszq').on('click',function(e){
                if(this.get('checked')){
                    Y.one('.psfs_box').setStyle('display','none'); 
                }
            });

            Y.one('.psdf').on('click',function(e){
                if(this.get('checked')){
                    Y.one('.psfs_box').setStyle('display','block');  
                }
            });

            Y.one('.select_pas_type').on('change',function(e){
                if (this.get('value')==2){
                    Y.one('.uploads-box').setStyle('display','block');
                }else{
                    Y.one('.uploads-box').setStyle('display','none');
                }

            });

            Y.one('.fp-one').on('click',function(e){
                if(this.get('checked')){
                    Y.one('.fpone-one').setStyle('display','block'); 
                    Y.one('.fpone-mul').setStyle('display','none');  
                }else{
                    Y.one('.fpone-one').setStyle('display','none'); 
                    Y.one('.fpone-mul').setStyle('display','block');  
                }
            });

            Y.one('.fp-mul').on('click',function(e){
                if(this.get('checked')){
                    Y.one('.fpone-one').setStyle('display','none'); 
                    Y.one('.fpone-mul').setStyle('display','block');  
                }else{
                    Y.one('.fpone-one').setStyle('display','block'); 
                    Y.one('.fpone-mul').setStyle('display','none');  
                }
            });

        },'.mo-tjdd');

        /*航班查询页面*/
        Y.on('available', function() {
            /*表单验证*/
            var form = new Y.FormManager('aspnetForm', {
                status_node: '#form-status'
            });

            Y.all('input').get('parentNode').addClass('formmgr-row')
            Y.all('input').insert('<span class="formmgr-message-text"/>', 'after');

            form.prepareForm();

            form_hbcx();
            init_calendar();

            function form_hbcx() {
                /*城市搜索建议*/
                citySuggest();

                /*航空公司自动补全*/
                var airlines = ['不限', 'Z-中国国航-CA', 'N-南方航空-CZ', 'D-东方航空-MU', 'A-奥凯航空公司-BK', 'B-北京首都航空有限公司-JD', 'C-成都航空有限公司-EU', 'D-大新华航空公司-CN', 'H-河北航空公司-NS', 'H-海南航空公司-HU', 'H-河南航空有限公司-VD', 'H-华夏航空公司-G5', 'J-吉祥航空公司-HO', 'K-昆明航空有限公司-KY', 'S-四川航空公司-3U', 'S-山东航空公司-SC', 'S-深圳航空公司-ZH', 'S-上海航空公司-FM', 'T-天津航空有限责任公司-GS', 'X-西部航空公司-PN', 'X-幸福航空有限责任公司-JR', 'X-厦门航空有限公司-MF', 'X-祥鹏航空公司-8L', 'Z-中国联合航空公司-KN'];
                var airlineNode = Y.one('.airlines');
                airlineNode.plug(Y.Plugin.AutoComplete, {
                    resultFilters: ['charMatch', 'wordMatch'],
                    // source:'ajax/airlines.js?callback={callback}',
                    source: airlines,
                    on: {
                        select: function(e) {
                            var arr = e.result.display.split('-');
                            var input = this._inputNode.next();
                            input.setAttribute('value', arr[2]);
                        }
                    },
                    activateFirstItem: true
                });

                airlineNode.on('focus', function(e) {
                    if (e.target.get('value') == '') {
                        e.target.ac.sendRequest('');
                    }
                });

                airlineNode.on('keyup', function(e) {
                    if (e.target.get('value') == '') {
                        e.target.ac.sendRequest('');
                    }
                });
                /*航空公司自动补全 end*/

                /* 切换显示返程输入框 */
                Y.all('.radio_is_single').on('click', function(e) {
                    var that = e.target;
                    var arrDate = Y.one('[name=ARRDATE]');
                    if (that.hasClass('is_double')) {
                        arrDate.set('disabled', false).removeClass('disabled').addClass('yiv-required');
                    } else {
                        arrDate.set('disabled', true).addClass('disabled').removeClass('yiv-required');
                    }
                });

                /* 提交航班查询表单 */
                var spin_wrap = Y.Node.create('<div style="display:none" class="loading">');
                spin_wrap.setContent('<span>数据加载中...<span>');
                Y.one(".block2").prepend(spin_wrap);
                Y.one(".J_Hbcx_Search").on('click', function(e) {
                    e.preventDefault();

                    Y.all('.yiv-required').each(function(i){
                        var id = i.get('id');
                        form.setErrorMessages(id,{
                            required: '&nbsp;<b class="red">×</b>'
                        });
                    });

                    if (!form.validateForm()) return;

                    var url = this.getAttribute('data-url');
                    var data = Y.io._serialize(Y.one('#aspnetForm')._node);

                    // 需要加载datashema模块
                    //   var schema = {
                    //    resultDelimiter: "&",
                    //    fieldDelimiter: "=",
                    //    resultFields: [ 'name', 'value' ]
                    //    };

                    //    submitedData = Y.DataSchema.Text.apply(schema, data).results;

                    // submitedData = data;

                    if (url) {
                        Y.io(url, {
                            data: data + '&time=' + new Date().getTime(),
                            on: {
                                start: function() {
                                    spin_wrap.show();
                                },
                                error: function() {},
                                success: function(i, res) {
                                    spin_wrap.hide();
                                    Y.one('#J_Hbcx_DataTable').setContent(res.responseText);
                                    more_hbcx();
                                }
                            }
                        });

                    }
                });
                /* 提交航班查询表单 end */
            }

            function init_calendar(){
                new Y.TripCalendar({
                    beginNode: '#depdate-td',
                    endNode: '#arrdate-td',							
                    limitBeginDate: new Date(),
                    limitDays:28,
                    isWeek: false,
                    isFestival: false,
                    titleTips: ""
                });
            }


            function more_hbcx() {
                var info_row = ''+
                    '<tr class="info-row">'+
                    '<td colspan=9>'+
                    '</td>'+
                    '</tr>'; 

                Y.all(".data-row").insert(info_row,'after');

                Y.all(".mo-hbcx .more").on('click', function(e) {
                    var that = e.target;
                    var url = that.getAttribute("data-url");

                    var container = that.ancestor("tr").next().one('td');

                    if (container.hasClass("loaded")) {
                        container.removeClass("loaded");
                        that.removeClass("more-h");
                        container.all(".dancheng-ajax-wrapper").remove();
                        container.all(".wangfan-ajax-wrapper").remove();
                    } else {
                        // var FlightNo = '&FlightNo=' + that.getAttribute('data-flightno');
                        // var data = submitedData.replace(/(FlightAllBerth)=(\d+)/i, '$1=1');
                        // var time = '&time=' + new Date().getTime();

                        Y.io(url,{
                            // data: data + FlightNo + time,
                            on: {
                                success: function(i, res) {
                                    container.addClass("loaded");
                                    container.prepend(res.responseText);
                                    that.addClass("more-h");
                                    updateInfoRow();
                                }
                            }
                        });
                    }

                });
            }

            function citySuggest() {
                var depCity = new Y.TripAutoComplete({
                    inputNode: '.depcity',
                    codeInputNode: '.depcity_hidden',
                    source: 'http://ijipiao.trip.taobao.com/ie/remote/auto_complete.do?flag=2&count=20&callback={callback}&q=',
                    // source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
                    // source: 'ajax/citysearch.js?&callback={callback}&q=',
                    hotSource: 'ajax/hotcity.js'
                });

                var toCity = new Y.TripAutoComplete({
                    inputNode: '.arrcity',
                    codeInputNode: '.arrcity_hidden',
                    // source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
                    source: 'http://ijipiao.trip.taobao.com/ie/remote/auto_complete.do?flag=4&count=20&callback={callback}&q=',
                    hotSource: 'ajax/hotcity_international.js'
                });
            }


            function updateInfoRow(){
                Y.all('.mul-select').on('click',function(e){
                    var parentRow =  e.target.ancestor('.info-row');
                    var previousRow = parentRow.previous('.data-row');
                    var rowIndexs = [];

                    var updatedNodes = parentRow.next('.meta-row').all('s');
                    var infoRowData = e.target.getAttribute('data-updates')
                    var data = infoRowData.split(',');

                    submitedData = submitedData || parentRow.next('.meta-row').one('input').getAttribute('data-params').split('|');

                    var cIndex = parentRow.get('rowIndex');

                    var previousMetaRow = parentRow.previous('.meta-row')
                    var nextMetaRow = parentRow.next('.meta-row');

                    var pMetaRowIndex = previousMetaRow &&  previousMetaRow.get('rowIndex') || -9999;
                    var nMetaRowIndex = nextMetaRow && nextMetaRow.get('rowIndex');

                    var group = parentRow.siblings(function(e){ 
                        var rowIndex = e.get('rowIndex'); 
                        if (e.hasClass("data-row") && rowIndex<nMetaRowIndex && rowIndex>pMetaRowIndex){
                            rowIndexs.push(rowIndex);
                            return true;
                        }
                    });

                    var pIndex = group.indexOf(previousRow);

                    // var group2 = parentRow.siblings(function(e){ 
                    //     var rowIndex = e.get('rowIndex'); 
                    //     if (e.hasClass("info-row") && rowIndex<nMetaRowIndex && rowIndex>pMetaRowIndex){
                    //         rowIndexs.push(rowIndex);
                    //         return true;
                    //     }
                    // });

                    var newArr = submitedData[pIndex].split(',');
                    newArr[newArr.length-2]=data[data.length-2];
                    newArr[newArr.length-1]=data[data.length-1];
                    newArr = newArr.join(',');

                    submitedData.splice(pIndex,1,newArr).join('|');

                    updatedNodes.each(function(i,index){
                        i.set('text',data[index]);
                    });

                    previousRow.one('.sit-type').set('text',data[data.length-2]);
                    previousRow.one('.sit-count').set('text',data[data.length-1]);
                    previousRow.one('.more-h').simulate('click');
                }); 
            }

        }, '.mo-hbcx')
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
function gotop() {
    var ie6 = ! window.XMLHttpRequest;
    var a = document.getElementById('J_goTop');
    a.style.position = ie6 ? 'absolute': 'fixed';
    a.style.right = 10 + 'px';
    a.style.bottom = 10 + 'px';
    if (ie6) {
        window.onscroll = function() {
            a.className = a.className;
        };
    }
}
//   gotop();
/*回到顶部 end*/

YY = Y;

/*本地测试用*/
(function(){
    var wo = location.search;
    if(wo.indexOf('usergroup')!=-1){
        Y.all('.menu-sidebar a').on('click',function(e){
            e.preventDefault();
            location.href = e.target.get('href')+wo;
        }); 
    }
})();

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

