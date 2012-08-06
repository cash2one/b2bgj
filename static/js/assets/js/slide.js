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
