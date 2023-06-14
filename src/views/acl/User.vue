<template>
  <!--搜索用户部分-->
    <el-card>
        <el-form inline class="search-form">
            <el-form-item label="用户名">
                <el-input placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
                <el-button type="primary">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

  <!--用户列表展示-->
    <el-card class="card-table">
        <template #header>
            <el-button type="primary" @click="addUser">添加用户</el-button>
            <el-button type="danger" :disabled="userTableSelection.data.length===0">
                批量删除
            </el-button>
        </template>
        <!--用户信息表格-->
        <el-table border :data="userTableData" @selection-change="tableSelectionChange">
            <el-table-column type="selection" width="60" align="center"/>
            <el-table-column type="index" label="序号" width="60" align="center"/>
            <el-table-column prop="id" label="ID" width="80" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="username" label="用户名称" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="name" label="用户昵称" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="roleName" label="用户角色" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="updateTime" label="更新时间" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="操作" width="280" align="center">
                <template #default="{row}">
                    <el-button type="primary" icon="User" size="small">分配角色</el-button>
                    <el-button type="primary" icon="Edit" size="small" @click="updateUser(row)">编辑</el-button>
                    <el-button type="danger" icon="Delete" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="->,prev,pager,next,total,sizes,jumper" :total="total"
                       v-model:current-page="pageNo" v-model:page-size="pageSize"
                       :page-sizes="[5,10,20]" @current-change="getUserInfo" @size-change="getUserInfo"/>

        <!--抽屉组件，用于新增、修改用户-->
        <el-drawer v-model="drawerDisplayFlag" :title="`${addOrUpdateUserFlag?'添加':'更新'}用户`"
                   direction="rtl" @close="onDrawerClose">
            <el-form ref="addUpdateFormRef" :model="addUpdateFormData.data"
                     :rules="addUpdateFormRules">
                <el-form-item label="用户姓名" prop="username">
                    <el-input v-model="addUpdateFormData.data.username" placeholder="请输入用户姓名"/>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input v-model="addUpdateFormData.data.name" placeholder="请输入用户昵称"/>
                </el-form-item>
                <!--仅添加用户时渲染密码栏位-->
                <el-form-item label="用户密码" prop="password" v-if="addOrUpdateUserFlag">
                    <el-input v-model="addUpdateFormData.data.password" type="password" placeholder="请输入用户密码"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="confirmAddOrUpdateUser">确定</el-button>
                <el-button @close="onDrawerClose">取消</el-button>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";

import type {UserData, UserInfoResponseData} from "@/api/acl/user/types";
import {reqAddOrUpdateUser, reqUsersInfo} from "@/api/acl/user";

interface SelectedUsersType {
    data: UserData[]
}

interface AddUpdateDataType {
    data: UserData
}

let pageNo = ref<number>(1);//分页器页码
let pageSize = ref<number>(10);//分页器页大小
let total = ref<number>(0);//分页器总数据条数

let userTableData = reactive<UserData[]>([]);//用户表格数据
let userTableSelection = reactive<SelectedUsersType>({data: []});//用户表格选中项

let addOrUpdateUserFlag = ref<boolean>(true);//标志位，true-添加用户，false-修改用户
let drawerDisplayFlag = ref<boolean>(false);//控制是否显示抽屉组件
const addUpdateFormRef = ref<FormInstance>();//添加、修改用户表单引用
let addUpdateFormData = reactive<AddUpdateDataType>({data: {}});//添加、修改用户表单的数据
//添加、修改用户表单的校验规则
const addUpdateFormRules = reactive<FormRules>({
    username: [
        {required: true, message: '用户名必须输入', trigger: 'blur'},
        {min: 5, message: '用户名长度不少于5位', trigger: 'change'},
        {max: 18, message: '用户名长度不多于18位', trigger: 'change'},
    ],
    name: [{required: true, message: '用户昵称必须输入', trigger: 'blur'},],
    password: [
        {required: true, message: '密码必须输入', trigger: 'blur'},
        {min: 6, message: '密码长度不少于6位', trigger: 'change'},
    ]
});

//获取用户信息
const getUserInfo = async () => {
    const result: UserInfoResponseData = await reqUsersInfo(pageNo.value, pageSize.value);
    if (result.code === 200) {
        userTableData.length = 0;
        result.data.records.forEach(item => userTableData.push(item));
        total.value = result.data.total;
    }
}

//添加用户按钮点击回调
const addUser = () => {
    addOrUpdateUserFlag.value = true;//更新用户
    drawerDisplayFlag.value = true;//展示抽屉组件
}

//更新用户按钮点击回调
const updateUser = (row: UserData) => {
    addUpdateFormData.data = row;
    addOrUpdateUserFlag.value = false;//更新用户
    drawerDisplayFlag.value = true;//展示抽屉组件
}

//抽屉组件确认按钮点击回调
const confirmAddOrUpdateUser = async () => {
    let result: any = await reqAddOrUpdateUser(addUpdateFormData.data);
    if (result.code === 200) {
        ElMessage.success(`${addOrUpdateUserFlag.value ? '添加' : '更新'}用户成功！`);
        onDrawerClose();//关闭抽屉
        getUserInfo();//重新查询用户数据
    } else {
        ElMessage.error(`${addOrUpdateUserFlag.value ? '添加' : '更新'}用户失败！${result.data}`);
    }
}

//抽屉组件关闭的回调
const onDrawerClose = () => {
    addUpdateFormData.data = {};//清除数据
    drawerDisplayFlag.value = false;//隐藏抽屉组件
    //清除表单校验结果
    addUpdateFormRef.value?.clearValidate();
}

//表格选中项发生变化的回调
const tableSelectionChange = (selections: UserData[]) => {
    userTableSelection.data = selections;
}

onMounted(() => {
    getUserInfo();
});
</script>

<style scoped lang="scss">
.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-form-item {
    margin-bottom: 0;
  }
}

.card-table {
  margin-top: 20px;

  .el-pagination {
    margin-top: 15px;
  }
}
</style>
