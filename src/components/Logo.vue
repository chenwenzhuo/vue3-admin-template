<template>
    <div class="logo-container">
        <img src="@/assets/images/mall-logo.png" alt="">
        <p>商品管理运营平台</p>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.logo-container {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #989898;

  img {
    width: 60px;
  }

  p {
    color: #ffffff;

  }
}
</style>
