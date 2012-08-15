/*!
 * Copyright koubei.com All rights reserved.
 * placeholder js
 * @file placeholder.js
 * @author <a href="mailto:zhengle.zl@taobao.com">zhengle</a>
 * @revision:
 * @version:1-0-0
 */ 
YUI.add("trip-placeholder",function(Y){
   //判断浏览器是否原生支持placeholder属性
   //&& "placeholder" in document.createElement("textarea"); //判断一个就够了
   if(Y.Modernizr.input.placeholder){
	 Y.TripPlaceholder =  { init:function(){} };
	 return;
   }
   var Node = Y.Node,
	   NodeList = Y.NodeList;
   var fnGet = Node.prototype.get;

   Node.prototype.get = function(attr){
	   if(attr === "value" && this.getAttribute("placeholder")){
		   return (this._node.value == this.getAttribute("placeholder"))?"":this._node.value;
	   } else {
		   return fnGet.apply(this,arguments);
	   }
   };

   Y.TripPlaceholder  = function(){
	   function _init(elems){

		   elems.on("focus",function(evt){
			   var node = evt.target;
			   var str = node.getAttribute("placeholder");
			   if(node._node.value == str){
				   node.set("value","");
				   node.removeClass("trip-placeholder");
			   }
		   });

		   elems.on("blur",function(evt){
			   var node = evt.target;
			   var str = node.getAttribute("placeholder");
			   if(node._node.value == ""){
				   node.set("value",str);
				   node.addClass("trip-placeholder");
			   }
		   });

		   function getValue(){
			   var ythis = Y.one(this);
			   var val = ythis.get("value"),
				   plhTxt = ythis.getAttribute("placeholder");
			   return (val && val == plhTxt)? "" : val;
		   }

		   //init
		   (function(){
			   elems.each(function(node){
				   if(node._node.value == node.getAttribute("placeholder") || node._node.value == ""){
					   node.addClass("trip-placeholder");
					   node.set("value",node.getAttribute("placeholder"));
				   } else {
					   node.removeClass("trip-placeholder");
				   }
				   node.getValue = node._node.getValue = getValue;

			   });
		   })()
	   }
	   return {
		 init:function(elems){
			   if(!elems){
				   _init(Y.all(".trip-placeholder"));
			   } else if((elems instanceof NodeList)){
				   _init(elems);
			   } else {
				   _init(Y.all(elems));
			   }
		   }
	   }
   }();
},'1.0.0',{requires:['node-base','event-base','trip-modernizr']});
 
