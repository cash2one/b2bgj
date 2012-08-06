/**
 * @fileoverview  模板替换功能
 * @author lanmeng
 * @version 0.1
 */


/**
 * 模板替换功能
 * @name Y.EjohnTemplate
 * @class Y.EjohnTemplate
 * @construct  模板替换功能
 */
YUI.namespace('Y.EjohnTemplate');
YUI.add('trip-ejohn-template',function(Y){
	 var cache = {};
     /**
     * 模板替换
     * @name Y.EjohnTemplate
     * @function
     * @param {string} str 需要替换的代码片段
     * @param {json} data 数据源
     * @return {string} 返回替换过的html片段
     * @public
     */
	 Y.EjohnTemplate = function tmpl(str, data){

        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(str) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};"
                                                                         + "with(obj){p.push('"
                                                                         + str.replace(/[\r\t\n]/g, " ")
                                                                              .split("<%").join("\t")
                                                                              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                                                                              .replace(/\t=(.*?)%>/g, "',$1,'")
                                                                              .split("\t").join("');")
                                                                              .split("%>").join("p.push('")
                                                                              .split("\r").join("\\'")
                                                                         + "');}return p.join('');");


         return data ? fn( data ) : fn;
	 };

},'',{});
