/**
 * @module  lazyload
 * @author  lijing00333@163.com
 */

/**
 * 当屏幕滚动到textarea所在位置时，将给定的textarea中的内容延时渲染出Dom
 * 		<textarea>$1</textarea> => <div>$1</div><textarea lazyloaded="1">$1</div>
 *
 * 只判断textarea是否滚动到屏幕viewport范围内，textarea是否可见不做判断
 *
 * 使用
 * 		new Y.Lazyload(YUINode)
 *		new Y.Lazyload(YUINodelist)
 *		new Y.Lazyload(YUINode,YUINode...)
 *
 * 方法
 *		Y.Lazyload.render(textarea)  若textarea没有被渲染，则将其渲染
 *
 * more
 *		tab操作中隐藏的面板的延时加载，直接实现在了Slide中
 *
 */
YUI.add('parse-textarea',function(Y){
	Y.Lazyload = {};

	//在全局执行代码
	var globalEval = function(data){
		if (data && /\S/.test(data)) {
			var head = document.getElementsByTagName('head')[0] || docElem,
				script = document.createElement('script');

			// It works! All browsers support!
			script.text = data;

			head.insertBefore(script, head.firstChild);
			head.removeChild(script);
		}
	};

	/**
	 * 渲染textarea中的内容,包括执行其中的script
	 * @method render
	 */
	var render = function(textarea){
		//textarea 强制设置为不可见
		textarea.setStyle('display','none');

		//渲染之后打flag标记
		if(textarea.getAttribute('lazyloaded')=='1'){
			return false;
		}
		textarea.setAttribute('lazyloaded','1');

		var	id = Y.stamp(div),
			html = textarea.get('innerHTML').replace(/&lt;/ig,'<').replace(/&gt;/ig,'>'),
			re_script = new RegExp(/<script([^>]*)>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/ig),// 识别正确的js代码
			div = Y.Node.create('<div>'+(html+'').replace(re_script,'')+'</div>');

		textarea.insert(div,'before');

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

		return true;

	};

	Y.Lazyload.render = render;



},'',{requires:['node-base']});

YUI.add('trip-lazyload',function(Y){


	//Lazyload 构造器
	var Lazyload = function(con){

		var self = this;

        // factory or constructor
        if (!(this instanceof Lazyload)) {
            return new DataLazyload(con);
        }

		Y.Array.each(arguments,function(con){
			self.init.call(self,con);
		});

	};

	//rename lazyload.render
	var render = Lazyload.render = Y.Lazyload.render;

	Y.mix(Lazyload,{
		con:null,
		init:function(con){

			var self = this;

			self.con = con;

			var micro_detect = function(){
				var unRended = self.getUnRendered();
				if(unRended.length == 0){
					onScroll.detach();
					return;
				}
				Y.Array.each(unRended,self.checkInView);
			};


			var onScroll = Y.on(['scroll','resize'],function(e){
				micro_detect();
			},window);

			micro_detect();

		},
		getUnRendered:function(){
			var self = this,
				a = [];
			var checkOne = function(node){
				if(node.getAttribute('lazyloaded') == '1'){
					return;
				}
				a.push(node);
			};

			self.con.each ? self.con.each(checkOne) : checkOne(self.con);

			return a;
		},
		//detect one textarea
		checkInView:function(textarea){
			var div = Y.Node.create('<div></div>');
			textarea.insert(div,'before');
			if(div.inViewportRegion()){
				render(textarea);
			}
			div.remove();
		}

	},0,null,4);


	Y.Lazyload = Lazyload;

},'',{requires:['parse-textarea']});
