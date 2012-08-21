
var PageName = '行程单使用明细';
var PageId = '58db3ab3be8d44d9a235d42686fe4211'
var PageUrl = '行程单使用明细.html'
document.title = '行程单使用明细';
var PageNotes = 
{
"pageName":"行程单使用明细",
"showNotesNames":"False"}
var $OnLoadVariable = '';

var $CSUM;

var hasQuery = false;
var query = window.location.hash.substring(1);
if (query.length > 0) hasQuery = true;
var vars = query.split("&");
for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0].length > 0) eval("$" + pair[0] + " = decodeURIComponent(pair[1]);");
} 

if (hasQuery && $CSUM != 1) {
alert('Prototype Warning: The variable values were too long to pass to this page.\nIf you are using IE, using Firefox will support more data.');
}

function GetQuerystring() {
    return '#OnLoadVariable=' + encodeURIComponent($OnLoadVariable) + '&CSUM=1';
}

function PopulateVariables(value) {
    var d = new Date();
  value = value.replace(/\[\[OnLoadVariable\]\]/g, $OnLoadVariable);
  value = value.replace(/\[\[PageName\]\]/g, PageName);
  value = value.replace(/\[\[GenDay\]\]/g, '31');
  value = value.replace(/\[\[GenMonth\]\]/g, '7');
  value = value.replace(/\[\[GenMonthName\]\]/g, '七月');
  value = value.replace(/\[\[GenDayOfWeek\]\]/g, '星期二');
  value = value.replace(/\[\[GenYear\]\]/g, '2012');
  value = value.replace(/\[\[Day\]\]/g, d.getDate());
  value = value.replace(/\[\[Month\]\]/g, d.getMonth() + 1);
  value = value.replace(/\[\[MonthName\]\]/g, GetMonthString(d.getMonth()));
  value = value.replace(/\[\[DayOfWeek\]\]/g, GetDayString(d.getDay()));
  value = value.replace(/\[\[Year\]\]/g, d.getFullYear());
  return value;
}

function OnLoad(e) {

}

var u167 = document.getElementById('u167');

var u299 = document.getElementById('u299');
gv_vAlignTable['u299'] = 'top';
var u36 = document.getElementById('u36');
gv_vAlignTable['u36'] = 'top';
var u180 = document.getElementById('u180');

var u136 = document.getElementById('u136');
gv_vAlignTable['u136'] = 'top';
var u216 = document.getElementById('u216');

var u194 = document.getElementById('u194');

var u333 = document.getElementById('u333');
gv_vAlignTable['u333'] = 'top';
var u97 = document.getElementById('u97');

var u152 = document.getElementById('u152');
gv_vAlignTable['u152'] = 'top';
var u231 = document.getElementById('u231');

var u60 = document.getElementById('u60');
gv_vAlignTable['u60'] = 'top';
var u78 = document.getElementById('u78');
gv_vAlignTable['u78'] = 'top';
var u166 = document.getElementById('u166');

var u298 = document.getElementById('u298');

var u139 = document.getElementById('u139');

var u201 = document.getElementById('u201');
gv_vAlignTable['u201'] = 'top';
var u1 = document.getElementById('u1');
gv_vAlignTable['u1'] = 'center';
var u215 = document.getElementById('u215');
gv_vAlignTable['u215'] = 'top';
var u193 = document.getElementById('u193');
gv_vAlignTable['u193'] = 'top';
var u11 = document.getElementById('u11');

var u126 = document.getElementById('u126');
gv_vAlignTable['u126'] = 'top';
var u332 = document.getElementById('u332');

var u151 = document.getElementById('u151');

var u71 = document.getElementById('u71');

var u202 = document.getElementById('u202');

var u26 = document.getElementById('u26');
gv_vAlignTable['u26'] = 'top';
var u165 = document.getElementById('u165');

var u138 = document.getElementById('u138');
gv_vAlignTable['u138'] = 'top';
var u100 = document.getElementById('u100');
gv_vAlignTable['u100'] = 'top';
var u54 = document.getElementById('u54');
gv_vAlignTable['u54'] = 'top';
var u236 = document.getElementById('u236');

var u214 = document.getElementById('u214');

