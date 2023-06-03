//路由配置
export const routesConfig = [{
    //登录
    path: '/login',
    component: () => import((`@/views/login/index.vue`)),
    name: 'login'
}, {
    //登录成功后数据展示路由
    path: '/',
    component: () => import((`@/views/home/index.vue`)),
    name: 'home'
}, {
    path: '/404',
    component: () => import((`@/views/404/index.vue`)),
    name: '404'
}, {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any'
}];
