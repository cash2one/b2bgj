/**
 * @fileOverview 旅行通用自动完成组件
 * @author shuke.cl
 * version 1.0
 * @requires ［"widget",  "autocomplete"］
 */
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};
YUI.namespace('Y.TripAutoComplete');
YUI.add('trip-autocomplete', function(Y) {
	/*
    *默认设置
     */
	var DEF_CONFIG = {
		resultTemplate: '<span class="ac-cityname">{cityName}</span><span class="ac-citypy">{py}</span>',
		// resultFormatter: acFormatter,
		// requestTemplate: function(query) {
		// 	return query;
		// },
		maxResults: 10,
		// resultListLocator: 'result',
		// resultTextLocator: 'cityName',
		activateFirstItem: true,
		width: 250,
		noResultMessage: '对不起，没有找到"<span class="highlight">{query}</span>"',
		hotWidth: 320
       		 // source: 'http://ijipiao.trip.taobao.com/ie/remote/auto_complete.do?flag=2&count=20&callback={callback}&q=',
		// source: 'http://jipiao.trip.taobao.com/remote/livesearch.do?callback={callback}&q=',
		// hotSource: 'http://www.taobao.com/go/rgn/trip/chinahotcity.php'
	};
	/*
    热门城市数据
     */
	var HOT_CITY_DATA = {},
	//缓存热门城市数据
	bakHotCityData, //返回数据临时存储
	// TEMPLATE = '<div class="yui3-hot-city"><div class="yui3-acinput-hot-tit">热门城市/国家(支持汉字/拼音/英文字母)</div><ul class="tab-nav">{{#results}}<li>{{tabname}}</li>{{/results}}</ul><div class="tab-content">{{#results}}<div class="tab-pannel">{{#tabdata}}<dl><dt>{{dt}}</dt><dd>{{#dd}}<span><a data-code="{{cityCode}}" href="#">{{cityName}}</a></span>{{/dd}}</dd></dl>{{/tabdata}}</div>{{/results}}</div></div>',
    TEMPLATE = '<div class="yui3-hot-city"><div class="yui3-acinput-hot-tit">热门城市/国家(支持中文名/英文名/机场码/城市码)</div><ul class="tab-nav">{{#results}}<li>{{tabname}}</li>{{/results}}</ul><div class="tab-content">{{#results}}<div class="tab-pannel">{{#tabdata}}<dl><dt>{{dt}}</dt><dd>{{#dd}}<span><a data-code="{{cityCode}}" href="#">{{cityName}}</a></span>{{/dd}}</dd></dl>{{/tabdata}}</div>{{/results}}</div></div>',
	//热门城市模板
	PLACEHOLDER_CLASS = 'trip-placeholder',
	INPUT_FOCUS_CLASS = 'yui3-acinput-focus',
	isSupportPlaceHolder = Y.Modernizr.input.placeholder;
	YUI.Env.JSONP.getHotCityData = function(o) {
		backHotCityData = o;
	};
	/*
    *格式化和高亮搜索结果内容
     */
	function highLight(str, key) {
		//return str.replace(key,'<span class="yui3-highlight">'+ key +'</span>');
		return str;
	}
	function acFormatter(query, results) {
		return Y.Array.map(results, function(result) {
			result = result.raw;
			return Y.Lang.sub(DEF_CONFIG.resultTemplate, {
				cityName: highLight(result.cityName, query),
				py: highLight(result.py, query)
			});
		});
	}
	/*
    *旅行定制SUGGEST构造函数
     */
	var TripAutoComplete = Y.Base.create('tripAutoComplete', Y.Base, [], {
		initializer: function(arg) {
			this.config = arg;
			Y.mix(this.config, DEF_CONFIG);

			this.AC = new Y.AutoComplete(this.config);

			var AC = this.AC;
			AC.DEF_PARENT_NODE = null;
			AC.render();

			this.inputNode = AC.get('inputNode');
			this.listNode = AC.get('listNode');
			this.contentBox = AC.get('contentBox');
			this.boundingBox = AC.get('boundingBox');
			this.msgBox = Y.Node.create('<div class="yui3-msg-box" style="display:none"></div>');
			this.contentBox.insertBefore(this.msgBox, this.contentBox.get('firstChild'));
			this.boundingBox.setStyle('position', 'absolute');
			AC.set('zIndex', '99999');
			var codeInputNode = this.config.codeInputNode;
			this.codeInputNode = typeof codeInputNode !== 'undefined' ? Y.one(codeInputNode) : null;

			this.isAllowFocus = true; //是否允许出发FOCUS事件
			this.isFillFirstItem = true; //是否需要用第一条数据填充
			this.isLoadedHotData = false; //热门城市是否已加载
			this.isHotVisible = false; //热门城市是否可见
			this.isMouseOverHot = false; //鼠标是否在热门城市框区域内
			this.hotNode = null;
			this.doc = Y.one(document);
			Y.TripPlaceholder.init(this.inputNode); //自动填充
			this.config.createIcon && this._createIcon(); //创建ICON
			this.inputNode.addClass('J_TripCityInput');
			//自定义事件
			this.publish('select');
			this._bindUI();
			this._syncUI();
			TG.SearchForm['#' + this.inputNode.get('id')] = this; //将实例存储到全局对象，将ID作为KEY
		},
		_syncUI: function() {
			this.inputNode.setAttribute('x-webkit-speech', 'x-webkit-speech');
			this.boundingBox.addClass('has-anim-fast');
		},
		_createIcon: function() {
			var parent = this.inputNode.get('parentNode');
			var node = Y.Node.create('<div class="yui3-acinput-box"><s class="yui3-acinput-icon"></s></div>');
			parent.insertBefore(node, this.inputNode);
			node.appendChild(this.inputNode);
			this.inputBoxNode = node;
			return this;
		},
		/*
      显示错误或者提示信息
       */
		showMessage: function(msg) {
			var that = this;
			this.msgBox.setContent(msg);
			this.msgBox.show();
			this.AC.show();
			this.boundingBox.addClass('anim-pulse');
			setTimeout(function() {
				that.boundingBox.removeClass('anim-pulse');
			},
			100);
			return this;
		},
		//显示自动完成组件
		show: function() {
			this.AC.show();
		},
		//隐藏自动完成组件
		hide: function() {
			this.AC.hide();
		},
		//获取焦点
		focus: function() {
			this.inputNode.focus();
		},
		/*
            同步默认城市数据 同步后展示
             */
		_syncHot: function(htmlStr) {
			var SELF = this;
			this.hotNode = this.contentBox.appendChild(htmlStr);
			this.hotNode.hide();
			this.hotNode.setAttrs({
				id: Y.stamp(this.hotNode)
			});
			var tabView = new Y.Slide(this.hotNode.get('id'));
			tabView.on('switch', function() {
				SELF.AC.sizeShim && SELF.AC.sizeShim();
			});
			this._bindHot();
			if (this.listNode.get('children').size() < 1) { //可能出现热门城市数据返回比用户输入后的匹配城市数据慢，出现这种情况时，不再默认展示热梦城市
				this.hotNode && this.hotNode.show();
				this.AC.render();
				this.AC.show();
				this.AC.sizeShim && this.AC.sizeShim();
				this.isHotVisible = true;
				this.AC.set('width', this.config.hotWidth);
			}
			return this;
		},
		_bindUI: function() {
			var inputNode = this.AC.get('inputNode');
			inputNode.on('keyup', function() {
				if (inputNode.get('value') == '') {
					this.msgBox && this.msgBox.hide();
					this.showHot();
				}
			},
			this);
			this._bindAC();
			this._bindInput();
			return this;
		},
		/*
            *给autoComplete对象绑定自定义事件
             */
		_bindAC: function() {
			var AC = this.AC,
			SELF = this;
			var selectHoverItem = function(e) { //选中鼠标HOVER的ITEM
				AC.set('activeItem', e.currentTarget);
			};
			AC.on('select', this._fillInput, this); //填充数据
			AC.on('results', this._afterResults, this); //显示错误提示
			AC.on('visibleChange', this._visibleChange, this);
			AC.on('hoveredItemChange', selectHoverItem, this);
			//用户鼠标选择时，不触发默认填充功能
			this.listNode.on('mousedown', function(e) {
				SELF.isFillFirstItem = false;
			});
		},
		_bindHot: function() {
			var hotNode = this.hotNode;
			Y.delegate('click', this._afterHotItemClick, hotNode, 'a', this);
			hotNode.on('mouseenter', this._afterHotMouseOver, this);
			hotNode.on('mouseleave', this._afterHotMouseOut, this);
			hotNode.on('click', this._afterHotClick, this);
		},
		/*
            输入框事件绑定
             */
		_bindInput: function() {
			var inputNode = this.inputNode,
			SELF = this;
			var focusInput = function() {
				setTimeout(function() {
					inputNode.focus();
				},
				10)
			};
			inputNode.on('focus', this._afterFocus, this);
			inputNode.on('blur', this._afterBlur, this); //如果用户没做选择，隐藏SUGGEST时默认用第一条数据填充
			this.config.createIcon && this.inputBoxNode.on('click', focusInput);
		},
		/*
            没有结果时，返回无结果提示信息
             */
		_afterResults: function(e) {
			var AC = this.AC,
			SELF = this;
			var contentBox = this.AC.get('contentBox');
			var qReg = new RegExp('{query}', 'g');
			//用户输入关键字后返回数据时隐藏热门城市
			this.listNode.removeClass('hidden');
			if (this.isHotVisible) {
				this.hotNode.hide();
			}

			//显示无结果提示
			if (e.results.length < 1) {
				e.preventDefault();
				//contentBox.get('firstChild').setContent('<li class="yui3-aclist-noresult">'+ SELF.config.noResultMessage.replace(qReg, e.query) +'</li>');
				this.showMessage(SELF.config.noResultMessage.replace(qReg, e.query)); //显示错误信息
				this.codeInputNode && this.codeInputNode.set('value', ''); //重置三字码为空
				//AC.show();
			} else {
				this.msgBox.hide();
				this.isFillFirstItem = true;
				//默认填入返回数据的第一个城市
				this.codeInputNode && this.codeInputNode.set('value', e.data.CityCode);
			}
			AC.set('width', SELF.config.width);
		},
		_visibleChange: function(e) {
			if (e.newVal == true) {
				this.doc.on('click', this._afterDocClick, this);
				this.AC.sizeShim && this.AC.sizeShim();
			} else {
				if (this.isHotVisible && this.isMouseOverHot) {
					e.preventDefault();
				}
			}
		},
		/*
            *选中后填充选中数据到input
             */
		_fillInput: function(e) {
			var _data = e.result.raw,
			o = {},
			codeInputNode = this.codeInputNode,
			SELF = this;
			//填充附加代码
			if (codeInputNode) {
                // HACK 城市码为空就用机场码
                if(_data.CityCode == ''){
                    _data.CityCode = _data.AirportCode;
                }

				codeInputNode.set('value', _data.CityCode);
				o.cityCode = _data.CityCode;
			}
			if (!isSupportPlaceHolder) {
				this.inputNode.removeClass(PLACEHOLDER_CLASS);
			}
			this.isFillFirstItem = false;

			//由于IE6下会触发FOCUS，做一个变量短时间内不允许执行FOCUS事件
			this.isAllowFocus = false;
			o.value = _data.CityNameCN;
            e.result.text = _data.CityNameCN;
			o.data = _data;
			setTimeout(function() {
				SELF.isAllowFocus = true;
				SELF.fire('select', o);
			},
			200);
		},
		/*
            获得焦点时，需要显示热门城市
            foucs被触发的一些条件：
            1.用户点击输入框
            2.TAB切换至输入框
            3.IE6在SUGGEST里选择完城市以后重新获得焦点:此时不需要显示热门推荐城市
             */
		_afterFocus: function(e) {
			this.msgBox.hide();
			var SELF = this,
			target = e.target;
			target.addClass(INPUT_FOCUS_CLASS);
			setTimeout(function() {
				if (SELF.isAllowFocus) {
					target.select();
					SELF.showHot();
					SELF.isAllowFocus = false;
				}
			},
			100);
		},
		/*
            inputNode失去焦点时，检查是否要隐藏热门推荐
            以下情况会触发此事件
            1.用户点击外部区域
            2.ie下用户点击热门推荐区域
             */
		_afterBlur: function(e) {
			var listNode = this.listNode,
			SELF = this;
			e.target.removeClass(INPUT_FOCUS_CLASS);
			if (this.isFillFirstItem) {
				//用户没做选择则默认填充第一条数据
				setTimeout(function() {
					if (listNode && listNode.get('children').size() > 0 && SELF.isFillFirstItem) {
						SELF.AC.selectItem(listNode.get('firstChild'));
					}
				},
				100);
			}
			setTimeout(function() {
				SELF.isAllowFocus = true;
			},
			300);
		},
		_afterDocClick: function(e) {
			var target = e.target,
			SELF = this;
			if (!this.isMouseOverHot && target != this.inputNode) {
				SELF.hideHot('doc');
				//Y.log('doc listener has moved '  + this.isMouseOverHot );
			}
		},
		_afterHotClick: function(e) {
			e.stopPropagation();
		},
		_afterHotMouseOver: function() {
			this.isMouseOverHot = true;
		},
		_afterHotMouseOut: function() {
			this.isMouseOverHot = false;
		},
		/*
            加载热门城市数据
             */
		_loadHotData: function() {
			var SELF = this,
			urlStr = this.config.hotSource;
			this.isLoadedHotData = true;
			if (typeof HOT_CITY_DATA[urlStr] !== 'undefined') {
				SELF._syncHot(Y.mustache(TEMPLATE, HOT_CITY_DATA[urlStr]));
				return this;
			}
			Y.Get.script(urlStr, {
				onSuccess: function(o) {
					var data = o.data;
					if (typeof backHotCityData === 'object') {
						HOT_CITY_DATA[data.url] = backHotCityData;
						SELF._syncHot(Y.mustache(TEMPLATE, backHotCityData));
					}
				},
				data: {
					url: urlStr
				}
			});
		},
		/*
      *显示热门城市
       */
		showHot: function() {
			var listNode = this.listNode;
			listNode.empty(); //要显示热门城市先清空LISTNODE
			listNode.addClass('hidden');
			if (!this.isLoadedHotData) {
				this._loadHotData();
				return this;
			}
			this.AC.set('width', this.config.hotWidth);
			if (this.hotNode) {
				this.hotNode.show();
				//IE6 7触发 reflow
				this.hotNode.setStyle('zoom', '0.95');
				this.hotNode.setStyle('zoom', '1');
			}
			this.AC.render();
			this.AC.show();
			this.isHotVisible = true;
			return this;

		},
		/*
      *隐藏热门城市
       */
		hideHot: function() {
			this.isHotVisible = false;
			this.isMouseOverHot = false;
			this.hotNode && this.hotNode.hide();
			this.doc.detach('click', this._afterDocClick);
			this.AC.hide();
		},
		/*
            热点城市点击链接后填充数据
            */
		_afterHotItemClick: function(e) {
			var SELF = this,
			o = {};
			e.halt();
			var node = e.currentTarget;
			if (!isSupportPlaceHolder) {
				this.inputNode.removeClass(PLACEHOLDER_CLASS);
			}
			var val = node.get('innerHTML');
			o.value = val;
			o.node = node;
			this.inputNode.set('value', val);
			var codeInputNode = this.codeInputNode,
			codeValue = node.getAttribute('data-code');
			if (codeValue && codeInputNode) {
				codeInputNode.set('value', codeValue);
				o.cityCode = codeValue;
			}
			this.hideHot();
			setTimeout(function() {
				SELF.fire('select', o);
			},
			200);
		}
	},
	{
		ATTRS: {
			config: {
				value: null
			}
		}
	});
	Y.TripAutoComplete = TripAutoComplete;
},
'0.0.1', {
	requires: ['autocomplete', 'trip-slide', 'trip-placeholder']
});

