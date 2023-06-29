<template>
    <el-container class="container">
        <el-aside class="aside">
            <Logo/>
            <el-scrollbar class="aside-scroll-bar">
                <el-menu background-color="#001529" text-color="#ffffff" active-text-color="yellowgreen"
                         :default-active="$route.path" :unique-opened="true">
                    <Menu :menuList="userStore.userState.menuRoutes[1].children"/>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <el-container class="sub-container">
            <el-header class="header">
                <TopBar/>
            </el-header>
            <el-main class="main">
                <Main/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

import Logo from "@/components/Logo.vue";
import Menu from '@/components/Menu.vue'
import TopBar from "@/components/TopBar.vue";
import Main from '@/views/main/index.vue'
import {useUserStore} from "@/stores/modules/user";

const userStore = useUserStore();
const $route = useRoute();
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;

  .aside {
    width: $base-menu-width;
    background-color: $base-menu-background-color;

    .aside-scroll-bar {
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: 0;
      }
    }
  }

  .sub-container {
    width: calc(100% - $base-menu-width);

    .header {
      width: 100%;
      height: $base-top-bar-height;
    }

    .main {
      width: 100%;
      height: calc(100vh - $base-top-bar-height);
      padding: 20px;
      overflow: scroll;
    }
  }
}
</style>
