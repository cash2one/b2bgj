$(function(){
    //菜单事件设置
    $("#top_menu li > a").each(function(index){
        $(this).mouseover(function(){
            $("#top_menu li").removeClass("current");
            $(this).parent("li").addClass("current");
            $(".sub_menu").hide();
            $(".sub_menu:eq(" + index + ")").show();
        });
    });

});
