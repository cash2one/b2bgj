//弹窗封装
function PopWindow(trigger, customSettings){
    var kendoWinDefaults = {
        visible:false,
        animation:false,
        width:570,
        modal:true
    }
    this.cache = true;
    this.kendoWinSettings = kendoWinDefaults; 
    this.triggerText = trigger;
    this.trigger = $(trigger);
    this.customSettings = customSettings; 
    this.win = null;
};
PopWindow.prototype = {
    init:function(){
        var isCreated = false;
        if(this.trigger.attr('role') === 'window_trigger'){
            isCreated = true;
        }

        if(!isCreated){
            this.render();
            this.bindClick();
            return this.win;
        }

    }, 
    render:function(){
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
        var that = this;
        that.trigger.attr('role','window_trigger');
        $('body').delegate(that.triggerText,'click',function(e){
            e.preventDefault();
            if(!that.cache){
                that.win.refresh(); 
            }
            that.win.center();
            that.win.open();

            kendo.init($('.popup-window'));
        });
    }
};

// 表格封装
function GridTable(trigger, customSettings){
    var kendoWinDefaults = {
        scrollable:false,
        pageable:{
            pageSize: 10,
            messages: {
                display: " 共 <b>{2}</b> 条记录，<b>{0}</b> - <b>{1}</b> 条",
                empty: "共 <b>0</b> 条记录",
                page: "页",
                of: "共 <b>{0}</b>",
                itemsPerPage: "每页",
                first: "第一页",
                previous: "前一页",
                next: "后一页",
                last: "最后页",
                refresh: "刷新"
            }
        }
    }
    this.kendoWinSettings = kendoWinDefaults; 
    this.triggerText = trigger;
    this.trigger = $(trigger);
    this.customSettings = customSettings; 
    this.grid = null;
};
GridTable.prototype = {
    init:function(){
        var isCreated = false;
        if(this.trigger.attr('role') === 'grid'){
            isCreated = true;
        }

        if(!isCreated){
            this.render();
            return this.grid;
        }
    }, 
    render:function(){
        var customSettings = this.customSettings || eval('('+this.trigger.data('options')+')');
        var opts;
        opts = $.extend( this.kendoWinSettings, customSettings);

        if( typeof opts.dataSource === 'undefined' ){
            throw new Error(this.triggerText + '缺少dataSource属性');
        }else{
            this.grid = this.trigger.kendoGrid( opts ).data('kendoGrid'); 
        }
    }
};

// 定高函数：超过3行时隐藏
var Collpase = function(opts){
    /*
    * container: Element
    * limitHeight : NUM
    * trigger : Element
    * triggerexp : the className while it is expanded
    * */
    this.limitHeight = 100;
    this.triggerexp = 'col-expp';
    this.trigger = '.content-collapse';
    $.extend(this,opts);
    this.container = $(this.container);
};
Collpase.prototype = {
    init:function(){
        if(this.getContainerHeight()<this.limitHeight) return this;
        this.render(); 
        this.bindClick();
        return this;
    },
    render:function(){
        var container = this.container; 
        this.originHeight = container[0].style.height;
        var trigger= this.triggerEle = $('<div class="'+(this.trigger+'_').slice(1,-1)+'"><div /></div>');
        trigger.appendTo(container).show();
        container.css({
            position:'relative',
            height:this.limitHeight + 'px',
            overflow:'hidden'
        });  
    },
    getContainerHeight:function(){
        return this.container.height();
    },
    setHeight:function(){
        if (this.triggerEle.hasClass(this.triggerexp)){
            this.triggerEle.removeClass(this.triggerexp);
            this.container.height(this.limitHeight);
        }
    },
    resetHeight:function(){
        if (!this.triggerEle.hasClass(this.triggerexp)){
            this.triggerEle.addClass(this.triggerexp);
            this.container.height(this.originHeight == ''?'':'100');
        }
    },
    bindClick:function(){
        var that = this;
        // collopse;
        $('body').delegate(that.trigger, 'click',function(){
            if ($(this).hasClass(that.triggerexp)){
                that.setHeight();
            }else{
                that.resetHeight();
            }
        });

    }
};

// 浮层模块
var FloatLayer = function(opts){
    var opts = $.extend({
        trigger:"",
        data:{},
        template:"",
        type:'click',
        offsetX:0,
        offsetY:20,
        toggle:true
    },opts);

    opts.trigger = opts.trigger.jquery ? opts.trigger : $(opts.trigger);

    var tpl = kendo.template( $(opts.template).html() );
    var layer = $('<div class="ac-floatlayer" style="display:none;position:absolute;"/>');

    layer.html(tpl(opts.data));
    $('body').append(layer);
    kendo.init(layer);

    $(document).on('click',function(e){
        var t = $(e.target);
        if ( !t.is(opts.trigger) ){
            if ( t.closest('.ac-floatlayer').length !==1 ){
                layer.hide();    
            }
        }
    });

    function set_pos(ele){
        var pos = ele.offset();
        layer.css({
            left:pos.left + opts.offsetX,
            top:pos.top + opts.offsetY
        });
    }

    if(opts.itemClick){
        layer.find('.item').bind('click',function(e){
            layer.close();
            opts.itemClick.apply(this,arguments);
        }); 
    }

    // todo: support more type;
    opts.trigger.bind(opts.type,function(e){
        set_pos($(this));
        if(opts.toggle){
            layer.toggle();
        }else{
            layer.open();
        }
    });

    layer.open = function(){
        set_pos(opts.trigger);
        layer.show();
    };

    layer.close = function(){
        layer.hide();
    };

    return layer;
};

