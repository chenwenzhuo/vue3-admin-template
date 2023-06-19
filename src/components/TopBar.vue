<template>
    <div class="top-bar-container">
        <div class="top-bar-left">
            <!--TopBar左侧面包屑-->
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index"
                                    v-show="item.meta.title">
                    <el-icon style="margin-right: 5px">
                        <component :is="item.meta.icon"/>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="top-bar-right">
            <el-button size="small" :icon="Refresh" circle @click="refreshPage"/>
            <el-button size="small" :icon="FullScreen" circle @click="fullScreen"/>
            <el-popover placement="bottom-start" title="主题设置"
                        :width="200" trigger="hover">
                <template #reference>
                    <el-button size="small" :icon="Setting" circle/>
                </template>
                <el-form>
                    <el-form-item label="主题颜色">
                        <el-color-picker v-model="color" show-alpha :predefine="predefineColors"
                                         @change="setPrimaryColor"/>
                    </el-form-item>
                    <el-form-item label="暗黑模式">
                        <el-switch @change="changeDark" v-model="dark" class="mt-2"
                                   inline-prompt active-icon="MoonNight" inactive-icon="Sunny"/>
                    </el-form-item>
                </el-form>
            </el-popover>
            <img :src="userStore.userState.avatar" :alt="userStore.userState.username"/>
            <!--用户名下拉菜单-->
            <el-dropdown class="user-drop-down">
                <span class="el-dropdown-link">
                  <span>{{ userStore.userState.username }}</span>
                    <el-icon><ArrowDown/></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {
    ArrowRight, FullScreen, Refresh, Setting
} from "@element-plus/icons-vue";

import {useUserStore} from "@/stores/modules/user";
import {useSysSettingsStore} from "@/stores/modules/settings";

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const settingsStore = useSysSettingsStore();

//刷新页面
const refreshPage = () => settingsStore.doRefresh();

//颜色组件组件的数据
const color = ref<string>("rgba(255, 69, 0, 0.68)");
const predefineColors = reactive([
    "#ff4500",
    "#ff8c00",
    "#ffd700",
    "#90ee90",
    "#00ced1",
    "#1e90ff",
    "#c71585",
    "rgba(255, 69, 0, 0.68)",
    "rgb(255, 120, 0)",
    "hsv(51, 100, 98)",
    "hsva(120, 40, 94, 0.5)",
    "hsl(181, 100%, 37%)",
    "hsla(209, 100%, 56%, 0.73)",
    "#c7158577"
]);
//开关组件是否打开
let dark = ref<boolean>(false);

//切换全屏模式
const fullScreen = () => {
    //DOM对象的属性，判断当前是否是全屏模式
    //全屏：true，非全屏：null
    let isFull = document.fullscreenElement;
    //切换全屏
    if (!isFull) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

const logout = async () => {
    //1.调用退出登录接口，告知服务器
    //2.清空仓库中相关数据
    //3.跳转登录界面
    await userStore.userLogout();
    $router.replace({path: '/login', query: {redirect: $route.path}});
}

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
    let html = document.documentElement;//获取HTML根节点
    //判断HTML标签是否有类名dark
    dark.value ? html.className = "dark" : html.className = "";
};

//主题颜色的设置
const setPrimaryColor = () => {
    //通知js修改根节点的样式对象的属性与属性值
    const html = document.documentElement;
    html.style.setProperty("--el-color-primary", color.value);
};
</script>

<style scoped lang="scss">
.top-bar-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .top-bar-right {
    display: flex;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
      margin-left: 10px;
      border-radius: 50%;
    }

    .user-drop-down {
      margin-left: 10px;
    }
  }
}
</style>
