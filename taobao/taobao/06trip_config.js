/**
 *http://a.tbcdn.cn/??apps/et/common/js/trip-config.js
 * "+p
 * @fileoverview 旅行相关模块定义
 * @author shuke.cl
 * @version 0.1
 * @update 2011/6/15
 */

var _JS_DEBUG_ = location.href.indexOf('_js_debug_') > -1 ? '.js' : '-min.js',
	_YUI3_CONFIG_ = {
		combine: true,
		comboBase: 'http://a.tbcdn.cn/??',
		root: 's/yui/3.3.0/build/',
		filter:{
			'searchExp': _JS_DEBUG_ == '.js' ? '-min.js&' : '&',
			'replaceStr': _JS_DEBUG_ == '.js' ? '-debug.js,' : ','
		},
		charset : 'gbk',
		groups:{
			util : {
				root : 'apps/et/common/',
				combine: true,
				modules : {
					/*
					* 模板工具
					*/
					'trip-mustache':{
						path : 'js/mustache' + _JS_DEBUG_
					},
					/*
					*html5表单检查器
					*/
					'trip-modernizr':{
						path : 'js/modernizr' + _JS_DEBUG_
					},
					/*
					*表单填充
					*/
					'trip-placeholder' : {
						path : 'js/placeholder' + _JS_DEBUG_,
						requires : ['node-base','trip-modernizr']
					},
					/*
					*Tab + 幻灯
					*/
					'trip-slide' : {
						path : 'js/slide' + _JS_DEBUG_,
						requires : ['node-base','node-event-delegate','node-screen','anim-easing']
					},
					/*
					*本地存储模块
					*/
					'trip-storage-lite' : {
						path : 'js/storage-lite-v1.1' + _JS_DEBUG_,
						requires : ['event-base','event-custom-complex','json']
					},
					/*
					*表单验证， 本地存储 ， 默认初始值 , 城市切换
					*/
					'trip-search-form' : {
						path : 'js/search-form' + _JS_DEBUG_,
						requires : ['node-base','node-event-delegate','event-base','base-base','base-build','cookie','trip-modernizr','trip-storage-lite']
					},
					/**
					 * historyhash from yui 3.4.0pr1 解决ie6 7不停触发history:change事件的问题
					 */
					'trip-history' : {
						path : 'js/history' + _JS_DEBUG_,
						requires : ['node-base','event-base','event-custom-complex','event-synthetic']
					},
					'trip-ejohn-template' : {
						path : 'js/ejohn-template'+ _JS_DEBUG_
					},
					/**
					 * 延迟加载模块 by bachi@taobao.com
					 */
					'trip-lazyload':{
						path : 'js/lazyload'+ _JS_DEBUG_,
						requires : ['node-base']
					},
					/**
					 * 公用提示组件样式 by shuke.cl@taobao.com
					 * Demo Address :  http://a.tbcdn.cn/tbra/dpl/common/message_demo.html
					 */
					'trip-tip-skin':{
						path : 'css/trip-tip-skin.css',
						type : 'css'
					},
					/**
					 * 旅行用户点击监测埋点(基于黄金令箭)
					 */
					'trip-monitor':{
						path : 'js/monitor'+ _JS_DEBUG_
					}
				}
			},
			widgets : {
				root : 'apps/et/common/widgets/',
				combine: true,
				modules : {
					'trip-autocomplete-skin':{
						path :'suggest/css/trip-autocomplete-min.css',
						type :'css'
					},
					'trip-autocomplete':{
						path :'suggest/js/trip-autocomplete' + _JS_DEBUG_,
						requires : ['autocomplete','trip-mustache','trip-slide','jsonp','trip-placeholder','trip-autocomplete-skin']
					},
					'trip-calendar':
					{
						path:'calendar/js/trip-calendar.v1.1'+_JS_DEBUG_,
						requires:["widget-position", "event-custom-complex", "calendar","trip-calendar-style",'trip-placeholder']
					},
					'calendar':{
						path:'calendar/js/calendar'+_JS_DEBUG_,
						requires:["widget-position", "event-custom-complex"]
					},
					'trip-calendar-style':{
						path:'calendar/css/calendar.v1.1-min.css',
						type: 'css'
					},
					'trip-box' : {
						path : 'box/js/box'+_JS_DEBUG_,
						requires:['node-base','event-base','overlay','dd-plugin','box-css']
					},
					'box-css' : {
						path : 'box/css/box-min.css',
						type : 'css'
					}
				}

			}
		}
	};
var YTRIP = YUI(_YUI3_CONFIG_);
YTRIP.addTripModule = function(mod){
	this.applyConfig(mod);
};
