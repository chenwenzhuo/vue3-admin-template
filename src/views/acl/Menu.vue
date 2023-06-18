<template>
    <el-table border :data="menuTableData.data"
              row-key="id" :expand-row-keys="['1']"
              style="width: 100%; margin-bottom: 20px"
              :header-cell-style="{'textAlign':'center'}">
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="code" label="权限值" align="center"/>
        <el-table-column prop="updateTime" label="修改时间" align="center"/>
        <el-table-column label="操作" width="300" align="center">
            <template #default="{row,$index}">
                <el-button type="primary" size="small" v-show="row.level<=3"
                           @click="handleAddMenu(row)">
                    {{ row.level >= 3 ? '添加功能' : '添加菜单' }}
                </el-button>
                <el-button type="primary" size="small" :disabled="row.level===1"
                           @click="handleUpdateMenu(row)">
                    编辑
                </el-button>
                <el-popconfirm :title="`是否确认删除菜单：${row.name}？`"
                               width="240" @confirm="handleRemoveMenu(row)">
                    <template #reference>
                        <el-button type="danger" size="small" :disabled="row.level===1">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>

  <!--添加、修改菜单弹窗-->
    <el-dialog :model-value="dialogDisplayStatus!==0" :title="dialogTitle"
               :width="dialogWidth" @close="onDialogClose">
        <el-form :model="addUpdateMenuData.data" :rules="addUpdateFormRules"
                 ref="addUpdateMenuFormRef" label-width="80">
            <el-form-item prop="name" label="菜单名称">
                <el-input v-model="addUpdateMenuData.data.name" placeholder="请输入菜单名称"/>
            </el-form-item>
            <el-form-item prop="code" label="权限值">
                <el-input v-model="addUpdateMenuData.data.code" placeholder="请输入权限值"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="confirmAddUpdateMenu">确认</el-button>
            <el-button @click="onDialogClose">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";

import type {Menu, MenuResponseData} from "@/api/acl/menu/types";
import {reqAddOrUpdateMenu, reqAllMenus, reqRemoveMenu} from "@/api/acl/menu";
import {ElMessage} from "element-plus";

interface MenuTableDataType {
    data: Menu[]
}

interface AddUpdateMenuDataType {
    data: Menu
}

let menuTableData = reactive<MenuTableDataType>({data: []});//菜单表格数据
//控制添加、更新菜单弹窗展示。0-隐藏，1-添加，2-更新
let dialogDisplayStatus = ref<number>(0);
let dialogTitle: string = computed(() => {//弹窗标题
    if (dialogDisplayStatus.value === 1)
        return '添加菜单';
    else if (dialogDisplayStatus.value === 2)
        return '更新菜单';
    return '';
});
let dialogWidth: string = computed(() => {
    let clientWidth = document.body.clientWidth;
    if (clientWidth <= 1200)
        return '50%';
    return '600px';
});

const addUpdateMenuFormRef = ref<FormInstance>();//添加、修改菜单表单实例引用
let addUpdateMenuData = reactive<AddUpdateMenuDataType>({data: {}});//添加、修改菜单表单数据
const addUpdateFormRules = reactive<FormRules>({
    name: [{required: true, message: '菜单名称必须输入'}],
    code: [{required: true, message: '权限值必须输入'}],
});

//获取菜单数据
const getMenusData = async () => {
    const result: MenuResponseData = await reqAllMenus();
    if (result.code === 200) {
        menuTableData.data = result.data;
    }
}

//添加按钮点击事件
const handleAddMenu = (row: Menu) => {
    dialogDisplayStatus.value = 1;//打开弹窗
    //清除表单校验结果
    nextTick(() => addUpdateMenuFormRef.value?.clearValidate());
    //新菜单的等级，应为当前菜单的子菜单。为level（菜单等级）和pid（父菜单等级）赋值
    addUpdateMenuData.data.level = row.level + 1;
    addUpdateMenuData.data.pid = row.level;
}

//编辑按钮点击事件
const handleUpdateMenu = (row: Menu) => {
    dialogDisplayStatus.value = 2;//打开弹窗
    //清除表单校验结果
    nextTick(() => addUpdateMenuFormRef.value?.clearValidate());
    Object.assign(addUpdateMenuData.data, row);
}

//弹窗确认按钮点击回调
const confirmAddUpdateMenu = () => {
    addUpdateMenuFormRef.value?.validate(async valid => {
        if (!valid)
            return;
        const result: any = await reqAddOrUpdateMenu(addUpdateMenuData.data);
        if (result.code === 200) {
            ElMessage.success(`${dialogDisplayStatus.value === 1 ? '添加' : '更新'}成功！`);
            getMenusData();//重新查询数据
            onDialogClose();//关闭弹窗
        } else {
            ElMessage.error(`${dialogDisplayStatus.value === 1 ? '添加' : '更新'}失败！${result.data}`);
        }
    });
}

//弹窗关闭回调
const onDialogClose = () => {
    dialogDisplayStatus.value = 0;//关闭弹窗
    addUpdateMenuData.data = {};//清除数据
}

//删除菜单
const handleRemoveMenu = async (row: Menu) => {
    const result: any = await reqRemoveMenu(row.id);
    if (result.code === 200) {
        ElMessage.success('删除成功！');
        getMenusData();//重新查询数据
    } else {
        ElMessage.error(`删除失败！${result.data}`);
    }
}

onMounted(() => getMenusData());
</script>

<style scoped lang="scss">

</style>
