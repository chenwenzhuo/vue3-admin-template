import {createApp} from 'vue'

// @ts-ignore
import App from './App.vue'
import router from './router'
import pinia from "@/stores";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//暗黑模式所需样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'

// @ts-ignore
import SvgIcon from '@/components/SvgIcon.vue'

import '@/styles/index.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {locale: zhCn,})
//注册所有ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//将SvgIcon注册为全局组件，可直接使用，无需在每个文件中引入
app.component('SvgIcon', SvgIcon)
app.mount('#app')
