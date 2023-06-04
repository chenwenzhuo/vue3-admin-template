<template>
    <el-container class="container">
        <el-aside class="aside">Aside</el-aside>
        <el-container class="sub-container">
            <el-header class="header">Header</el-header>
            <el-main class="main">
                <div style="height: 30000px;background-color: #fff;">ddd</div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;

  .aside {
    width: $base-menu-width;
    background-color: $base-menu-background-color;
  }

  .sub-container {
    width: calc(100% - $base-menu-width);
    background-color: #bfa;

    .header {
      width: 100%;
      height: $base-tab-bar-height;
      background-color: #fffc00;
    }

    .main {
      width: 100%;
      height: calc(100vh - $base-tab-bar-height);
      background-color: #1f64cb;
      padding: 20px;
      overflow: scroll;
    }
  }
}
</style>
