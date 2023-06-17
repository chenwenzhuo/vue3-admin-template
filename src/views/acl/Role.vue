<template>
  <!--顶部搜索角色部分-->
    <el-card>
        <el-form inline class="search-role-form">
            <el-form-item label="角色搜索">
                <el-input v-model="searchRoleKeyword" placeholder="请输入角色关键字"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="!searchRoleKeyword"
                           @click="searchRole">
                    搜索
                </el-button>
                <el-button type="primary" @click="resetSearch">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

  <!--角色列表部分-->
    <el-card class="box-card-table">
        <template #header>
            <el-button type="primary" icon="Plus">添加角色</el-button>
        </template>

        <el-table border :data="roleTableData.data">
            <el-table-column type="index" label="序号" width="80" align="center"/>
            <el-table-column prop="id" label="ID" width="80" align="center"/>
            <el-table-column prop="roleName" label="职位名称" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="updateTime" label="更新时间" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="操作" width="280" align="center" fixed="right">
                <template #default="{row}">
                    <el-button type="primary" icon="Filter" size="small">分配权限</el-button>
                    <el-button type="primary" icon="Edit" size="small">编辑</el-button>
                    <el-button type="danger" icon="Delete" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="->,prev,pager,next,total,sizes,jumper"
                       v-model:current-page="pageNo" v-model:page-size="pageSize"
                       :page-sizes="[10,20,30]" :total="total"
                       @current-change="getAllRoles" @size-change="getAllRoles"/>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type {RoleRecords, RoleResponseData} from "@/api/acl/role/types";
import {reqAllRoles} from "@/api/acl/role";

interface RoleTableDataType {
    data: RoleRecords
}

let searchRoleKeyword = ref<string>('');//搜索角色的关键字
let pageNo = ref<number>(1);//分页组件当前页码
let pageSize = ref<number>(10);//分页组件页大小
let total = ref<number>(0);//分页组件数据总条数
let roleTableData = reactive<RoleTableDataType>({data: []});//角色表格数据

//查询所有角色信息
const getAllRoles = async () => {
    const result: RoleResponseData = await reqAllRoles(pageNo.value, pageSize.value, searchRoleKeyword.value);
    if (result.code === 200) {
        roleTableData.data = result.data.records;
        total.value = result.data.total;
    }
}

//搜索角色区域，搜索按钮点击事件
const searchRole = () => {
    roleTableData.data = [];//清除数据
    pageNo.value = 1;//回到第一页
    total.value = 0;//重置总条数
    getAllRoles();
}

//搜索角色区域，重置按钮点击事件
const resetSearch = () => {
    searchRoleKeyword.value = '';//重置搜索条件
    searchRole();
}

onMounted(() => {
    getAllRoles();
})
</script>

<style scoped lang="scss">
.search-role-form {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-form-item {
    margin-bottom: 0;
  }
}

.box-card-table {
  margin-top: 20px;

  .el-pagination {
    margin-top: 15px;
  }
}
</style>