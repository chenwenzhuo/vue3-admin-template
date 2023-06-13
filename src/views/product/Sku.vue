<template>
    <el-card>
        <el-table border :data="skuTableData">
            <el-table-column type="index" label="序号" width="80" align="center"/>
            <el-table-column prop="skuName" label="名称" width="180" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="skuDesc" label="描述" width="180" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="图片" width="200" align="center">
                <template #default="{row}">
                    <img :src="row.skuDefaultImg" alt="SKU图片" style="width: 150px">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量（克）" width="180" align="center"/>
            <el-table-column prop="price" label="价格（元）" width="180" align="center"/>
            <el-table-column label="操作" width="240" align="center" fixed="right">
                <template #default="{row}">
                    <el-button type="primary" icon="Upload" size="small">上架</el-button>
                    <el-button type="primary" icon="Edit" size="small">编辑</el-button>
                    <div style="margin: 5px 0"></div>
                    <el-button type="primary" icon="InfoFilled" size="small">详情</el-button>
                    <el-button type="danger" icon="Delete" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
                       background layout="->,prev,pager,next,total,sizes,jumper" :total="total"
                       @current-change="getSKUData" @size-change="getSKUData"
                       style="margin-top: 15px"/>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

import {SKUData} from "@/api/product/spu/types";
import type {SKUResponseData} from "@/api/product/sku/types";
import {reqSKUList} from "@/api/product/sku";

let skuTableData = reactive<SKUData[]>([]);
let pageNo = ref<number>(1);//表格当前页码
let pageSize = ref<number>(5);//表格页大小
let total = ref<number>(0);//表格数据总条数

//查询SKU数据
const getSKUData = async () => {
    const result: SKUResponseData = await reqSKUList(pageNo.value, pageSize.value);
    if (result.code !== 200) {
        ElMessage.error(`获取数据失败！${result.data}`);
        return;
    }
    console.log('getSKUData result--------', result);
    skuTableData.length = 0;
    result.data.records.forEach(item => skuTableData.push(item));
    total.value = result.data.total;
}

onMounted(() => {
    getSKUData();
})
</script>

<style scoped lang="scss">

</style>