var u192 = document.getElementById('u192');

var u67 = document.getElementById('u67');

var u269 = document.getElementById('u269');
gv_vAlignTable['u269'] = 'top';
var u331 = document.getElementById('u331');
gv_vAlignTable['u331'] = 'top';
var u321 = document.getElementById('u321');
gv_vAlignTable['u321'] = 'top';
var u150 = document.getElementById('u150');
gv_vAlignTable['u150'] = 'top';
var u287 = document.getElementById('u287');
gv_vAlignTable['u287'] = 'top';
var u48 = document.getElementById('u48');
gv_vAlignTable['u48'] = 'top';
var u24 = document.getElementById('u24');
gv_vAlignTable['u24'] = 'top';
var u80 = document.getElementById('u80');
gv_vAlignTable['u80'] = 'top';
var u65 = document.getElementById('u65');

var u318 = document.getElementById('u318');

var u113 = document.getElementById('u113');

var u268 = document.getElementById('u268');

var u330 = document.getElementById('u330');

var u227 = document.getElementById('u227');
gv_vAlignTable['u227'] = 'top';
var u42 = document.getElementById('u42');
gv_vAlignTable['u42'] = 'top';
var u159 = document.getElementById('u159');
gv_vAlignTable['u159'] = 'top';
var u163 = document.getElementById('u163');
gv_vAlignTable['u163'] = 'top';
var u63 = document.getElementById('u63');

var u326 = document.getElementById('u326');

var u177 = document.getElementById('u177');
gv_vAlignTable['u177'] = 'top';
var u37 = document.getElementById('u37');

var u93 = document.getElementById('u93');

var u112 = document.getElementById('u112');
gv_vAlignTable['u112'] = 'top';
var u46 = document.getElementById('u46');
gv_vAlignTable['u46'] = 'top';
var u307 = document.getElementById('u307');
gv_vAlignTable['u307'] = 'top';
var u285 = document.getElementById('u285');
gv_vAlignTable['u285'] = 'top';
var u18 = document.getElementById('u18');
gv_vAlignTable['u18'] = 'top';
var u50 = document.getElementById('u50');
gv_vAlignTable['u50'] = 'top';
var u162 = document.getElementById('u162');
gv_vAlignTable['u162'] = 'top';
var u79 = document.getElementById('u79');

var u176 = document.getElementById('u176');

var u55 = document.getElementById('u55');

var u149 = document.getElementById('u149');

var u111 = document.getElementById('u111');

var u306 = document.getElementById('u306');

var u284 = document.getElementById('u284');

var u12 = document.getElementById('u12');
gv_vAlignTable['u12'] = 'top';
var u342 = document.getElementById('u342');

u342.style.cursor = 'pointer';
if (bIE) u342.attachEvent("onclick", Clicku342);
else u342.addEventListener("click", Clicku342, true);
function Clicku342(e)
{
windowEvent = e;


if (true) {

	NewTab("打印行程单.html" + GetQuerystring(), "");

}

}

var u161 = document.getElementById('u161');
gv_vAlignTable['u161'] = 'top';
var u329 = document.getElementById('u329');
gv_vAlignTable['u329'] = 'top';
var u175 = document.getElementById('u175');

var u229 = document.getElementById('u229');
gv_vAlignTable['u229'] = 'top';
var u148 = document.getElementById('u148');
gv_vAlignTable['u148'] = 'top';
var u110 = document.getElementById('u110');
gv_vAlignTable['u110'] = 'top';
var u305 = document.getElementById('u305');
gv_vAlignTable['u305'] = 'top';
var u283 = document.getElementById('u283');
gv_vAlignTable['u283'] = 'top';
var u20 = document.getElementById('u20');
gv_vAlignTable['u20'] = 'top';
var u124 = document.getElementById('u124');
gv_vAlignTable['u124'] = 'top';
var u279 = document.getElementById('u279');
gv_vAlignTable['u279'] = 'top';
var u241 = document.getElementById('u241');
gv_vAlignTable['u241'] = 'top';
var u160 = document.getElementById('u160');
gv_vAlignTable['u160'] = 'top';
var u297 = document.getElementById('u297');
gv_vAlignTable['u297'] = 'top';
var u8 = document.getElementById('u8');

