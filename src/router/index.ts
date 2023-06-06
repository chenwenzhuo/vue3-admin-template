import {createRouter, createWebHashHistory} from 'vue-router'
import {routesConfig} from './routes'
// @ts-ignore
import nprogress from "nprogress";
import 'nprogress/nprogress.css'
import pinia from "@/stores";
import {useUserStore} from "@/stores/modules/user";
import {useSysSettingsStore} from "@/stores/modules/settings";

//组件外访问仓库，必须传入顶层仓库对象
const userStore = useUserStore(pinia);
const settingsStore = useSysSettingsStore(pinia);
nprogress.configure({showSpinner: false});

const router = createRouter({
    history: createWebHashHistory(),
    routes: routesConfig,
    //路由切换时的页面滚动行为
    scrollBehavior() {
        return {left: 0, top: 0}
    }
});

//通过全局前置路由守卫进行路由鉴权
//1.任意路由切换实现进度条业务 ---nprogress
//2.路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[指向首页],其余的路由可以访问

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    //访问任意路由前都会执行
    nprogress.start();//开始展示进度条
    //修改页面标题
    document.title = `${settingsStore.title}-${to.meta.title}`;

    const token = userStore.userState.token;//获取用户token
    const username = userStore.userState.username;//获取用户名
    if (token) {//已登录
        //登录成功,访问login,不能访问,指向首页
        if (to.path === "/login") {
            next({path: "/"});
            return;
        }
        //登录成功访问其余六个路由(登录排除)
        if (username) {//有用户信息
            //放行
            next();
        } else {//如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
            try {
                await userStore.userInfo();//获取用户信息
                //放行
                //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
                next({...to});
            } catch (error) {
                //token过期:获取不到用户信息了
                //用户手动修改本地存储token
                //退出登录->用户相关的数据清空
                await userStore.userLogout();
                next({path: "/login", query: {redirect: to.path}});
            }
        }
        next();
    } else {//未登录
        if (to.path === '/login') {
            next();//访问登录页，直接放行
        } else {
            //访问其他页面，重定向到登录页
            //将尝试访问的页面路径以参数形式保存，登录后直接跳转
            next({path: '/login', query: {redirect: to.path}});
        }
    }
});

//全局后置守卫
router.afterEach(async (to: any, from: any) => {
    //访问任意路由后执行
    nprogress.done();//隐藏进度条
});

export default router
