(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/editRoute/modify_routeInformation/modify_routeInformation"],{"0df7":function(t,e,o){"use strict";(function(t){o("6954"),o("921b");n(o("66fd"));var e=n(o("59b6"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,o("6e42")["createPage"])},"3b8e":function(t,e,o){"use strict";var n,r=function(){var t=this,e=t.$createElement;t._self._c},a=[];o.d(e,"b",function(){return r}),o.d(e,"c",function(){return a}),o.d(e,"a",function(){return n})},"46e9":function(t,e,o){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=function(){return Promise.all([o.e("common/vendor"),o.e("components/QS-inputs-split/elements/QS-input/index")]).then(o.bind(null,"9069"))},r=function(){return Promise.all([o.e("common/vendor"),o.e("components/QS-inputs-split/elements/QS-picker-date/index")]).then(o.bind(null,"7bdb"))},a=function(){return Promise.all([o.e("common/vendor"),o.e("components/QS-inputs-split/elements/QS-infinitePics/index")]).then(o.bind(null,"f133"))},i={data:function(){return{routeName_before:"",routeId:"",userInfomation:"",userRoute:"",routeInfomation:"",routeStartTime:"",routeEndTime:"",backgroundImg:"",isChooseOver:!1,startDataSet:{},endDataSet:{}}},methods:{onLoad:function(e){this.routeId=e.routeId,this.userInfomation=t.getStorageSync("currentUser"),this.userRoute=t.getStorageSync(this.userInfomation.userName+"_route"),this.routeInfomation=this.userRoute[this.routeId],this.routeStartTime=this.routeInfomation.routeStartTime.replace(/-/g,"/"),this.routeEndTime=this.routeInfomation.routeEndTime.replace(/-/g,"/"),this.startDataSet={startYear:(new Date).getFullYear()-20,endYear:(new Date).getFullYear()+20,defaultValue:this.routeStartTime},this.endDataSet={startYear:(new Date).getFullYear()-20,endYear:(new Date).getFullYear()+20,defaultValue:this.routeEndTime}},save:function(){var e=this;if(!this.isChooseOver){"string"!=typeof this.routeInfomation.routeStartTime&&(this.routeInfomation.routeStartTime=this.get_specialFormat(this.routeInfomation.routeStartTime.data)),"string"!=typeof this.routeInfomation.routeEndTime&&(this.routeInfomation.routeEndTime=this.get_specialFormat(this.routeInfomation.routeEndTime.data));var o=this.check_date(this.routeInfomation.routeStartTime,this.routeInfomation.routeEndTime),n=this.dateSpace(this.routeInfomation.routeStartTime,this.routeInfomation.routeEndTime);this.routeInfomation.routeDay;switch(o){case"true-true":case"true-false":return void t.showModal({title:"提示",content:"结束日期应大于或等于开始日期",showCancel:!1});case"false-true":return void t.showModal({title:"提示",content:"改动后的天数小于行程天数，这将删除多余安排，确定这样操作吗",showCancel:!0,success:function(t){t.confirm&&(e.routeInfomation.route.splice(n,e.routeInfomation.route.length-n),e.isChooseOver=!0,e.save())}});case"false-false":for(var r=[],a=0;a<n;a++)"object"==typeof this.routeInfomation.route[a]?r[a]=this.routeInfomation.route[a]:r[a]=[];this.routeInfomation.route=r;break}this.isChooseOver=!1}if(this.routeInfomation.routeDay=this.dateSpace(this.routeInfomation.routeStartTime,this.routeInfomation.routeEndTime),""==this.backgroundImg){this.userRoute[this.routeId]=this.routeInfomation,t.setStorageSync(this.userInfomation.userName+"_route",this.userRoute);t.getStorageSync(this.userInfomation.userName+"_route");t.navigateBack()}else t.saveFile({tempFilePath:this.backgroundImg[0].path,success:function(o){e.routeInfomation.routeImg=o.savedFilePath,e.userRoute[e.routeId]=e.routeInfomation,t.setStorageSync(e.userInfomation.userName+"_route",e.userRoute),t.navigateBack()},fail:function(e){t.showToast({title:"图片保存失败",icon:"none"})}})},get_specialFormat:function(t){var e=t.split("/"),o=new Date(parseInt(e[0]),parseInt(e[1])-1,parseInt(e[2])),n=o.getFullYear(),r=o.getMonth()+1<10?"0"+(o.getMonth()+1):o.getMonth()+1,a=o.getDate()<10?"0"+o.getDate():o.getDate();return n+"-"+r+"-"+a},check_date:function(t,e){var o,n,r=new Date(t),a=new Date(e),i=this.dateSpace(t,e);return o=r.getTime()>a.getTime(),n=i<this.routeInfomation.routeDay,o+"-"+n},dateSpace:function(t,e){var o,n;return t=Date.parse(t),e=Date.parse(e),o=e-t,o=Math.abs(o),n=Math.floor(o/864e5),n+1}},components:{QSInput:n,QSPickerDate:r,QSInfinitePics:a}};e.default=i}).call(this,o("6e42")["default"])},"59b6":function(t,e,o){"use strict";o.r(e);var n=o("3b8e"),r=o("7ca9");for(var a in r)"default"!==a&&function(t){o.d(e,t,function(){return r[t]})}(a);var i,u=o("f0c5"),s=Object(u["a"])(r["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],i);e["default"]=s.exports},"7ca9":function(t,e,o){"use strict";o.r(e);var n=o("46e9"),r=o.n(n);for(var a in n)"default"!==a&&function(t){o.d(e,t,function(){return n[t]})}(a);e["default"]=r.a}},[["0df7","common/runtime","common/vendor"]]]);