import axios from "axios";
// @ts-ignore
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores/modules/user";

//1.创建axios实例对象
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,
});

//2.添加请求、响应拦截器
request.interceptors.request.use(config => {
    //获取用户二级仓库
    const userStore = useUserStore();
    //发送请求时携带用户token
    if (userStore.userState.token) {
        config.headers.token = userStore.userState.token;
        console.log('token--------', userStore.userState.token);
    }
    return config;
});
request.interceptors.response.use(response => {
    return response.data;
}, error => {
    //处理网络错误
    let msg: string;
    let status = error.response.status;
    switch (status) {
        case 401:
            msg = "token过期";
            break;
        case 403:
            msg = '无权访问';
            break;
        case 404:
            msg = "请求地址错误";
            break;
        case 500:
            msg = "服务器出现问题";
            break;
        default:
            msg = "网络出现问题";
            break;
    }
    ElMessage({type: 'error', message: msg});
    return Promise.reject(error);
});

export default request;
