/**
 * Created with JetBrains WebStorm.
 * User: TRAVELZEN-IT-ZHANGZZ
 * Date: 13-6-25
 * Time: 上午10:09
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    var dt=new Date().getMilliseconds();
    $(".popwin").click(function(){
        var tar= $.parseJSON($(this).attr("data"));
        var kendoWindowData=$("#window").data("kendoWindow");
        if(!kendoWindowData)
        {
            $("#window").kendoWindow({
                animation:false,
                iframe:true,
                content:function(tar){return tar.content?{url:'',template:tar.contentFunction?eval(tar.content):tar.content}:tar.url+"?dt="+dt}(tar),
                modal:tar.modal || true,
                width:tar.width,
                height:tar.height,
                title:tar.title,
                visible:false,
                refresh:function(){
                    $("#window").data("kendoWindow").center();
                    $("#window").data("kendoWindow").open();
                    $("#window").data("kendoWindow").modal()?showOverLay():'';
                },
                close:function(){
                    $("#window").data("kendoWindow").modal()?$("#iframeShadow").hide():'';
                }
            });
        }
        else
        {
            kendoWindowData.modal()?showOverLay():'';
            tar.content?kendoWindowData.refresh({url:'',template:tar.contentFunction?eval(tar.content):tar.content}):kendoWindowData.refresh(tar.url+"?dt="+dt);
            kendoWindowData.setOptions({
                width:tar.width,
                height:tar.height,
                title:tar.title
            });
        }
        return false;
    });

    function showOverLay()
    {
        if($.browser.msie && parseInt($.browser.version)<7)
        {
            if(!$("#iframeShadow").length)
            {
                $("body").append("<div id='iframeShadow' style='z-index:1000;width:100%;position:absolute;top:0;left:0;;filter:alpha(opacity=0);'><iframe src='' width='100%' height='100%'></iframe> </div>")
            }
            $(".k-overlay,#iframeShadow").height(Math.max($("body").height(),$(window).height()));
        }
        $(".k-overlay,#iframeShadow").show();
    }

    $(".topFixedToolsBar").scrollFix("top","top");
});