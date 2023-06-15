<template>
  <!--搜索用户部分-->
    <el-card>
        <el-form inline class="search-form">
            <el-form-item label="用户名">
                <el-input v-model="searchingKeyword" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getUserInfo"
                           :disabled="!searchingKeyword">
                    搜索
                </el-button>
                <el-button type="primary" @click="resetSearchUsers">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

  <!--用户列表展示-->
    <el-card class="card-table">
        <template #header>
            <el-button type="primary" @click="addUser">添加用户</el-button>
            <el-button type="danger" :disabled="userTableSelection.data.length===0"
                       @click="removeUserBatch">
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
                    <el-button type="primary" icon="User" size="small" @click="assignRole(row)">分配角色</el-button>
                    <el-button type="primary" icon="Edit" size="small" @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm :title="`是否确认删除用户${row.username}？`" width="280"
                                   @confirm="removeUser(row)">
                        <template #reference>
                            <el-button type="danger" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="->,prev,pager,next,total,sizes,jumper" :total="total"
                       v-model:current-page="pageNo" v-model:page-size="pageSize"
                       :page-sizes="[5,10,20]" @current-change="getUserInfo" @size-change="getUserInfo"/>

        <!--抽屉组件，用于新增、修改用户-->
        <el-drawer v-model="userDrawerDisplayFlag" :title="`${addOrUpdateUserFlag?'添加':'更新'}用户`"
                   direction="rtl" @close="onUserDrawerClose">
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
                <el-button @click="onUserDrawerClose">取消</el-button>
            </template>
        </el-drawer>

        <!--抽屉组件，用于分配用户角色-->
        <el-drawer v-model="roleDrawerDisplayFlag" title="分配用户角色"
                   direction="rtl" @close="onRoleDrawerClose">
            <el-form>
                <el-form-item label="用户名称">
                    <el-input v-model="assignRoleFormData.data.username" disabled/>
                </el-form-item>
                <el-form-item label="角色列表">
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                                 @change="handleCheckAllChange"
                                 style="margin-right: 10px">
                        全选
                    </el-checkbox>
                    <!--所有可选择的职位复选框-->
                    <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
                        <el-checkbox v-for="role in allRoles" :key="role.id" :label="role">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="confirmAssignRoles">确定</el-button>
                <el-button @click="onRoleDrawerClose">取消</el-button>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";

import {useUserStore} from "@/stores/modules/user";
import type {AllRolesResponseData, RoleList, UserData, UserInfoResponseData} from "@/api/acl/user/types";
import {
    reqAddOrUpdateUser,
    reqAllRoles,
    reqRemoveUser,
    reqRemoveUserBatch,
    reqSetUserRole,
    reqUsersInfo
} from "@/api/acl/user";

interface SelectedUsersType {
    data: UserData[]
}

interface UserDataType {
    data: UserData
}

const userStore = useUserStore();//当前登录的用户数据
const $route = useRoute();
const $router = useRouter();

let pageNo = ref<number>(1);//分页器页码
let pageSize = ref<number>(10);//分页器页大小
let total = ref<number>(0);//分页器总数据条数

let searchingKeyword = ref<string>('');//搜索用户的关键词
let userTableData = reactive<UserData[]>([]);//用户表格数据
let userTableSelection = reactive<SelectedUsersType>({data: []});//用户表格选中项

let addOrUpdateUserFlag = ref<boolean>(true);//标志位，true-添加用户，false-修改用户
let userDrawerDisplayFlag = ref<boolean>(false);//控制是否显示抽屉组件
const addUpdateFormRef = ref<FormInstance>();//添加、修改用户表单引用
let addUpdateFormData = reactive<UserDataType>({//添加、修改用户表单的数据
    data: {username: '', password: '', name: ''}
});
let operatingCurrentUser = ref<boolean>(false);//更新、删除用户时，是否操作的当前已登录用户
//添加、修改用户表单的校验规则
const addUpdateFormRules = reactive<FormRules>({
    username: [{required: true, validator: validateUsername, trigger: 'blur'}],
    name: [{required: true, validator: validateName, trigger: 'blur'}],
    password: [{required: true, validator: validatePassword, trigger: 'blur'}]
});