var u49 = document.getElementById('u49');

var u25 = document.getElementById('u25');

var u309 = document.getElementById('u309');
gv_vAlignTable['u309'] = 'top';
var u228 = document.getElementById('u228');

var u81 = document.getElementById('u81');

var u88 = document.getElementById('u88');
gv_vAlignTable['u88'] = 'top';
var u304 = document.getElementById('u304');

var u282 = document.getElementById('u282');

var u76 = document.getElementById('u76');
gv_vAlignTable['u76'] = 'top';
var u123 = document.getElementById('u123');

var u263 = document.getElementById('u263');
gv_vAlignTable['u263'] = 'top';
var u278 = document.getElementById('u278');

var u240 = document.getElementById('u240');

var u296 = document.getElementById('u296');

var u137 = document.getElementById('u137');

var u33 = document.getElementById('u33');

var u254 = document.getElementById('u254');

var u173 = document.getElementById('u173');
gv_vAlignTable['u173'] = 'top';
var u213 = document.getElementById('u213');
gv_vAlignTable['u213'] = 'top';
var u303 = document.getElementById('u303');
gv_vAlignTable['u303'] = 'top';
var u281 = document.getElementById('u281');
gv_vAlignTable['u281'] = 'top';
var u94 = document.getElementById('u94');
gv_vAlignTable['u94'] = 'top';
var u122 = document.getElementById('u122');
gv_vAlignTable['u122'] = 'top';
var u5 = document.getElementById('u5');
gv_vAlignTable['u5'] = 'center';
var u317 = document.getElementById('u317');
gv_vAlignTable['u317'] = 'top';
var u295 = document.getElementById('u295');
gv_vAlignTable['u295'] = 'top';
var u19 = document.getElementById('u19');

var u51 = document.getElementById('u51');

var u109 = document.getElementById('u109');

var u253 = document.getElementById('u253');
gv_vAlignTable['u253'] = 'top';
var u172 = document.getElementById('u172');

var u267 = document.getElementById('u267');
gv_vAlignTable['u267'] = 'top';
var u302 = document.getElementById('u302');

var u280 = document.getElementById('u280');

var u121 = document.getElementById('u121');

var u207 = document.getElementById('u207');
gv_vAlignTable['u207'] = 'top';
var u316 = document.getElementById('u316');

var u294 = document.getElementById('u294');

var u135 = document.getElementById('u135');

var u108 = document.getElementById('u108');
gv_vAlignTable['u108'] = 'top';
var u252 = document.getElementById('u252');

var u171 = document.getElementById('u171');

var u191 = document.getElementById('u191');
gv_vAlignTable['u191'] = 'top';
var u266 = document.getElementById('u266');

var u64 = document.getElementById('u64');
gv_vAlignTable['u64'] = 'top';
var u239 = document.getElementById('u239');
gv_vAlignTable['u239'] = 'top';
var u301 = document.getElementById('u301');
gv_vAlignTable['u301'] = 'top';
var u120 = document.getElementById('u120');
gv_vAlignTable['u120'] = 'top';
var u2 = document.getElementById('u2');

var u169 = document.getElementById('u169');

var u315 = document.getElementById('u315');
gv_vAlignTable['u315'] = 'top';
var u293 = document.getElementById('u293');
gv_vAlignTable['u293'] = 'top';
var u21 = document.getElementById('u21');

var u134 = document.getElementById('u134');
gv_vAlignTable['u134'] = 'top';
var u251 = document.getElementById('u251');
gv_vAlignTable['u251'] = 'top';
var u170 = document.getElementById('u170');
gv_vAlignTable['u170'] = 'top';
var u319 = document.getElementById('u319');
gv_vAlignTable['u319'] = 'top';
var u82 = document.getElementById('u82');
gv_vAlignTable['u82'] = 'top';
var u16 = document.getElementById('u16');
gv_vAlignTable['u16'] = 'top';
var u238 = document.getElementById('u238');

var u200 = document.getElementById('u200');

var u314 = document.getElementById('u314');

var u292 = document.getElementById('u292');

var u77 = document.getElementById('u77');

