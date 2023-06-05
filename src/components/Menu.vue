<template>
  <!--渲染菜单项-->
    <template v-for="item in menuList" :key="item.path">
        <!--没有子路由-->
        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
                <!--菜单项标题-->
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"/>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <!--有子路由-->
        <template v-if="item.children">
            <el-sub-menu index="item.path" v-if="!item.meta.hidden">
                <!--子菜单标题-->
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"/>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
                <!--递归组件渲染子路由-->
                <Menu :menuList="item.children"/>
            </el-sub-menu>
        </template>
    </template>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

//获取父组件传递的路由数组
defineProps(['menuList']);

const $router = useRouter();

//点击菜单的回调
const goRoute = (vc: any) => {
    //路由跳转
    $router.push(vc.index);
}
</script>

<!--递归组件需要name属性，新增一个script标签使用选项式api指定-->
<script lang="ts">
export default {
    name: "Menu"
};
</script>

<style scoped lang="scss">

</style>
