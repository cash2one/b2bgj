jQuery(function($){

    $(".datepicker").kendoDatePicker(); 
    $(".timepicker").kendoTimePicker();

    $('.arrow5').on('click',function(){
        $('.head').toggle(); 
        $(this).toggleClass('arrow5h');
    });

    $('.arrow4').on('click',function(){
        $('.sidebar').toggle(); 
        $(this).toggleClass('arrow4h');
        $('body').toggleClass('hide-sidebar');
    });

    function changeStyle(name,filepath){
        var href=filepath;

        if(name==="default"){
            $('#skins').remove();
            return;
        }

        if($('#skins').length!==1){
            $('head').append('<link id="skins" rel="stylesheet" href="'+href+'"  />'); 
        }else{
            $('#skins').attr("href",href);
        }
    } 

    $('.change-style').on('click',function(){
        var path = $(this).data('filepath');
        var that = $(this);
        var color = that.data('color');
        changeStyle(color,path);
    })

    $('.lightbox').find('[rel=close]').click(function(){
        $(this).parents('.lightbox').hide(); 
    });

    $("body").on("click",".show-lightbox",function(){
        var lightboxID = $(this).data("lightboxid"); 
        $(".lightbox").each(function(){
            if($(this).data("lightboxid") == lightboxID ){
                $(this).show(); 
            }        
        })
    });

    $(".mo-jptj .dropdown").hover(function(){
        $(this).find(".box").toggle(); 
    })
    
    $(".mo-hbcx .more").click(function(){
    var that = $(this);
        var ajaxurl=$(this).data("ajaxurl");
        var container = $(this).parents("tr").next().find("td");
        if(!container.hasClass("loaded")){
            $.get(ajaxurl,function(d){
                container.prepend(d); 
                container.addClass("loaded");
                that.addClass("more-h");
            }); 
        }else{
           container.find(".dacheng-ajax-wrapper").remove();
           container.find(".wangfan-ajax-wrapper").remove();
           container.removeClass("loaded");
                that.removeClass("more-h");
        }
    });

})
