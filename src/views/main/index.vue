<template>
    <router-view v-if="flag"/>
</template>

<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
import {useSysSettingsStore} from "@/stores/modules/settings";

const settingsStore = useSysSettingsStore();
let flag = ref<boolean>(true);
//监听刷新控制变量，发生变化时执行刷新
watch(() => settingsStore.refresh, () => {
    flag.value = false;//修改flag，销毁当前组件
    //通过nextTick，DOM更新完成后重新渲染
    nextTick(() => flag.value = true);
});
</script>

<style scoped lang="scss">

</style>