let roleDrawerDisplayFlag = ref<boolean>(false);//控制是否显示抽屉组件
let assignRoleFormData = reactive<UserDataType>({//用户角色设置表单的数据
    data: {}
});
let checkAll = ref<boolean>(false);//角色列表复选框是否全选
let isIndeterminate = ref<boolean>(false);//复选框未全部选中时，“全选”复选框是否展示中间状态
let allRoles = reactive<RoleList>([]);//所有角色列表
//疑似bug：el-checkbox-group组件v-model绑定的数据必须用ref定义，使用reactive会导致不能改变选项的情况
let checkedRoles = ref<RoleList>([]);//选中的角色

//获取用户信息
const getUserInfo = async () => {
    const result: UserInfoResponseData = await reqUsersInfo(pageNo.value, pageSize.value, searchingKeyword.value);
    if (result.code === 200) {
        userTableData.length = 0;
        result.data.records.forEach(item => userTableData.push(item));
        total.value = result.data.total;
    }
}

//重置搜索用户
const resetSearchUsers = () => {
    searchingKeyword.value = '';//清除关键词
    getUserInfo();//重新查询
}

//添加用户按钮点击回调
const addUser = () => {
    addOrUpdateUserFlag.value = true;//更新用户
    userDrawerDisplayFlag.value = true;//展示抽屉组件
}

//更新用户按钮点击回调
const updateUser = (row: UserData) => {
    addUpdateFormData.data = row;
    addOrUpdateUserFlag.value = false;//更新用户
    userDrawerDisplayFlag.value = true;//展示抽屉组件
    //是否正更新当前已登录用户
    operatingCurrentUser.value = (row.username === userStore.userState.username);
}

//用户抽屉组件确认按钮点击回调
const confirmAddOrUpdateUser = () => {
    addUpdateFormRef.value?.validate(async (valid) => {
        if (!valid) return;
        let result: any = await reqAddOrUpdateUser(addUpdateFormData.data);
        if (result.code === 200) {
            ElMessage.success(`${addOrUpdateUserFlag.value ? '添加' : '更新'}用户成功！`);
            //若执行更新，且更新了当前已登录用户
            if (!addOrUpdateUserFlag.value && operatingCurrentUser.value) {
                //弹窗提示
                ElMessageBox.alert(
                    '当前登录用户已被修改，请重新登录！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        center: true,
                        'show-close': false
                    }
                ).then(async () => {
                    await userStore.userLogout();
                    $router.replace({path: '/login', query: {redirect: $route.path}});
                });
            } else {
                onUserDrawerClose();//关闭抽屉
                getUserInfo();//重新查询用户数据
            }
        } else {
            ElMessage.error(`${addOrUpdateUserFlag.value ? '添加' : '更新'}用户失败！${result.data}`);
        }
    });
}

//添加、更新用户抽屉组件关闭的回调
const onUserDrawerClose = () => {
    addUpdateFormData.data = {username: '', password: '', name: ''};//清除数据
    userDrawerDisplayFlag.value = false;//隐藏抽屉组件
    //清除表单校验结果
    addUpdateFormRef.value?.clearValidate();
    operatingCurrentUser.value = false;
}

//分配角色按钮点击回调
const assignRole = (row: UserData) => {
    roleDrawerDisplayFlag.value = true;
    assignRoleFormData.data = row;
    getRoles(row);
}

//角色列表全选复选框变化的回调
const handleCheckAllChange = (allChecked: boolean) => {
    isIndeterminate.value = false;//取消“全选”复选框的中间状态
    checkedRoles.value = allChecked ? allRoles : [];//更新选中项
}

//角色列表选中项变化的回调
const handleCheckedRolesChange = (value: string[]) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === allRoles.length;//判断是否全选
    //判断是否展示“全选”复选框的中间状态
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRoles.length;
}

//查询用户已有的角色，及所有角色列表
const getRoles = async (row: UserData) => {
    const result: AllRolesResponseData = await reqAllRoles(row.id);
    if (result.code === 200) {
        //记录所有角色
        allRoles.length = 0;
        result.data.allRolesList.forEach(item => allRoles.push(item));
        //记录已有的角色
        checkedRoles.value = result.data.assignRoles;
    }
}

