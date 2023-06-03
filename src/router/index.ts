import {createRouter, createWebHashHistory} from 'vue-router'
import {routesConfig} from './routes'

const router = createRouter({
    history: createWebHashHistory(),
    routes: routesConfig,
    //路由切换时的页面滚动行为
    scrollBehavior() {
        return {left: 0, top: 0}
    }
});

export default router
