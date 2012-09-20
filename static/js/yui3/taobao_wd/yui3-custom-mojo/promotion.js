/**
 * 最新中奖滚动信息
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
 * 生活助手彩票首页
 * author donghan<donghan@taobao.com>
 * date 2011.02.10 
 */
(function(){
	TDog.add('Lottery',new TDog.Application);

	if(YAHOO.env.ua.webkit){
		alert('本次活动仅支持IE和Firefox浏览器！')
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
	 * 抽奖弹出层 
	 */
	var draws = {
		//显示抽奖结果
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
		//异步通讯
		async: function(){
			var that = this,
				tips = that.targetObj.getElementsByTagName('div')[0],
				remainMobile = Dom.get('remainMobile'),
				remainNum = Dom.get('remainNum'),
				checkcode = Dom.getElementsByClassName('suncn_text')[0];
			if(!checkcode.value){
				alert('请输入验证码！');
				return false;
			}
			that.sendAjax({
				type: 'get',
				url: 'http://caipiao.taobao.com/lottery/activity/poker/lucky_mobile.htm?checkCode=' + checkcode.value + '&timestamp=' + new Date().getTime(),
				dataType: 'text',
				onTimeout: function(){
					tips.innerHTML = '<p>抽奖用户过多，让程序飞一会，先去 <a href="http://caipiao.taobao.com" target="_blank">彩票频道</a> 转转再回来吧！</p>';
					setTimeout(function(){window.location.reload()},5000);
				},
				onSuccess: function(o){
					var obj = eval('(' + o + ')'),
						sta = obj.state;
					switch(sta){
						case 1:
							tips.innerHTML = '<p>您还未登录淘宝网。<br>请在这里 <a href="http://login.taobao.com/member/login.jhtml?from=lottery&redirectURL=http://caipiao.taobao.com/lottery/activity/poker/promotion.htm" target="_blank">登录淘宝网</a></p>';
							break;
						case 2:
							tips.innerHTML = '<p>您今天还未达到抽奖的条件，请先购买彩票<a href="http://caipiao.taobao.com/lottery/index.htm" target="_blank">【去购彩】</a></p>';
							break;
						case 3:
							tips.innerHTML = '<p>恭喜您中了<em>2元</em>红包！<br>祝您在新的一年里心想事成，万事如意！继续支持淘宝彩票! 现在还有<em>' + obj.remain_num + '次</em>可用</p>';
							break;
						case 4:
							tips.innerHTML = '<p class="box1">恭喜您中了<em>2元</em>红包！<br>祝您在新的一年里心想事成，万事如意！继续支持淘宝彩票! 现在还有<em>' + obj.remain_num + '次</em>可用，请继续购买彩票以获得更多抽奖机会</p>';
							break;
						case 5:
							tips.innerHTML = '<p class="box1">恭喜您中了<em>2元</em>红包！<br>祝您在新的一年里心想事成，万事如意！继续支持淘宝彩票! 您今天获得的10次机会已经全部用完，欢迎明天继续参与，谢谢</p>';
							break;
						case 6:
							tips.innerHTML = '<p class="box2">恭喜您中了Moto手机一部！<br>请尽快确认个人在淘宝的默认收货地址，以便我们发货给您! 现在还有<em>' + obj.remain_num + '次</em>可用</p>';
							break;
						case 7:
							tips.innerHTML = '<p class="box3">恭喜您中了Moto手机一部！<br>请尽快确认个人在淘宝的默认收货地址，以便我们发货给您! 现在还有<em>' + obj.remain_num + '次</em>可用，请继续购买彩票以获得更多抽奖机会</p>';
							break;
						case 8:
							tips.innerHTML = '<p class="box3">恭喜您中了Moto手机一部！<br>请尽快确认个人在淘宝的默认收货地址，以便我们发货给您! 您今天获得的<em>10次</em>机会已经全部用完，欢迎明天继续参与，谢谢</p>';
							break;
						case 9:
							tips.innerHTML = '<p>很遗憾本次没有中奖!<br>现在还有' + obj.remain_num + '次可用</p>';
							break;
						case 10:
							tips.innerHTML = '<p>很遗憾本次没有中奖!<br>现在还有<em>' + obj.remain_num + '次</em>可用，请继续购买彩票以获得更多抽奖机会</p>';
							break;
						case 11:
							tips.innerHTML = '<p>很遗憾本次没有中奖!<br>您今天获得的<em>10次</em>机会已经全部用完，欢迎明天继续参与，谢谢</p>';
							break;
						case 12:
							tips.innerHTML = '<p>您今天的抽奖次数已经全部用完，请继续购买彩票以获得更多抽奖机会，谢谢</p>';
							break;
						case 13:
							tips.innerHTML = '<p>活动尚未开始。</p>';
							break;
						case 14:
							tips.innerHTML = '<p>验证码错误，请重新输入。</p>';
							break;
						case 15:
							tips.innerHTML = '<p>您今天获得的10次机会已经全部用完，欢迎明天继续参与，谢谢</p>';
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
			popup, popupClass = "popup-box", popupTitle = "再选一次,试试手气",
			running = 0,
			self = this;

		/*
		* 随机选号投注
		* @param id:容器id; redMax:红球最大数值; blueMax:蓝球最大数值; blueNum:蓝球的个数
		*/
		this.LuckyLottery = function(id, redMax, blueMax, blueNum) {
			freshBtn = Dom.getElementsByClassName("num-list", "ul", id)[0].getElementsByTagName("button")[0];//刷新按钮
			buyBtn = Dom.getElementsByClassName("buy-bar", "div", id)[0].getElementsByTagName("button")[0];//购买
			ball = Dom.getElementsByClassName("num", "li", id); //号码

			self.createPopup();
			
			//刷新号码按钮提示-显示
			Event.on(freshBtn, 'mouseover', function(e){
			   var el = Event.getTarget(e),
				   pos;
			   Event.preventDefault(e);
			   el.title = "";
			   pos = Dom.getXY(el);
			   Dom.setStyle(popup, 'display', 'block');
			   Dom.setXY(popup, [pos[0] - 60,pos[1]- 28]);
			});

			//刷新号码按钮提示-隐藏
			Event.on(freshBtn, 'mouseout', function(e){
			   Event.preventDefault(e);
			   Dom.setStyle(popup, 'display', 'none');
			});
			
			//刷新号码按钮-滚动号码
			Event.on(freshBtn, 'click', function(e){
			   Event.preventDefault(e);
			   self.forEachBall(redMax, blueMax, blueNum);
			});
			
			//提交表单
			Event.on(buyBtn, 'click', function(e){
			   var el = Event.getTarget(e),
				   ballNums = [],
				   sBall,sBall2;
				Event.stopEvent(e);
			   if(running > 0){
				 alert("稍安毋躁，请在号码滚动结束后投注，谢谢:)");
				 return;
			   }
			   
			   for(var i = 0; i < ball.length; i++){
				 ballNums.push(ball[i].getElementsByTagName('b')[0].innerHTML);
			   }

			  switch(blueNum){
				case LOTTERY_TYPE["ssq"] ://双色球
					var sBall2 = ballNums.slice(0, 6).join(' ') + ':' + ballNums.slice(6).join(' ');
					break;
				case LOTTERY_TYPE["fc"] ://福彩3d
					var sBall2 = ballNums.slice(0, 3).join(''); //ballNums.slice(0, 3).join(' ');
						sBall2= sBall2.replaceAll("0","") +":0";
					break;
				case LOTTERY_TYPE["qlc"] ://七乐彩
					var sBall2 = ballNums.slice(0, 7).join(' ');
					break;
				case LOTTERY_TYPE["qxc"] ://七星彩
					var sBall2 = ballNums.slice(0, 7).join(',');
					sBall2= sBall2.replaceAll("0","");
					break;
				case LOTTERY_TYPE["dlt"] ://大乐透
					var sBall2 = ballNums.slice(0, 5).join(' ') + '-' + ballNums.slice(5).join(' ');
					break;
				case LOTTERY_TYPE["pls"] ://排列三
					var sBall2 = ballNums.slice(0, 3).join('');
					sBall2= sBall2.replaceAll("0","") + ":0";
					break;
				case LOTTERY_TYPE["plw"] ://排列五
					var sBall2 = ballNums.slice(0, 5).join('');
					sBall2= sBall2.replaceAll("0","") + ":0";
					break;
				default:
					break;
			  }



			  Dom.get("J_Lottery").elements["numberStrings"].value = sBall2;

			
				endTime = +(new Date(Date.parse((endTime).replace(/-/g,   "/"))));
				if((+new Date()) > endTime){
					alert('彩期已过期！')
				}else{
					this.form.submit();
					//弹出代购提示曾	
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

		  
			
		  //页面加载完后 ，第一次执行
		  Event.onDOMReady(function(){
			 self.forEachBall(redMax, blueMax, blueNum);
		  });
		};
		
		/*
		* 创建浮出层
		*/
		this.createPopup = function(){
			popup = doc.createElement("div");
			popup.id = popup;
			popup.className = popupClass;
			popup.innerHTML = popupTitle;
			doc.body.appendChild(popup);
	
		};
		
		/*
		* 循环号码
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
		* 随即号码
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
	* getScript获取数据
	*/
	Lottery.use("IO", new function(){
		
		var LOTTERY_URL = {
			OPEN_AWARD : HOST +"/lottery/wangwang/lottery_open_award.htm", //
			NEWS : HOST+"/lottery/wangwang/lottery_latest_win.htm?count=4", //最新中奖
			ISSUE_INFO: HOST + "/lottery/wangwang/lottery_issue_info.htm" //
		},

		self = this;


		this._setLootteryCallback = function(name,num) {
			
			//设置表单的数据
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
						case LOTTERY_TYPE["ssq"] ://双色球
							var sBall = ballNums.slice(0, 6).join(' ') + ':' + ballNums.slice(6).join(' ');
							break;
						case LOTTERY_TYPE["fc"] ://福彩3d
							var sBall = ballNums.slice(0, 3).join(' '); 
							break;
						case LOTTERY_TYPE["qlc"] ://七乐彩
							var sBall = ballNums.slice(0, 7).join(' '); 
							break;
						case LOTTERY_TYPE["qxc"] ://七星彩
							var sBall = ballNums.slice(0, 6).join(' ') + ':' + ballNums.slice(6).join(' ');
							break;
						case LOTTERY_TYPE["dlt"] ://大乐透
							var sBall = ballNums.slice(0, 5).join(' ') + ':' + ballNums.slice(5).join(' ')+ ballNums.slice(6).join(' ');
							break;
						case LOTTERY_TYPE["pls"] ://排列三
							var sBall = ballNums.slice(0, 5).join(' ') + ':' + ballNums.slice(5).join(' ') ;
							break;
						case LOTTERY_TYPE["plw"] ://排列五
							var sBall = ballNums.slice(0, 5).join(' ') + ':' + ballNums.slice(5).join(' ');
							break;
						default:
							break;
							
					  }
                    //彩票号码
					//Dom.get("J_Lottery").elements["numberStrings"].value = sBall;
					
                    Dom.get("J_Lottery").elements["lotteryTypeId"].value = num;//LOTTERY_TYPE[data["name"]];
				};
			}
			//最新中奖名单
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
			//上期中奖信息
			else{
				win[name] = function(data) {
					if(!data) return;
					var issue = data["issue"],
						luckyNum = data["luckyNum"],
						parentEl = Dom.getElementsByClassName("mod-"+name.split("_")[0],"div")[0],
						issue_el = Dom.getElementsByClassName("issue","span",parentEl)[0],
						luckyNum_el = Dom.getNextSiblingBy(issue_el);

                      //  Dom.get("J_Lottery").elements["lotteryTypeId"].value = LOTTERY_TYPE[data["name"]];
					issue_el.innerHTML = "上期开奖期次:" + issue;
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
						luckyNum_el.innerHTML = "上期开奖号码: <em>"+luckyNumRed+"<em class='blue'>:"+luckyNumBlue+"</em></em>";
					}else{
						luckyNum_el.innerHTML = "上期开奖号码: <em>"+luckyNum+"</em>";
					}
				};
			}
		}
		
	
		
		/*
		* @param name:彩票名; id:彩票id; callback:回调函数
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
					case 0 ://双色球
						Lottery.mod.Lottery.LuckyLottery('J_ssq', '33', '16', LOTTERY_TYPE["ssq"]);
						Lottery.mod.IO.getScript("ssq",LOTTERY_TYPE["ssq"],"ssq_callback");
						break;
					case 1 ://福彩3d
						Lottery.mod.Lottery.LuckyLottery('J_fc', '9', null, LOTTERY_TYPE["fc"]);
						Lottery.mod.IO.getScript("fc",LOTTERY_TYPE["fc"],"fc_callback");
						break;
					case 2 ://七乐彩
						Lottery.mod.Lottery.LuckyLottery('J_qlc', '30', null, LOTTERY_TYPE["qlc"]);
						Lottery.mod.IO.getScript("qlc",LOTTERY_TYPE["qlc"],"qlc_callback");
						break;
					case 3 ://七星彩
						Lottery.mod.Lottery.LuckyLottery('J_qxc', '9', null, LOTTERY_TYPE["qxc"]);
						Lottery.mod.IO.getScript("qxc",LOTTERY_TYPE["qxc"],"qxc_callback");
						break;
					case 4 ://大乐透
						Lottery.mod.Lottery.LuckyLottery('J_dlt', '35', '12', LOTTERY_TYPE["dlt"]);
						Lottery.mod.IO.getScript("dlt",LOTTERY_TYPE["dlt"],"dlt_callback");
						break;
					case 5 ://排列三
						Lottery.mod.Lottery.LuckyLottery('J_pls', '9', null, LOTTERY_TYPE["pls"]);
						Lottery.mod.IO.getScript("pls",LOTTERY_TYPE["pls"],"pls_callback");
						break;
					case 6 ://排列五
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