var u133 = document.getElementById('u133');

var u250 = document.getElementById('u250');

var u147 = document.getElementById('u147');

var u58 = document.getElementById('u58');
gv_vAlignTable['u58'] = 'top';
var u34 = document.getElementById('u34');
gv_vAlignTable['u34'] = 'top';
var u90 = document.getElementById('u90');
gv_vAlignTable['u90'] = 'top';
var u61 = document.getElementById('u61');

var u164 = document.getElementById('u164');

var u95 = document.getElementById('u95');

var u132 = document.getElementById('u132');
gv_vAlignTable['u132'] = 'top';
var u327 = document.getElementById('u327');
gv_vAlignTable['u327'] = 'top';
var u146 = document.getElementById('u146');
gv_vAlignTable['u146'] = 'top';
var u52 = document.getElementById('u52');
gv_vAlignTable['u52'] = 'top';
var u119 = document.getElementById('u119');

var u274 = document.getElementById('u274');

var u277 = document.getElementById('u277');
gv_vAlignTable['u277'] = 'top';
var u47 = document.getElementById('u47');

var u212 = document.getElementById('u212');

var u190 = document.getElementById('u190');

var u226 = document.getElementById('u226');

var u145 = document.getElementById('u145');

var u118 = document.getElementById('u118');
gv_vAlignTable['u118'] = 'top';
var u32 = document.getElementById('u32');
gv_vAlignTable['u32'] = 'top';
var u131 = document.getElementById('u131');

var u276 = document.getElementById('u276');

var u89 = document.getElementById('u89');

var u249 = document.getElementById('u249');
gv_vAlignTable['u249'] = 'top';
var u211 = document.getElementById('u211');
gv_vAlignTable['u211'] = 'top';
var u130 = document.getElementById('u130');
gv_vAlignTable['u130'] = 'top';
var u85 = document.getElementById('u85');

var u22 = document.getElementById('u22');
gv_vAlignTable['u22'] = 'top';
var u144 = document.getElementById('u144');
gv_vAlignTable['u144'] = 'top';
var u261 = document.getElementById('u261');
gv_vAlignTable['u261'] = 'top';
var u43 = document.getElementById('u43');

var u275 = document.getElementById('u275');
gv_vAlignTable['u275'] = 'top';
var u260 = document.getElementById('u260');

var u17 = document.getElementById('u17');

var u248 = document.getElementById('u248');

var u210 = document.getElementById('u210');

var u107 = document.getElementById('u107');

var u44 = document.getElementById('u44');
gv_vAlignTable['u44'] = 'top';
var u30 = document.getElementById('u30');
gv_vAlignTable['u30'] = 'top';
var u224 = document.getElementById('u224');

var u143 = document.getElementById('u143');

var u341 = document.getElementById('u341');
gv_vAlignTable['u341'] = 'top';
var u72 = document.getElementById('u72');
gv_vAlignTable['u72'] = 'top';
var u9 = document.getElementById('u9');
gv_vAlignTable['u9'] = 'center';
var u157 = document.getElementById('u157');
gv_vAlignTable['u157'] = 'top';
var u59 = document.getElementById('u59');

var u189 = document.getElementById('u189');
gv_vAlignTable['u189'] = 'center';
var u35 = document.getElementById('u35');

var u91 = document.getElementById('u91');

var u328 = document.getElementById('u328');

var u106 = document.getElementById('u106');
gv_vAlignTable['u106'] = 'top';
var u223 = document.getElementById('u223');
gv_vAlignTable['u223'] = 'top';
var u142 = document.getElementById('u142');
gv_vAlignTable['u142'] = 'top';
var u86 = document.getElementById('u86');
gv_vAlignTable['u86'] = 'top';
var u265 = document.getElementById('u265');
gv_vAlignTable['u265'] = 'top';
var u340 = document.getElementById('u340');

var u237 = document.getElementById('u237');
gv_vAlignTable['u237'] = 'top';
var u156 = document.getElementById('u156');
gv_vAlignTable['u156'] = 'center';
var u188 = document.getElementById('u188');

var u273 = document.getElementById('u273');
gv_vAlignTable['u273'] = 'top';
var u53 = document.getElementById('u53');

