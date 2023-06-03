<template>
    <div>
        <h1>App组件</h1>
        <svg>
            <use xlink:href="#icon-home"></use>
        </svg>
        <SvgIcon name="home" width="50px" height="50px"/>
    </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import request from "@/utils/request";

onMounted(() => {
    request({
        url: '/user/login',
        method: 'post',
        data: {
            username: 'admin',
            password: '111111'
        }
    })
})
</script>

<style scoped lang="scss">
div {
  color: $primary-color;
}
</style>
