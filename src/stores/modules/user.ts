import {reactive} from 'vue'
import {defineStore} from 'pinia'

import {reqLogin, reqUserInfo, reqLogout} from "@/api/user";
import type {loginFormData, loginResponseData, userInfoResponseData} from "@/api/user/types";
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

    async function userLogin(data: loginFormData) {
        const result: loginResponseData = await reqLogin(data);
        console.log('login result---------', result);
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
        console.log('userInfo result---------', result);
        if (result.code === 200) {
            userState.username = result.data.name;
            userState.avatar = result.data.avatar;
            return 'ok';
        } else {
            //返回一个失败的Promise
            return Promise.reject(new Error(result.message));
        }
    }

    //退出登录
    async function userLogout() {
        const result: any = await reqLogout();
        console.log('userLogout result---------', result);
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

    return {userState, userLogin, userInfo, userLogout}
});
