YUI.Env.JSONP.getHotCityData({results : [{
	'tabname' : '热门城市','tabdata' : [{'dt' : ' ', 'dd':[

{'cityName':'香港','cityCode':'HKG'}
 ,  {'cityName':'北京','cityCode':'BJS'}
 ,  {'cityName':'上海','cityCode':'SHA'}
 ,  {'cityName':'澳门','cityCode':'MFM'}
 ,  {'cityName':'台北','cityCode':'TPE'}
 ,  {'cityName':'东京','cityCode':'TYO'}
 ,  {'cityName':'首尔','cityCode':'SEL'}
 ,  {'cityName':'曼谷','cityCode':'BKK'}
 ,  {'cityName':'吉隆坡','cityCode':'KUL'}
 ,  {'cityName':'新加坡','cityCode':'SIN'}
 ,  {'cityName':'法兰克福','cityCode':'FRA'}
 ,  {'cityName':'巴黎','cityCode':'PAR'}
 ,  {'cityName':'纽约','cityCode':'NYC'}
 ,  {'cityName':'大阪','cityCode':'OSA'}
 ,  {'cityName':'名古屋','cityCode':'NGO'}
 ,  {'cityName':'悉尼','cityCode':'SYD'}
 ]}

]},
{'tabname' : '欧洲','tabdata' :[
	 {'dt' : '', 'dd':[

{'cityName':'伦敦','cityCode':'LON'}
 ,  {'cityName':'慕尼黑','cityCode':'MUC'}
 ,  {'cityName':'阿姆斯特丹','cityCode':'AMS'}
 ,  {'cityName':'斯特哥尔摩','cityCode':'STO'}
 ,  {'cityName':'巴塞罗那','cityCode':'BCN'}
 ,  {'cityName':'柏林','cityCode':'BER'}
 ,  {'cityName':'米兰','cityCode':'MIL'}
 ,  {'cityName':'莫斯科','cityCode':'MOW'}
 ,  {'cityName':'罗马','cityCode':'ROM'}
 ,  {'cityName':'哥本哈根','cityCode':'CPH'}
 ,  {'cityName':'布鲁塞尔','cityCode':'BRU'}
 ,  {'cityName':'杜塞尔多夫','cityCode':'DUS'}
 ,  {'cityName':'汉堡','cityCode':'HAM'}
 ,  {'cityName':'里昂','cityCode':'LYS'}
 ]}

]},
{'tabname' : '亚洲/大洋洲','tabdata' :[


	 {'dt' : '', 'dd':[

{'cityName':'墨尔本','cityCode':'MEL'}
 ,  {'cityName':'布里斯班','cityCode':'BNE'}
 ,  {'cityName':'平壤','cityCode':'FNJ'}
 ,  {'cityName':'马尼拉','cityCode':'MNL'}
 ,  {'cityName':'济州岛','cityCode':'CJU'}
 ,  {'cityName':'釜山','cityCode':'PUD'}
 ,  {'cityName':'大丘','cityCode':'TAE'}
 ,  {'cityName':'金边','cityCode':'PNH'}
 ,  {'cityName':'多哈','cityCode':'DOH'}
 ,  {'cityName':'万象','cityCode':'VIE'}
 ,  {'cityName':'马累','cityCode':'MLE'}
 ,  {'cityName':'福冈','cityCode':'FUK'}
 ,  {'cityName':'奥克兰','cityCode':'AKL'}
 ,  {'cityName':'德里','cityCode':'DEL'}
 ,  {'cityName':'河内','cityCode':'HAN'}
 ]}

]},
{'tabname' : '美洲','tabdata' :[
	 {'dt' : '', 'dd':[

{'cityName':'休斯敦','cityCode':'HOU'}
 ,  {'cityName':'丹佛','cityCode':'DEN'}
 ,  {'cityName':'华盛顿','cityCode':'WAS'}
 ,  {'cityName':'芝加哥','cityCode':'CHI'}
 ,  {'cityName':'温哥华','cityCode':'YVR'}
 ,  {'cityName':'底特律','cityCode':'DTT'}
 ,  {'cityName':'夏威夷','cityCode':'HNL'}
 ,  {'cityName':'西雅图','cityCode':'SEA'}
 ,  {'cityName':'多伦多','cityCode':'YTO'}
 ,  {'cityName':'墨西哥城','cityCode':'MEX'}
 ]}

]},
{'tabname' : '非洲','tabdata' :[
	 {'dt' : '', 'dd':[

{'cityName':'开普敦','cityCode':'CPT'}
 ,  {'cityName':'约翰内斯堡','cityCode':'JNB'}
 ,  {'cityName':'开罗','cityCode':'CAI'}
 ]}

]}

]})



