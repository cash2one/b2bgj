$(function(){
    kendo.culture('zh-CN');
    kendo.init($('body'));
    $('.actions').fixedBar();
    var lensf = function (){
        $.each($('.instr'),function(){
            var that = $(this);
            if(that.find('.highlight-fl').size()>0){
                var ele = that.find('.highlight');
                var len = ele.size();
                var wid = ele.width()*len + 13;
                that.find('.line').prepend('<div style="background-color:#FF6608;height:2px;width:'+wid+'px" />')
            }
        });
    }
    lensf();
});