//分配角色抽屉组件中确定按钮点击回调
const confirmAssignRoles = async () => {
    //角色id列表，由选中的角色列表映射得到
    const roleIdList: number[] = checkedRoles.value.map(item => item.id);
    //发送请求
    const result: any = await reqSetUserRole({roleIdList, userId: assignRoleFormData.data.id});
    if (result.code === 200) {
        ElMessage.success('分配角色成功！');
        onRoleDrawerClose();//关闭抽屉
        getUserInfo();//重新查询用户数据
    } else {
        ElMessage.error(`分配角色失败！${result.data}`);
    }
}

//分配角色抽屉组件关闭的回调
const onRoleDrawerClose = () => {
    roleDrawerDisplayFlag.value = false;
    assignRoleFormData.data = {};
    checkAll.value = false;
    isIndeterminate.value = false;
    allRoles.length = 0;
    checkedRoles.value = [];
}

//表格选中项发生变化的回调
const tableSelectionChange = (selections: UserData[]) => {
    userTableSelection.data = selections;
}

//删除一个用户
const removeUser = async (row: UserData) => {
    //是否正删除当前已登录用户
    operatingCurrentUser.value = (row.username === userStore.userState.username);

    const result: any = await reqRemoveUser(row.id);
    if (result.code === 200) {
        ElMessage.success('删除用户成功！');
        //若删除了当前已登录用户
        if (operatingCurrentUser.value) {
            //弹窗提示
            ElMessageBox.alert(
                '当前登录用户已被删除，请重新登录！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    center: true,
                    'show-close': false
                }
            ).then(async () => {
                await userStore.userLogout();
                $router.replace({path: '/login', query: {redirect: $route.path}});
            });
        } else {
            getUserInfo();//重新查询用户数据
        }
    } else {
        ElMessage.error(`删除用户失败！${result.data}`);
    }
}

//批量删除用户
const removeUserBatch = async () => {
    //获取已选择用户的id列表，并检查是否正删除当前已登录用户
    const idList: number[] = userTableSelection.data.map(item => {
        if (item.username === userStore.userState.username)
            operatingCurrentUser.value = true;
        return item.id;
    });
    const result: any = await reqRemoveUserBatch(idList);
    if (result.code === 200) {
        ElMessage.success('删除用户成功！');
        //若删除了当前已登录用户
        if (operatingCurrentUser.value) {
            //弹窗提示
            ElMessageBox.alert(
                '当前登录用户已被删除，请重新登录！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    center: true,
                    'show-close': false
                }
            ).then(async () => {
                await userStore.userLogout();
                $router.replace({path: '/login', query: {redirect: $route.path}});
            });
        } else {
            getUserInfo();//重新查询用户数据
        }
    } else {
        ElMessage.error(`删除用户失败！${result.data}`);
    }
}

//添加、修改用户，用户名自定义校验
function validateUsername(rule: any, value: any, callBack: any) {
    let realValue = value.trim();
    if (realValue.length === 0) {
        //若全输入空格，将其清空
        addUpdateFormData.data.username = '';
        callBack(new Error('用户名必须输入'));
    } else if (realValue.length < 5)
        callBack(new Error('用户名长度不少于5位'));
    else if (realValue.length > 18)
        callBack(new Error('用户名长度不多于18位'));
    else
        callBack();
}

//添加、修改用户，用户昵称自定义校验
function validateName(rule: any, value: any, callBack: any) {
    let realValue = value.trim();
    if (realValue.length === 0) {
        //若全输入空格，将其清空
        addUpdateFormData.data.name = '';
        callBack(new Error('昵称必须输入'));
    } else if (realValue.length > 10)
        callBack(new Error('昵称长度不多于10位'));
    else
        callBack();
}

//添加、修改用户，用户密码自定义校验
function validatePassword(rule: any, value: any, callBack: any) {
    let realValue = value.trim();
    if (realValue.length === 0) {
        //若全输入空格，将其清空
        addUpdateFormData.data.password = '';
        callBack(new Error('密码必须输入'));
    } else if (realValue.length < 6)
        callBack(new Error('密码长度不少于6位'));
    else if (realValue.length > 24)
        callBack(new Error('密码长度不多于24位'));
    else
        callBack();
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
