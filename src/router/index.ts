import {createRouter, createWebHashHistory} from 'vue-router'
import {routesConfig} from './routes'
// @ts-ignore
import nprogress from "nprogress";
import 'nprogress/nprogress.css'

const router = createRouter({
    history: createWebHashHistory(),
    routes: routesConfig,
    //路由切换时的页面滚动行为
    scrollBehavior() {
        return {left: 0, top: 0}
    }
});

//通过全局前置路由守卫进行路由鉴权
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    //访问任意路由前都会执行
    nprogress.start();//开始展示进度条
    next();
});

//全局后置守卫
router.afterEach(async (to: any, from: any) => {
    //访问任意路由后执行
    nprogress.done();//隐藏进度条
});

export default router
