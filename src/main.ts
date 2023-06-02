import {createApp} from 'vue'
import {createPinia} from 'pinia'

// @ts-ignore
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {locale: zhCn,})
//注册所有ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
