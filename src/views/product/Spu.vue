<template>
    <CategorySelect :selector-enabled="scene===0"/>

    <el-card class="box-card">
        <!--展示SPU信息-->
        <div v-show="scene===0">
            <el-button type="primary" icon="Plus" class="add-spu"
                       @click="handleAddSPU">
                添加SPU
            </el-button>

            <el-table :data="SPUTableData" border :header-cell-style="{'textAlign':'center'}">
                <el-table-column type="index" label="序号" width="80" align="center"/>
                <el-table-column prop="spuName" label="SPU名称"/>
                <el-table-column prop="description" label="SPU描述"/>
                <el-table-column label="SPU操作" width="240" align="center">
                    <template #default="{row}">
                        <el-button type="primary" icon="Plus" size="small"
                                   @click="handleAddSKU(row)">
                            添加
                        </el-button>
                        <el-button type="primary" icon="Edit" size="small"
                                   @click="handleUpdateSPU(row)">
                            编辑
                        </el-button>
                        <div style="margin: 3px 0"></div>
                        <el-button type="primary" icon="View" size="small" @click="handleViewSKUs(row)">
                            查看
                        </el-button>
                        <el-popconfirm title="是否确认删除此SPU？" width="200"
                                       @confirm="handleRemoveSPU(row)">
                            <template #reference>
                                <el-button type="danger" icon="Delete" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="->,prev,pager,next,total,sizes,jumper"
                           :total="total" :page-sizes="[5,10,20]" :pager-count="5"
                           v-model:current-page="pageNo" v-model:page-size="limit"
                           @current-change="getExistingSPU" @size-change="handlePageSizeChange"/>
        </div>

        <!--添加、修改SPU-->
        <SpuForm ref="spuFormRef" v-show="scene===1" @changeScene="changeScene"/>

        <!--添加SKU的结构-->
        <SkuForm ref="skuFormRef" v-show="scene===2" @changeScene="changeScene"/>

        <!--查看SPU下SKU-->
        <el-dialog :model-value="viewSKUDialogDisplay" title="SKU列表"
                   @close="handleCloseDialog">
            <el-table :data="SKUDialogData" border>
                <el-table-column type="index" label="序号" width="80" align="center"/>
                <el-table-column prop="skuName" label="名称" width="240" align="center"/>
                <el-table-column prop="price" label="价格（元）" width="100" align="center"/>
                <el-table-column prop="weight" label="重量（克）" width="100" align="center"/>
                <el-table-column label="图片" align="center">
                    <template #default="{row}">
                        <img :src="row.skuDefaultImg" alt="图片" style="width: 160px"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";

import CategorySelect from "@/components/CategorySelect.vue";
import SpuForm from "@/views/product/SpuForm.vue";
import SkuForm from "@/views/product/SkuForm.vue";
import {useCategoryStore} from "@/stores/modules/category";
import type {
    ExistingSPUResponseData, Records, SKUData, SkuInfoData, SPUData
} from "@/api/product/spu/types";
import {reqSKUList, reqExistingSPU, reqRemoveSPU} from "@/api/product/spu";

const categoryStore = useCategoryStore();
let pageNo = ref<number>(1);//表格当前页码
let limit = ref<number>(10);//表格每页数据条数
let total = ref<number>(0);//表格总数据条数
const SPUTableData = reactive<Records>([]);//SPU表格数据

//控制页面场景切换。0:显示已有SPU，1:添加或者修改已有SPU，2:添加SKU的结构
let scene = ref<number>(0);
const spuFormRef = ref<any>();//子组件SpuForm实例
const skuFormRef = ref<any>();//子组件SkuForm实例

let viewSKUDialogDisplay = ref<boolean>(false);//查看SPU下SKU对话框是否展示
let SKUDialogData = reactive<SKUData[]>([]);//查看SPU下SKU对话框展示的数据

//监听仓库中三级分类id，有值时查询SPU数据
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) {
        //id为空，清空数据，不进行查询
        SPUTableData.length = 0;
        return;
    }
    getExistingSPU();
});

//发送请求查询SPU数据
const getExistingSPU = async () => {
    const result: ExistingSPUResponseData = await reqExistingSPU(pageNo.value, limit.value, categoryStore.c3Id);
    if (result.code === 200) {
        SPUTableData.length = 0;//清空已有数据
        result.data.records.forEach(item => SPUTableData.push(item));
        total.value = result.data.total;
    }
}

//分页器页大小变化的回调
const handlePageSizeChange = () => {
    pageNo.value = 1;
    getExistingSPU();
}

//添加SPU的回调
const handleAddSPU = () => {
    scene.value = 1;//切换到添加页面
    spuFormRef.value.initSPUData_Add(categoryStore.c3Id);
}

//添加SKU的点击回调
const handleAddSKU = (row: SPUData) => {
    scene.value = 2;//切换到添加SKU页面
    skuFormRef.value.initSKUData({
        c1Id: categoryStore.c1Id,
        c2Id: categoryStore.c2Id,
        c3Id: categoryStore.c3Id,
        spu: row
    });
}

//修改SPU的点击回调
const handleUpdateSPU = (row: SPUData) => {
    scene.value = 1;//切换到添加/修改页面
    //调用子组件方法，初始化数据
    spuFormRef.value.initSPUData(row);
}

//查看SPU下SKU按钮的点击回调
const handleViewSKUs = async (row: SPUData) => {
    const result: SkuInfoData = await reqSKUList(row.id);
    if (result.code === 200) {
        viewSKUDialogDisplay.value = true;//展示弹窗
        result.data.forEach(item => SKUDialogData.push(item));
    } else {
        ElMessage.error(`查询数据失败！${result.data}`);
    }
}

//删除SPU按钮点击回调
const handleRemoveSPU = async (row: SPUData) => {
    const result: any = await reqRemoveSPU(row.id);
    if (result.code == 200) {
        ElMessage.success('删除成功！');
        getExistingSPU();//重新查询数据
    } else {
        ElMessage.error(`删除失败！${result.data}`);
    }
}

//查看SPU下SKU弹窗关闭的回调
const handleCloseDialog = () => {
    viewSKUDialogDisplay.value = false;//关闭弹窗
    SKUDialogData.length = 0;//清除数据
}

//切换场景，传递给子组件使用
const changeScene = (obj: any) => {
    scene.value = obj.scene;
    //重新查询SPU表格数据
    if (obj.param === 'update') {
        //执行完更新SPU业务，回到展示界面，则表格停留在当前页
        getExistingSPU();
    } else if (obj.param === 'add') {
        //执行完新增SPU业务，回到展示界面，则表格回到第一页
        pageNo.value = 1;
        getExistingSPU();
    }
}
</script>

<style scoped lang="scss">
.box-card {
  .add-spu {
    margin-bottom: 15px;
  }

  .el-pagination {
    margin-top: 15px
  }
}
</style>
