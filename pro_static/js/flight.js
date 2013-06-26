$(function(){
    kendo.init($('body'));
    $('.actions').fixedBar();
    var lensf = function (){
        $.each($('.instr'),function(){
            var that = $(this);
            if(that.find('.highlight-fl').size()>0){
                var ele = that.find('.highlight');
                var len = ele.size();
                var wid = ele.width()*len + 15;
                that.find('.line').prepend('<div style="background-color:#FF6608;height:2px;width:'+wid+'px" />')
            }
        });
    }
    lensf();
});

function PopWindow(trigger, customSettings){
    var kendoWinDefaults = {
        visible:false,
        animation:false,
        width:500,
        modal:true
    }
    this.kendoWinSettings = kendoWinDefaults; 
    this.triggerText = trigger;
    this.trigger = $(trigger);
    this.customSettings = customSettings; 
    this.win = null;
}

PopWindow.prototype = {
    init:function(){
        this.createWin();
        this.bindClick();
        return this.win;
    }, 
    createWin:function(){
        var windowEle = $('<div class="popup-window">');
        windowEle.appendTo($('body'));
        var customSettings = this.customSettings || eval('('+this.trigger.data('options')+')');
        var opts,data_template;

        data_template = this.trigger.data('template');

        opts = $.extend( this.kendoWinSettings, customSettings);

        if ( customSettings || data_template ){
            if( typeof opts.content === 'undefined'){
                if( data_template ){
                    opts.template = data_template;  
                }
                if( opts.template ){
                    opts.content = {
                        template : kendo.template($(opts.template).html()) 
                    }
                }
            }
        }

        if( typeof opts.content === 'undefined' ){
            throw new Error(this.triggerText + '缺少content(弹窗内容)属性');
        }else{
            this.win = windowEle.kendoWindow( opts ).data('kendoWindow'); 
        }
    },
    bindClick:function(){
        var win = this.win;
        this.trigger.bind('click',function(){
            win.center();
            win.open();
            kendo.init($('.popup-window'));
        });
    }
    // ,
    // bindOpenCallBack:function(){
    //     this.win.bind('open',function(){
    //         if(typeof this.options.onOpen === 'function') {
    //             this.options.onOpen.call(this);
    //         };
    //     });
    // }
}
