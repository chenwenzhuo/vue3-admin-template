<template>
  <!--顶部搜索角色部分-->
    <el-card>
        <el-form inline class="search-role-form">
            <el-form-item>
                <el-input placeholder="请输入角色关键字"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
                <el-button type="primary">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
  <!--角色列表部分-->
    <el-card class="box-card-table">
        <template #header>
            <el-button type="primary" icon="Plus">添加角色</el-button>
        </template>

        <el-table border>
            <el-table-column type="index" label="序号" width="80" align="center"/>
            <el-table-column label="ID" width="80" align="center"/>
            <el-table-column label="职位名称" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="更新时间" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="操作" width="280" align="center" fixed="right">
                <template #default="{row}">
                    <el-button type="primary" icon="User" size="small">分配权限</el-button>
                    <el-button type="primary" icon="Eidt" size="small">编辑</el-button>
                    <el-button type="danger" icon="Delete" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="->,prev,pager,next,total,sizes,jumper"
                       v-model:current-page="pageNo" v-model:page-size="pageSize"
                       :page-sizes="[10,20,30]" :total="total"/>
    </el-card>
</template>

<script setup lang="ts">
import {ref} from "vue";

let pageNo = ref<number>(1);//分页组件当前页码
let pageSize = ref<number>(10);//分页组件页大小
let total = ref<number>(100);//分页组件数据总条数
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