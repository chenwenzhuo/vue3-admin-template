import {reactive} from 'vue'
import {defineStore} from 'pinia'

import {reqLogin, reqUserInfo} from "@/api/user";
import type {loginForm, loginResponseData} from "@/api/user/types";
import type {UserState} from "@/stores/modules/types";
import {routesConfig} from "@/router/routes";

//用户相关二级仓库
export const useUserStore = defineStore('User', () => {
    let userState = reactive<UserState>({
        token: localStorage.getItem('TOKEN'),//用户唯一标识token
        menuRoutes: routesConfig,
        username: '',
        avatar: ''
    });

    async function userLogin(data: loginForm) {
        console.log(data);
        const result: loginResponseData = await reqLogin(data);
        //登录成功：200->token
        //登录失败：201->错误信息
        if (result.code === 200) {
            //存储用户token
            userState.token = (result.data.token as string);//存储在pinia中
            //存储在本地持久化存储中，防止刷新页面token丢失
            localStorage.setItem('TOKEN', (result.data.token as string));
            //返回一个成功的Promise
            return 'ok';
        } else {
            //返回一个失败的Promise
            return Promise.reject(new Error(result.data.message));
        }
    }

    //获取用户信息并存储
    async function userInfo() {
        const result: any = await reqUserInfo();
        if (result.code === 200) {
            userState.username = result.data.checkUser.username;
            userState.avatar = result.data.checkUser.avatar;
            return 'ok';
        } else {
            //返回一个失败的Promise
            return Promise.reject(new Error('获取用户信息失败'));
        }
    }

    //退出登录
    function userLogout() {
        userState.token = '';
        userState.username = '';
        userState.avatar = '';
        //清除localStorage中Token
        localStorage.removeItem('TOKEN');
    }

    return {userState, userLogin, userInfo, userLogout}
});
