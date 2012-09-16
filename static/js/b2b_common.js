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
YUI({
    // defaultSkin:'sam'
}).use('gallery-checkboxgroups', 'cookie', 'gallery-storage-lite', 'fieldsetFormat', 'dataschema-text', 'node-event-simulate', 'io', 'node', 'json', 'jsonp', 'event', 'autocomplete', 'autocomplete-filters', 'imageloader', 'trip-mustache', 'trip-autocomplete', 'trip-calendar', 'trip-box', function(Y) {
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
                    Y.all('.lightbox [rel=close]').on('click', function(e) {
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
                    var lightboxTemplate = Y.Mustache.to_html(templ, output);

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

                                var lightboxTemplate = Y.Mustache.to_html(templ, data);
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
            Y.all(".dropdown").on("hover", function(i) {
                Y.one(".box").setStyle("display", "block");
            },
            function(i) {
                Y.one(".box").setStyle("display", "none");
            });
        },
        '.mo-jptj');

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

            Y.one('.rp-fp-checkbox').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.rq-fp').setStyle('display', 'block');
                } else {
                    Y.one('.rq-fp').setStyle('display', 'none');
                }
            });

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
                    console.log(SingleTicketPrice);
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

            Y.one('.rp-fp-checkbox').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.rq-fp').setStyle('display', 'block');
                } else {
                    Y.one('.rq-fp').setStyle('display', 'none');
                }
            });

            Y.one('.pszq').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.psfs_box_zq').setStyle('display', 'block');
                    Y.one('.psfs_box_df').setStyle('display', 'none');
                }
            });

            Y.one('.psdf').on('click', function(e) {
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

            Y.one('.fp-one').on('click', function(e) {
                if (this.get('checked')) {
                    Y.one('.fpone-one').removeClass('hidden').all('.group-item').removeClass('disabled');
                    Y.one('.fpone-mul').addClass('hidden').all('.group-item').addClass('disabled');
                } else {
                    Y.one('.fpone-one').addClass('hidden').all('.group-item').addClass('disabled');

                    Y.one('.fpone-mul').removeClass('hidden').all('.group-item').removeClass('disabled');
                    ;
                }
            });

            Y.one('.fp-mul').on('click', function(e) {
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


        /*mo-khcx-cpcz*/
        Y.on('available',function(){
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

                var nodePrice1 = Y.one('.aPrice1');
                var nodePrice2 = Y.one('.aPrice2');
                var nodePrice3 = Y.one('.aPrice3');
                var nodePrice4 = Y.one('.aPrice4');
                var nodePrice5 = Y.one('.aPrice5');
                var nodePrice6 = Y.one('.aPrice6');
                var nodePrice7 = Y.one('.aPrice7');
                var nodePrice8 = Y.one('.aPrice8');

                var nodePrice1_t = Y.one('.tPrice1');
                var nodePrice2_t = Y.one('.tPrice2');
                var nodePrice3_t = Y.one('.tPrice3');
                var nodePrice4_t = Y.one('.tPrice4');
                var nodePrice5_t = Y.one('.tPrice5');

                Y.one('.mo-khcx-cpcz').on('change',formchangehandler);
                Y.one('.mo-khcx-cpcz').on('valueChange',formchangehandler);

                Y.one('input').focus();
                var CustomerCount = Y.one('.block3').all('.group-item').size();
                /*
                * 单张机票净价= 单张运价*（1-代理费率）*（1-奖励扣率）- 奖励金额
                * 1、票款合计=费用明细中的单张机票净价，按照人数累加
                * 2、税费合计=费用明细中的税费，按照人数累加
                * 3、保险合计=费用明细中的乘机人信息中的保险费用累加
                * 4、佣金合计=（单张运价-单张机票净价），按照人数累加
                * 5、订单总金额=票款合计+税费合计+保险合计
                * 6、单张机票结算价=单张机票净价-开票费
                * 7、单张机票小计=单张机票净价-开票费+税费
                *
                * */

                function formchangehandler(){
                    CustomerCount = Y.one('.block3').all('.group-item').size();
                    var Price1 = parseFloat(nodePrice1.get('value'));
                    var Price2 = parseFloat(nodePrice2.get('value'));
                    var Price3 = parseFloat(nodePrice3.get('value'));
                    var Price4 = parseFloat(nodePrice4.get('value'));
                    var Price5 = parseFloat(nodePrice5.get('value'));
                    var Price6 = parseFloat(nodePrice6.get('value'));
                    var Price7 = parseFloat(nodePrice7.get('value'));

                    var basePrice = Price1*(1-Price2/100)*(1-Price3/100)-Price4;

                    nodePrice6.set('value',basePrice - Price5);
                    nodePrice8.set('value',basePrice - Price5 + Price7);

                    var t1 = basePrice*CustomerCount; //票款合计
                    var t2 = Price7*CustomerCount; //税费合计
                    var t3 = 8*CustomerCount; //保险合计
                    var t4 = (Price1 - basePrice) * CustomerCount; //佣金合计
                    var t5 = t1+t2+t3; //订单从金额

                    nodePrice1_t.set('value',t1);
                    nodePrice2_t.set('value',t2);
                    nodePrice3_t.set('value',t3);
                    nodePrice4_t.set('value',t4);
                    nodePrice5_t.set('value',t5)
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
                                location.href = 'FlightOrderSubmit.aspx?ORDER_NO=' + arr[1];
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

        /*航班查询页面*/
        Y.on('available', function() {
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

            Y.on('io:failure',function(t, r, a){
                clearTimeout(timeout);
                spin_wrap.one('span').setContent('请求失败:'+r);
            });

            Y.on('io:complete',function(){
                clearTimeout(timeout);
                spin_wrap.hide();
            });

            /*表单验证*/
            // var form = new Y.FormManager('aspnetForm', {
            //     status_node: '#form-status'
            // });

            // Y.all('input').get('parentNode').addClass('formmgr-row')
            // Y.all('input').insert('<span class="formmgr-message-text"/>', 'after');

            // form.prepareForm();

            form_hbcx();
            init_calendar();

            function form_hbcx() {
                /*城市搜索建议*/
                citySuggest();
                /*航空公司自动补全*/
                //http://webresource.c-ctrip.com/code/cquery/resource/address/flightintl/airline_gb2312.js
                var airlines = "不限@CA|中国国际航空|CA@MU|东方航空|MU@CZ|南方航空|CZ@FM|上海航空|FM@SQ|新加坡航空|SQ@CX|国泰航空|CX@UA|美联航|UA@HX|香港航空|HX@QR|卡塔尔航空|QR@MH|马来西亚航空|MH@BA|英国航空|BA@CI|中华航空|CI@AA|美国航空|AA@AF|法国航空|AF@KA|港龙航空|KA@LH|汉莎航空|LH@EK|阿联酋航空|EK@NX|澳门航空|NX@AC|加拿大航空|AC@DL|达美航空|DL@OZ|韩亚航空|OZ@BR|长荣航空|BR@QF|澳洲航空|QF@HU|海南航空|HU@GE|复兴航空|GE@KL|荷兰航空|KL@TG|泰国航空|TG@KE|大韩航空|KE@JL|日本航空|JL@VS|维珍航空|VS@AY|芬兰航空|AY@NH|全日空|NH@HO|吉祥航空|HO@UO|香港快运航空|UO@SK|北欧航空|SK@TK|土耳其航空|TK@EY|阿提哈德航空|EY@SU|俄罗斯航空|SU@LX|瑞士航空|LX@NZ|新西兰航空|NZ@AM|墨西哥航空|AM@SA|南非航空|SA@VN|越南航空|VN@BT|汶莱皇家航空|BI@PR|菲律宾航空|PR@AI|印度航空|AI@GA|印尼鹰航|GA@KQ|肯尼亚航空|KQ@ET|埃塞俄比亚航空|ET@MF|厦门航空|MF@ZH|深圳航空|ZH@UL|斯里兰卡航空|UL@AE|华信航空|AE@9W|印度捷特航空|9W@KC|阿斯塔纳航空|KC@SC|山东航空|SC@AZ|意大利航空|AZ@3U|四川航空|3U@S7|西伯利亚航空|S7@LO|波兰航空|LO@MD|马达加斯加航空|MD@MI|胜安航空|MI@OM|蒙古航空|OM@HY|乌兹别克斯坦航空|HY@AH|阿尔及利亚航空|AH@B7|立荣航空|B7@PG|曼谷航空|PG@XF|海参崴航空|XF@GS|天津航空|GS@VV|乌克兰航空|VV@UN|洲际航空|UN@MK|毛里求斯航空|MK@SN|布鲁塞尔航空|SN@MS|埃及航空|MS@OS|奥地利航空|OS@LY|以色列航空|LY@U6|乌拉尔航空|U6@SV|沙特航空|SV@".split('@');

                // var airlines = ['不限', 'Z-中国国航-CA', 'N-南方航空-CZ', 'D-东方航空-MU', 'A-奥凯航空公司-BK', 'B-北京首都航空有限公司-JD', 'C-成都航空有限公司-EU', 'D-大新华航空公司-CN', 'H-河北航空公司-NS', 'H-海南航空公司-HU', 'H-河南航空有限公司-VD', 'H-华夏航空公司-G5', 'J-吉祥航空公司-HO', 'K-昆明航空有限公司-KY', 'S-四川航空公司-3U', 'S-山东航空公司-SC', 'S-深圳航空公司-ZH', 'S-上海航空公司-FM', 'T-天津航空有限责任公司-GS', 'X-西部航空公司-PN', 'X-幸福航空有限责任公司-JR', 'X-厦门航空有限公司-MF', 'X-祥鹏航空公司-8L', 'Z-中国联合航空公司-KN'];
                var airlineNode = Y.one('.airlines');
                airlineNode.plug(Y.Plugin.AutoComplete, {
                    resultFilters: ['charMatch'],
                    // source:'ajax/airlines.js?callback={callback}',
                    source: airlines,
                    maxResults: 10,
                    on: {
                        select: function(e) {
                            var arr = e.result.display.split('|');
                            var codeNode = this._inputNode.next('.airlines_hidden');
                            if (arr[1]) {
                                e.result.text = arr[1];
                                codeNode.set('value', arr[2]);
                            } else {
                                e.result.text = '';
                                codeNode.set('value', '');
                            }
                        }
                    },
                    activateFirstItem: true
                });

                airlineNode.on('focus', function(e) {
                    if (e.currentTarget.get('value') == '') {
                        e.target.ac.sendRequest('');
                    }
                });

                /*航空公司自动补全 end*/

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
                // Y.all('.yiv-required').each(function(i) {
                //     var id = i.get('id');
                //     form.setErrorMessages(id, {
                //         required: '&nbsp;<b class="red">×</b>'
                //     });
                // });

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
									var nodes = Y.Node.create(res.responseText);
									var scriptTag = nodes.one('script') || ( nodes.get('nodeName') == 'SCRIPT' && nodes );
									if(scriptTag){
										eval(scriptTag.get('text'));
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

            function init_calendar() {
                new Y.TripCalendar({
                    beginNode: '#depdate-td',
                    endNode: '#arrdate-td',
                    limitBeginDate: new Date(),
                    limitDays: 28,
                    isWeek: false,
                    isFestival: false,
                    titleTips: ""
                });
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
                                    var nodes = Y.Node.create(res.responseText);
									var scriptTag = nodes.one('script') || ( nodes.get('nodeName') == 'SCRIPT' && nodes );
                                    if (scriptTag) {
                                        eval(scriptTag.get('text'));
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
                    // source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
                    // source: 'ajax/citysearch.js?&callback={callback}&q=',
                    hotSource: '/js/ajax/hotcity.js'
                });

                var toCity = new Y.TripAutoComplete({
                    inputNode: '.arrcity',
                    codeInputNode: '.arrcity_hidden',
                    // source: 'http://kezhan.trip.taobao.com/remote/citySearch.do?&callback={callback}&q=',
                    source: 'http://ijipiao.trip.taobao.com/ie/remote/auto_complete.do?flag=4&count=20&callback={callback}&q=',
                    hotSource: '/js/ajax/hotcity_international.js'
                });
            }

            function updateInfoRow() {
                Y.all('.mul-select').on('click', function(e) {
                    /* .data-row 单条航空公司数据 显示 航空公司 航班 机型 机场 时间等信息
                    *  .info-row 更多舱位数据行 默认隐藏 选择按钮 5600,3,1%+34.00,256,516,5860,Y,>9 点击选择后更新.meta-row和.data-row数据
                    *  .meta-row 预定按钮数据行 显示 退改签 票面价 代理费 奖励 佣金 税金 结算价
                    */
                    var infoRow = e.target.ancestor('.info-row');
                    var dataRow = infoRow.previous('.data-row');
                    var rowIndexs = [];

                    var previousMetaRow = infoRow.previous('.meta-row');
                    var nextMetaRow = infoRow.next('.meta-row');

                    var pMetaRowIndex = previousMetaRow && previousMetaRow.get('rowIndex') || - 9999;
                    var nMetaRowIndex = nextMetaRow && nextMetaRow.get('rowIndex');

                    var data = e.target.getAttribute('data-updates').split(',');

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
        getUrl = Y.Mustache.to_html(configUrl, {productId: pdid,cityCode: Y.one('#J_changeNav li.selected a').getAttribute('data-code')});
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

// YUI().use('node', 'array-extras', 'querystring-stringify', function (Y) {
//     var form = Y.one('.mo-hbcx .block1'), query;
//     query = Y.QueryString.stringify(Y.Array.reduce(Y.one(form).all('input[name],select[name],textarea[name]')._nodes, {}, function (init, el, index, array) {
//         init[el.name] = el.value;
//         return init;
//     }));
//     console.log(query);
// });