var u105 = document.getElementById('u105');

var u222 = document.getElementById('u222');

var u311 = document.getElementById('u311');
gv_vAlignTable['u311'] = 'top';
var u6 = document.getElementById('u6');

var u29 = document.getElementById('u29');

var u155 = document.getElementById('u155');

var u209 = document.getElementById('u209');
gv_vAlignTable['u209'] = 'top';
var u272 = document.getElementById('u272');

var u336 = document.getElementById('u336');

var u104 = document.getElementById('u104');
gv_vAlignTable['u104'] = 'top';
var u308 = document.getElementById('u308');

var u259 = document.getElementById('u259');
gv_vAlignTable['u259'] = 'top';
var u221 = document.getElementById('u221');
gv_vAlignTable['u221'] = 'top';
var u235 = document.getElementById('u235');
gv_vAlignTable['u235'] = 'top';
var u75 = document.getElementById('u75');

var u13 = document.getElementById('u13');

var u208 = document.getElementById('u208');

var u271 = document.getElementById('u271');
gv_vAlignTable['u271'] = 'top';
var u74 = document.getElementById('u74');
gv_vAlignTable['u74'] = 'top';
var u103 = document.getElementById('u103');

var u339 = document.getElementById('u339');
gv_vAlignTable['u339'] = 'top';
var u158 = document.getElementById('u158');
gv_vAlignTable['u158'] = 'top';
var u220 = document.getElementById('u220');

var u3 = document.getElementById('u3');
gv_vAlignTable['u3'] = 'center';
var u117 = document.getElementById('u117');

var u31 = document.getElementById('u31');

var u234 = document.getElementById('u234');

var u73 = document.getElementById('u73');

var u270 = document.getElementById('u270');

var u28 = document.getElementById('u28');
gv_vAlignTable['u28'] = 'top';
var u199 = document.getElementById('u199');
gv_vAlignTable['u199'] = 'top';
var u92 = document.getElementById('u92');
gv_vAlignTable['u92'] = 'top';
var u102 = document.getElementById('u102');
gv_vAlignTable['u102'] = 'top';
var u56 = document.getElementById('u56');
gv_vAlignTable['u56'] = 'top';
var u300 = document.getElementById('u300');

var u116 = document.getElementById('u116');
gv_vAlignTable['u116'] = 'top';
var u186 = document.getElementById('u186');

var u233 = document.getElementById('u233');
gv_vAlignTable['u233'] = 'top';
var u87 = document.getElementById('u87');

var u247 = document.getElementById('u247');
gv_vAlignTable['u247'] = 'top';
var u68 = document.getElementById('u68');
gv_vAlignTable['u68'] = 'top';
var u198 = document.getElementById('u198');

var u101 = document.getElementById('u101');

var u0 = document.getElementById('u0');

var u338 = document.getElementById('u338');

var u115 = document.getElementById('u115');

var u313 = document.getElementById('u313');
gv_vAlignTable['u313'] = 'top';
var u232 = document.getElementById('u232');

var u7 = document.getElementById('u7');
gv_vAlignTable['u7'] = 'center';
var u246 = document.getElementById('u246');

var u62 = document.getElementById('u62');
gv_vAlignTable['u62'] = 'top';
var u219 = document.getElementById('u219');
gv_vAlignTable['u219'] = 'top';
var u114 = document.getElementById('u114');
gv_vAlignTable['u114'] = 'top';
var u57 = document.getElementById('u57');

var u312 = document.getElementById('u312');

var u290 = document.getElementById('u290');

var u187 = document.getElementById('u187');
gv_vAlignTable['u187'] = 'center';
var u38 = document.getElementById('u38');
gv_vAlignTable['u38'] = 'top';
var u70 = document.getElementById('u70');
gv_vAlignTable['u70'] = 'top';
var u14 = document.getElementById('u14');
gv_vAlignTable['u14'] = 'top';
var u218 = document.getElementById('u218');

var u98 = document.getElementById('u98');
gv_vAlignTable['u98'] = 'top';
var u262 = document.getElementById('u262');

var u99 = document.getElementById('u99');

var u286 = document.getElementById('u286');

