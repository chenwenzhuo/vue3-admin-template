<template>
    <el-form label-width="100">
        <el-form-item label="SPU名称">
            <el-input v-model="spuParams.data.spuName" placeholder="请输入SPU名称"/>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="spuParams.data.tmId">
                <el-option v-for="item in allTrademarks" :key="item.id"
                           :label="item.tmName" :value="item.id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input v-model="spuParams.data.description" :rows="5"
                      type="textarea" placeholder="请输入SPU描述"/>
        </el-form-item>
        <el-form-item label="SPU图片">
            <!--照片墙-->
            <el-upload v-model:file-list="picCardFileList"
                       action="/api/admin/product/fileUpload"
                       list-type="picture-card"
                       :on-preview="handlePicCardPreview"
                       :before-upload="beforeImgUpload"
                       :on-success="imgUploadSuccess"
                       :on-remove="handlePicCardRemove">
                <el-icon>
                    <Plus/>
                </el-icon>
            </el-upload>
            <!--照片墙预览对话框-->
            <el-dialog v-model="picCardPreview" width="40%" @close="handlePicCardPreviewClose">
                <img :src="picCardPreviewUrl" alt="Preview Image" style="width: 100%"/>
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <!--SPU销售属性下拉框需要收集属性id和属性名，将两属性以json字符串形式返回，作为下拉框的value-->
            <el-select :placeholder="`剩余${saleAttrToSelect.length}个属性待选择`"
                       v-model="saleAttrIdAndValueName" clearable>
                <el-option v-for="item in saleAttrToSelect" :key="item.id"
                           :label="item.name" :value="JSON.stringify({id:item.id, name:item.name})"/>
            </el-select>
            <!--仅当下拉框有选择时启用按钮-->
            <el-button type="primary" icon="Plus" style="margin-left: 15px"
                       :disabled="!saleAttrIdAndValueName"
                       @click="addSaleAttr">
                添加属性
            </el-button>
            <el-table border :header-cell-style="{'textAlign':'center'}" style="margin-top: 15px"
                      :data="existingSPUSaleAttr">
                <el-table-column type="index" label="序号" width="80" align="center"/>
                <el-table-column prop="saleAttrName" label="销售属性名字" width="150" align="center"/>
                <el-table-column label="销售属性值">
                    <template #default="{row,$index}">
                        <!--点击关闭tag时，将对应数据从数组中移除-->
                        <el-tag v-for="(item,index) in row.spuSaleAttrValueList"
                                :key="item.id" style="margin: 5px" closable
                                @close="()=>row.spuSaleAttrValueList.splice(index,1)">
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <!--销售属性值输入框和新增按钮，默认显示按钮，点击按钮显示输入框，完成输入后输入框隐藏，重新显示按钮-->
                        <el-input :ref="(vc:any)=>saleAttrValueInputs[$index]=vc"
                                  size="small" style="width: 120px"
                                  v-model="row.saleAttrValue" v-show="row.editFlag"
                                  @blur="saleAttrValueInputBlur(row)"/>
                        <el-button type="primary" size="small" icon="Plus"
                                   v-show="!row.editFlag" @click="addSaleAttrValue(row,$index)"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template #default="{$index}">
                        <el-button type="danger" icon="Delete"
                                   @click="()=>existingSPUSaleAttr.splice($index,1)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
            <el-button type="primary" @click="saveSPU">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";

import type {
    AllTrademarkResponseData,
    ImageListResponseData,
    SaleAttrResponseData,
    ExistingSaleAttrResponseData,
    SPUData, Trademark, SPUImage,
    SaleAttr, ExistingSaleAttr, SaleAttrValue,
} from "@/api/product/spu/types";
import {
    reqAddOrUpdateSPU,
    reqAllSaleAttr, reqAllTrademark,
    reqExistingSPUSaleAttr, reqSPUImageList
} from "@/api/product/spu";
import {ElMessage, UploadProps} from "element-plus";

interface SPUParamsType {
    data: SPUData
}

const $emits = defineEmits(['changeScene']);
//存储SPU数据
const allTrademarks = reactive<Trademark[]>([]);//全部品牌数据
const spuImageList = reactive<SPUImage[]>([]);//某一个品牌旗下全部售卖商品的图片
const existingSPUSaleAttr = reactive<SaleAttr[]>([]);//已有的SPU销售属性的数据
const allSaleAttr = reactive<ExistingSaleAttr[]>([]);//整个项目全部SPU的销售属性
//existingSPUSaleAttr是allSaleAttr的子集，
//existingSPUSaleAttr展示在表格中，allSaleAttr展示在SPU销售属性下拉框，
//每从下拉框中选择一项，表格中新增一行，同时下拉框中被选择的项移除
//计算集合allSaleAttr减去集合existingSPUSaleAttr的结果
let saleAttrToSelect = computed(() => {
    return allSaleAttr.filter(allItem => {
        //在existingSPUSaleAttr中查找allSaleAttr的每个元素
        //若找到，则saleAttrToSelect中不能包含此元素，故返回!findInEx
        const findInEx = existingSPUSaleAttr.find(exItem => exItem.saleAttrName === allItem.name);
        return !findInEx;
    });
});

//SPU表单数据。需要额外包裹一层，否则在对象赋值时回丢失响应性
let spuParams = reactive<SPUParamsType>({
    data: {}
});
const picCardFileList = reactive([]);//照片墙文件列表
let picCardPreview = ref<boolean>(false);//照片墙预览对话框是否展示
let picCardPreviewUrl = ref<string>('');//照片墙预览图片url

let saleAttrIdAndValueName = ref<string>('');//SPU销售属性下拉框被选择项的值
let saleAttrValueInputs = reactive<any>([]);//SPU销售属性表格中，属性值input组件ref数组