/* 城市补全js 模板
<script type="text/x-kendo-template" id="city_popup">
<div id="tabstrip" class="tcy_tabstrip" style="display:none;">
<span class="tcy_title">
热门城市/国家（支持中文名/拼音/英文名/三字码）
</span>
<ul>
<li id="hot_city" class="k-state-active">热门</li>
# for (var i=0; i<data.group.length; i++ ) { #
<li>#= data.group[i] #</li>
# } #
</ul>
<div id="hot_city_tab">
<ul class="tcy_list clearfix">

# for(var j=0;j<hotcitylist.length;j++){ #
# var citylist_item = hotcitylist[j] #
<li class="item" title="#= citylist_item.code #" data-code="#= citylist_item.code #">#= citylist_item.name #</li>
# } #
</ul>
</div>

# for(var i=0;i<data.citylist.length;i++){ #
# var citylist_item = data.citylist[i] #
<div class="city_tab">
<ul class="tcy_list clearfix">
# for(var k=0;k<data.group[i].length;k++){ #
<li class="tcy_list_sep">#= data.group[i].split('')[k] #</li>
# for(var j=0;j<citylist_item.value.length;j++){ #
# var citylist_value_item = citylist_item.value[j]; #
# if(citylist_value_item.py.slice(0,1) == data.group[i].split('')[k]) {#
<li class="item" title="#= citylist_value_item.code #" data-code="#= citylist_value_item.code #">#= citylist_value_item.name #</li>
# } #
# } #
# } #
</ul>
</div>

# } #
</div>
</script>

<script type="x-kendo-template" id="itemTemplate">
<span class="sg_py">${data.py}</span><span class="sg_name">${data.name}</span><span class="sg_code">（${data.code}）</span>
</script>

模板结束 */

var CityAutocomplete = function(){
    var that = {};
    var input,opts,hot_tabs;
    /* /FlightReserve/DataAssistant/GetCitys.aspx */

    function process_citydata(d){
        return jQuery.map(d.split(';'),function(n){
            if(n.indexOf('|')==-1) return;
            var item = n.split('|');
            return {'code':item[0],'search':item[0]+'|'+item[2]+'|'+item[1],'py':item[1],'name':item[2]};
        });
    }

    function process_pinyin(arr, group, col){
        var result = [],
        len = group.length,
        r = 0,
        item;

        for(; r<len; r++){
            item = group[r];
            result[r] = {
                name:"",
                value:[]
            };
            result[r]['name'] = group[r];
            jQuery.each(arr, function(index,i) {
                var str = i[col];
                var first_letter = str.toUpperCase().charCodeAt(0);
                var rangeStart = item.charCodeAt(0);
                var rangeEnd = item.charCodeAt(group[r].length-1);

                if (first_letter >= rangeStart && first_letter <= rangeEnd) {
                    result[r]['value'].push(i);
                }
            });
        }

        return result;
    }

    function render_hotcity_tabs(data){
        var templateID = opts.template || "#city_popup_tpl"; 

        hot_tabs = FloatLayer({
            toggle:false,
            trigger:input,
            offsetY:25,
            data:data,
            template:templateID
        });

        hot_tabs.delegate('.tcy_list li[data-code]','click',function(){
            var $t = $(this);
            var text = $t.text();
            input.focus().val(text);
            $(opts.codeEle).val($t.data('code'));
            hot_tabs.close();
        });

        hot_tabs.find('.tcy_tabstrip').kendoTabStrip({
            animation:false
        });
    }

    function render_suggest_city(data){
        input.kendoAutoComplete({
            dataTextField:'search',
            animation:false,
            filter:function(d,f){
                return {
                    filters:[{
                        ignoreCase: true,
                        value:  d,
                        operator: 'startswith',
                        field: 'code'
                    },{
                        ignoreCase: true,
                        value:  d,
                        operator: 'startswith',
                        field: 'py'
                    },{
                        ignoreCase: true,
                        value:  d,
                        operator: 'startswith',
                        field: 'name'
                    }],
                    logic:'or'
                }
            },
            template: $(opts.itemTemplate).html() ||'<span class="sg_py">${data.py}</span><span class="sg_name">${data.name}</span><span class="sg_code">（${data.code}）</span>',
            dataSource: data,
            highlightFirst: true,
            placeholder:"拼音/城市码/中文",
            select:opts.select || function(t){
                var dataItem = this.dataItem(t.item.index());
                t.preventDefault();
                t.sender.value(dataItem.name);
                $(opts.codeEle).val(dataItem.code);
            }
        });

        input.on('keyup',function(){
            var $t = $(this);
            if( $t.val() === '' ){
                hot_tabs.open();
            }else{
                hot_tabs.close();
            }
        });

        input.on('focus',function(){
           hot_tabs.find('.tcy_tabstrip').data('kendoTabStrip').activateTab("#hot_city"); 
        });

    };

    that.setOptions = function(settings){
        var defaults = {
            input : ".suggest-city",
            url: './searchflight_files/data.txt',
            group: ["ABCD","EFGHJ", "KLMN", "PQRSTW", "XYZ"]
        };

        that.options = $.extend(defaults,settings);
        return that;
    };

    that.init = function(){
        if(typeof that.options === 'undefined'){
            that.setOptions(); 
        }

        opts = that.options;
        input = opts.input.jquery ? opts.input : $(opts.input);

        $.get(opts.url,function(d){
            var citydata = d.split('@');
            var pcitydata = process_citydata(citydata[1]);
            var citygroup = opts.group;

            // 去掉热门
            citygroup.shift();

            render_hotcity_tabs({
                "group": citygroup,
                "citylist": process_pinyin(pcitydata, citygroup, "py"),
                "hotcitylist": process_citydata(citydata[0])
            });

            render_suggest_city(pcitydata);
        });

        return that;
    };

    return that;
}();



