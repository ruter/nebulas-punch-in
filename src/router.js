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
    path: '/detail/:id',
    meta: {
        title: '打卡详情'
    },
    component: (resolve) => require(['./views/detail.vue'], resolve)
}];
export default routers;