//照片墙文件上传前回调
const beforeImgUpload: UploadProps['beforeUpload'] = rawFile => {
    if (rawFile.type !== 'image/jpeg' &&
        rawFile.type !== 'image/png' &&
        rawFile.type !== 'image/gif') {
        ElMessage.error('图片应为jpeg、png或gif格式！');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小应小于2MB！');
        return false;
    }
    return true;
}

//照片墙上传成功回调
const imgUploadSuccess = (response, uploadFile) => {
    //将数据插入spuImageList中
    spuImageList.push({
        imgName: uploadFile.name,
        imgUrl: response.data
    });
}

//照片墙删除文件回调
const handlePicCardRemove = (uploadFile, uploadFiles) => {
    console.log('handlePicCardRemove-----------', uploadFile, uploadFiles);
    //picCardFileList中数据会自动删除，手动删除spuImageList中对应数据
    //寻找待删除数据在spuImageList中的下标
    let targetIndex = -1;
    spuImageList.forEach((item, index) => {
        if (item.imgUrl === uploadFile.url)
            targetIndex = index;
    });
    if (targetIndex !== -1)//找到有效下标，删除对应数据
        spuImageList.splice(targetIndex, 1);
}

//照片墙预览回调
const handlePicCardPreview = (file: any) => {
    picCardPreviewUrl.value = file.url;
    picCardPreview.value = true;
}

//照片墙预览对话框关闭回调
const handlePicCardPreviewClose = () => {
    picCardPreview.value = false;
    picCardPreviewUrl.value = '';
}

//SPU销售属性-添加属性按钮点击回调
const addSaleAttr = () => {
    //将属性id和属性名的json字符串转为json对象
    const obj = JSON.parse(saleAttrIdAndValueName.value);
    //向表格数据中追加一条，对应表格中增加一行
    const attrObj: SaleAttr = {
        baseSaleAttrId: obj.id,
        saleAttrName: obj.name,
        spuSaleAttrValueList: []
    };
    existingSPUSaleAttr.push(attrObj);
    //清空数据
    saleAttrIdAndValueName.value = '';
}

//SPU销售属性-表格“销售属性值”列中添加属性值按钮的点击回调
const addSaleAttrValue = (row: SaleAttr, $index: number) => {
    row.editFlag = true;//切换到编辑属性值模式
    saleAttrValueInputs[$index].focus();//输入框自动获取焦点
}

//SPU销售属性-表格“销售属性值”列中input输入框的blur事件回调
const saleAttrValueInputBlur = (row: SaleAttr) => {
    //属性值不能重复
    const repeat = row.spuSaleAttrValueList.find(item => item.saleAttrValueName === row.saleAttrValue);
    if (repeat) {
        ElMessage.error('属性值不能重复！');
    } else if (!row.saleAttrValue || row.saleAttrValue.trim() === '') {
        ElMessage.error('属性值不能为空！');
    } else {
        //属性值合法，加入list
        const obj: SaleAttrValue = {
            baseSaleAttrId: row.baseSaleAttrId,
            saleAttrValueName: row.saleAttrValue
        };
        row.spuSaleAttrValueList.push(obj);
    }
    //退出编辑模式
    row.editFlag = false;
    row.saleAttrValue = '';
}

//保存按钮点击回调
const saveSPU = async () => {
    //整理参数（照片墙、销售属性）
    spuParams.data.spuImageList = [...spuImageList];
    spuParams.data.spuSaleAttrList = [...existingSPUSaleAttr];
    //发送请求
    const result = await reqAddOrUpdateSPU(spuParams.data);
    console.log('saveSPU result-------', result);
    if (result.code === 200) {
        ElMessage.success(`${spuParams.data.id ? '更新' : '新增'}成功！`);
        //返回主页
        handleCancel();
    } else {
        ElMessage.error(`${spuParams.data.id ? '更新' : '新增'}失败！${result.data}`);
    }
}

//初始化SPU数据
const initSPUData = async (spu: SPUData) => {
    spuParams.data = spu;//更新时，保存传入的表单数据

    //获取数据，分别为：
    //全部品牌数据、某一个品牌旗下全部售卖商品的图片、已有的SPU销售属性的数据、整个项目全部SPU的销售属性
    const results: (AllTrademarkResponseData | ImageListResponseData | SaleAttrResponseData | ExistingSaleAttrResponseData)[]
        = await Promise.all([reqAllTrademark(), reqSPUImageList(spu.id), reqExistingSPUSaleAttr(spu.id), reqAllSaleAttr()]);
    //保存数据
    if (results[0].code === 200) {
        allTrademarks.length = 0;
        results[0].data.forEach(item => allTrademarks.push(item));
    }
    if (results[1].code === 200) {
        spuImageList.length = 0;
        results[1].data.forEach(item => spuImageList.push(item));
        spuImageList.forEach(item => picCardFileList.push({
            name: item.imgName, url: item.imgUrl
        }));
    }
    if (results[2].code === 200) {
        existingSPUSaleAttr.length = 0;
        results[2].data.forEach(item => existingSPUSaleAttr.push(item));
    }
    if (results[3].code === 200) {
        allSaleAttr.length = 0;
        results[3].data.forEach(item => allSaleAttr.push(item));
    }
}

//取消按钮点击回调
const handleCancel = () => {
    $emits('changeScene', {scene: 0});
    //清除SPU数据
    allTrademarks.length = 0;
    spuImageList.length = 0;
    existingSPUSaleAttr.length = 0;
    allSaleAttr.length = 0;
    spuParams.data = {};
    picCardFileList.length = 0;
}

//对外暴露组件方法
defineExpose({initSPUData});
</script>

<style scoped lang="scss">

</style>
