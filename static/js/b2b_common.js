YUI.Env.JSONP = {
    getHotCityData: function(o) {
        backHotCityData = o;
    }
}

/**
*http://a.tbcdn.cn/??apps/et/trip-home/js/kezhan_v1.1.js
* @path: apps/et/trip-home/js/kezhan_v1.1.js
* @data: 2012/04/13
*/

YUI().use('get','tabview','checkall','box','cookie', 'fieldsetFormat', 'dataschema-array','dataschema-text', 'node-event-simulate', 'io', 'node', 'json', 'jsonp', 'event', 'autocomplete','trip-autocomplete', 'autocomplete-filters', 'imageloader', 'trip-calendar', 'trip-box','gallery-mustache', 'gallery-storage-lite','gallery-checkboxgroups',  function(Y) {
    var submitedData;
    var bodyEle = Y.one('body');
    /*iframe高度自定义,解决跨域问题*/
    /*
    var getDomain = function() {
    var arr = location.hostname.split('.'),
    len = arr.length;
    return arr.slice(len - 2).join('.');
    };
    document.domain = getDomain();
    */

    /* 从cookie里加载用户皮肤*/
    (function(){
        var skin_cookie = Y.Cookie.getSubs('b2b_prefs_skin');
        if( skin_cookie && skin_cookie.name && skin_cookie.name!='default'){
            changeSkin(skin_cookie.name,skin_cookie.filepath);
            Y.on('contentready',function(){
                Y.one('.head').removeClass('vhidden');
            },'#skins');
        }else{
            Y.on('available',function(){
                this.removeClass('vhidden');
            },'.head');
        }
    })();

    /* 换肤 */
    function changeSkin(name, filepath, saving_in_cookie) {
        var href = filepath;

        //保存skin名至cookie
        if (saving_in_cookie) {
            Y.Cookie.setSubs('b2b_prefs_skin',{name:name,filepath:filepath});
        }

        if (name === "default") {
            Y.one('#skins') && Y.one('#skins').remove();
            return;
        }

        if (Y.one('#skins') == null) {
            Y.one('head').append('<link id="skins" rel="stylesheet" href="' + href + '"  />');
        } else {
            Y.one('#skins').set("href", href);
        }
    }

    /* 重置表单 */
    Y.Node.addMethod('resetForm', function() {
        this.all('input[type=text]').set('value', '');
        this.all('textarea').set('text', '');
    });

    /* 将input组装成XMLHttpRequest的data
    * 简单模拟Y.io._serialize
    */
    Y.Node.addMethod('serialize_form', function() {
        var result = [];
        this.all('input,textarea,select').each(function(){
            var name = this.get('name');
            var eleType = this.get('type');
            var isDisabled= this.get('disabled');
            var value = this.get('value');

            if (isDisabled || name == '' ||  name=='__MYVIEWSTATE'){
                return false;
            }

            if ( (eleType == 'checkbox' || eleType == 'radio') && this.get('checked')==false ){
                return false;
            }

            // result[name]=value;
            result.push(name+'='+value);

        });

        return result.join('&');
    });

    /* 调用yui默认皮肤 */
    //bodyEle.addClass('yui3-skin-sam');

    /* 全局Domready */
    Y.on('domready', function() {
        /*弹出窗overlay*/
        function lightbox() {
            //todo 等待重构
            bodyEle.delegate('click', function(e) {
                var uid = '-' + this.get('id');
                var lightboxid = this.getAttribute('data-lightboxid');
                var lightboxID = lightboxid + uid;
                //缓存ajax弹窗
                var cached = this.getAttribute('data-cached')=='0'?false:true;
                var url = this.getAttribute('data-url');
                var buy = this.getAttribute('data-buy');
                var FlightNo = '&FlightNo=' + this.getAttribute('data-flightno');
                var Price = '&Price=' + this.getAttribute('data-price');

                submitedData = this.getAttribute('data-params');

                //显示弹窗
                function show(fn,ele) {
                    if( ele ){
                        var i = Y.one(ele).setStyle('display', 'block');
                        lightboxID = null;
                        fn && fn.call(this, i);
                    }else{
                        Y.all('.lightbox').each(function(i) {
                            if (i.getAttribute('data-lightboxid') + uid == lightboxID) {
                                i.setStyle('display', 'block');
                                lightboxID = null;
                                //设置回调函数
                                fn && fn.call(this, i);
                            }
                        });
                    }

                    //关闭按钮
                    Y.all('.lightbox .close').on('click', function(e) {
                        if (buy && e.target.hasClass('submit')) {
                            Y.log(submitedData)
                            location.href = buy + submitedData;
                        } else {
                            e.target.ancestor('.lightbox').hide();
                        }
                    });
                }


                if(lightboxid == 'GDZC'){
                    var container = Y.one('#gdzc_lightbox');

                    container.one('.confirm').on('click',function(){
                        var input,table,targetRow,cloned;
                        var checked = container.one(':checked');
                        if(checked==null) return;

                        table = Y.one('.table2-tjdd');
                        targetRow = checked.ancestor('tr');

                        if( table.one('#'+targetRow.get('id') )==null ){
                            cloned = targetRow.cloneNode(true);
                            table.one('tr:nth-last-child(1)').insert(cloned,'after');
                            cloned.one('input').simulate('change');
                        }

                        input = table.one('#'+targetRow.get('id')+' input');
                        input.simulate('click');
                    });

                }

                if (lightboxid == 'QACT'){
                    if (Y.one('.lightbox' + uid)) {
                        Y.log(cached);
                        if(cached){
                            return show();
                        }else{
                            Y.one('.lightbox' + uid).remove();
                        }
                    }
                    var templ = Y.one('#quick_add_city_template').getContent();
                    var data={}
                    data.uid=uid;
                    data.apcode=this.ancestor('.add_city_block').get('id');
                    var lightboxTemplate = Y.mustache(templ, data);

                    bodyEle.append(lightboxTemplate);
                    show(null,'.lightbox'+uid);
                }

                if (lightboxid == 'CPQR') {

                    // 初始化数据
                    // Y.fieldsetFormat('set',{
                    //     data:info
                    // });

                    // 序列化所有fieldset标签
                    var output = Y.fieldsetFormat('get');
                    var data = Y.JSON.stringify(output);

                    // 初始化数据
                    // Y.StorageLite.on('storage-lite:ready',function(){
                    //     Y.StorageLite.setItem('CPQR_DATA',data);
                    // });

                    Y.log(data);

                    /* 显示确认信息
                    output.uid = uid;
                    var templ = Y.one('#TOTAL-template').getContent();
                    var lightboxTemplate = Y.mustache.to_html(templ, output);

                    if (Y.one('.lightbox' + uid)) {
                    if(cached){
                    return show();
                    }else{
                    Y.one('.lightbox' + uid).remove();
                    }
                    }

                    bodyEle.append(lightboxTemplate);

                    show(function(i) {
                    i.one('.submit').on('click', function() {
                    Y.io(url, {
                    data: 'info=' + data,
                    on: {
                    success: function(i,res) {
                    var arr = res.responseText.split(',');
                    if (arr[0] == '0') {
                    location.href = 'FlightOrderAuditDetail.aspx?ORDER_NO=' + arr[1];
                    }

                    if (arr[0] == '1') {
                    alert(arr[1]);
                    }
                    },
                    error: function() {}
                    }
                    });
                    });
                    });
                    */

                    // todo
                    // if(!formvalid()) return;

                    Y.io(url, {
                        method: 'post',
                        data: 'info=' + data,
                        on: {
                            success: function(i,res) {
                                var arr = res.responseText.split(',');
                                if (arr[0] == '0') {
                                    location.href = 'FlightOrderAuditDetail.aspx?ORDER_NO=' + arr[1];
                                }

                                if (arr[0] == '1') {
                                    alert(arr[1]);
                                }
                            }
                        }
                    });
                    // end ajax 确认提交支付

                    return;
                }

                if (url) {
                    if (Y.one('.lightbox' + uid)) {
                        Y.log(cached);
                        if(cached){
                            return show();
                        }else{
                            Y.one('.lightbox' + uid).remove();
                        }
                    }

                    //在每个lightbox按钮旁边增加可序列化的fieldset
                    var output = Y.fieldsetFormat('get',{
                        selector:this.get('parentNode').all('fieldset')
                    });

                    var data = Y.JSON.stringify(output);
                    Y.log('换仓验证数据'+data);

                    Y.io(url, {
                        data: 'verify='+data+'&time=' + new Date().getTime(),
                        on: {
                            success: function(i, res) {
                                /* 返回的格式
                                * { html:{0},Status:{1},data_Price:{2},data_Tax:{3} }
                                */

                                var templ = Y.one('#TSXX-template').getContent();
                                var data = Y.JSON.parse(res.responseText);
                                data.uid = uid;

                                var lightboxTemplate = Y.mustache(templ, data);
                                buy = buy.replace(/(data_Price=)[^&]+/g,'data_Price='+data['data_Price']);
                                buy = buy.replace(/(data_Tax=)[^&]+/g,'data_Tax='+data['data_Tax']);

                                bodyEle.append(lightboxTemplate);
                                show(null,'.lightbox'+uid);
                            }
                        }
                    });
                } else {
                    show();
                }

            }, ".show-lightbox");
        }
        lightbox();
        /*弹出窗overlay end*/

        /*  绑定全局日历组件 */
        // Y.on('available', function() {
        // 	Y.all('.datepicker').each(function(i) {
        // 		if (i.get('parentNode').hasClass('datepicker-wrapper')) {
        // 			return;
        // 		} else {
        // 			i = i.wrap('<u>').get('parentNode');
        // 			new Y.TripCalendar({
        // 				beginNode: i
        // 			});
        // 		}
        // 	});
        // },
        // '.datepicker');


        Y.all('.change-style').on('click', function(e) {
            var that = e.target;
            // var path = that.getData('filepath');
            // var color = that.getData('color');
            var path = that.getAttribute('data-filepath')
            var color = that.getAttribute('data-color')
            changeSkin(color, path, true);

        });
        /* 换肤 end */

        /* 隐藏头部菜单 */
        Y.one('.arrow5').on('click', function() {
            Y.one('.head').toggleView();
            this.toggleClass('arrow5h');
        });

        /* 隐藏左侧菜单 */
        Y.one('.arrow4').on('click', function() {
            Y.one('.sidebar').toggleView();
            this.toggleClass('arrow4h');
            bodyEle.toggleClass('hide-sidebar');
        });

        /*机票统计页面*/
        Y.on('available', function() {
             var calendar = new Y.TripCalendar({
                isSelect:true,
                count:1,
                isDateInfo:false,
                // maxDate: showdate(365,new Date()),
                triggerNode:'.start_date,.end_date'
            });     


            Y.all(".dropdown").on("hover", function(i) {
                Y.one(".box").setStyle("display", "block");
            },
            function(i) {
                Y.one(".box").setStyle("display", "none");
            });
        },
        '.mo-jptj');

        /*出票订单 mo-cpdd*/
        Y.on('available',function(){
            var calendar = new Y.TripCalendar({
                //isSelect:true,
                count:1,
                isDateInfo:false,
                maxDate: new Date(),
                triggerNode:'.start_date,.end_date'
            });
             
             var current_start_date;

            calendar.on('show',function(){
                var cal = this;
                var input = this.getCurrentNode();
                if(input.hasClass('start_date')){                     
                        cal.set('date',new Date()).render();
                        cal.set('maxDate',new Date()).render();                        
                        cal.set('minDate',null).render();          
                }
                if(input.hasClass('end_date')){
                      var sub = parseInt(( new Date().getTime() - new Date(current_start_date).getTime() )/3600/1000/24);
                      if( sub>30 ){
                         cal.set('date',showdate(31-sub,new Date())).render();
                         cal.set('maxDate',showdate(31-sub,new Date())).render();
                         cal.set('minDate',new Date(current_start_date)).render(); 
                      }else{
                         cal.set('date',new Date()).render();
                         cal.set('maxDate',new Date()).render();
                         cal.set('minDate',new Date(current_start_date)).render(); 
                      }

                }
            });

            calendar.on('dateclick',function(e){
                var cal = this;
                var input = this.getCurrentNode();
                if(input.hasClass('start_date')){
                    current_start_date = this.getSelectedDate();
                }
            });

        },'.mo-cpdd')

        /*政策添加*/
        Y.on('available', function() {
            loadingbar();

            var tpl = Y.one('#add_city_template').getContent();
            var airline_container = Y.one('.add_city_container');
            var airline_temp="";

            function airline_change(){

                Y.all('.add_city_block .select_group').each(function(){
                    var that=this;
                    var container = that.ancestor().ancestor().ancestor().one('.add_city_preview ul')
                    new Y.Checkall({
                        node:[that.one('.select_button')],
                        nodelist:that.all('.checkbox'),
                        inverse:that.one('.unselect_button')
                    }).on('check',function(o){
                        var pp = that.ancestor().all(':checked').get('value');
                        container.empty();
                        Y.Array.each(pp,function(i){
                            if(i!=''){
                                container.append('<li><input class="select_city" type="hidden" value="'+i+'" />'+i+'</li>');
                            }
                        });
                    });
                });

                new Y.Checkall({
                    node:[Y.one('.add_city_xblock .select_button')],
                    nodelist:Y.all('.add_city_xblock .checkbox'),
                    inverse:Y.one('.add_city_xblock .unselect_button')
                });

                Y.one('.add_city_container .confirm').on('click',function(){
                    var depcity= Y.all('.add_city_block_depcity .select_city').get('value');
                    var berth = Y.all('.add_city_xblock .checkbox:checked').get('value');
                    var arrcity= Y.all('.add_city_block_arrcity .select_city').get('value');

                    if(depcity.length<1) return alert('请选择始发城市');
                    if(berth.length<1) return alert('请选择舱位');
                    if(arrcity.length<1) return alert('请选择目的城市');

                    Y.one('.agroup_depcity').set('value',depcity.join('/'));
                    Y.one('.agroup_berth').set('value',berth.join('/'));
                    Y.one('.agroup_arrcity').set('value',arrcity.join('/'));

                     cancel_input();
                });

                Y.one('.add_city_container .cancel').on('click',function(){
                     cancel_input();
                });  

                function cancel_input(){
                    airline_container.setStyle('display','none').empty();
                    setTimeout(function(){
                        location.href='#';
                    },50);
                }

            }

            bodyEle.delegate('click',function(){
                var that = this;
                var textarea = this.ancestor('.lightbox-content').one('textarea')
                var apcode_value = textarea.get('value');
                var data_ap = this.getAttribute('data-apcode');
                var arr = apcode_value && apcode_value.split('/')
                var container = Y.one('#'+data_ap).one('.add_city_preview');
                var valid = true;
                if(arr!=''){
                    Y.Array.each(arr,function(i,index){
                        if (/^[a-zA-Z]{3}$/.test(i)==false){
                            alert('三字码不正确');
                            valid = false;
                            return false;
                        }else{
                            var new_value = i.toUpperCase();
                            if(container.get('text').indexOf(new_value)==-1){
                                container.append('<ul><li class="blue"><input class="select_city" type="hidden" value="'+new_value+'" /> '+new_value+'  </li></ul>');
                            }
                        }
                    });
                }

                textarea.set('value','');
                if(valid){
                    that.ancestor('.lightbox').setStyle('display','none');
                }

            },'.apcode_submit');

            Y.one('.agroup_airline').on('change',function(){
                var container = this.ancestor('table');
                container.one('.agroup_berth').set('value','');
                container.one('.agroup_depcity').set('value','');
                container.one('.agroup_arrcity').set('value','');
            });


            airline_autocomplete(function(e){
                var arr = e.result.display.split('|');
                var inputNode = e.target._inputNode;
                var codeNode = Y.one('#ctl00_BodyContent_AIRLINE');
                setTimeout(function(){
                    inputNode.blur();
                },50);

                if (arr[1]) {
                    e.result.text = arr[1];
                    codeNode.set('value', arr[0]);

                    //如果航空公司没变，舱位城市值清空
                    if(airline_temp != arr[1]){
                        airline_temp = arr[1];
                        Y.one('.agroup_airline').simulate('change');
                    }

                    var url='/js/ajax/airlinedata/'+arr[0]+'.js';

                    Y.io(url,{
                        // data:'',
                        on:{
                            start:function(){
                                Y.Get.script('/js/ajax/domestic.js', function (err) {
                                    G_domestic_city = G_domestic_city;
                                });
                            },
                            success:function(i,res){
                                var data = Y.JSON.parse(res.responseText);
                                //全局变量 domestic_city;
                                if(typeof G_domestic_city=='undefined'){
                                    return Y.log('没找到国内航班数据');
                                }

                                G_domestic_city = Y.DataSchema.Array.apply({
                                    resultFields: [ 'AirportCode', 'CityName' ]
                                }, G_domestic_city);

                                // data.domestic = G_domestic_city.results;

                                data.domestic = process_py(G_domestic_city.results);
                                data.ListS= process_py(data.ListS);
                                data.berth = function(){
                                    var html='';
                                    for(var i=65;i<=90;i++){
                                        html+='<label> <input type="checkbox" class="checkbox" value="'+String.fromCharCode(i)+'" name="" /> '+String.fromCharCode(i)+' </label>';
                                    }
                                    return html;
                                }

                                airline_container.setStyle('display','block').empty().append(Y.mustache(tpl, data));
                                airline_change();

                                new Y.TabView({
                                    srcNode: '#add_depcity_group'
                                }).render();

                                new Y.TabView({
                                    srcNode: '#add_arrcity_group'
                                }).render();

                            }
                        }

                    });

                } else {
                    e.result.text = '';
                    codeNode.set('value', '');
                }

            });

        },
        '.mo-zctj');

        function process_py(arr){
            var obj={
                "AF":[],
                "GL":[],
                "MR":[],
                "SZ":[]
            };
            Y.Array.each(arr,function(i,index){
                var first_letter = i.AirportCode.charCodeAt(0);
                if(first_letter>=65 && first_letter<=70){
                    obj["AF"].push(i);
                }

                if(first_letter>=71 && first_letter<=76){
                    obj["GL"].push(i);
                }

                if(first_letter>=77 && first_letter<=82){
                    obj["MR"].push(i);
                }

                if(first_letter>=83 && first_letter<=90){
                    obj["SZ"].push(i);
                }
            });

            return obj;
        }

        /*线下订单管理预订单*/
        Y.on('available', function(){
            Y.all('.manipulate a').on('click',function(e){
                e.preventDefault();
                var url = this.get('href');
                Y.io(url,{
                    data:'',
                    on:{
                        success:function(){}
                    }
                });
            });
        },'.mo-khcx-ddcx-yu');

        /*提交pnr订单*/
        Y.on('available', function() {
            loadingbar();

            //日历控件  生日，证件有效期
             var calendar = new Y.TripCalendar({
                isSelect:true,
                count:1,
                isDateInfo:false,
                isHolity:false,
                triggerNode:'.datepicker'
            });

             function count_fp(){
                  var vals = Y.all('[name=INVOICE_AMOUNT]').get('value');
                  var count = 0;
                  Y.Array.each(vals,function(i,index){
                        var item = parseInt(i);
                        if(!isNaN(item)) {
                            count+=item;
                        }
                  });
                  return count;
             };

              bodyEle.delegate('keyup',function(){
                    var total =  count_fp();
                    var all = parseInt(Y.one('.TotalPrice').get('text'));
                    var val = this.get('value');

                    if(total>all){
                         val = val.replace(/.$/,'');
                         this.set('value', val ); 
                    }

             },'[name=INVOICE_AMOUNT]');

            //初始化数据
            // Y.StorageLite.on('storage-lite:ready',function(){
            //     var LAST_CPQR_DATA = Y.StorageLite.getItem('CPQR_DATA');
            //     if(LAST_CPQR_DATA){
            //         Y.fieldsetFormat('set',{ data: Y.JSON.parse(LAST_CPQR_DATA)});
            //     }
            // });

            //todo 待优化
            var countCus = 1;

            function add_fpone_item(){
                var fpone_item = '<div class="group-item">'+Y.one('.fpone-mul .group-item').getContent()+'</div>';
                var container =  Y.one('.fpone-one');
                var node =  Y.Node.create(fpone_item);
                container.append(node);
            }

            /**同步乘客到联系人信息**/
            bodyEle.delegate('change',function(e){
                var index = Y.all('.block3 [name=SurName]').indexOf(this);
                var item = Y.all('.fpone-one [name=PASSENGER_NAME]').item(index);
                if(item.get('value')==''){
                    item.set('value',this.get('value'));
                }
            },'.block3 [name=SurName]');

            /**增加乘客*/
            bodyEle.delegate('click', function(i) {
                i.preventDefault();
                var that = i.target;
                var container = that.ancestor('fieldset');
                var cloned = container.one('.group-item').cloneNode(true);
                cloned.append('<span class="CustomerDel">删除</span>');
                container.append(cloned.resetForm());
                cloned.one('[type=text]').focus();
                countCus++;

                add_fpone_item();
            },
            '.CustomerAdd');

            /*删除乘客*/
            bodyEle.delegate('click', function(i) {
                var that = i.target;
                var container = that.ancestor('.group-item');
                var index = Y.all('.block3 .group-item').indexOf(container);

                container.previous().one('[type=text]').focus();
                container.remove();
                countCus--;

                Y.one('.fpone-one').all('.group-item').item(index).remove();
            },
            '.CustomerDel');

            (function(){
                Y.mix(Y.Node.DOM_EVENTS, {
                    DOMNodeInserted: true,
                    DOMNodeRemoved: true,
                    DOMSubtreeModified:true,
                    DOMCharacterDataModified: true
                });

                var nodeCustomerCount = Y.all('.CustomerCount');
                var nodeCustomerInsuranceCount = Y.all('.CustomerInsuranceCount');
                var nodeCustomerTotalInsurance = Y.all('.CustomerTotalInsurance');
                var nodeSingleTickedPrice = Y.all('.SingleTicketPrice');
                var nodeTotalPrice = Y.all('.TotalPrice');
                var CustomerCount = 1;
                var CustomerInsuranceCount = 1;
                var SingleTicketPrice = parseInt(nodeSingleTickedPrice.get('text'));

                //**********change policy
                //todo   SingleTicketPrice = new;

                Y.one('.mo-tjdd .block2').on('change',function(e){
                    SingleTicketPrice = e.target.ancestor('tr').one('td:nth-last-child(1)').get('text');
                    swichChangeNodeValue(nodeSingleTickedPrice,SingleTicketPrice);
                    Y.one('.mo-tjdd .block3').simulate('change');
                });

                Y.one('.mo-tjdd .block3').on('valueChange',formchangehandler);
                Y.one('.mo-tjdd .block3').on('change',formchangehandler);
                Y.one('.mo-tjdd .block3').on('DOMNodeInserted',formchangehandler);
                Y.one('.mo-tjdd .block3').on('DOMNodeRemoved',formchangehandler);

                function formchangehandler(){
                    var tempCustomerCount = this.all('.group-item').size();
                    var tempCustomerInsuranceCount = this.all('[name=Insurance]:checked').size();

                    if (tempCustomerCount != CustomerCount){
                        CustomerCount = tempCustomerCount;
                        swichChangeNodeValue(nodeCustomerCount,CustomerCount);
                    }

                    if (tempCustomerInsuranceCount != CustomerInsuranceCount){
                        CustomerInsuranceCount = tempCustomerInsuranceCount
                        swichChangeNodeValue(nodeCustomerInsuranceCount,CustomerInsuranceCount);
                        swichChangeNodeValue(nodeCustomerTotalInsurance,CustomerInsuranceCount*8);
                    }

                    swichChangeNodeValue(nodeTotalPrice,SingleTicketPrice*CustomerCount + CustomerInsuranceCount*8);
                }
            })();

            function swichChangeNodeValue(node,value){
                var tagName = node.get('tagName');
                if(tagName=='INPUT'){
                    node.set('value',value);
                }else{
                    node.set('text',value);
                }
            }

            Y.one('.rp-fp-checkbox')&&Y.one('.rp-fp-checkbox').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.rq-fp').setStyle('display', 'block');
                } else {
                    Y.one('.rq-fp').setStyle('display', 'none');
                }
            });

            Y.one('.pszq')&&Y.one('.pszq').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.psfs_box_zq').setStyle('display', 'block');
                    Y.one('.psfs_box_df').setStyle('display', 'none');
                }
            });

            Y.one('.psdf')&&Y.one('.psdf').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.psfs_box_df').setStyle('display', 'block');
                    Y.one('.psfs_box_zq').setStyle('display', 'none');
                }
            });

            Y.one('.select_pas_type')&&Y.one('.select_pas_type').on('change', function(e) {
                if (this.get('value') == 2) {
                    Y.one('.uploads-box').setStyle('display', 'block');
                } else {
                    Y.one('.uploads-box').setStyle('display', 'none');
                }
            });

            Y.one('.fp-one')&&Y.one('.fp-one').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.fpone-one').removeClass('hidden').all('.group-item').removeClass('disabled');
                    Y.one('.fpone-mul').addClass('hidden').all('.group-item').addClass('disabled');
                } else {
                    Y.one('.fpone-one').addClass('hidden').all('.group-item').addClass('disabled');

                    Y.one('.fpone-mul').removeClass('hidden').all('.group-item').removeClass('disabled');
                    ;
                }
            });

            Y.one('.fp-mul')&&Y.one('.fp-mul').on('click', function(e) {
                if (!this.get('checked')) {
                    Y.one('.fpone-one').removeClass('hidden').all('.group-item').removeClass('disabled');
                    Y.one('.fpone-mul').addClass('hidden').all('.group-item').addClass('disabled');
                } else {
                    Y.one('.fpone-one').addClass('hidden').all('.group-item').addClass('disabled');

                    Y.one('.fpone-mul').removeClass('hidden').all('.group-item').removeClass('disabled');
                    ;
                }
            });

        },
        '.mo-tjdd');

         /*mo-ffpxq*/
      Y.on('available',function(){
             var calendar = new Y.TripCalendar({
                isSelect:true,
                count:1,
                isDateInfo:false,
                maxDate: showdate(365,new Date()),
                minDate: new Date(),
                triggerNode:'.tkoff_date'
            });  
         },'.mo-ffpxq');

     /*添加政策 mo-zctj*/
      Y.on('available',function(){
             var calendar = new Y.TripCalendar({
                isSelect:true,
                count:1,
                isDateInfo:false,
                //maxDate: showdate(365,new Date()),
               // minDate: new Date(),
                triggerNode:'.datepicker'
            });  
         },'.mo-zctj');


        /*mo-khcx-cpcz*/
        Y.on('available',function(){
             var calendar = new Y.TripCalendar({
                isSelect:true,
                count:1,
                isDateInfo:false,
                // maxDate: showdate(365,new Date()),
                // minDate: new Date(),
                triggerNode:'.zjyxq_date'
            });     

            loadingbar();
            // attaches behavior to all checkboxes with CSS class "my-at-least-one-checkbox-group"
            //new Y.AtLeastOneCheckboxGroup('.my-at-least-one-checkbox-group');

            // attaches behavior to all checkboxes with CSS class "my-at-most-one-checkbox-group"
            //new Y.AtMostOneCheckboxGroup('.my-at-most-one-checkbox-group');

            // attaches behavior to all checkboxes with CSS class "my-select-all-checkbox-group",
            // controlled by the checkbox with id "my-select-all-checkbox"
            new Y.SelectAllCheckboxGroup('.table1-ddxq .thead .checkbox', '.table1-ddxq .data-row .checkbox');

            // attaches behavior to all checkboxes with CSS class "my-enable-if-any-checkbox-group",
            // to enable/disable all nodes with CSS class "managed" (typically buttons)
            //new Y.EnableIfAnyCheckboxGroup('.my-enable-if-any-checkbox-group', '.managed');

            (function(){
                Y.mix(Y.Node.DOM_EVENTS, {
                    DOMNodeInserted: true,
                    DOMNodeRemoved: true,
                    DOMSubtreeModified:true,
                    DOMCharacterDataModified: true
                });

/*           nodeprice1        <td>单张运价</td>
  *           nodeprice2       <td>代理费（%）</td>
  *           nodeprice3          <td>奖励扣率（%）</td>
  *           nodeprice4         <td>奖励金额</td>
  *           nodeprice5        <td>税费</td>
   */
                var nodePrice1 = Y.one('.aPrice1');
                var nodePrice2 = Y.one('.aPrice2');
                var nodePrice3 = Y.one('.aPrice3');
                var nodePrice4 = Y.one('.aPrice4');
                var nodePrice5 = Y.one('.aPrice5');


                var nodePrice1_t = Y.one('.tPrice1');
                var nodePrice2_t = Y.one('.tPrice2');
                var nodePrice3_t = Y.one('.tPrice3');
                var nodePrice4_t = Y.one('.tPrice4');
                var nodePrice5_t = Y.one('.tPrice5');

                Y.one('.mo-khcx-cpcz').on('change',formchangehandler);
                Y.all('.mo-khcx-cpcz .table2-ddxq .text').on('keyup',formchangehandler);
                Y.one('.mo-khcx-cpcz').on('valueChange',formchangehandler);

                Y.one('input').focus();
                var CustomerCount = Y.one('.block3').all('.group-item').size();
                /*
                * 
单张机票净价=单张运价*（1-代理费率）*（1-奖励扣率）- 奖励金额
1、票款合计=费用明细中的单张机票净价，按照人数累加
2、税费合计=费用明细中的税费，按照人数累加
3、保险合计=费用明细中的乘机人信息中的保险费用累加
4、佣金合计=（单张运价-单张机票净价），按照人数累加
5、订单总金额=票款合计+税费合计+保险合计
                *
                * */

                function formchangehandler(){
                    CustomerCount = Y.one('.block3').all('.group-item').size();
                    var Price1 = parseInt(nodePrice1.get('value'))||0;
                    var Price2 = parseInt(nodePrice2.get('value'))||0;
                    var Price3 = parseInt(nodePrice3.get('value'))||0;
                    var Price4 = parseInt(nodePrice4.get('value'))||0;
                    var Price5 = parseInt(nodePrice5.get('value'))||0;


                    var basePrice = parseInt(Price1*(1-Price2/100)*(1-Price3/100)-Price4)||0;

                    var t1 = basePrice*CustomerCount; //票款合计
                    var t2 = Price5*CustomerCount; //税费合计
                    var t3 = 8*CustomerCount; //保险合计
                    var t4 = (Price1 - basePrice) * CustomerCount; //佣金合计
                    var t5 = t1+t2+t3; //订单从金额

                    nodePrice1_t.set('value',t1||0);
                    nodePrice2_t.set('value',t2||0);
                    nodePrice3_t.set('value',t3||0);
                    nodePrice4_t.set('value',t4||0);
                    nodePrice5_t.set('value',t5||0)
                }

            })();

            function swichChangeNodeValue(node,value){
                var tagName = node.get('tagName');
                if(tagName=='INPUT'){
                    node.set('value',value);
                }else{
                    node.set('text',value);
                }
            }

            var hbxx_add = Y.one('.hbxx_add');
            var hbxx_copy = Y.one('.hbxx_copy');
            var hbxx_del_sel  = Y.one('.hbxx_del_sel');
            var hbxx_del_unsel  = Y.one('.hbxx_del_unsel');
            var hbxx_combine  = Y.one('.hbxx_combine');

            var container = Y.one('.table1-ddxq');

            hbxx_add.on('click',function(e){
                e.preventDefault();
                var cloned = container.one('.data-row').cloneNode(true).resetForm();
                container.one('tr:nth-last-child(1)').insert(cloned,'after');
                new Y.SelectAllCheckboxGroup('.table1-ddxq .thead .checkbox', '.table1-ddxq .data-row .checkbox');
            });

            hbxx_del_unsel.on('click',function(e){
                e.preventDefault();

                //todo
                var unchecked_row = container.all('.data-row .checkbox').filter('.data-row :checked');

                if(unchecked_row.size()>0){
                    unchecked_row = unchecked_row.get('parentElement').get('parentElement');
                }

                unchecked_row.remove();

                new Y.SelectAllCheckboxGroup('.table1-ddxq .thead .checkbox', '.table1-ddxq .data-row .checkbox');
            });

            hbxx_del_sel.on('click',function(e){
                e.preventDefault();

                //todo
                var leftcount = (container.all('.data-row .checkbox').size() - container.all('.data-row :checked').size());

                if(leftcount<1){
                    return alert('必须留一条');
                }

                var checked_row = container.all('.data-row :checked');

                if(checked_row.size()>0){
                    checked_row = checked_row.get('parentElement').get('parentElement');
                }

                checked_row.remove();

                new Y.SelectAllCheckboxGroup('.table1-ddxq .thead .checkbox', '.table1-ddxq .data-row .checkbox');
            });

            hbxx_copy.on('click',function(e){
                e.preventDefault();
                var arr = [];
                var checked_row = container.all('.data-row :checked');

                if(checked_row.size()>0){
                    checked_row = checked_row.get('parentElement').get('parentElement');
                }

                checked_row.each(function(i,v){
                    arr.push( i.cloneNode(true));
                });

                arr = arr.reverse();

                Y.Array.each(arr,function(i){
                    checked_row.insert(i,'after');
                });

                new Y.SelectAllCheckboxGroup('.table1-ddxq .thead .checkbox', '.table1-ddxq .data-row .checkbox');
            });

            bodyEle.delegate('click',function(e){
                var count_data_row = container.all('.data-row').size();
                e.preventDefault();
                if(count_data_row<=1){
                    alert('必须留一条');
                }else{
                    this.ancestor('tr').remove();
                }
            },'.hbxx_del_row')

        },'.mo-khcx-cpcz');

        /*mo-khcx-ddxq*/
        Y.on('available',function(){
            Y.one('#save_submit').on('click',function(){
                // 保存出票数据
                // Y.fieldsetFormat('set',{
                //     data:info
                // });

                var url = this.getAttribute('data-url');
                var output = Y.fieldsetFormat('get');
                var data = Y.JSON.stringify(output);

                // 保存出票数据
                // Y.StorageLite.on('storage-lite:ready',function(){
                //     Y.StorageLite.setItem('CPQR_DATA',data);
                // });
                Y.log(data);

                // todo
                // if(!formvalid()) return;

                Y.io(url, {
                    method: 'post',
                    data: 'info=' + data,
                    on: {
                        success: function(i,res) {
                            var arr = res.responseText.split(',');
                            if (arr[0] == '0') {
                                location.href = '../FlightOrderSubmit.aspx?ORDER_NO=' + arr[1];
                            }

                            if (arr[0] == '1') {
                                alert(arr[1]);
                            }
                        }
                    }
                });
                /*end */

            });

        },'.mo-khcx-ddxq');

        /*mo-khcx-ddxq-new*/
        Y.on('available',function(){
            (function(){
                Y.mix(Y.Node.DOM_EVENTS, {
                    DOMNodeInserted: true,
                    DOMNodeRemoved: true,
                    DOMSubtreeModified:true,
                    DOMCharacterDataModified: true
                });

                var nodePrice1 = Y.one('.Price1');
                var nodePrice2 = Y.one('.Price2');
                var nodePrice3 = Y.one('.Price3');

                Y.one('.manipulate').on('change',formchangehandler);
                Y.one('.manipulate').on('valueChange',formchangehandler);

                function formchangehandler(){
                    var  Price1 = parseFloat(nodePrice1.get('value'));
                    var  Price2 = parseFloat(nodePrice2.get('value'));
                    if(Price2>Price1) {
                        alert('Error');
                        return;
                    }
                    nodePrice3.set('value',Price1-Price2);
                }

            })();

            function swichChangeNodeValue(node,value){
                var tagName = node.get('tagName');
                if(tagName=='INPUT'){
                    node.set('value',value);
                }else{
                    node.set('text',value);
                }
            }

        },'.mo-khcx-ddxq-new');


        function loadingbar(){
            /* 统一ajax遮罩*/
            var loading_tpl = '<div class="lightbox loading" style="display:none"><table cellspacing="0">\
            <tbody><tr><td>\
                <div class="lightbox-content">\
                <i>&nbsp;</i><span>数据加载中...</span>\
                </div>\
                </td></tr>\
                </tbody></table></div>';

            var spin_wrap = Y.Node.create(loading_tpl);
            var timeout;

            bodyEle.prepend(spin_wrap);

            Y.on('io:start',function(){
                spin_wrap.setStyle('display','block');
                // timeout = setTimeout(function(){
                //     alert('连接超时');
                //     spin_wrap.hide();
                // },20000);
            });

            // Y.on('io:failure',function(t, r, a){
            //     clearTimeout(timeout);
            //     spin_wrap.one('span').setContent('请求失败:'+r);
            // });

            Y.on('io:complete',function(){
                clearTimeout(timeout);
                spin_wrap.hide();
            });

        }

        /*航空公司自动补全*/
        function airline_autocomplete(select_callback){
            //old source http://webresource.c-ctrip.com/code/cquery/resource/address/flightintl/airline_gb2312.js
            // var airlines = [{
            //     airline_name:'中国国际航空',
            //     airline_code:'CA'
            // },{
            //     airline_name:'东方航空',
            //     airline_code:'MU'
            // },{
            //     airline_name:'东方航空',
            //     airline_code:'MC'
            // }];
            var airlineNode = Y.one('.airlines');

            airlineNode.plug(Y.Plugin.AutoComplete, {
                resultTextLocator: function(r){
                       return r.airline_code+'|'+r.airline_name;
                },
                resultFilters: ['charMatch'],
                // source:'ajax/airlines.js?callback={callback}',
               // source: airlines,
                source: '/js/ajax/airlines.js',
                maxResults: 10,
                on: {
                    select: function(e) {
                        if(typeof select_callback=='function'){
                            select_callback.call(null,e);
                        }
                    }
                }
            });

            airlineNode.on('focus', function(e) {
                if (e.currentTarget.get('value') == '') {
                    e.target.ac.sendRequest('');
                }
            });
        }

        /*航班查询页面*/
        Y.on('available', function() {

            loadingbar();
            form_hbcx();

             var calendar = new Y.TripCalendar({
                //isSelect:true,
                count:2,
                isDateInfo:false,
                minDate: new Date(),
                triggerNode:'.depdate,.arrdate'
            });

            function form_hbcx() {
                /*城市搜索建议*/
                citySuggest();

                /*航空公司补全*/
                airline_autocomplete(function(e){
                    var arr = e.result.display.split('|');
                    var inputNode = e.target._inputNode;
                    var codeNode = Y.one('.airlines_hidden');
                    setTimeout(function(){
                        inputNode.blur();
                    },50);
                    if (arr[1]) {
                        e.result.text = arr[1];
                        codeNode.set('value', arr[0]);
                    } else {
                        e.result.text = '';
                        codeNode.set('value', '');
                    }

                });

                /* 切换显示返程输入框 */
                Y.all('.radio_is_single').on('click', function(e) {
                    var that = e.target;
                    var arrDate = Y.one('[name=ARRDATE]');
                    if (that.hasClass('is_double')) {
                        arrDate.set('disabled', false).removeClass('disabled').addClass('yiv-required');
                    } else {
                        arrDate.set('disabled', true).addClass('disabled').removeClass('yiv-required');
                    }
                });

                /* 提交航班查询表单 */
                // todo

                Y.one(".J_Hbcx_Search").on('click', function(e) {
                    e.preventDefault();
                    var container = Y.one('#J_Hbcx_DataTable');

                    // 测试时禁用
                    // todo 可能要换掉模块
                    //if (!form.validateForm()) return;

                    var url = this.getAttribute('data-url');
                    var data = Y.one('.block1').serialize_form();
                    Y.log(data);
                    container.empty();

                    if (url) {
                        Y.io(url, {
                            data: data + '&time=' + new Date().getTime(),
                            on: {
                                success: function(i, res) {
                                    //IE 8 bug 无法识别script
                                    var nodes = Y.Node.create('<div>'+res.responseText.replace(/<script/,'_<script')+'</div>');
                                    var scriptTag = nodes.one('script');

                                    if(scriptTag){
                                        eval(scriptTag.getContent());
                                    }else{
                                        container.setContent(res.responseText);
                                        more_hbcx();
                                    }
                                }
                            }
                        });

                    }
                });
                /* 提交航班查询表单 end */
            }

            function more_hbcx() {
                var info_row = '' + '<tr class="info-row">' + '<td colspan=9>' + '</td>' + '</tr>';

                Y.all(".data-row").insert(info_row, 'after');

                Y.all(".mo-hbcx .more").on('click', function(e) {
                    var that = e.target;
                    var url = that.getAttribute("data-url");

                    var container = that.ancestor("tr").next().one('td');

                    if (container.hasClass("loaded")) {
                        container.removeClass("loaded");
                        that.removeClass("more-h");
                        container.all(".dancheng-ajax-wrapper").remove();
                        container.all(".wangfan-ajax-wrapper").remove();
                    } else {
                        Y.io(url, {
                            on: {
                                success: function(i, res) {
                                    //IE 8 bug 无法识别script
                                    var nodes = Y.Node.create('<div>'+res.responseText.replace(/<script/,'_<script')+'</div>');
                                    var scriptTag = nodes.one('script');

                                    if (scriptTag) {
                                        eval(scriptTag.getContent());
                                    } else {
                                        container.addClass("loaded");
                                        container.prepend(res.responseText);
                                        that.addClass("more-h");
                                        updateInfoRow();
                                    }
                                }
                            }
                        });
                    }

                });
            }

            function citySuggest() {
                       var depCity = new Y.TripAutoComplete({
                            inputNode: '.depcity',
                            codeInputNode: '.depcity_hidden',
                            source: 'http://ijipiao.trip.taobao.com/ie/remote/auto_complete.do?flag=2&count=20&callback={callback}&q=',
                            // source: result,
                            hotSource: '/js/ajax/hotcity.js'
                        });

                        var toCity = new Y.TripAutoComplete({
                            inputNode: '.arrcity',
                            codeInputNode: '.arrcity_hidden',
                            source: 'http://ijipiao.trip.taobao.com/ie/remote/auto_complete.do?flag=2&count=20&callback={callback}&q=',
                            // source: result,
                            hotSource: '/js/ajax/hotcity_international.js'
                        });


                // Y.Get.script('/js/ajax/citysearch.js',{
                //     onSuccess:function(){
                //         var city = city_guonei + city_guoji;
                //         var schema = {
                //             resultDelimiter: "@",
                //             fieldDelimiter: "|",
                //             resultFields: ['py','cityName','aa','bb']
                //         }

                //         // var result = {"userInput":"sb","code":200,"result":[{"cityName":"\u5723\u5df4\u5df4\u62c9","cityCode":"SBA","py":"shengbabala","spy":"s","en":"shengbabala","flag":4,"stateCode":1,"type":1,"ccode":"US"},{"cityName":"\u897f\u5e03(\u9a6c\u6765\u897f\u4e9a)","cityCode":"SBW","py":"xibu","spy":"x","en":"SIBU","flag":4,"stateCode":1,"type":1,"ccode":"MY"}],"cityFlag":4 };

                //         // result['result'] = Y.DataSchema.Text.apply(schema, city).results;
                //         // Y.log(result);


                //     }
                // });
            }

            function updateInfoRow() {
                Y.all('.mul-select').on('click', function(e) {

                    /* .data-row 单条航空公司数据 显示 航空公司 航班 机型 机场 时间等信息
                    *  .info-row 更多舱位数据行 默认隐藏 选择按钮 5600,3,1%+34.00,256,516,5860,Y,>9 点击选择后更新.meta-row和.data-row数据
                    *  .meta-row 预定按钮数据行 显示 退改签 票面价 代理费 奖励 佣金 税金 结算价
                    */
                     Y.log('换舱前数据:'+submitedData);                     

                    var infoRow = e.target.ancestor('.info-row');
                    var dataRow = infoRow.previous('.data-row');
                    var rowIndexs = [];

                    var previousMetaRow = infoRow.previous('.meta-row');
                    var nextMetaRow = infoRow.next('.meta-row');

                    var pMetaRowIndex = previousMetaRow && previousMetaRow.get('rowIndex') || - 9999;
                    var nMetaRowIndex = nextMetaRow && nextMetaRow.get('rowIndex');

                    var data = e.target.getAttribute('data-updates').split(',');

                    Y.log('换仓验证数据(源):'+data);

                    if (submitedData!='' && typeof submitedData != 'undefined'){
                        submitedData = submitedData.split('|')
                    }else{
                        submitedData = nextMetaRow.one('.button').getAttribute('data-params').split('|');
                    }

                    var cIndex = infoRow.get('rowIndex');

                    var group = infoRow.siblings(function(e) {
                        var rowIndex = e.get('rowIndex');
                        if (e.hasClass("data-row") && rowIndex < nMetaRowIndex && rowIndex > pMetaRowIndex) {
                            rowIndexs.push(rowIndex);
                            return true;
                        }
                    });

                    var pIndex = group.indexOf(dataRow);
                    var newArr = submitedData[pIndex].split(',');
                    newArr[newArr.length - 4] = data[data.length - 2];
                    newArr = newArr.join(',');

                    submitedData.splice(pIndex, 1, newArr)
                    submitedData = submitedData.join('|');

                    //更新metarow数据
                    nextMetaRow.all('s').each(function(i, index) {
                        i.set('text', data[index]);
                    });
                    nextMetaRow.one('.button').setAttribute('data-params',submitedData);

                    //更新datarow数据
                    dataRow.one('.sit-type').set('text', data[data.length - 2]);
                    dataRow.one('.sit-count').set('text', data[data.length - 1]);
                    dataRow.one('.more-h').simulate('click');

                    //更新预订验舱请求数据
                    Y.log('换舱后数据:'+submitedData);
                    nextMetaRow.all('[name=FlightInfo] [name=Class]').set('value',data[data.length - 2]);
                    nextMetaRow.all('[name=PubInfo] [name=Price]').set('value',data[0]);
                });
            }

        },
        '.mo-hbcx');

        //全局保存城市，关键字element
        // _toCity = Y.all('.endcity');
        // _searchKeyword = Y.one('#J_search_keyword');
        // _searchForm = Y.one('#J_kezhan_form');
        //
        // Y.TripPlaceholder.init('#J_search_keyword');
        //
        // new Y.SearchForm({node:'#J_kezhan_form', 'storage':false, 'afterValidate':function(){
        //  _submitInnSearch();
        // }});
        /*异步获取数据 列表
        function showList(k){
        //变量初始化
        var tabPannel =Y.all('#J_box .tab-pannel'), //客栈相关产品容器
        cityhotelnum = tabPannel.item(k).one("span.J_cityhotelnum"), //tab下的客栈数量信息
        pdid = [], //数组
        productId, //产品ID
        items, //callback客栈ID列表
        configUrl, //请求jsonp
        getUrl; //转化jsonp

        productId = tabPannel.item(k).all('li').get('id');
        for(var i=0; i<productId.length; i++){
        pdid.push(productId[i].replace('pd_',''));
        }
        pdid=pdid.join('|');
        //var configUrl ="http://kezhan.trip.daily.taobao.net/getKezhanList.htm?depCity={{cityCode}}&productId={{productId}}&callback={callback}";
        configUrl ="http://kezhan.trip.taobao.com/getKezhanList.htm?depCity={{cityCode}}&productId={{productId}}&callback={callback}";
        getUrl = Y.mustache(configUrl, {productId: pdid,cityCode: Y.one('#J_changeNav li.selected a').getAttribute('data-code')});
        if(getUrl){
        Y.jsonp(getUrl, {
        on : {
        success : function(response){
        if(response.code == 200){
        cityhotelnum.setContent('<em>' + response.data.hotelnum + '</em>'+ '家客栈,共<em>'+ response.data.peoplenum +'</em>人去过');
        items = response.data.pdlist;
        Y.each(items,function(pdcomment, pdid){
        Y.one("#pd_" + pdid + " .J_commentNum").setContent(pdcomment);
        });
        }else{
        Y.all('#J_box .J_cnone').remove();
        }
        }
        }
        });
        }
        };
        //showList(0);
        /* 列表 end*/

        /*屏幕滚动，延时加载
        var sImg = function(index){
        var ImageLazyloader,
        rendered = false;

        function renderImageLazyloader(){
        ImageLazyloader = new Y.ImgLoadGroup({
        name: 'insure-imageloader',
        foldDistance: 50
        });
        }

        function registerImages(len){
        var tabPannel = Y.all('.tab-pannel');
        tabPannel.item(len).all('.J_imglist').each(function(node) {
        node.setAttribute('id', Y.stamp(node));
        ImageLazyloader.registerImage({
        domId: node.get('id'),
        srcUrl: node.getAttribute('image-lazyload')
        });
        });
        }

        function render(len){
        renderImageLazyloader();
        registerImages(len);
        rendered = true;
        }

        render(index);

        };
        //sImg(0);
        /*屏幕滚动 图片延迟 end*/

        /*tab切换
        var TabClick = new Y.Slide('J_tablist',{
        autoSlide:false,
        eventype:'click'
        });
        // 点击tab获得索引值执行showList;
        TabClick.on('switch',function(data){
        var index = parseInt(data.index);

        setTimeout(function(){
        //延时加载
        showList(index);
        sImg(index);
        },10);
        });
        /*tab切换 end*/

        /*顶部图片hover效果
        Y.one('.adImgBox table').delegate('hover', function(e){
        var tar = e.currentTarget;
        var spanInMe = tar.one('.J_spanbox');
        spanInMe.removeClass('hide');
        },function(e) {
        var tar = e.currentTarget;
        var spanInMe = tar.one('.J_spanbox');
        spanInMe.addClass('hide');
        }, '.J_hoverA');
        /*顶部图片hover效果 end*/

        /*分享收藏
        Y.on('click',function(e){
        e.halt();
        if(!e.target.getAttribute('data-url')) return;
        //var tbToken = '&_tb_token_=' + Y.one('.J_tbToken')._node.value;
        var box = new Y.Box({
        head:'添加收藏<a class="close closebtn" style="cursor: pointer;"><img border="0" src="http://img01.taobaocdn.com/tps/i1/T1DeKaXcBxXXXXXXXX-10-10.png"></a>',
        body:'<iframe id="J_BoxIframe" src="'+e.target.getAttribute('data-url')+'" frameborder="0" width="445px" height="100%" scrolling="no"></iframe>',
        width:450,
        height:265
        });
        box.render();

        var inter;
        Y.on('click',function(e){
        e.halt();
        box.close();
        clearInterval(inter);
        },'.close');

        var tmp = Y.one("#J_BoxIframe"),
        scIframe = tmp._node;
        setTimeout(function(){
        tmp.on("load", function(){
        setIHeight();
        inter = setInterval(setIHeight, 3000);
        if(Y.UA.ie){
        var closeNode = scIframe.contentWindow.document.getElementById("J_ClosePopup");
        } else {
        var closeNode = scIframe.contentDocument.getElementById('J_ClosePopup');
        }
        closeNode && (Y.one(closeNode).setStyle("display", "none"));
        });
        }, 100);

        function setIHeight(){
        if (!Y.Cookie.get('_nk_')) {
        var hh = 275;
        }
        else {
        var hh = document.getElementById('J_BoxIframe').contentWindow.document.body.scrollHeight;
        }
        Y.one('#J_BoxIframe').setAttribute('height',hh+'px');
        Y.one('.yui3-widget').setStyle('height',(hh+35));
        Y.one('.yui3-widget .yui3-overlay-content').setStyle('height',(hh+35));
        Y.one('.yui3-widget .yui3-widget-bd').setStyle('height',hh);
        }
        },'.J_favourite');
        /*分享收藏 end*/

        /*回到顶部
        function gotop() {
        var ie6 = ! window.XMLHttpRequest;
        var a = document.getElementById('J_goTop');
        a.style.position = ie6 ? 'absolute': 'fixed';
        a.style.right = 10 + 'px';
        a.style.bottom = 10 + 'px';
        if (ie6) {
        window.onscroll = function() {
        a.className = a.className;
        };
        }
        }
        //   gotop();
        /*回到顶部 end*/

        /*本地测试用 切换用户类型*/
        YY = Y;
        (function() {
            var wo = location.search;
            if (wo.indexOf('usergroup') != - 1) {
                Y.all('.menu-sidebar a').on('click', function(e) {
                    e.preventDefault();
                    location.href = e.target.get('href') + wo;
                });
            }
        })();

    });

});


function showdate(n,d){
               //计算d天的前几天或者后几天，返回date,注：chrome下不支持date构造时的天溢出
                var uom = new Date(d-0+n*86400000);
                uom = uom.getFullYear() + "/" + (uom.getMonth()+1) + "/" + uom.getDate();
                return new Date(uom);
            };

          function dateToString(s, sep) {
                //将日期对象转换为文本
                    var sep = sep || '/'
                    return [s.getFullYear(), (s.getMonth() < 9 ? "0" : "") + (s.getMonth() + 1), (s.getDate() < 10 ? "0" : "") + s.getDate()].join(sep);
                };

// YUI().use('node', 'array-extras', 'querystring-stringify', function (Y) {
//     var form = Y.one('.mo-hbcx .block1'), query;
//     query = Y.QueryString.stringify(Y.Array.reduce(Y.one(form).all('input[name],select[name],textarea[name]')._nodes, {}, function (init, el, index, array) {
//         init[el.name] = el.value;
//         return init;
//     }));
//     console.log(query);
// });
