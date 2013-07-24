$.fn.fixedBar = function(args){
    var defaults = {
        paged:false,  //是否始终固定位置
        css:"position:fixed;top:0;",
        createShadow:'fixBarShadow'
    };

    var callback;

    if( Object.prototype.toString.call(args) == "[object Function]" ){
        callback = args; 
    }

    var opts = $.extend(defaults, args); 
    
    if (window.ActiveXObject) {
        window.isIE = window[window.XMLHttpRequest ? 'isIE7' : 'isIE6'] = true;
    }

    if (window.isIE6) try {document.execCommand("BackgroundImageCache", false, true);} catch(e){}

    this.each(function(){
        var ele = $(this);
        var eleOffsetTop = ele.offset().top;
        var elePositionTop = ele.position().top;
        var shadow;

        if(opts.createShadow){
            if (typeof opts.createShadow === 'string'){
                shadow = $(opts.createShadow).length ? $(opts.createShadow) : $('<div class="'+opts.createShadow+'"></dvi>').css({
               display:'none',
               height:ele.outerHeight()+1+'px'
                });
            }
            ele.before(shadow);
        }

        if(opts.paged){
            eleOffsetTop = -1; 
            if (!ele.hasClass("fixedBar")) ele.addClass("fixedBar").attr("style",opts.css);
            if(window.isIE6) ele.css({"position":"absolute"});
        }

        $(window).unbind("scroll.fixedBar").bind("scroll.fixedBar",function(e){
            var that = $(this);
            var scrollTop = that.scrollTop();
            if(scrollTop > eleOffsetTop){
                if (!ele.hasClass("fixedBar")){
                    if (opts.createShadow){ shadow.show() }
                    ele.addClass("fixedBar").attr("style",opts.css);
                }
                if(window.isIE6) ele.css({"top":scrollTop - eleOffsetTop + elePositionTop + "px","position":"absolute"});
            }else{
                if (opts.createShadow){ shadow.hide() }
                ele.removeClass("fixedBar").removeAttr("style");
            }

            if (callback) callback.call(ele,scrollTop);
        }); 

    });

    return this;
};
