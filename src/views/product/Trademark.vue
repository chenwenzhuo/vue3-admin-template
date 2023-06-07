<template>
    <el-card class="box-card">
        <!--顶部添加品牌按钮-->
        <el-button type="primary" icon="Plus">添加品牌</el-button>
        <!--表格组件，展示品牌数据-->
        <el-table :data="tableData" border class="trademark-table">
            <el-table-column label="序号" type="index" width="80px" align="center"/>
            <el-table-column prop="tmName" label="品牌名称" align="center"/>
            <el-table-column label="品牌Logo" align="center">
                <template #default="{row}">
                    <img :src="row.logoUrl" alt="Logo加载失败" class="trademark-logo"/>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="操作" align="center">
                <template #default="{row}">
                    <el-button type="primary" icon="Edit">编辑</el-button>
                    <el-button type="danger" icon="Delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination background layout="->,prev, pager, next, total, sizes, jumper" :total="total"
                       v-model:current-page="pageNo" v-model:page-size="limit"
                       :page-sizes="[5,10,20]" :pager-count="5"
                       @current-change="reqTrademarkData"
                       @size-change="handlePageSizeChange"/>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {reqExistingTrademark} from "@/api/product/trademark";
import type {Records, TrademarkResponseData} from "@/api/product/trademark/types";

let tableData = reactive<Records>([]);
let pageNo = ref<number>(1);//表格当前页码
let limit = ref<number>(10);//表格每页数据条数
let total = ref<number>(0);//表格总数据条数

//获取已有品牌
const reqTrademarkData = async () => {
    const result: TrademarkResponseData = await reqExistingTrademark(pageNo.value, limit.value);
    if (result.code === 200) {
        tableData.length = 0;//清空数据
        //将查询到的数据加入本地数据数组
        result.data.records.forEach(item => tableData.push(item));
        total.value = result.data.total;//保存数据总数
    }
}

//表格分页大小改变的回调
const handlePageSizeChange = () => {
    pageNo.value = 1;//回到第一页
    reqTrademarkData();//查询数据
}

onMounted(() => {
    reqTrademarkData();
});
</script>

<style scoped lang="scss">
.box-card {
  .trademark-table {
    margin-top: 20px;

    .trademark-logo {
      width: 80px;
    }
  }

  .el-pagination {
    margin-top: 15px;
  }
}
</style>
