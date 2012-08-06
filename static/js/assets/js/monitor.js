/**
 * @fileOverview 旅行用户点击监测埋点(基于黄金令箭)
 * @author shuke.cl@taobao.com
 * version 1.0
 */
YUI.namespace('Y.TripMonitor');
YUI.add('trip-monitor' , function (Y){
    Y.TripMonitor = (function (){
        var monitorNode = null ,doc = document ;
        /**
        * @name Y.TripMonitor.goldArrow
        * @function
        * @param ｛String｝［point］埋点内容(从黄金令箭系统获取对应埋点)
        * @description 旅行用户点击监测埋点方法
        */
        function goldArrow(point){
            var t ;
            if (!point) {
                return;
            }
            monitorNode =  monitorNode || doc.createElement('img');
            t = String(new Date().getTime());
            //BI要求catche推荐7位
            t = t.substr(t.length-7 , 7);
            monitorNode.src = 'http://www.atpanel.com/' + point + '?cache=' + t;
        }
        return {
            goldArrow : goldArrow
        };
    })();
},'0.1');
