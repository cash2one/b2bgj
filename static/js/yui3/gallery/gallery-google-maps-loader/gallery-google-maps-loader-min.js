YUI.add("gallery-google-maps-loader",function(a){(function(f,e){var d=f.Base,b=f.Lang.isArray,c=f.QueryString.stringify;f.GoogleMapsLoader=d.create(e,d,[],{initializer:function(){var g=this;g.publish("failure");g.publish("success",{fireOnce:true});g.publish("timeout");},load:function(j){j=j||{};var i=this,g=j.libraries,k=j.timeout||i.get("timeout"),h=j.source||i.get("source");if(i.get("loaded")){return i;}if(b(g)){j.libraries=g.join(",");}j.sensor=j.sensor?"true":"false";j.v=j.v||j.version;delete j.callback;delete j.source;delete j.timeout;delete j.version;if(h.indexOf("?")===-1){h+="?";}f.jsonp(h+c(j)+"&callback={callback}",{on:{failure:function(){i.fire("failure");},success:function(){i._set("loaded",true);i.fire("success");},timeout:function(){i.fire("timeout");}},timeout:k});return i;}},{ATTRS:{loaded:{readOnly:true,value:false},source:{value:"http://maps.google.com/maps/api/js"},timeout:{value:30000}}});}(a,arguments[1]));},"gallery-2012.09.05-20-01",{requires:["base","jsonp","querystring-stringify"],skinnable:false});