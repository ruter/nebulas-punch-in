webpackJsonp([2],{319:function(t,e,a){"use strict";function n(t){i||a(334)}Object.defineProperty(e,"__esModule",{value:!0});var r=a(325),s=a(335),i=!1,o=a(132),l=n,c=o(r.a,s.a,!1,l,"data-v-5e365a83",null);c.options.__file="src/views/account.vue",e.default=c.exports},321:function(t,e,a){t.exports=a.p+"01eb94657865be099be99035047937f1.png"},325:function(t,e,a){"use strict";var n=a(133),r=a(64),s=a(134),i=(a.n(s),a(65)),o=(a.n(i),"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t}),l=new r.a;e.a={data:function(){var t=this;return{page:1,total:0,limit:10,taskCol:[{title:"ID",key:"hash",render:function(t,e){return t("router-link",{props:{to:"/detail/"+e.row.hash}},e.row.hash)}},{title:"目标",key:"name"},{title:"创建时间",key:"datetime",width:200,render:function(t,e){return t("div",n.a.dateFmt(e.row.datetime))}},{title:"激励金",key:"deposit",width:400,render:function(t,e){var a=e.row.deposit;return t("div",a+" Wei（"+s.Unit.fromBasic(a)+"NAS）")}},{title:"打卡时长",key:"cycle",width:100,render:function(t,e){return t("div",e.row.cycle+" 天")}},{title:"当前进度",key:"days",width:100,render:function(t,e){return t("div",e.row.days+" 天")}},{title:"目标状态",key:"state",width:150,align:"center",render:function(e,a){return e("p",{class:{state0:0===a.row.state,state1:1===a.row.state,"state-1":-1===a.row.state},style:{"margin-top":0}},t.state[a.row.state])}}],taskData:[],state:{"-1":"已失败",0:"进行中",1:"已完成"},address:"",loading:!0,timeoutObj:null,noData:!1,rewardValue:"",balance:"",reward:"",transferLimit:"",transferAmount:""}},filters:{dateFmt:function(t){if(t){var e="object"!==(void 0===t?"undefined":o(t))?new Date(t):t,a={year:e.getFullYear(),month:e.getMonth()<9?"0"+(e.getMonth()+1):e.getMonth()+1,day:e.getDate()<10?"0"+e.getDate():e.getDate(),hour:e.getHours()<10?"0"+e.getHours():e.getHours(),min:e.getMinutes()<10?"0"+e.getMinutes():e.getMinutes(),sec:e.getSeconds()<10?"0"+e.getSeconds():e.getSeconds()};return a.year+"年"+a.month+"月"+a.day+"日"}return"未知"},nasFromBasic:function(t){return t?s.Unit.fromBasic(t):0}},watch:{address:function(){this.startApp()}},created:function(){var t=this;n.a.noWallet?(this.loading=!1,this.showError()):(this.timeoutObj=setTimeout(function(){t.loading=!1,t.showWarning()},5e3),n.a.getAccount(this))},methods:{startApp:function(){clearTimeout(this.timeoutObj),this.getTasksByOwner(),this.getUserReward(),this.getTransferLimit()},showError:function(){this.$Modal.warning(n.a.PocketErr)},showWarning:function(){this.$Modal.warning(n.a.WalletWarning)},setTransferTime:function(){localStorage.setItem("nasTransfer",Date.now())},getTransferOk:function(){var t=Date.now(),e=localStorage.getItem("nasTransfer");return!e||t-e>=18e5&&(localStorage.removeItem("nasTransfer"),!0)},getTasksByOwner:function(){var t=this,e=n.a.getContractAddress(),a=n.a.toSting([this.page,this.limit]);l.simulateCall(e,"0","getTasksByOwner",a,{listener:function(e){if(e.execute_err)"contract check failed"==e.execute_err&&t.$Modal.error({title:"网络错误",content:"请确认钱包插件网络为「Mainnet」，切换后刷新重试"}),t.noData=!0;else{var a=n.a.parse(e.result);a&&a.tasks.length?(t.taskData=a.tasks,t.total=a.total,t.limit=a.limit):t.noData=!0}t.loading=!1}})},getTransferLimit:function(){var t=this,e=n.a.getContractAddress();l.simulateCall(e,"0","getTransferLimit","[]",{listener:function(e){t.transferLimit=n.a.parse(e.result)}})},getUserReward:function(){var t=this,e=n.a.getContractAddress();l.simulateCall(e,"0","getBalance","[]",{listener:function(e){var a=n.a.parse(e.result);t.balance=a.balance,t.reward=a.reward}})},handlePageChange:function(t){this.loading=!0,this.page=t,this.getTasksByOwner()},handleTransferClick:function(){var t=this;if(!this.getTransferOk())return void this.$Modal.error({title:"无法转出",content:"激励金的转出时间间隔不能小于 30 分钟"});var e=n.a.getContractAddress(),a=this.transferAmount,r=s.Unit.toBasic(a),i=this.transferLimit,o=this.reward,c=n.a.toSting([r]);return a&&r.gt(i)?r.gt(o)?void this.$Modal.error({title:"数额错误",content:"转出数额不能大于可转出金额 "+o+" Wei（"+s.Unit.fromBasic(o)+" NAS）"}):(this.loading=!0,void l.call(e,"0","transfer",c,{listener:function(e){if(e.execute_err)t.$Modal.error({title:"转出失败",content:"余额不足，无法转出"});else{t.setTransferTime();var a=n.a.parse(e.result);t.balance=a.balance,t.reward=a.reward,t.$Modal.success({title:"转出成功",content:"代币已转出，请稍候查看钱包交易记录"})}t.loading=!1}})):void this.$Modal.warning({title:"数额错误",content:"转出数额必须大于 "+i+" Wei（"+s.Unit.fromBasic(i)+" NAS）"})}}}},334:function(t,e){},335:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"index"},[n("Tabs",[n("TabPane",{attrs:{label:"历史打卡",icon:"ios-timer"}},[n("Row",{attrs:{type:"flex",justify:"center",align:"middle"}},[t.noData?n("Col",{staticStyle:{"text-align":"center"},attrs:{span:"12"}},[n("div",{staticStyle:{"text-align":"center"}},[n("h1",[n("img",{attrs:{src:a(321),alt:""}})]),t._v(" "),n("h2",{staticClass:"mb32"},[t._v("\n                            你还没有任何打卡目标，快来创建一个打卡，向目标迈进吧~\n                        ")]),t._v(" "),n("router-link",{attrs:{to:"/create"}},[n("Button",{attrs:{type:"primary",size:"large",icon:"planet"}},[n("span",[t._v("新建打卡")])])],1)],1)]):n("Col",{staticStyle:{"text-align":"center"},attrs:{span:"20"}},[n("Table",{attrs:{data:t.taskData,columns:t.taskCol,stripe:""}}),t._v(" "),n("div",{staticStyle:{margin:"10px",overflow:"hidden"}},[n("div",{staticStyle:{float:"right"}},[n("Page",{attrs:{total:t.total,current:t.page,"page-size":t.limit},on:{change:t.handlePageChange}})],1)])],1)],1)],1),t._v(" "),n("TabPane",{attrs:{label:"我的激励金",icon:"social-usd"}},[n("Row",{attrs:{type:"flex",justify:"center",align:"middle"}},[n("Col",{staticStyle:{"text-align":"center"},attrs:{span:"20"}},[n("h2",[n("span",[n("Icon",{attrs:{type:"ios-infinite"}}),t._v("\n                            激励金额: "+t._s(t.balance)+" Wei（"+t._s(t._f("nasFromBasic")(t.balance))+" NAS）\n                            可转出金额："+t._s(t.reward)+" Wei（"+t._s(t._f("nasFromBasic")(t.reward))+" NAS）\n                        ")],1),t._v(" "),n("span",[n("Icon",{attrs:{type:"cash"}}),t._v("钱包地址："+t._s(t.address))],1)]),t._v(" "),n("hr")])],1),t._v(" "),n("p",{staticClass:"pet-mb-32",staticStyle:{"text-align":"center"}},[t._v("\n                * 转出的激励金数值应大于 "+t._s(t.transferLimit)+" Wei（"+t._s(t._f("nasFromBasic")(t.transferLimit))+" NAS）\n            ")]),t._v(" "),n("Row",{attrs:{type:"flex",justify:"center",align:"middle"}},[n("Col",{staticStyle:{"text-align":"center"},attrs:{span:"8"}},[n("Input",{attrs:{size:"large",placeholder:"请输入要转出的激励金额..."},model:{value:t.transferAmount,callback:function(e){t.transferAmount=e},expression:"transferAmount"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[n("Icon",{attrs:{type:"ios-nutrition"}})],1),t._v(" "),n("span",{attrs:{slot:"append"},slot:"append"},[t._v("NAS")])]),t._v(" "),n("p",{directives:[{name:"show",rawName:"v-show",value:t.transferAmount>0,expression:"transferAmount > 0"}]},[t._v("\n                    "+t._s(t.transferAmount)+" Wei ≈ "+t._s(t._f("nasFromBasic")(t.transferAmount))+" NAS\n                ")]),t._v(" "),n("Button",{staticClass:"pet-mt-16",attrs:{type:"primary",size:"large"},on:{click:t.handleTransferClick}},[t._v("转出")])],1)],1)],1)],1),t._v(" "),t.loading?n("Spin",{attrs:{size:"large",fix:""}}):t._e()],1)},r=[];n._withStripped=!0;var s={render:n,staticRenderFns:r};e.a=s}});