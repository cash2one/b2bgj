jQuery(function($){
    $('.arrow5').on('click',function(){
        $('.head').toggle(); 
        $(this).toggleClass('arrow5h');
    });

    $('.arrow4').on('click',function(){
        $('.sidebar').toggle(); 
        $(this).toggleClass('arrow4h');
        $('body').toggleClass('hide-sidebar');
    });

    function changeStyle(name){
        var href='/static/css/skin-'+name+'.css';

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
        var that = $(this);
        var color = that.data('color');
        changeStyle(color);
    })

    $('.lightbox').find('[rel=close]').click(function(){
        $(this).parents('.lightbox').hide(); 
    });

    $(".show-lightbox").click(function(){
        var lightboxID = $(this).data("lightboxid"); 
        $(".lightbox").each(function(){
            if($(this).data("lightboxid") == lightboxID ){
                $(this).show(); 
            }        
        })
    });
    
    $(".mo-hbcx .more").click(function(){
        var ajaxurl=$(this).data("ajaxurl");
        $(this).toggleClass("more-h");
        var container = $(this).parents("tr").next().find("td");
        if(!container.hasClass("loaded")){
            $.get(ajaxurl,function(d){
                container.prepend(d); 
                container.addClass("loaded");
            }); 
        }else{
           container.find(".dacheng-ajax-wrapper").remove();
           container.removeClass("loaded");
        }
    });

})
