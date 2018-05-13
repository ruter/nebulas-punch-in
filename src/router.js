const routers = [{
    path: '/',
    meta: {
        title: '我的打卡'
    },
    component: (resolve) => require(['./views/index.vue'], resolve)
}, {
    path: '/create',
    meta: {
        title: '新建打卡'
    },
    component: (resolve) => require(['./views/create.vue'], resolve)
}, {
    path: '/detail/:hash',
    meta: {
        title: '打卡详情'
    },
    component: (resolve) => require(['./views/detail.vue'], resolve)
}, {
    path: '/claim',
    meta: {
        title: '我的激励金'
    },
    component: (resolve) => require(['./views/claim.vue'], resolve)
}];
export default routers;