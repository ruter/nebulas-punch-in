webpackJsonp([3],{316:function(t,a,e){"use strict";function s(t){r||e(327)}Object.defineProperty(a,"__esModule",{value:!0});var n=e(322),i=e(328),r=!1,o=e(132),l=s,c=o(n.a,i.a,!1,l,"data-v-a83bd3b0",null);c.options.__file="src/views/index.vue",a.default=c.exports},322:function(t,a,e){"use strict";var s=e(133),n=e(64),i=e(134),r=(e.n(i),"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t}),o=new n.a;a.a={data:function(){return{address:"",tasks:[],state:{"-1":"未完成",0:"未打卡",1:"已打卡"},taskHash:"",loading:!0,timeoutObj:null}},filters:{dateInterval:function(t,a){if(t){var e="object"!==(void 0===t?"undefined":r(t))?new Date(t):t,n=new Date(e.getTime()+864e5*(a-1)),i=s.a.dateSep(e),o=s.a.dateSep(n);return i.year+"."+i.month+"."+i.day+" ~ "+o.year+"."+o.month+"."+o.day}return"未知时间"},dateDelta:function(t){return t?s.a.dateDelta(t):"?"}},watch:{address:function(){this.startApp()}},created:function(){var t=this;s.a.noWallet?(this.loading=!1,this.showError()):(this.timeoutObj=setTimeout(function(){t.loading=!1,t.showWarning()},5e3),s.a.getAccount(this))},methods:{startApp:function(){clearTimeout(this.timeoutObj),this.getValidTasks()},showError:function(){this.$Modal.warning(s.a.PocketErr)},showWarning:function(){this.$Modal.warning(s.a.WalletWarning)},getValidTasks:function(){var t=this,a=s.a.getContractAddress();o.simulateCall(a,"0","getValidTasks","[]",{listener:function(a){var e=s.a.parse(a.result);t.tasks=e.filter(function(t){return-1!==t.state&&s.a.dateDelta(t.datetime)<=t.cycle}),t.loading=!1}})},handleTaskClick:function(t){this.loading=!0,this.$router.push("/detail/"+t)},handleSearchClick:function(){this.loading=!0,this.$router.push("/detail/"+this.taskHash)},handlePunchClick:function(t){var a=this,e=this.tasks[t],n=e.hash;if(1===e.state)return void this.$Modal.info({title:"已打卡",content:"今日已打卡，无需重复操作"});this.loading=!0;var i=s.a.getContractAddress(),l=s.a.toSting([n]);o.call(i,"0","punch",l,{listener:function(s){e.state=1,a.tasks.splice(t,1,e),"object"===(void 0===s?"undefined":r(s))?a.$Modal.success({title:"打卡成功",content:"今日目标「"+e.name+"」已完成，奖励一下自己吧"}):a.$Modal.error({title:"创建失败",content:"交易被取消，打卡失败"}),a.loading=!1}})}}}},327:function(t,a){},328:function(t,a,e){"use strict";var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"index"},[e("Row",{attrs:{type:"flex",justify:"center",align:"middle"}},[e("Col",{attrs:{span:"12"}},[e("div",{staticClass:"mb32",staticStyle:{"text-align":"center"}},[e("Input",{attrs:{placeholder:"请输入要查找的打卡目标唯一 ID..."},model:{value:t.taskHash,callback:function(a){t.taskHash=a},expression:"taskHash"}},[e("Button",{attrs:{slot:"append",icon:"ios-search"},nativeOn:{click:function(a){return t.handleSearchClick(a)}},slot:"append"})],1)],1)])],1),t._v(" "),e("Row",{staticClass:"mb32",attrs:{type:"flex",justify:"center",align:"middle"}},[t._l(t.tasks,function(a,s){return e("Col",{key:a.hash,staticClass:"mr8",attrs:{span:"6"}},[e("Card",{staticClass:"text-center card-task",staticStyle:{cursor:"pointer"},nativeOn:{click:function(e){t.handleTaskClick(a.hash)}}},[e("div",{class:"gradient-"+s+" card-header"},[e("h1",[t._v("第 "+t._s(t._f("dateDelta")(a.datetime))+" 天")])]),t._v(" "),e("div",{staticClass:"card-body"},[e("h2",[t._v(t._s(a.name))]),t._v(" "),e("p",{staticClass:"ellip mt8"},[t._v(t._s(a.desc))]),t._v(" "),e("p",{staticClass:"mt8"},[t._v(t._s(t._f("dateInterval")(a.datetime,a.cycle)))]),t._v(" "),e("p",{class:"state"+a.state},[t._v(t._s(t.state[a.state]))])]),t._v(" "),e("div",{staticClass:"card-footer"},[e("Button",{attrs:{type:"ghost",shape:"circle",icon:"checkmark-round",size:"large"},on:{click:function(a){a.stopPropagation(),t.handlePunchClick(s)}}})],1)])],1)}),t._v(" "),t._l(3-t.tasks.length,function(t){return e("Col",{key:t,staticClass:"mr8",attrs:{span:"6"}},[e("router-link",{attrs:{to:"/create"}},[e("Button",{staticClass:"task-create",attrs:{type:"ghost",icon:"plus-circled",size:"large"}})],1)],1)})],2),t._v(" "),t.loading?e("Spin",{attrs:{size:"large",fix:""}}):t._e()],1)},n=[];s._withStripped=!0;var i={render:s,staticRenderFns:n};a.a=i}});