var u168 = document.getElementById('u168');

var u230 = document.getElementById('u230');

u230.style.cursor = 'pointer';
if (bIE) u230.attachEvent("onclick", Clicku230);
else u230.addEventListener("click", Clicku230, true);
function Clicku230(e)
{
windowEvent = e;


if (true) {

	NewTab("空白行程单申请.html" + GetQuerystring(), "");

}

}

var u127 = document.getElementById('u127');

var u325 = document.getElementById('u325');
gv_vAlignTable['u325'] = 'top';
var u244 = document.getElementById('u244');

var u27 = document.getElementById('u27');

var u83 = document.getElementById('u83');

var u310 = document.getElementById('u310');

var u179 = document.getElementById('u179');

var u185 = document.getElementById('u185');
gv_vAlignTable['u185'] = 'center';
var u40 = document.getElementById('u40');
gv_vAlignTable['u40'] = 'top';
var u324 = document.getElementById('u324');

var u243 = document.getElementById('u243');
gv_vAlignTable['u243'] = 'top';
var u257 = document.getElementById('u257');
gv_vAlignTable['u257'] = 'top';
var u69 = document.getElementById('u69');

var u289 = document.getElementById('u289');
gv_vAlignTable['u289'] = 'top';
var u45 = document.getElementById('u45');

var u206 = document.getElementById('u206');

var u184 = document.getElementById('u184');

var u323 = document.getElementById('u323');
gv_vAlignTable['u323'] = 'top';
var u242 = document.getElementById('u242');

var u96 = document.getElementById('u96');
gv_vAlignTable['u96'] = 'top';
var u291 = document.getElementById('u291');
gv_vAlignTable['u291'] = 'top';
var u337 = document.getElementById('u337');
gv_vAlignTable['u337'] = 'top';
var u256 = document.getElementById('u256');

var u288 = document.getElementById('u288');

var u129 = document.getElementById('u129');

var u174 = document.getElementById('u174');

var u205 = document.getElementById('u205');
gv_vAlignTable['u205'] = 'top';
var u183 = document.getElementById('u183');
gv_vAlignTable['u183'] = 'center';
var u10 = document.getElementById('u10');

var u322 = document.getElementById('u322');

var u141 = document.getElementById('u141');

var u197 = document.getElementById('u197');
gv_vAlignTable['u197'] = 'top';
var u39 = document.getElementById('u39');

var u255 = document.getElementById('u255');
gv_vAlignTable['u255'] = 'top';
var u15 = document.getElementById('u15');

var u128 = document.getElementById('u128');
gv_vAlignTable['u128'] = 'top';
var u204 = document.getElementById('u204');

var u182 = document.getElementById('u182');

var u66 = document.getElementById('u66');
gv_vAlignTable['u66'] = 'top';
var u125 = document.getElementById('u125');

var u178 = document.getElementById('u178');
gv_vAlignTable['u178'] = 'top';
var u140 = document.getElementById('u140');
gv_vAlignTable['u140'] = 'top';
var u196 = document.getElementById('u196');

var u245 = document.getElementById('u245');
gv_vAlignTable['u245'] = 'top';
var u335 = document.getElementById('u335');
gv_vAlignTable['u335'] = 'top';
var u23 = document.getElementById('u23');

var u154 = document.getElementById('u154');
gv_vAlignTable['u154'] = 'top';
var u264 = document.getElementById('u264');

var u203 = document.getElementById('u203');
gv_vAlignTable['u203'] = 'top';
var u181 = document.getElementById('u181');

var u84 = document.getElementById('u84');
gv_vAlignTable['u84'] = 'top';
var u258 = document.getElementById('u258');

var u320 = document.getElementById('u320');

var u4 = document.getElementById('u4');

var u217 = document.getElementById('u217');
gv_vAlignTable['u217'] = 'top';
var u195 = document.getElementById('u195');
gv_vAlignTable['u195'] = 'top';
var u225 = document.getElementById('u225');
gv_vAlignTable['u225'] = 'top';
var u41 = document.getElementById('u41');

var u334 = document.getElementById('u334');

var u153 = document.getElementById('u153');

if (window.OnLoad) OnLoad();
