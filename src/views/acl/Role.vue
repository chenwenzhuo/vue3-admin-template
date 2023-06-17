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
            <el-button type="primary" icon="Plus" @click="handleAddRole">添加角色</el-button>
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
                    <el-button type="primary" icon="Edit" size="small" @click="handleUpdateRole(row)">编辑</el-button>
                    <el-button type="danger" icon="Delete" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="->,prev,pager,next,total,sizes,jumper"
                       v-model:current-page="pageNo" v-model:page-size="pageSize"
                       :page-sizes="[10,20,30]" :total="total"
                       @current-change="getAllRoles" @size-change="getAllRoles"/>

        <!--添加、更新角色弹窗-->
        <el-dialog :model-value="dialogDisplayStatus!==0" :title="dialogTitle"
                   @close="onDialogClose" :width="dialogWidth">
            <el-form ref="addUpdateFormRef" :model="addUpdateRoleData.data"
                     :rules="addUpdateFormRules">
                <el-form-item prop="roleName" label="角色名称">
                    <el-input v-model="addUpdateRoleData.data.roleName" placeholder="请输入角色名称"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="confirmAddUpdate">确定</el-button>
                <el-button @click="onDialogClose">取消</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";

import type {RoleData, RoleRecords, RoleResponseData} from "@/api/acl/role/types";
import {reqAddOrUpdateRole, reqAllRoles} from "@/api/acl/role";
import {ElMessage} from "element-plus";

interface RoleTableDataType {
    data: RoleRecords
}

interface AddOrUpdateRoleDataType {
    data: RoleData
}

let searchRoleKeyword = ref<string>('');//搜索角色的关键字
let pageNo = ref<number>(1);//分页组件当前页码
let pageSize = ref<number>(10);//分页组件页大小
let total = ref<number>(0);//分页组件数据总条数
let roleTableData = reactive<RoleTableDataType>({data: []});//角色表格数据

//控制添加、更新角色弹窗显示状态。0-隐藏，1-添加角色，2-更新角色
let dialogDisplayStatus = ref<number>(0);
let dialogTitle: string = computed(() => {
    if (dialogDisplayStatus.value === 1)
        return '添加角色';
    else if (dialogDisplayStatus.value === 2)
        return '更新角色';
    return '';
});
//控制添加、更新角色弹窗宽度
let dialogWidth = computed(() => {
    const clientWidth = document.body.clientWidth;
    if (clientWidth < 1200)
        return '50%';
    return '500px';
});
const addUpdateFormRef = ref<FormInstance>();//添加、更新角色表单实例引用
let addUpdateRoleData = reactive<AddOrUpdateRoleDataType>({//添加、更新角色表单数据
    data: {roleName: ''}
});
const addUpdateFormRules = reactive<FormRules>({
    roleName: [
        {required: true, message: '角色名称必须输入'},
        {min: 2, message: '角色名称长度不少于2位'},
    ]
});

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

//添加角色按钮点击事件
const handleAddRole = () => {
    dialogDisplayStatus.value = 1;
    nextTick(() => addUpdateFormRef.value?.clearValidate());
}

//更新角色按钮点击事件
const handleUpdateRole = (row: RoleData) => {
    dialogDisplayStatus.value = 2;
    nextTick(() => addUpdateFormRef.value?.clearValidate());
    Object.assign(addUpdateRoleData.data, row);
}

//确认添加、更新角色按钮点击事件
const confirmAddUpdate = () => {
    addUpdateFormRef.value?.validate(async valid => {
        if (!valid)
            return;
        const result: any = await reqAddOrUpdateRole(addUpdateRoleData.data);
        if (result.code === 200) {
            ElMessage.success(`${dialogDisplayStatus.value === 1 ? '添加' : '更新'}角色成功！`);
            //重新查询数据
            if (dialogDisplayStatus.value === 1)
                pageNo.value = 1;//添加角色后，表格回到第一页
            getAllRoles();
            onDialogClose();//关闭弹窗
        } else {
            ElMessage.error(`${dialogDisplayStatus.value === 1 ? '添加' : '更新'}角色失败！${result.data}`);
        }
    });
}

//添加、更新角色弹窗关闭事件
const onDialogClose = () => {
    dialogDisplayStatus.value = 0;
    addUpdateRoleData.data = {};
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

  .add-update-dialog {
    max-width: 500px;
  }
}
</style>