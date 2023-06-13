<template>
    <el-card>
        <el-table border :data="skuTableData">
            <el-table-column type="index" label="序号" width="80" align="center"/>
            <el-table-column prop="skuName" label="名称" width="180" align="center" :show-overflow-tooltip="true"/>
            <el-table-column prop="skuDesc" label="描述" width="180" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="图片" width="200" align="center">
                <template #default="{row}">
                    <img :src="row.skuDefaultImg" alt="SKU图片" style="max-width: 120px;max-height: 120px">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量（克）" width="180" align="center"/>
            <el-table-column prop="price" label="价格（元）" width="180" align="center"/>
            <el-table-column label="操作" width="240" align="center" fixed="right">
                <template #default="{row}">
                    <el-button type="primary" :icon="row.isSale===0?'Upload':'Download'"
                               size="small" @click="handleUpdateSaleStatus(row)">
                        {{ row.isSale === 0 ? '上架' : '下架' }}
                    </el-button>
                    <el-button type="primary" icon="Edit" size="small" @click="updateSku">编辑</el-button>
                    <div style="margin: 5px 0"></div>
                    <el-button type="info" icon="InfoFilled" size="small"
                               @click="showSKUDetail(row)">
                        详情
                    </el-button>
                    <el-popconfirm title="是否确认删除此商品？" width="200"
                                   @confirm="handleDeleteSKU(row)">
                        <template #reference>
                            <el-button type="danger" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
                       background layout="->,prev,pager,next,total,sizes,jumper" :total="total"
                       @current-change="getSKUData" @size-change="getSKUData"
                       style="margin-top: 15px"/>

        <el-drawer v-model="drawerVisible" direction="rtl" size="40%"
                   title="商品详情" @close="onDrawerClose">
            <el-row style="margin-bottom: 15px">
                <el-col :span="6">
                    <span style="font-size: 20px">名称</span>
                </el-col>
                <el-col :span="18">
                    <span>{{ drawerData.data.skuName }}</span>
                </el-col>
            </el-row>
            <el-row style="margin-bottom: 15px">
                <el-col :span="6">
                    <span style="font-size: 20px">详情</span>
                </el-col>
                <el-col :span="18">
                    <span>{{ drawerData.data.skuDesc }}</span>
                </el-col>
            </el-row>
            <el-row style="margin-bottom: 15px">
                <el-col :span="6">
                    <span style="font-size: 20px">价格</span>
                </el-col>
                <el-col :span="18">
                    <span>{{ drawerData.data.price }}元</span>
                </el-col>
            </el-row>
            <el-row style="margin-bottom: 15px">
                <el-col :span="6">
                    <span style="font-size: 20px">平台属性</span>
                </el-col>
                <el-col :span="18">
                    <el-tag v-for="item in drawerData.data.skuAttrValueList" :key="item.id"
                            style="margin:0 5px 5px 0">
                        {{ item.valueName }}
                    </el-tag>
                </el-col>
            </el-row>
            <el-row style="margin-bottom: 15px">
                <el-col :span="6">
                    <span style="font-size: 20px">销售属性</span>
                </el-col>
                <el-col :span="18">
                    <el-tag v-for="item in drawerData.data.skuSaleAttrValueList" :key="item.id"
                            style="margin:0 5px 5px 0">
                        {{ item.saleAttrValueName }}
                    </el-tag>
                </el-col>
            </el-row>
            <el-row style="margin-bottom: 15px">
                <el-col :span="6">
                    <span style="font-size: 20px">商品图片</span>
                </el-col>
                <el-col :span="18">
                    <el-carousel :interval="2000" arrow="always" type="card"
                                 v-show="!!drawerData.data.skuImageList && drawerData.data.skuImageList.length>0">
                        <el-carousel-item v-for="item in drawerData.data.skuImageList"
                                          :key="item.id" style="display: flex;align-items: center">
                            <img :src="item.imgUrl" alt="" style="width:200px;max-height: 200px;">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

import {SKUData, SkuInfoData} from "@/api/product/sku/types";
import type {SKUResponseData} from "@/api/product/sku/types";
import {reqCancelSaleSku, reqRemoveSku, reqSaleSku, reqSkuInfo, reqSKUList} from "@/api/product/sku";

interface DrawerDataType {
    data: SKUData
}

let skuTableData = reactive<SKUData[]>([]);
let pageNo = ref<number>(1);//表格当前页码
let pageSize = ref<number>(5);//表格页大小
let total = ref<number>(0);//表格数据总条数

let drawerVisible = ref<boolean>(false);//商品详情抽屉展示状态
let drawerData = reactive<DrawerDataType>({data: {}});//抽屉组件数据

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

//商品上架/下架
const handleUpdateSaleStatus = async (row: SKUData) => {
    let result: any = null;
    let info: string = '';
    if (row.isSale === 0) {
        result = await reqSaleSku(row.id);
        info = '上架';
    } else if (row.isSale === 1) {
        result = await reqCancelSaleSku(row.id);
        info = '下架';
    }

    if (result && result.code === 200) {
        ElMessage.success(`${info}成功！`);
        getSKUData();//重新查询数据
    } else {
        ElMessage.error(`${info}失败！`);
    }
}

//更新已有的SKU
const updateSku = () => {
    ElMessage({type: "success", message: "程序员在努力的更新中...."});
};

//详情按钮点击事件
const showSKUDetail = async (row: SKUData) => {
    drawerVisible.value = true;//展示抽屉组件
    const result: SkuInfoData = await reqSkuInfo(row.id);
    if (result.code === 200) {
        drawerData.data = result.data;
    }
}

//删除SKU按钮点击回调
const handleDeleteSKU = async (row: SKUData) => {
    const result: any = await reqRemoveSku(row.id);
    if (result.code === 200) {
        ElMessage.success('删除成功！');
        getSKUData();//重新查询数据
    } else {
        ElMessage.error(`删除失败！${result.data}`);
    }
}

//抽屉组件关闭的回调
const onDrawerClose = () => {
    drawerVisible.value = false;//关闭抽屉组件
    drawerData.data = {};
}

onMounted(() => {
    getSKUData();
})
</script>

<style scoped lang="scss">

</style>
