<template>
    <el-table border :data="menuTableData.data" row-key="id"
              style="width: 100%; margin-bottom: 20px"
              :header-cell-style="{'textAlign':'center'}">
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="code" label="权限值" align="center"/>
        <el-table-column prop="updateTime" label="修改时间" align="center"/>
        <el-table-column label="操作" width="300" align="center">
            <template #default="{row,$index}">
                <el-button type="primary" size="small" v-show="row.level<=3">
                    {{ row.level >= 3 ? '添加功能' : '添加菜单' }}
                </el-button>
                <el-button type="primary" size="small" :disabled="row.level===1">
                    编辑
                </el-button>
                <el-button type="danger" size="small" :disabled="row.level===1">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";

import type {Menu, MenuResponseData} from "@/api/acl/menu/types";
import {reqAllMenus} from "@/api/acl/menu";

interface MenuTableDataType {
    data: Menu[]
}

let menuTableData = reactive<MenuTableDataType>({data: []});//菜单表格数据

//获取菜单数据
const getMenusData = async () => {
    const result: MenuResponseData = await reqAllMenus();
    if (result.code === 200) {
        menuTableData.data = result.data;
    }
}

onMounted(() => getMenusData());
</script>

<style scoped lang="scss">

</style>
