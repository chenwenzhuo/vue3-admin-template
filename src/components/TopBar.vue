<template>
    <div class="top-bar-container">
        <div class="top-bar-left">
            <!--TopBar左侧面包屑-->
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <a href="/">promotion management</a>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="top-bar-right">
            <el-button size="small" :icon="Refresh" circle/>
            <el-button size="small" :icon="FullScreen" circle/>
            <el-button size="small" :icon="Setting" circle/>
            <!--用户名下拉菜单-->
            <el-dropdown class="user-drop-down">
                <span class="el-dropdown-link">
                  <span>admin</span>
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
import {
    ArrowRight, FullScreen, Refresh, Setting
} from "@element-plus/icons-vue";
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

    .user-drop-down {
      margin-left: 10px;
    }
  }
}
</style>