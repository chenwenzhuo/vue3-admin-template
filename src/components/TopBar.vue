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
            <el-button size="small" :icon="Setting" circle/>
            <img :src="userStore.userState.avatar" :alt="userStore.userState.username"/>
            <!--用户名下拉菜单-->
            <el-dropdown class="user-drop-down">
                <span class="el-dropdown-link">
                  <span>{{ userStore.userState.username }}</span>
                    <el-icon><ArrowDown/></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {
    ArrowRight, FullScreen, Refresh, Setting
} from "@element-plus/icons-vue";

import {useUserStore} from "@/stores/modules/user";
import {useSysSettingsStore} from "@/stores/modules/settings";

const $route = useRoute();
const userStore = useUserStore();
const settingsStore = useSysSettingsStore();

//刷新页面
const refreshPage = () => settingsStore.doRefresh();

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
