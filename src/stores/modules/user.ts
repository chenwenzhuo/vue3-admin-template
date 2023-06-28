import {reactive} from 'vue'
import {defineStore} from 'pinia'
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep';

import {reqLogin, reqUserInfo, reqLogout} from "@/api/user";
import type {loginFormData, loginResponseData, userInfoResponseData} from "@/api/user/types";
import type {UserState} from "@/stores/modules/types";
import {anyRoute, asyncRoute, routesConfig} from "@/router/routes";
import router from '@/router';

//用户相关二级仓库
export const useUserStore = defineStore('User', () => {
    let userState = reactive<UserState>({
        token: localStorage.getItem('TOKEN'),//用户唯一标识token
        menuRoutes: routesConfig,
        username: '',
        avatar: '',
        buttons:[],
    });

    async function userLogin(data: loginFormData) {
        const result: loginResponseData = await reqLogin(data);
        //登录成功：200->token
        //登录失败：201->错误信息
        if (result.code === 200) {
            //存储用户token
            userState.token = (result.data as string);//存储在pinia中
            //存储在本地持久化存储中，防止刷新页面token丢失
            localStorage.setItem('TOKEN', (result.data as string));
            //返回一个成功的Promise
            return 'ok';
        } else {
            //返回一个失败的Promise
            return Promise.reject(new Error(result.data));
        }
    }

    //获取用户信息并存储
    async function userInfo() {
        const result: userInfoResponseData = await reqUserInfo();
        if (result.code === 200) {
            userState.username = result.data.name;
            userState.avatar = result.data.avatar;
            userState.buttons = result.data.buttons;
            //筛选当前用户可访问的异步路由。需要修改asyncRoute对象，所以传入其深拷贝
            const userAsyncRoute = filterAsyncRoutes(cloneDeep(asyncRoute), result.data.routes);
            userState.menuRoutes[1].children.push(...userAsyncRoute);
            //将异步路由注册到路由器中（添加为admin的子路由）
            userAsyncRoute.forEach(item => router.addRoute('admin', item));
            //将任意路由也作为动态路由添加，否则在异步路由界面进行刷新时会重定向到404界面
            //因为路由匹配发生在动态路由挂载前，此时异步路由路径不存在，所以会重定向到404界面
            router.addRoute(anyRoute);
            return 'ok';
        } else {
            //返回一个失败的Promise
            return Promise.reject(new Error(result.message));
        }
    }

    //退出登录
    async function userLogout() {
        const result: any = await reqLogout();
        if (result.code === 200) {
            userState.token = '';
            userState.username = '';
            userState.avatar = '';
            //清除localStorage中Token
            localStorage.removeItem('TOKEN');
            return 'ok';
        } else {
            return Promise.reject(new Error(result.message));
        }
    }

    //筛选异步路由
    function filterAsyncRoutes(asyncRoute: any[], routes: any[]) {
        return asyncRoute.filter(item => {
            //当前异步路由item在可访问的路由列表中，返回true，否则返回false
            if (routes.includes(item.name)) {
                //当前路由有子路由，递归筛选
                if (!!item.children && item.children.length > 0)
                    item.children = filterAsyncRoutes(item.children, routes);
                return true;
            }
            return false;
        });
    }

    return {userState, userLogin, userInfo, userLogout}
});
