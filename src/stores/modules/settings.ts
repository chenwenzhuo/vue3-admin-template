//系统设置相关二级仓库
import {defineStore} from "pinia";
import {ref} from "vue";

export const useSysSettingsStore = defineStore('settingsStore', () => {
    let refresh = ref<boolean>(true);//控制组件刷新
    const doRefresh = () => refresh.value = !refresh.value;
    return {refresh, doRefresh};
});