YUI.Env.JSONP={
    getHotCityData: function (o){backHotCityData=o;}
}

/**
 *http://a.tbcdn.cn/??apps/et/trip-home/js/kezhan_v1.1.js
 * @path: apps/et/trip-home/js/kezhan_v1.1.js
 * @author: zining@taobao.com
 * @data: 2012/04/13
 */
YUI().use('trip-search-form', 'trip-autocomplete' ,'trip-calendar','node','trip-box','jsonp','event', 'trip-mustache','imageloader', function(Y){
	
	/*iframe高度自定义,解决跨域问题*/
	var getDomain = function() {
			  var arr = location.hostname.split('.'),
			  len = arr.length;
			  return arr.slice(len - 2).join('.');
			};
	document.domain = getDomain();
	
	/* added by shaobo 提前初始化搜索 */
	var	_toCity = null,
		_searchKeyword = null,
		_searchForm = null,
		_submitInnSearch = function(){
			 // 针对不支持placeholder的浏览器，需要在提交表单前判断是否有用户输入
			if (_toCity._node.value === _toCity.getAttribute('placeholder')) {_toCity.set('value', '')};
			if (_searchKeyword._node.value === _searchKeyword.getAttribute('placeholder')) {_searchKeyword.set('value', '')};
			_searchForm.submit();
		};
		
	
	Y.on('domready', function(){
		// 酒店搜索模块日历和placeholder控件初始化							
		var	hotelDate = new Y.TripCalendar({
				beginNode: '#beginNode',
				endNode: '#J_kezhan_endDateBox',							
				limitBeginDate: new Date(),
				limitDays:28,
				isWeek: false,
                isFestival: false,
				titleTips: "酒店预订时间不能超过90天"
			}),
			depCity = new Y.TripAutoComplete({
				inputNode : '.depcity',
				codeInputNode : '#J_ToCityCode',
				source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
				hotSource: '/static/js/b2b_hotcity'
			}),
			toCity = new Y.TripAutoComplete({
				inputNode : '.tocity',
				codeInputNode : '#J_ToCityCode',
				source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
				hotSource: '/static/js/b2b_hotcity'
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
	}, '.adImgBox');
	
			
	Y.on('domready',function(){
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
    $(".suggest").kendoAutoComplete({
        minLength: 1,
        dataField: "citycode",
        dataSource: {
            serverFiltering: true,
            // serverPaging: true,
            // pageSize: 2,
            transport: {
                read: "ajax/citylist"
            }
        },
        // filter: "startswith",
        placeholder: "中文/拼音"
    });

    kendo.culture("zh-CHS");

    $(".datepicker").kendoDatePicker();
    $(".timepicker").kendoTimePicker();

    $('.arrow5').on('click', function() {
        $('.head').toggle();
        $(this).toggleClass('arrow5h');
    });

    $('.arrow4').on('click', function() {
        $('.sidebar').toggle();
        $(this).toggleClass('arrow4h');
        $('body').toggleClass('hide-sidebar');
    });

    function changeStyle(name, filepath) {
        var href = filepath;

        if (name === "default") {
            $('#skins').remove();
            return;
        }

        if ($('#skins').length !== 1) {
            $('head').append('<link id="skins" rel="stylesheet" href="' + href + '"  />');
        } else {
            $('#skins').attr("href", href);
        }
    }

    $('.change-style').on('click', function() {
        var path = $(this).data('filepath');
        var that = $(this);
        var color = that.data('color');
        changeStyle(color, path);
    })

    $('.lightbox').find('[rel=close]').click(function() {
        $(this).parents('.lightbox').hide();
    });

    $("body").on("click", ".show-lightbox", function() {
        var lightboxID = $(this).data("lightboxid");
        $(".lightbox").each(function() {
            if ($(this).data("lightboxid") == lightboxID) {
                $(this).show();
            }
        })
    });

    $(".mo-jptj .dropdown").hover(function() {
        $(this).find(".box").toggle();
    })

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
