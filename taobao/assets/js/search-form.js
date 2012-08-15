/**
 * @fileOverview 表单功能模块 包含功能 1.搜索表单验证 2.默认填入用户当前城市（依赖开发的COOKIES） 3.用户搜索历史记录和回填 4.城市切换
 * @author shuke.cl
 * version 1.0
 * @requires ［"widget",  "calendar"］
 */
var TG = TG || {};
TG.SearchForm = TG.SearchForm || {};
YUI.add('trip-search-form',function(Y){
	var isSupportPlaceholder = Y.Modernizr.input.placeholder , Array = Y.Array , Cookie = Y.Cookie ;
	var dateReg = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/;

	var SearchForm  = Y.Base.create('searchForm' , Y.Base ,[],{
			allSubmit : true ,
			initializer: function (){
				this.form = this.get('node');
				this.radioNodes = this.form.all('.J_type_radio');
        this.inputNodes = this.form.all('.J_TripCityInput ,.J_DateInput');
				this._syncUI();
				this._bindUI();
			},
			_syncUI : function (){
				this.setDefaultValue();
			},
			_bindUI: function (){
				var _form = this.form ,tradeBtn = _form.one('.search-trade') , SELF = this;
				_form.on('submit' , this.doSubmit , this);
				_form.delegate('click',this.setFlightType, '.J_type_radio' , this);
				if (tradeBtn) {
					tradeBtn.on('click' , this._trade , this);
				}

				//选择返程时间，自动重置航程类型为往返
				var backNode = this.form.one('.search-backitem'),
					radioNodes = this.radioNodes ,
					backDateInput = null ;
				var doCheckFlightType = function (){
          if (radioNodes.size() < 1 ) {
              return false;
          }
					radioNodes.item(1).set('checked' , true);
					SELF.setFlightType();
				};
				if (backNode) {
					backDateInput = backNode.one('.J_endDate');
					backDateInput && backDateInput.on('keyup',this.checkOneWay,this);
				}
        /*
        当INPUT有data-autotab属性时，绑定自动切换事件
        */
        this.inputNodes.each(function (item){
            var curAc  , curCal;
            if (item.hasClass('J_TripCityInput') && item.hasAttribute('data-autotab')) {//自动完成组件自动切换
                curAc = TG.SearchForm['#'+item.get('id')];
                curAc && curAc.on('select' , function (){
                   var el = Y.one('#'+ item.getAttribute('data-autotab'));
                    setTimeout(function (){
                        el && el.focus();
                    },200);
                })
            }else if (item.hasClass('J_DateInput')) { 
                curCal = TG.SearchForm['#'+item.get('id')];
                curCal && curCal.on('select' , function (e){
                    if (item.hasAttribute('data-autotab')) {
                        var el =  Y.one('#'+ item.getAttribute('data-autotab'));
                        if (!e.inputNode.hasClass('J_endDate') && el && el.hasClass('required')) {
                            setTimeout(function (){
                                el.focus();
                            },200);
                        }
                    }
                    //如果SELECT事件被返程日历选框触发
                    if (e.inputNode.hasClass('J_endDate')) {
                      doCheckFlightType();
                    }

                });
            }
        });
			},
			/**
			 * 用户删除返程时间内的值时，自动切换为单程
			 */
			checkOneWay : function (e){
				var target = e.currentTarget ;
				if (e.keyCode == 8 && target.get('value') == '') {
					this.radioNodes.item(0).set('checked' , true );
					this.setFlightType();
				}
			},
			/**
			 * 表单提交验证
			 * @param e
			 */
			doSubmit : function(e){
				e.halt();//阻止提交
				if(this._validateForm()){
					if (this.get('storage')) {//存储用户搜索结果
						this._storageForm();
					}
					//恶心的国际搜索：当选择航程类型为单程时，仍必须传入返程时间字段，值为yyyy-mm-dd
					var ieBackInput = this.form.one('.J_ieEndDate') ,flightType = this.getTypeValue();
					if (ieBackInput && flightType=='0') {
						//ieBackInput.set('disabled' , false);
						ieBackInput.set('value' , 'yyyy-mm-dd');
					}
					if (typeof this.get('afterValidate') === 'function') {//回调
						this.get('afterValidate')(this.form);
					}else{
						this.form.submit();
					}
					setTimeout(function(){
						if (ieBackInput && flightType=='0') {
							ieBackInput.set('value' , '');
						}
					},100);
				}
			},
			/**
			 * 验证表单
			 * @type function
			 */
			_validateForm : function (){
				var _form = this.form , SELF = this ,bDate ,eDate , bDateDesc , formType = 'flight' ,nowTime ;
				var inputNodes  = _form.all('input'),
					requiresNodes = [],
					dateFormatNodes = [],
          cityNodes = [];
        var bindWidget = null , curNode , AC , msgStr ;
				/*
				//返程时间为空，则自动切换为单程
				var endDateInput =_form.one('.J_endDate') ; 
				if (endDateInput && _form.one('.J_type_radio')) {
					if (endDateInput.get('value')=='') {
						this.radioNodes.each(function (item){
							if (item.get('value') == '0') {
								item.set('checked' , true) ;
							}
						});
						this.setFlightType();
					}
				}
				*/
				inputNodes.each(function (item , index){
					if (item.hasClass('required')) {//必填项检查
						if(!SELF._requiredItemCheck(item)){
							requiresNodes.push(item);
							return false;
						}
					}
					var nodeVal = item.get('value');
					if (item.hasClass('dateformat')) {//日期格式必须正确
						if (!dateReg.test(nodeVal)) {
							dateFormatNodes.push(item);
							return false;
						}
					}
          else if ((item.hasClass('J_TripCityInput'))) {
              cityNodes.push(item);
          }
				});
				if (requiresNodes.length > 0) {
          curNode = requiresNodes[0];
					curNode.select();
          bindWidget = TG.SearchForm['#' + requiresNodes[0].get('id')];
          if(bindWidget && curNode.hasAttribute('data-description')){//需要显示错误信息
              bindWidget.showMessage && bindWidget.showMessage('请选择' + curNode.getAttribute('data-description') , curNode);
          }
					return false ;
				}
				if (dateFormatNodes.length > 0) {
          bindWidget = TG.SearchForm['#' + dateFormatNodes[0].get('id')];
          bindWidget && bindWidget.showMessage('日期格式为：yyyy-mm-dd' , 	dateFormatNodes[0]);
					dateFormatNodes[0].select();
					return false ;
				}
				/*验证返程时间不能早于出发时间*/
				bDate = _form.one('.J_depDate');
        eDate = _form.one('.J_endDate');
				if (eDate && bDate && eDate.hasAttribute('data-description') &&  bDate.hasAttribute('data-description')) {
          bDateDesc = bDate.getAttribute('data-description');
          msgStr = "不能早于";
          nowTime = new Date();
          if (bDateDesc.indexOf('入住')>-1) {
              msgStr = '不能早于/等于';
              formType = 'hotel';
          }
          //出发日期不能早于今天
          if ( this._toMs(bDate.get('value'))  < new Date(nowTime.getFullYear(),nowTime.getMonth(),nowTime.getDate())) {
              bindWidget = TG.SearchForm['#' + bDate.get('id')];
              bindWidget && bindWidget.showMessage(bDate.getAttribute('data-description')+'不能早于今天，请重新选择', 	bDate);
              return false ;
          }
          //出发日期不能早于今天
					if ((formType=='flight' && this._toMs(eDate.get('value')) < this._toMs(bDate.get('value'))) || (formType=='hotel' && this._toMs(eDate.get('value')) <= this._toMs(bDate.get('value')))) {
            bindWidget = TG.SearchForm['#' + eDate.get('id')];
						Y.later(50,this,function(){
							eDate.select();
              bindWidget && bindWidget.showMessage(eDate.getAttribute('data-description')+ msgStr +bDate.getAttribute('data-description') +'，请重新选择', 	eDate);
						});
						return false ;
					}
				}
        
        //验证出发到达城市是否相同
        if (typeof cityNodes[1] != 'undefined') {//可能只有一个城市输入框
          cityNodes[1].get && (AC = TG.SearchForm['#'+ cityNodes[1].get('id')]);
        }
        if (AC && cityNodes.length > 1 && cityNodes[0].get('value') == cityNodes[1].get('value') && cityNodes[0].hasClass('required') && cityNodes[1].hasClass('required')) {
          if(AC.showMessage){
              AC.inputNode.focus();
              AC.showMessage('出发城市和到达城市不能相同，请重新输入');
              return false;
          }
        }
				return true;
			},
      /*
      *将日期转化为毫秒
       */
      _toMs : function (date){
          date = date.split('-');
          return new Date(date[0]/1 , date[1]/1 - 1 , date[2]/1 );
      },
			/**
			 * 保存表单数据
			 */
			_storageForm : function(){
				var inputNodes = this.form.all('input'),
					storageArr = [],
					itemStr  = '';
				inputNodes.each(function (node , i){
					var attr = node.getAttribute('type'),
						nodeValue = node.get('value');
					if (attr == 'text' || attr == 'hidden') {//文本框
						if (nodeValue!='' && !node.get('disabled')) {
							itemStr = node.get('id') + ':' + nodeValue ;
							storageArr.push(itemStr);
						}
						
					}else if(attr == 'radio'){//radio 
						if (node.get('checked')) {
							itemStr = node.get('id') + ':' + nodeValue ;
							storageArr.push(itemStr);
						}
					}
				});
				//保存到本地
				Y.StorageLite.setItem(this.form.get('id') , storageArr.join(','));
			},
			/**
			 * 填充表单默认数据 1.用户当前所在城市 2.用户搜索历史记录
			 */
			setDefaultValue :function (){
				var userCityInput = this.get('defaultCity') ;//用户当前所在城市要填入的INPUT
				var userCity = '';
				if (userCityInput) {
					if (!this.get('storage') && Cookie.get('ect') && this.get('fillCurrentCity')) {
						userCity = Cookie.get('ect').split('|')[1];
						userCityInput.set('value',userCity);
					}
				}
				if (this.get('storage') && Y.StorageLite.getItem(this.form.get('id'))) {//搜索记录数据
					this.storageToInput(Y.StorageLite.getItem(this.form.get('id')));
				}
			},
			/**
			 * 本地数据回填
			 * @param node
			 */
			storageToInput : function (data){
				var SELF = this, isResetDate = false;
				data = data.split(',');
				Array.each(data , function (item,i){
					var item = item.split(':');
					var node = Y.one('#'+item[0]) , nodeValue = item[1] ,bindWidget;
					if (node) {
						switch (node.getAttribute('type')){
							case 'text':
                bindWidget = TG.SearchForm['#' + node.get('id')];
								if (node.hasClass('J_DateInput')) {//输入框为日历时
									if (node.hasClass('J_depDate')) { //出发日期
										if (SELF.isResetDate(nodeValue)) {//如果日期早于今天则设置出发日期为明天
											nodeValue = SELF.getDate(1);
										}
									}else if(node.hasClass('J_endDate')){//返程日期
										if (SELF.isResetDate(nodeValue)) {
											nodeValue = SELF.getDate(3);
										}
									}
								}
								node.set('value' , nodeValue);
                if (node.hasClass('J_DateInput')) {
                   bindWidget && bindWidget.setDateInfo(false , node);
                }
								if (!isSupportPlaceholder) {
									node.removeClass('trip-placeholder');
								}
								break;
							case 'hidden' :
								node.set('value' , nodeValue);
								break ;
							case 'radio' :
								node.set('checked' , true);
								//往返输入框切换
								SELF.setFlightType();
								break;
							default :
								break;
						}
					}	
				});
			},
			/**
			 * 日期检查,返回
			 * @param aData 日期 ['2011-05-14','2011-06-14']
			 * @return Array
			 */
			isResetDate : function (date){
				date = date.split('-');
				return new Date() > new Date(date[0],date[1]-1,date[2]);
			},
			/*
			*获取指定日期的
			*@num_date 指定日期的前后天数 1为明天,2为后天,-1为昨天...
			*/
			getDate : function (num_date){
				function formatdate(str){
					str +='';
					if (str.length == 1) {
						return '0'+str;
					}else{
						return str;
					}
				}
				num_date = num_date || 0;
				var _y,_m,_d;
				var _T = new Date();
				_T.setDate(_T.getDate()+num_date);
				_y = _T.getFullYear();
				_m = formatdate(_T.getMonth() + 1);
				_d = formatdate(_T.getDate()) ;
				return [_y,_m,_d].join('-');
			},
			/**
			 * 必填项检查
			 *@parm node
			 *@return boolean
			 */
			_requiredItemCheck : function(node){
				if (node.get('value') == ''){
					return false;
				}else{
					return true ;
				}
			},
			/**
			 * 出发到达城市互换
			 */
			_trade : function (){
				var _form = this.form ;
				tradeNodes = _form.all('input[data-trade]');
				var arr1 = [] , arr2 = [];
				tradeNodes.each(function (item ,i){
					var _tradeNode = Y.one('#'+item.getAttribute('data-trade'));
					if (_tradeNode) {
						arr1.push(item);
						arr2.push(_tradeNode);
					}
				});
				this.tradeAction(arr1,arr2);
			},
			/**
			 * 互换INPUT节点的VALUE
			 * @param arr1 nodeArray
			 * @param arr2	nodeArray
			 */
			tradeAction : function (arr1,arr2){
				var _tmp ="" , _tmp2 = "";
				Array.each(arr1,function(item,i){
					_tmp = item.get('value');
					_tmp2 = arr2[i].get('value');
					item.set('value', _tmp2);
					arr2[i].set('value',_tmp);
					if (!isSupportPlaceholder) {
						if (_tmp2 == '') {
							item.addClass('trip-placeholder');
							item.set('value', item.getAttribute('placeholder'));
						}else{
							item.removeClass('trip-placeholder');
						}
						if (_tmp == '') {
							arr2[i].addClass('trip-placeholder');
							arr2[i].set('value', arr2[i].getAttribute('placeholder'));
						}else{
							arr2[i].removeClass('trip-placeholder');
						}
					}
				});
			},
			/**
			 * 单程往返类型切换
			 */
			setFlightType : function (){
				var _type = this.getTypeValue(),
					backNode = this.form.one('.search-backitem'),
					backDateNode = backNode.one('input[type=text]');
          
				if (_type == '1') {
					backNode.removeClass('disabled');
					//backDateNode.set('disabled',false);
					backDateNode.addClass('required');
					backDateNode.addClass('dateformat');
				}else{
					backNode.addClass('disabled');
					backDateNode.removeClass('required');
					backDateNode.removeClass('dateformat');

					if (!Y.Modernizr.input.placeholder) {
						backDateNode.set('value',backDateNode.getAttribute('placeholder'));
						backDateNode.addClass('trip-placeholder');
					}else{
						backDateNode.set('value','');
					}
					//backDateNode.set('disabled' , true);
				}
			},
			/**
			 * 获取往返radio值
			 */
			getTypeValue : function (){
				var radioNodes = this.radioNodes ;
				for(var i=0 ; i < radioNodes.size() ; i++){
					if (radioNodes.item(i).get('checked')) {
						return radioNodes.item(i).get('value');
						break;
					}
				}
			}
		},{
			ATTRS:{
				node : {
					setter : Y.one
				},
        fillCurrentCity : {
            value : false 
        },
				storage :{
					value : false
				},
				defaultCity : {
					value : '',
					setter : Y.one
				},
				afterValidate : {
					value : null
				}
			}
		});
	Y.SearchForm= SearchForm;
},'',{requires:['node-base','event-base','cookie','base','trip-modernizr']});
