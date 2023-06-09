//路由配置
export const routesConfig = [{
    //登录
    path: '/login',
    component: () => import((`@/views/login/index.vue`)),
    name: 'login',
    meta: {
        title: '登录',
        hidden: true,//是否在菜单栏中隐藏此路由
        icon: 'Promotion'//菜单项图标
    }
}, {
    //登录成功后数据展示路由
    path: '/',
    component: () => import((`@/views/admin/index.vue`)),
    name: 'admin',
    redirect: '/home',
    meta: {
        title: '',
        hidden: false,
        icon: ''
    },
    children: [{
        path: '/home',
        component: import((`@/views/home/index.vue`)),
        name: 'home',
        meta: {
            title: '主页',
            hidden: false,
            icon: 'HomeFilled'
        }
    }, {
        path: '/screenTransfer',
        name: 'screenTransfer',
        redirect: '/screen',
        meta: {
            title: '数据大屏',
            hidden: false,
            icon: 'Monitor'
        }
    },]
}, {
    path: '/screen',
    component: import((`@/views/screen/index.vue`)),
    name: 'screen'
}, {
    path: '/404',
    component: () => import((`@/views/404/index.vue`)),
    name: '404',
    meta: {
        title: '404',
        hidden: true,
        icon: 'DocumentDelete'
    }
}];

//异步路由
export const asyncRoute = [{
    path: '/acl',
    component: import((`@/views/acl/index.vue`)),
    name: 'Acl',
    meta: {
        title: '权限管理',
        hidden: false,
        icon: 'Lock'
    },
    redirect: '/acl/user',
    children: [{
        path: '/acl/user',
        component: import((`@/views/acl/User.vue`)),
        name: 'User',
        meta: {
            title: '用户管理',
            hidden: false,
            icon: 'User'
        }
    }, {
        path: '/acl/role',
        component: import((`@/views/acl/Role.vue`)),
        name: 'Role',
        meta: {
            title: '角色管理',
            hidden: false,
            icon: 'PriceTag'
        }
    }, {
        path: '/acl/menu',
        component: import((`@/views/acl/Menu.vue`)),
        name: 'Permission',
        meta: {
            title: '菜单管理',
            hidden: false,
            icon: 'More'
        }
    },]
}, {
    path: '/product',
    component: import((`@/views/product/index.vue`)),
    name: 'Product',
    meta: {
        title: '商品管理',
        hidden: false,
        icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [{
        path: '/product/trademark',
        component: import((`@/views/product/Trademark.vue`)),
        name: 'Trademark',
        meta: {
            title: '品牌管理',
            hidden: false,
            icon: 'Stamp',
        }
    }, {
        path: '/product/attr',
        component: import((`@/views/product/Attr.vue`)),
        name: 'Attr',
        meta: {
            title: '属性管理',
            hidden: false,
            icon: 'Flag',
        }
    }, {
        path: '/product/spu',
        component: import((`@/views/product/Spu.vue`)),
        name: 'Spu',
        meta: {
            title: 'Spu管理',
            hidden: false,
            icon: 'Calendar',
        }
    }, {
        path: '/product/sku',
        component: import((`@/views/product/Sku.vue`)),
        name: 'Sku',
        meta: {
            title: 'Sku管理',
            hidden: false,
            icon: 'Magnet',
        }
    },]
}];

//任意路由（不存在的路径，重定向到404页面）
export const anyRoute = {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
        title: 'any',
        hidden: true,
        icon: 'MagicStick'
    }
};
