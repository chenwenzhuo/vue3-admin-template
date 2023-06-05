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
        title: 'admin',
        hidden: false,
        icon: 'Avatar'
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
        path: '/screen',
        component: import((`@/views/screen/index.vue`)),
        name: 'screen',
        meta: {
            title: '数据大屏',
            hidden: false,
            icon: 'Monitor'
        }
    }, {
        path: '/acl',
        component: import((`@/views/acl/index.vue`)),
        name: 'acl',
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock'
        },
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
            path: '/acl/permission',
            component: import((`@/views/acl/Permission.vue`)),
            name: 'Permission',
            meta: {
                title: '菜单管理',
                hidden: false,
                icon: 'Menu'
            }
        },]
    }, {
        path: '/product',
        component: import((`@/views/product/index.vue`)),
        name: 'product',
        meta: {
            title: '商品管理',
            hidden: false,
            icon: 'Goods',
        },
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
    }]
}, {
    path: '/404',
    component: () => import((`@/views/404/index.vue`)),
    name: '404',
    meta: {
        title: '404',
        hidden: true,
        icon: 'DocumentDelete'
    }
}, {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
        title: 'any',
        hidden: true,
        icon: 'MagicStick'
    }
}];
