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
    path: '/account',
    meta: {
        title: '个人中心'
    },
    component: (resolve) => require(['./views/account.vue'], resolve)
}, {
    path: '/about',
    meta: {
        title: '关于'
    },
    component: (resolve) => require(['./views/about.vue'], resolve)
}];
export default routers;