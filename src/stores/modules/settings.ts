//系统设置相关二级仓库
import {defineStore} from "pinia";
import {ref} from "vue";

export const useSysSettingsStore = defineStore('settingsStore', () => {
    let title = ref<string>('商品管理运营平台');//项目标题
    let refresh = ref<boolean>(true);//控制组件刷新
    const doRefresh = () => refresh.value = !refresh.value;
    return {title, refresh, doRefresh};
});