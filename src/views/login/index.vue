<template>
    <div class="login-container">
        <el-row>
            <el-col :span="12" :xs="0" :sm="0" :lg="12"></el-col>
            <el-col :span="12" :xs="24" :sm="24" :lg="12">
                <el-form ref="loginFormRef" class="login-form"
                         :model="loginFormData" :rules="loginFormRules">
                    <h1>Hello</h1>
                    <h2>欢迎使用商品管理运营平台</h2>
                    <el-form-item prop="username">
                        <el-input placeholder="请输入用户名" v-model="loginFormData.username"
                                  prefix-icon="user"/>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="请输入密码" v-model="loginFormData.password"
                                  type="password" :show-password="true"
                                  prefix-icon="lock"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-btn" type="primary"
                                   :loading="loading" @click="login">
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import type {FormRules, FormInstance} from "element-plus";

import {useUserStore} from "@/stores/modules/user";
import {getTimeDesc} from "@/utils/utils";

const loginFormRef = ref<FormInstance>();
const loginFormData = reactive({username: '', password: ''});
let loading = ref<boolean>(false);//控制按钮加载效果
const userStore = useUserStore();
const $route = useRoute();
const $router = useRouter();

//表单校验规则
const loginFormRules = reactive<FormRules>({
    username: [
        {required: true, message: '用户名必须输入', trigger: 'change'},
        {min: 5, max: 12, message: '用户名长度在5位到12位之间', trigger: 'change'},
        {pattern: /^[0-9a-zA-Z_]+$/, message: '用户名由字母、数字、下划线组成', trigger: 'change'},
    ],
    password: [
        {required: true, message: '密码必须输入', trigger: 'change'},
        {min: 6, max: 18, message: '密码长度在6位到18位之间', trigger: 'change'},
    ]
});

//登录按钮回调
const login = () => {
    //进行表单校验
    loginFormRef.value?.validate(isValid => {
        if (!isValid) return;
        loading.value = true;//显示加载效果
        //通知仓库发登录请求
        //请求成功->首页展示数据
        //请求失败->弹出提示信息
        userStore.userLogin(loginFormData).then(result => {
            loading.value = false;//取消加载效果
            //检查是否有query参数
            const redirect = $route.query.redirect;
            if (redirect) {
                $router.replace(redirect);//跳转到退出登录前页面
            } else {
                $router.push('/');//跳转到首页
            }
            ElNotification({
                type: 'success',
                title: `${getTimeDesc()}好`,
                message: '欢迎回来'
            });
        }).catch(error => {
            loading.value = false;//取消加载效果
            ElNotification({
                type: 'error',
                message: (error as Error).message
            });
        });
    });
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;

  .login-form {
    width: 80%;
    padding: 40px 80px;
    box-sizing: border-box;
    position: relative;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;

    h1 {
      font-size: 50px;
      font-weight: bold;
      color: #ffffff;
    }

    h2 {
      font-size: 25px;
      color: #ffffff;
      margin: 20px 0;
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>
