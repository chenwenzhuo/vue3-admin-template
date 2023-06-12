<template>
    <el-form label-width="88">
        <el-form-item label="SKU名称">
            <el-input v-model="SKUParams.data.skuName" placeholder="请输入SKU名称"/>
        </el-form-item>
        <el-form-item label="价格（元）">
            <el-input v-model="SKUParams.data.price" placeholder="请输入价格" type="number">
                <template #prefix>¥&nbsp;&nbsp;</template>
            </el-input>
        </el-form-item>
        <el-form-item label="重量（克）">
            <el-input v-model="SKUParams.data.weight" placeholder="请输入重量" type="number"/>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input v-model="SKUParams.data.skuDesc" placeholder="请输入描述" type="textarea" :rows="5"/>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true" label-width="80">
                <el-form-item v-for="item in attrArr" :key="item.id"
                              :label="item.attrName" style="margin: 5px 0">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option v-for="attrValue in item.attrValueList" :key="attrValue.id"
                                   :label="attrValue.valueName" :value="`${item.id}:${attrValue.id}`"/>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item v-for="item in saleArr" :key="item.id"
                              :label="item.saleAttrName">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option v-for="saleValue in item.spuSaleAttrValueList" :key="saleValue.id"
                                   :label="saleValue.saleAttrName" :value="`${item.id}:${saleValue.id}`"/>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :header-cell-style="{'textAlign':'center'}"
                      ref="imgTableRef" :data="imgArr">
                <el-table-column type="selection" width="80" align="center"/>
                <el-table-column label="图片" align="center">
                    <template #default="{row}">
                        <img :src="row.imgUrl" alt="" style="width: 160px;max-height: 300px"/>
                    </template>
                </el-table-column>
                <el-table-column prop="imgName" label="名称" align="center"/>
                <el-table-column label="操作" width="150" align="center">
                    <template #default="{row}">
                        <el-button type="primary" @click="handleSetDefaultImg(row)">
                            设为默认
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElMessage, ElTable} from "element-plus";

import {AttrObjList, AttrResponseData} from "@/api/product/attr/type";
import {ImageListResponseData, SaleAttr, SaleAttrResponseData, SKUData, SPUImage} from "@/api/product/spu/types";
import {reqAttrs} from "@/api/product/attr";
import {reqAddSKU, reqExistingSPUSaleAttr, reqSPUImageList} from "@/api/product/spu";

interface SKUParamType {
    data: SKUData
}

const $emits = defineEmits(['changeScene']);
let attrArr = reactive<AttrObjList>([]);//平台属性
let imgArr = reactive<SPUImage[]>([]);//图片数据
let saleArr = reactive<SaleAttr[]>([]);//销售属性

//SKU表单数据对象，多包装一层便于对象赋值时保持响应性
let SKUParams = reactive<SKUParamType>({
    data: {
        skuName: '',
        price: '',
        weight: '',
        skuDesc: '',
        skuDefaultImg: '',
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
    }
});

const imgTableRef = ref<InstanceType<typeof ElTable>>();//图片表格引用

//设置默认图片按钮点击回调
const handleSetDefaultImg = (row: SPUImage) => {
    //保存当前图片URL
    SKUParams.data.skuDefaultImg = row.imgUrl;
    //将当前行设为勾选，先取消所有勾选，再选中当前行，保证只有一个被选择
    imgArr.forEach(item => imgTableRef.value.toggleRowSelection(item, false));
    imgTableRef.value.toggleRowSelection(row, true);
}

//保存按钮点击回调
const handleSave = async () => {
    //整理参数
    attrArr.forEach(item => {
        if (!item.attrIdAndValueId)
            return;
        //将属性id与属性值id分割
        const ids = item.attrIdAndValueId.split(':');
        //加入请求参数对象
        SKUParams.data.skuAttrValueList.push({
            attrId: ids[0],
            valueId: ids[1],
        });
    });
    saleArr.forEach(item => {
        if (!item.saleIdAndValueId)
            return;
        //将属性id与属性值id分割
        const ids = item.saleIdAndValueId.split(':');
        //加入请求参数对象
        SKUParams.data.skuSaleAttrValueList.push({
            saleAttrId: ids[0],
            saleAttrValueId: ids[1],
        });
    });
    //发送请求
    const result: any = await reqAddSKU(SKUParams.data);
    if (result.code === 200) {
        ElMessage.success('添加SKU成功！');
        handleCancel();
    } else {
        ElMessage.error(`添加SKU失败！${result.data}`);
    }
}

//取消按钮点击回调
const handleCancel = () => {
    $emits('changeScene', {scene: 0});
    //清除数据
    attrArr.length = 0;
    imgArr.length = 0;
    saleArr.length = 0;
    SKUParams.data = {};
}

//初始化数据
const initSKUData = async (params: any) => {
    //保存从父组件获取的参数
    SKUParams.data.category3id = params.c3Id;
    SKUParams.data.spuId = params.spu.id;
    SKUParams.data.tmId = params.spu.tmId;
    //发送请求获取数据
    const results: (AttrResponseData | ImageListResponseData | SaleAttrResponseData)[] =
        await Promise.all([
            reqAttrs(params.c1Id, params.c2Id, params.c3Id),
            reqSPUImageList(params.spu.id),
            reqExistingSPUSaleAttr(params.spu.id)
        ]);
    //保存数据
    console.log('initSKUData results---------', results);
    if (results[0].code === 200) {
        attrArr.length = 0;
        results[0].data.forEach(item => attrArr.push(item));
    }
    if (results[1].code === 200) {
        imgArr.length = 0;
        results[1].data.forEach(item => imgArr.push(item));
    }
    if (results[2].code === 200) {
        saleArr.length = 0;
        results[2].data.forEach(item => saleArr.push(item));
    }
}

defineExpose({initSKUData});
</script>

<style scoped lang="scss">

</style>
