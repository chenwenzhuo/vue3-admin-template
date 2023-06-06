<template>
    <div>首页</div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

import {useUserStore} from "@/stores/modules/user";

//获取用户二级仓库
const userStore = useUserStore();

//首页挂载完成，发送请求获取用户信息
onMounted(() => {
    userStore.userInfo();
});
</script>


<style scoped lang="scss">

</style>