/**
 * �����н�������Ϣ
 */
/*
(function(){
	var marquePic1 = document.getElementById('marquePic1'),
		marquePic2 = document.getElementById('marquePic2'),
		demo = document.getElementById('demo');
	var speed=30 
	marquePic2.innerHTML = marquePic1.innerHTML 
	function Marquee(){ 
		if(demo.scrollLeft >= marquePic1.scrollWidth){ 
			demo.scrollLeft = 0; 
		}else{ 
			demo.scrollLeft++; 
		}
	} 
	var MyMar=setInterval(Marquee,speed) 
	demo.onmouseover = function(){clearInterval(MyMar)}; 
	demo.onmouseout = function(){MyMar=setInterval(Marquee,speed)}; 
})();
*/



/**
 * �������ֲ�Ʊ��ҳ
 * author donghan<donghan@taobao.com>
 * date 2011.02.10 
 */
(function(){
	TDog.add('Lottery',new TDog.Application);

	if(YAHOO.env.ua.webkit){
		alert('���λ��֧��IE��Firefox�������')
	}

	var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event,
		L = YAHOO.util.Lang, Get = YAHOO.util.Get,  Lottery = TDog.Lottery,
		doc = document, win = window,


		DOMAIN = location.hostname.indexOf('taobao.net') > 0 ? 'taobao.net' : 'taobao.com',
		isOnline = DOMAIN === 'taobao.com',
		HOST = isOnline ? 'http://caipiao.taobao.com' : "http://caipiao.taobao.com",

		LOTTERY_TYPE = {
			"ssq" : 1,
			"fc"  : 2,
			"qlc" : 7,
			"qxc" : 13,
			"dlt" : 8,
			"pls" : 6,
			"plw" : 18
		},

		ball,endTime;

	
	/**
	 * �齱������ 
	 */
	var draws = {
		//��ʾ�齱���
		disResult: function(){
			var that = this,
				masks = Dom.get('maskLayer'),
				targetObj = that.targetObj = Dom.get('drawLayer'),
				trig = targetObj.getElementsByTagName('img')[0];
			masks.style.height = document.body.offsetHeight + 'px';
			if(that.async()){
				masks.className = '';
				targetObj.className = '';
				targetObj.style.top = (function(){return self.pageYOffset || document.documentElement.scrollTop||document.body.scrollTop;})() + document.documentElement.clientHeight/2 - 72 + 'px';
				trig.onclick = function(){
					targetObj.className = 'hidden';
					masks.className = 'hidden';
					changeCheckCode();
				};
			}
		},
		//�첽ͨѶ
		async: function(){
			var that = this,
				tips = that.targetObj.getElementsByTagName('div')[0],
				remainMobile = Dom.get('remainMobile'),
				remainNum = Dom.get('remainNum'),
				checkcode = Dom.getElementsByClassName('suncn_text')[0];
			if(!checkcode.value){
				alert('��������֤�룡');
				return false;
			}
			that.sendAjax({
				type: 'get',
				url: 'http://caipiao.taobao.com/lottery/activity/poker/lucky_mobile.htm?checkCode=' + checkcode.value + '&timestamp=' + new Date().getTime(),
				dataType: 'text',
				onTimeout: function(){
					tips.innerHTML = '<p>�齱�û����࣬�ó����һ�ᣬ��ȥ <a href="http://caipiao.taobao.com" target="_blank">��ƱƵ��</a> תת�ٻ����ɣ�</p>';
					setTimeout(function(){window.location.reload()},5000);
				},
				onSuccess: function(o){
					var obj = eval('(' + o + ')'),
						sta = obj.state;
					switch(sta){
						case 1:
							tips.innerHTML = '<p>����δ��¼�Ա�����<br>�������� <a href="http://login.taobao.com/member/login.jhtml?from=lottery&redirectURL=http://caipiao.taobao.com/lottery/activity/poker/promotion.htm" target="_blank">��¼�Ա���</a></p>';
							break;
						case 2:
							tips.innerHTML = '<p>�����컹δ�ﵽ�齱�����������ȹ����Ʊ<a href="http://caipiao.taobao.com/lottery/index.htm" target="_blank">��ȥ���ʡ�</a></p>';
							break;
						case 3:
							tips.innerHTML = '<p>��ϲ������<em>2Ԫ</em>�����<br>ף�����µ�һ���������³ɣ��������⣡����֧���Ա���Ʊ! ���ڻ���<em>' + obj.remain_num + '��</em>����</p>';
							break;
						case 4:
							tips.innerHTML = '<p class="box1">��ϲ������<em>2Ԫ</em>�����<br>ף�����µ�һ���������³ɣ��������⣡����֧���Ա���Ʊ! ���ڻ���<em>' + obj.remain_num + '��</em>���ã�����������Ʊ�Ի�ø���齱����</p>';
							break;
						case 5:
							tips.innerHTML = '<p class="box1">��ϲ������<em>2Ԫ</em>�����<br>ף�����µ�һ���������³ɣ��������⣡����֧���Ա���Ʊ! �������õ�10�λ����Ѿ�ȫ�����꣬��ӭ����������룬лл</p>';
							break;
						case 6:
							tips.innerHTML = '<p class="box2">��ϲ������Moto�ֻ�һ����<br>�뾡��ȷ�ϸ������Ա���Ĭ���ջ���ַ���Ա����Ƿ�������! ���ڻ���<em>' + obj.remain_num + '��</em>����</p>';
							break;
						case 7:
							tips.innerHTML = '<p class="box3">��ϲ������Moto�ֻ�һ����<br>�뾡��ȷ�ϸ������Ա���Ĭ���ջ���ַ���Ա����Ƿ�������! ���ڻ���<em>' + obj.remain_num + '��</em>���ã�����������Ʊ�Ի�ø���齱����</p>';
							break;
						case 8:
							tips.innerHTML = '<p class="box3">��ϲ������Moto�ֻ�һ����<br>�뾡��ȷ�ϸ������Ա���Ĭ���ջ���ַ���Ա����Ƿ�������! �������õ�<em>10��</em>�����Ѿ�ȫ�����꣬��ӭ����������룬лл</p>';
							break;
						case 9:
							tips.innerHTML = '<p>���ź�����û���н�!<br>���ڻ���' + obj.remain_num + '�ο���</p>';
							break;
						case 10:
							tips.innerHTML = '<p>���ź�����û���н�!<br>���ڻ���<em>' + obj.remain_num + '��</em>���ã�����������Ʊ�Ի�ø���齱����</p>';
							break;
						case 11:
							tips.innerHTML = '<p>���ź�����û���н�!<br>�������õ�<em>10��</em>�����Ѿ�ȫ�����꣬��ӭ����������룬лл</p>';
							break;
						case 12:
							tips.innerHTML = '<p>������ĳ齱�����Ѿ�ȫ�����꣬����������Ʊ�Ի�ø���齱���ᣬлл</p>';
							break;
						case 13:
							tips.innerHTML = '<p>���δ��ʼ��</p>';
							break;
						case 14:
							tips.innerHTML = '<p>��֤��������������롣</p>';
							break;
						case 15:
							tips.innerHTML = '<p>�������õ�10�λ����Ѿ�ȫ�����꣬��ӭ����������룬лл</p>';
							break;
						default:
							break;
					}
					if(obj.state!=14){
						remainMobile.innerHTML = obj.remain_mobile_num;
						remainNum.innerHTML = obj.remain_num;
					}
					
					
				}
			});
			return true;
		},
		//ajax
		sendAjax: function(options){
			options = {
				type: options.type || "post",
				url: options.url || "",
				timeout: options.timeout || 5000,
				onComplete: options.onComplete || function(){},
				onError: options.onError || function(){},
				onSuccess: options.onSuccess || function(){},
				onTimeout: options.onTimeout || function(){},
				dataType: options.dataType || "xml"
			};
			
			if(typeof XMLHttpRequest == "undefined"){
				XMLHttpRequest = function(){
					return new ActiveXObject(navigator.userAgent.indexOf("MSIE 5")>=0?"Miscosoft.XMLHTTP":"Msxml2.XMLHTTP");
				};
			}
			
			var xml = new XMLHttpRequest();
			xml.open(options.type,options.url,true);
			
			var timeoutLength = options.timeout;
			var requestDone = false;
			
			setTimeout(function(){requestDone = true;},timeoutLength);
			
			xml.onreadystatechange = function(){
				if(xml.readyState==4&&!requestDone){
					if(httpSuccess(xml)){
						options.onSuccess(httpData(xml,options.dataType))
					}else{
						options.onError();
					}
					options.onComplete();
					xml = null;
				}else if(requestDone){
					options.onTimeout();
				}
			};
			xml.send();
			
			function httpSuccess(r){
				try{
					return !r.status&&location.protocol=="file"||(r.status>=200&&r.status<=300)||r.status==304||navigator.userAgent.indexOf("Safari")>=0&&typeof r.status=="undefined";
				}catch(e){}
				return false;
			}
			
			function httpData(r,type){
				var ct = r.getResponseHeader("content-type");
				var data = !type&&ct&&ct.indexOf("xml")>=0;
				data=type=="xml"||data?r.responseXML:r.responseText;
				if(type=="Script"){
					eval.call(window,data);
				}
				return data;
			}
		}
	};

/*
	Dom.get('trigdraw').onclick = function(){
		draws.disResult();
	};
	*/

	Lottery.use("Lottery", new function(){
		var freshBtn, buyBtn, redMax, blueMax, blueNum,
			popup, popupClass = "popup-box", popupTitle = "��ѡһ��,��������",
			running = 0,
			self = this;

		/*
		* ���ѡ��Ͷע
		* @param id:����id; redMax:���������ֵ; blueMax:���������ֵ; blueNum:����ĸ���
		*/
		this.LuckyLottery = function(id, redMax, blueMax, blueNum) {
			freshBtn = Dom.getElementsByClassName("num-list", "ul", id)[0].getElementsByTagName("button")[0];//ˢ�°�ť
			buyBtn = Dom.getElementsByClassName("buy-bar", "div", id)[0].getElementsByTagName("button")[0];//����
			ball = Dom.getElementsByClassName("num", "li", id); //����

			self.createPopup();
			
			//ˢ�º��밴ť��ʾ-��ʾ
			Event.on(freshBtn, 'mouseover', function(e){
			   var el = Event.getTarget(e),
				   pos;
			   Event.preventDefault(e);
			   el.title = "";
			   pos = Dom.getXY(el);
			   Dom.setStyle(popup, 'display', 'block');
			   Dom.setXY(popup, [pos[0] - 60,pos[1]- 28]);
			});

			//ˢ�º��밴ť��ʾ-����
			Event.on(freshBtn, 'mouseout', function(e){
			   Event.preventDefault(e);
			   Dom.setStyle(popup, 'display', 'none');
			});
			
			//ˢ�º��밴ť-��������
			Event.on(freshBtn, 'click', function(e){
			   Event.preventDefault(e);
			   self.forEachBall(redMax, blueMax, blueNum);
			});
			
			//�ύ��
			Event.on(buyBtn, 'click', function(e){
			   var el = Event.getTarget(e),
				   ballNums = [],
				   sBall,sBall2;
				Event.stopEvent(e);
			   if(running > 0){
				 alert("�԰����꣬���ں������������Ͷע��лл:)");
				 return;
			   }
			   
			   for(var i = 0; i < ball.length; i++){
				 ballNums.push(ball[i].getElementsByTagName('b')[0].innerHTML);
			   }

			  switch(blueNum){
				case LOTTERY_TYPE["ssq"] ://˫ɫ��
					var sBall2 = ballNums.slice(0, 6).join(' ') + ':' + ballNums.slice(6).join(' ');
					break;
				case LOTTERY_TYPE["fc"] ://����3d
					var sBall2 = ballNums.slice(0, 3).join(''); //ballNums.slice(0, 3).join(' ');
						sBall2= sBall2.replaceAll("0","") +":0";
					break;
				case LOTTERY_TYPE["qlc"] ://���ֲ�
					var sBall2 = ballNums.slice(0, 7).join(' ');
					break;
				case LOTTERY_TYPE["qxc"] ://���ǲ�
					var sBall2 = ballNums.slice(0, 7).join(',');
					sBall2= sBall2.replaceAll("0","");
					break;
				case LOTTERY_TYPE["dlt"] ://����͸
					var sBall2 = ballNums.slice(0, 5).join(' ') + '-' + ballNums.slice(5).join(' ');
					break;
				case LOTTERY_TYPE["pls"] ://������
					var sBall2 = ballNums.slice(0, 3).join('');
					sBall2= sBall2.replaceAll("0","") + ":0";
					break;
				case LOTTERY_TYPE["plw"] ://������
					var sBall2 = ballNums.slice(0, 5).join('');
					sBall2= sBall2.replaceAll("0","") + ":0";
					break;
				default:
					break;
			  }



			  Dom.get("J_Lottery").elements["numberStrings"].value = sBall2;

			
				endTime = +(new Date(Date.parse((endTime).replace(/-/g,   "/"))));
				if((+new Date()) > endTime){
					alert('�����ѹ��ڣ�')
				}else{
					this.form.submit();
					//����������ʾ��	
					var masks = Dom.get('maskLayer'),
						targetObj = Dom.get('buystep'),
						spans = targetObj.getElementsByTagName('span')[0],
						trig = targetObj.getElementsByTagName('img')[0];
					masks.style.height = document.body.offsetHeight + 'px';
					masks.className = '';
					targetObj.className = '';
					targetObj.style.top = (function(){return self.pageYOffset || document.documentElement.scrollTop||document.body.scrollTop;})() + document.documentElement.clientHeight/2 - 170 + 'px';
					spans.style.top = '302px';
					spans.style.left = '338px';
					spans.onclick = trig.onclick = function(){
						targetObj.className = 'hidden';
						masks.className = 'hidden';
						window.location.reload();
					};
				}
				
			 
					
		  });

		  
			
		  //ҳ�������� ����һ��ִ��
		  Event.onDOMReady(function(){
			 self.forEachBall(redMax, blueMax, blueNum);
		  });
		};
		
		/*
		* ����������
		*/
		this.createPopup = function(){
			popup = doc.createElement("div");
			popup.id = popup;
			popup.className = popupClass;
			popup.innerHTML = popupTitle;
			doc.body.appendChild(popup);
	
		};
		
		/*
		* ѭ������
		*/
		this.forEachBall = function(redMax, blueMax, blueNum) {
			var max ,
				r ,
				k = 0 ,
				_a = {};

			for(var i = 0; i < ball.length; i++) {
				 if(Dom.hasClass(ball[i], 'num') && Dom.hasClass(ball[i], 'blue')){
				   max = blueMax;
				 }else{
				   max = redMax;
				 }

				 r = Math.ceil(Math.random() * max);
				 if(_a[r.toString()]){
				   i--;
				   continue;
				 }
				 _a[r.toString()] = r;
			}
			
			for(var i in _a){
				var b = ball[k].getElementsByTagName('b')[0];
				self.ballRandom(b, i, 10);
				k++;
		   }
		};
		
		/*
		* �漴����
		*/
		this.ballRandom = function(el, v, maxNum, step) {
			 var num = 0 ;
				 running += 1;
		   setTimeout(function(){
			 num++;
			 if(num > 100){
			   running -= 1;
			   el.innerHTML = Number(v) < 10 ? '0' + v.toString() : v;
			   return;
			 }else{
			   var r = Math.ceil(Math.random() * 35);
			   el.innerHTML = Number(r) < 10 ? '0' + r.toString() : r;
			   setTimeout(arguments.callee, step);
			 };
		   }, step);
		};
		
	
	});


	/*
	* getScript��ȡ����
	*/
	Lottery.use("IO", new function(){
		
		var LOTTERY_URL = {
			OPEN_AWARD : HOST +"/lottery/wangwang/lottery_open_award.htm", //
			NEWS : HOST+"/lottery/wangwang/lottery_latest_win.htm?count=4", //�����н�
			ISSUE_INFO: HOST + "/lottery/wangwang/lottery_issue_info.htm" //
		},

		self = this;


		this._setLootteryCallback = function(name,num) {
			
			//���ñ�������
			if(name.indexOf("_issue") > 0 ){
				win[name] = function(data) {
					var issue = data["issueId"],
						issue_data = data["issue"];
					Dom.get("J_Lottery").elements["issueId"].value = issue;
					Dom.get("J_Lottery").elements["issue"].value = issue_data;
					endTime =  data["lastBuyTime"];
					
					var ballNums = [], sBall;
					   for(var i = 0; i < ball.length; i++){
						 ballNums.push(Dom.get("J_"+name.split("_")[0]).getElementsByTagName('b')[i].innerHTML);
					   }

					   switch(num){
						case LOTTERY_TYPE["ssq"] ://˫ɫ��
							var sBall = ballNums.slice(0, 6).join(' ') + ':' + ballNums.slice(6).join(' ');
							break;
						case LOTTERY_TYPE["fc"] ://����3d
							var sBall = ballNums.slice(0, 3).join(' '); 
							break;
						case LOTTERY_TYPE["qlc"] ://���ֲ�
							var sBall = ballNums.slice(0, 7).join(' '); 
							break;
						case LOTTERY_TYPE["qxc"] ://���ǲ�
							var sBall = ballNums.slice(0, 6).join(' ') + ':' + ballNums.slice(6).join(' ');
							break;
						case LOTTERY_TYPE["dlt"] ://����͸
							var sBall = ballNums.slice(0, 5).join(' ') + ':' + ballNums.slice(5).join(' ')+ ballNums.slice(6).join(' ');
							break;
						case LOTTERY_TYPE["pls"] ://������
							var sBall = ballNums.slice(0, 5).join(' ') + ':' + ballNums.slice(5).join(' ') ;
							break;
						case LOTTERY_TYPE["plw"] ://������
							var sBall = ballNums.slice(0, 5).join(' ') + ':' + ballNums.slice(5).join(' ');
							break;
						default:
							break;
							
					  }
                    //��Ʊ����
					//Dom.get("J_Lottery").elements["numberStrings"].value = sBall;
					
                    Dom.get("J_Lottery").elements["lotteryTypeId"].value = num;//LOTTERY_TYPE[data["name"]];
				};
			}
			//�����н�����
			else if(name.indexOf("_news") > 0 ){
				win[name] = function(data) {
					if(!data) return;
					var str = "";
					for(var i = 0 ;i < data.length; ++ i) {
						str += '<li><span class="ticket">['+data[i].lotteryTypeName+']</span><span class="name">' + data[i].nick+'</span><span class="price">'+data[i].winFee+'</span></li>';
					}
					//Dom.get("J_news").innerHTML = str;
				}
			}
			//�����н���Ϣ
			else{
				win[name] = function(data) {
					if(!data) return;
					var issue = data["issue"],
						luckyNum = data["luckyNum"],
						parentEl = Dom.getElementsByClassName("mod-"+name.split("_")[0],"div")[0],
						issue_el = Dom.getElementsByClassName("issue","span",parentEl)[0],
						luckyNum_el = Dom.getNextSiblingBy(issue_el);

                      //  Dom.get("J_Lottery").elements["lotteryTypeId"].value = LOTTERY_TYPE[data["name"]];
					issue_el.innerHTML = "���ڿ����ڴ�:" + issue;
					if(luckyNum.indexOf(":")>0){
						var luckyNumRed = luckyNum.split(":")[0],
						luckyNumBlue = luckyNum.split(":")[1];
                        if(name.split("_")[0] === "ssq" || name.split("_")[0] === "qlc" || name.split("_")[0] === "dlt") {
                            var _arr = [],_luckyNumRed = luckyNumRed.split("");
                            for(var i =0,j=0;i< _luckyNumRed.length-1; i++){
                                      if(i % 2 == 0){
                                          _arr[j] =  _luckyNumRed[i]+_luckyNumRed[i+1];
                                          j++;
                                      }
                            }
                            luckyNumRed = "";
                            for(var k =0;k< _arr.length;k++){
                                  luckyNumRed += "&nbsp;" + _arr[k] //'<span>'+_arr[k]+'</span>';
                            }


                        }
						luckyNum_el.innerHTML = "���ڿ�������: <em>"+luckyNumRed+"<em class='blue'>:"+luckyNumBlue+"</em></em>";
					}else{
						luckyNum_el.innerHTML = "���ڿ�������: <em>"+luckyNum+"</em>";
					}
				};
			}
		}
		
	
		
		/*
		* @param name:��Ʊ��; id:��Ʊid; callback:�ص�����
		*/
		this.getScript = function(name, id, fn) {
			self.io([
				{
					"url" : LOTTERY_URL.OPEN_AWARD,
					"type": id,
					"callback" : fn 
				
				},
				{
					"url" : LOTTERY_URL.ISSUE_INFO,
					"type": id,
					"callback" : fn + "_issue"
				
				},
				{
					"url" : LOTTERY_URL.NEWS,
					"type": id,
					"callback" : fn + "_news"
				
				}
			]);

		}

		this.io = function(url, type, callback) {
			var arr ;
			if(arguments.length >= 1 && arguments[0].length) {
				arr = arguments[0];
				for(var i = 0 ; i < arr.length; ++ i) {
					self._setLootteryCallback(arr[i]["callback"],arr[i]["type"]);
					Get.script(arr[i]["url"] + "?lottery_type=" + arr[i]["type"] + "&callback=" + arr[i]["callback"] + "&_input_charset=utf-8&t=" + (+new Date),{});
					
				}
			}else{
				Get.script(url + "?lottery_type=" + type + "&callback=" + callback + "&_input_charset=utf-8&t=" + (+new Date),{});
				self._setLootteryCallback(callback,type);
			}
			
		}

	});



	Lottery.use("Tips", new function(){
		var trigger = Dom.getElementsByClassName("nav-trigger","em")[0];
		list = Dom.getElementsByClassName("nav-list","ul")[0],
		submitBtn = Dom.getElementsByClassName("J_submit");

		this.init =  function() {
			Event.on([trigger,list],"mouseover",function(e){	
				var target = Event.getTarget(e);
					point = Dom.getXY(trigger);
					Dom.setStyle(list,"top",point[1]+trigger.offsetHeight+"px");
					Dom.setStyle(list,"left",point[0]+5+"px");
				if (Dom.hasClass(list,"hidden")) {
					Dom.removeClass(list,"hidden");
				}
			});
			Event.on(document,"click",function(e){
				var tar = Event.getTarget(e);
				if (tar !== list && !Dom.isAncestor(list, tar)) {
					Dom.addClass(list, 'hidden');
				}
			});
			
			Event.on(Dom.getElementsByClassName("outline"),"focus",function(e){
				var tar = Event.getTarget(e);
				tar.blur && tar.blur();
			});
		
		}
		
	
	});



	Lottery.use("SimpleTab",new function(){
		
		this.init = function() {
			var dates = new Date(),
				day = dates.getDate();
			var _index = 0;
			if(day == 17 || day == 20){
				_index = 4;
			}
			TB.widget.SimpleTab.decorate('J_Tab', {eventType:'click', stopEvent: true, currentClass:'selected',autoSwitchToFirst:false,onSwitch:function(idx){
				
				switch(idx){
					case 0 ://˫ɫ��
						Lottery.mod.Lottery.LuckyLottery('J_ssq', '33', '16', LOTTERY_TYPE["ssq"]);
						Lottery.mod.IO.getScript("ssq",LOTTERY_TYPE["ssq"],"ssq_callback");
						break;
					case 1 ://����3d
						Lottery.mod.Lottery.LuckyLottery('J_fc', '9', null, LOTTERY_TYPE["fc"]);
						Lottery.mod.IO.getScript("fc",LOTTERY_TYPE["fc"],"fc_callback");
						break;
					case 2 ://���ֲ�
						Lottery.mod.Lottery.LuckyLottery('J_qlc', '30', null, LOTTERY_TYPE["qlc"]);
						Lottery.mod.IO.getScript("qlc",LOTTERY_TYPE["qlc"],"qlc_callback");
						break;
					case 3 ://���ǲ�
						Lottery.mod.Lottery.LuckyLottery('J_qxc', '9', null, LOTTERY_TYPE["qxc"]);
						Lottery.mod.IO.getScript("qxc",LOTTERY_TYPE["qxc"],"qxc_callback");
						break;
					case 4 ://����͸
						Lottery.mod.Lottery.LuckyLottery('J_dlt', '35', '12', LOTTERY_TYPE["dlt"]);
						Lottery.mod.IO.getScript("dlt",LOTTERY_TYPE["dlt"],"dlt_callback");
						break;
					case 5 ://������
						Lottery.mod.Lottery.LuckyLottery('J_pls', '9', null, LOTTERY_TYPE["pls"]);
						Lottery.mod.IO.getScript("pls",LOTTERY_TYPE["pls"],"pls_callback");
						break;
					case 6 ://������
						Lottery.mod.Lottery.LuckyLottery('J_plw', '9', null, LOTTERY_TYPE["plw"]);
						Lottery.mod.IO.getScript("plw",LOTTERY_TYPE["plw"],"plw_callback");
						break;
					default:
						break;
				}
			}}).switchTab(_index);
			
		}
	
	});
	Lottery.init();

})();	
