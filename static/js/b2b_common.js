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
YUI().use('trip-search-form', 'trip-autocomplete', 'trip-calendar', 'node', 'trip-box', 'jsonp', 'event', 'trip-mustache', 'imageloader', function(Y) {

	/*iframe高度自定义,解决跨域问题*/
	var getDomain = function() {
		var arr = location.hostname.split('.'),
		len = arr.length;
		return arr.slice(len - 2).join('.');
	};
	document.domain = getDomain();

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

	Y.on('domready', function() {

    Y.one("body").delegate("click", function(e) {
        var lightboxID = this.getAttribute("data-lightboxid");

        Y.all(".lightbox").each(function(i) {
            if (i.getAttribute("data-lightboxid") == lightboxID) {
                i.setStyle('display','block');
            }
        })

    },".show-lightbox");

    Y.all('.lightbox [rel=close]').on("click",function(e) {
        e.currentTarget.ancestor('.lightbox').hide();
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
		})
		// 酒店搜索模块日历和placeholder控件初始化							
		var hotelDate = new Y.TripCalendar({
			beginNode: '#beginNode',
			endNode: '#endNode',
			limitBeginDate: new Date(),
			limitDays: 28,
			isWeek: false,
			isFestival: false,
			titleTips: "XXXXXXXXXXXX"
		}),
		depCity = new Y.TripAutoComplete({
			inputNode: '.depcity',
			codeInputNode: '#J_ToCityCode',
			source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
			hotSource: '/static/js/b2b_hotcity.js'
		}),
		toCity = new Y.TripAutoComplete({
			inputNode: '.tocity',
			codeInputNode: '#J_ToCityCode',
			source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
			hotSource: '/static/js/b2b_hotcity.js'
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
	},
	'body');

	Y.on('domready', function() {
		/*jsonp异步获取数据*/
		/*
         * 客栈
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
		showList(0);
	*/
		//屏幕滚动，延时加载		
		/*
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
		sImg(0);	
	*/

		// //tab切换
		// var TabClick = new Y.Slide('J_tablist',{
		// 	autoSlide:false,
		// 	eventype:'click'
		// });
		//点击tab获得索引值执行showList;
		/*
		TabClick.on('switch',function(data){		
					var index = parseInt(data.index);						
						
					setTimeout(function(){
						//延时加载
						showList(index);
						sImg(index);												
					},10);
		});				
		*/

		/*顶部图片hover效果*/
		/*
		Y.one('.adImgBox table').delegate('hover', function(e){
			var tar = e.currentTarget;		
			var spanInMe = tar.one('.J_spanbox');		
			spanInMe.removeClass('hide');
		},function(e) {		
			var tar = e.currentTarget;		
			var spanInMe = tar.one('.J_spanbox');		
			spanInMe.addClass('hide');		
		}, '.J_hoverA');
        */
		/*顶部图片hover效果 end*/

		/*分享收藏*/
		/*
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
        */
		/*分享收藏 end*/

		/*回到顶部*/
		// function gotop (){
		// 	var ie6 = !window.XMLHttpRequest;
		// 	var a = document.getElementById('J_goTop');
		// 	a.style.position = ie6 ? 'absolute' : 'fixed';
		// 	a.style.right = 10 + 'px';
		// 	a.style.bottom =10 + 'px';
		// 	if (ie6) {
		// 		window.onscroll = function() {
		// 			a.className = a.className;
		// 		};
		// 	}
		// }
		// gotop();
		/*回到顶部 end*/

	});
})

/*
jQuery(function($) {



    $(".mo-hbcx .more").click(function() {
        var that = $(this);
        var ajaxurl = $(this).data("ajaxurl");
        var container = $(this).parents("tr").next().find("td");
        if (!container.hasClass("loaded")) {
            console.log('ss')
            $.get(ajaxurl, function(d) {
                container.prepend(d);
                container.addClass("loaded");
                that.addClass("more-h");
            });
        } else {
            container.find(".dancheng-ajax-wrapper").remove();
            container.find(".wangfan-ajax-wrapper").remove();
            container.removeClass("loaded");
            that.removeClass("more-h");
        }
    });

})


*/

