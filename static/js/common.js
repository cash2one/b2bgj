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


})