/*
cQuery.jsonpResponse = {};
cQuery.jsonpResponse.suggestion = {
	'国际热门': [{
		display: "香港",
		data: "|香港|58"
	},
	{
		display: "首尔",
		data: "|首尔|274"
	},
	{
		display: "台北",
		data: "|台北|617"
	},
	{
		display: "东京",
		data: "|东京|228"
	},
	{
		display: "新加坡",
		data: "|新加坡|73"
	},
	{
		display: "澳门",
		data: "|澳门|59"
	},
	{
		display: "曼谷",
		data: "|曼谷|359"
	},
	{
		display: "大阪",
		data: "|大阪|219"
	},
	{
		display: "胡志明市",
		data: "|胡志明市|301"
	},
	{
		display: "马尼拉",
		data: "|马尼拉|364"
	},
	{
		display: "名古屋",
		data: "|名古屋|360"
	},
	{
		display: "伦敦",
		data: "|伦敦|338"
	},
	{
		display: "吉隆坡",
		data: "|吉隆坡|315"
	},
	{
		display: "釜山",
		data: "|釜山|253"
	},
	{
		display: "悉尼",
		data: "|悉尼|501"
	},
	{
		display: "法兰克福",
		data: "|法兰克福|250"
	},
	{
		display: "温哥华",
		data: "|温哥华|476"
	},
	{
		display: "巴黎",
		data: "|巴黎|192"
	},
	{
		display: "纽约",
		data: "|纽约|633"
	},
	{
		display: "洛杉矶",
		data: "|洛杉矶|347"
	},
	{
		display: "夏威夷",
		data: "|夏威夷|757"
	}],
	'国内热门': [{
		display: "上海",
		data: "|上海|2"
	},
	{
		display: "北京",
		data: "|北京|1"
	},
	{
		display: "香港",
		data: "|香港|58"
	},
	{
		display: "广州",
		data: "|广州|32"
	},
	{
		display: "杭州",
		data: "|杭州|17"
	},
	{
		display: "厦门",
		data: "|厦门|25"
	},
	{
		display: "南京",
		data: "|南京|12"
	},
	{
		display: "澳门",
		data: "|澳门|59"
	},
	{
		display: "成都",
		data: "|成都|28"
	},
	{
		display: "青岛",
		data: "|青岛|7"
	},
	{
		display: "台北",
		data: "|台北|617"
	},
	{
		display: "福州",
		data: "|福州|258"
	},
	{
		display: "天津",
		data: "|天津|3"
	},
	{
		display: "深圳",
		data: "|深圳|30"
	},
	{
		display: "大连",
		data: "|大连|6"
	},
	{
		display: "沈阳",
		data: "|沈阳|451"
	},
	{
		display: "昆明",
		data: "|昆明|34"
	},
	{
		display: "武汉",
		data: "|武汉|477"
	},
	{
		display: "宁波",
		data: "|宁波|375"
	},
	{
		display: "无锡",
		data: "|无锡|13"
	},
	{
		display: "晋江",
		data: "|晋江|1803"
	},
	{
		display: "重庆",
		data: "|重庆|4"
	},
	{
		display: "三亚",
		data: "|三亚|43"
	},
	{
		display: "西安",
		data: "|西安|10"
	}],
	'亚洲': [{
		display: "香港",
		data: "|香港|58"
	},
	{
		display: "东京",
		data: "|东京|228"
	},
	{
		display: "台北",
		data: "|台北|617"
	},
	{
		display: "首尔",
		data: "|首尔|274"
	},
	{
		display: "新加坡",
		data: "|新加坡|73"
	},
	{
		display: "曼谷",
		data: "|曼谷|359"
	},
	{
		display: "吉隆坡",
		data: "|吉隆坡|315"
	},
	{
		display: "大阪",
		data: "|大阪|219"
	},
	{
		display: "澳门",
		data: "|澳门|59"
	},
	{
		display: "雅加达",
		data: "|雅加达|524"
	},
	{
		display: "胡志明市",
		data: "|胡志明市|301"
	},
	{
		display: "马尼拉",
		data: "|马尼拉|364"
	},
	{
		display: "巴厘岛",
		data: "|巴厘岛|723"
	},
	{
		display: "名古屋",
		data: "|名古屋|360"
	},
	{
		display: "普吉岛",
		data: "|普吉岛|725"
	},
	{
		display: "河内",
		data: "|河内|286"
	},
	{
		display: "马累",
		data: "|马累|1207"
	},
	{
		display: "迪拜",
		data: "|迪拜|220"
	},
	{
		display: "釜山",
		data: "|釜山|253"
	},
	{
		display: "加德满都",
		data: "|加德满都|304"
	},
	{
		display: "高雄",
		data: "|高雄|720"
	},
	{
		display: "福冈",
		data: "|福冈|248"
	},
	{
		display: "金边",
		data: "|金边|303"
	},
	{
		display: "德里",
		data: "|德里|230"
	},
	{
		display: "济州岛",
		data: "|济州岛|737"
	},
	{
		display: "札幌",
		data: "|札幌|641"
	},
	{
		display: "伊斯坦布尔",
		data: "|伊斯坦布尔|532"
	},
	{
		display: "乌兰巴托",
		data: "|乌兰巴托|483"
	},
	{
		display: "孟买",
		data: "|孟买|724"
	}],
	'欧洲': [{
		display: "伦敦",
		data: "|伦敦|338"
	},
	{
		display: "巴黎",
		data: "|巴黎|192"
	},
	{
		display: "法兰克福",
		data: "|法兰克福|250"
	},
	{
		display: "莫斯科",
		data: "|莫斯科|366"
	},
	{
		display: "罗马",
		data: "|罗马|343"
	},
	{
		display: "阿姆斯特丹",
		data: "|阿姆斯特丹|176"
	},
	{
		display: "米兰",
		data: "|米兰|361"
	},
	{
		display: "慕尼黑",
		data: "|慕尼黑|363"
	},
	{
		display: "斯德哥尔摩",
		data: "|斯德哥尔摩|420"
	},
	{
		display: "柏林",
		data: "|柏林|193"
	},
	{
		display: "曼彻斯特(英国)",
		data: "|曼彻斯特(英国)|722"
	},
	{
		display: "马德里",
		data: "|马德里|357"
	},
	{
		display: "苏黎世",
		data: "|苏黎世|434"
	},
	{
		display: "布鲁塞尔",
		data: "|布鲁塞尔|196"
	},
	{
		display: "哥本哈根",
		data: "|哥本哈根|260"
	},
	{
		display: "赫尔辛基",
		data: "|赫尔辛基|277"
	},
	{
		display: "维也纳",
		data: "|维也纳|651"
	},
	{
		display: "巴塞罗那",
		data: "|巴塞罗那|707"
	},
	{
		display: "雅典",
		data: "|雅典|710"
	},
	{
		display: "爱丁堡",
		data: "|爱丁堡|706"
	},
	{
		display: "伯明翰(英国)",
		data: "|伯明翰(英国)|1270"
	},
	{
		display: "纽卡斯尔",
		data: "|纽卡斯尔|1289"
	},
	{
		display: "日内瓦",
		data: "|日内瓦|666"
	},
	{
		display: "圣彼得堡",
		data: "|圣彼得堡|798"
	},
	{
		display: "格拉斯哥",
		data: "|格拉斯哥|780"
	},
	{
		display: "基辅",
		data: "|基辅|306"
	},
	{
		display: "布达佩斯",
		data: "|布达佩斯|637"
	},
	{
		display: "汉堡",
		data: "|汉堡|763"
	},
	{
		display: "布拉格",
		data: "|布拉格|1288"
	},
	{
		display: "杜塞尔多夫",
		data: "|杜塞尔多夫|762"
	}],
	'美洲': [{
		display: "纽约",
		data: "|纽约|633"
	},
	{
		display: "洛杉矶",
		data: "|洛杉矶|347"
	},
	{
		display: "旧金山",
		data: "|旧金山|313"
	},
	{
		display: "温哥华",
		data: "|温哥华|476"
	},
	{
		display: "芝加哥",
		data: "|芝加哥|549"
	},
	{
		display: "多伦多",
		data: "|多伦多|461"
	},
	{
		display: "西雅图",
		data: "|西雅图|511"
	},
	{
		display: "华盛顿",
		data: "|华盛顿|676"
	},
	{
		display: "波士顿",
		data: "|波士顿|703"
	},
	{
		display: "底特律",
		data: "|底特律|233"
	},
	{
		display: "亚特兰大",
		data: "|亚特兰大|704"
	},
	{
		display: "休斯敦",
		data: "|休斯敦|701"
	},
	{
		display: "悉尼(加拿大)",
		data: "|悉尼(加拿大)|3285"
	},
	{
		display: "蒙特利尔",
		data: "|蒙特利尔|759"
	},
	{
		display: "火奴鲁鲁",
		data: "|火奴鲁鲁|757"
	},
	{
		display: "塞班",
		data: "|塞班|1237"
	},
	{
		display: "达拉斯",
		data: "|达拉斯|705"
	},
	{
		display: "明尼阿波利斯",
		data: "|明尼阿波利斯|1238"
	},
	{
		display: "费城",
		data: "|费城|1189"
	},
	{
		display: "圣保罗",
		data: "|圣保罗|415"
	},
	{
		display: "渥太华",
		data: "|渥太华|760"
	},
	{
		display: "墨西哥城",
		data: "|墨西哥城|691"
	},
	{
		display: "拉斯维加斯",
		data: "|拉斯维加斯|675"
	},
	{
		display: "卡尔加利",
		data: "|卡尔加利|761"
	},
	{
		display: "迈阿密",
		data: "|迈阿密|702"
	},
	{
		display: "丹佛",
		data: "|丹佛|699"
	},
	{
		display: "奥兰多",
		data: "|奥兰多|1187"
	},
	{
		display: "波特兰",
		data: "|波特兰|694"
	},
	{
		display: "圣保罗",
		data: "|圣保罗|7591"
	},
	{
		display: "曼彻斯特(美国)",
		data: "|曼彻斯特(美国)|1877"
	},
	{
		display: "埃特蒙顿",
		data: "|埃特蒙顿|1245"
	},
	{
		display: "布宜诺斯艾利斯",
		data: "|布宜诺斯艾利斯|807"
	}],
	'非洲': [{
		display: "开罗",
		data: "|开罗|332"
	},
	{
		display: "约翰内斯堡",
		data: "|约翰内斯堡|684"
	},
	{
		display: "开普敦",
		data: "|开普敦|683"
	},
	{
		display: "内罗毕",
		data: "|内罗毕|825"
	},
	{
		display: "拉各斯",
		data: "|拉各斯|783"
	},
	{
		display: "罗安达",
		data: "|罗安达|842"
	},
	{
		display: "毛里求斯",
		data: "|毛里求斯|785"
	},
	{
		display: "达累斯萨拉姆",
		data: "|达累斯萨拉姆|814"
	},
	{
		display: "亚的斯亚贝巴",
		data: "|亚的斯亚贝巴|635"
	},
	{
		display: "喀土穆",
		data: "|喀土穆|1279"
	},
	{
		display: "阿克拉",
		data: "|阿克拉|1274"
	},
	{
		display: "阿尔及尔",
		data: "|阿尔及尔|1271"
	},
	{
		display: "卡萨布兰卡",
		data: "|卡萨布兰卡|809"
	},
	{
		display: "德班",
		data: "|德班|1278"
	},
	{
		display: "突尼斯",
		data: "|突尼斯|1280"
	},
	{
		display: "卢萨卡",
		data: "|卢萨卡|816"
	},
	{
		display: "哈拉雷",
		data: "|哈拉雷|849"
	},
	{
		display: "雅温得",
		data: "|雅温得|4206"
	},
	{
		display: "哈博罗内",
		data: "|哈博罗内|857"
	},
	{
		display: "金沙萨",
		data: "|金沙萨|845"
	},
	{
		display: "马普托",
		data: "|马普托|863"
	},
	{
		display: "杜阿拉",
		data: "|杜阿拉|1272"
	},
	{
		display: "亚历山德里亚",
		data: "|亚历山德里亚|1489"
	},
	{
		display: "费里敦",
		data: "|费里敦|4210"
	},
	{
		display: "阿比让",
		data: "|阿比让|3265"
	},
	{
		display: "卢克索",
		data: "|卢克索|730"
	}],
	'大洋洲': [{
		display: "悉尼",
		data: "|悉尼|501"
	},
	{
		display: "墨尔本",
		data: "|墨尔本|358"
	},
	{
		display: "奥克兰(新西兰)",
		data: "|奥克兰(新西兰)|678"
	},
	{
		display: "布里斯班",
		data: "|布里斯班|680"
	},
	{
		display: "阿德莱德",
		data: "|阿德莱德|1243"
	},
	{
		display: "珀斯",
		data: "|珀斯|681"
	},
	{
		display: "惠灵顿",
		data: "|惠灵顿|843"
	},
	{
		display: "堪培拉",
		data: "|堪培拉|679"
	},
	{
		display: "凯恩斯",
		data: "|凯恩斯|728"
	},
	{
		display: "克赖斯特彻奇",
		data: "|克赖斯特彻奇|7505"
	},
	{
		display: "楠迪",
		data: "|楠迪|791"
	},
	{
		display: "黄金海岸",
		data: "|黄金海岸|1210"
	},
	{
		display: "帕皮堤",
		data: "|帕皮堤|5646"
	},
	{
		display: "霍巴特",
		data: "|霍巴特|1446"
	},
	{
		display: "达尔文",
		data: "|达尔文|682"
	},
	{
		display: "泊特莫尔斯比港",
		data: "|泊特莫尔斯比港|859"
	},
	{
		display: "艾丽斯斯普林斯",
		data: "|艾丽斯斯普林斯|3320"
	},
	{
		display: "达尼丁",
		data: "|达尼丁|1297"
	},
	{
		display: "汤斯维尔",
		data: "|汤斯维尔|3357"
	}]
};
*/
