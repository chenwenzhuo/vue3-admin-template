<template>
    <div>
        <el-card class="box-card">
            <!--顶部添加品牌按钮-->
            <el-button type="primary" icon="Plus" @click="handleAddTrademark">
                添加品牌
            </el-button>
            <!--表格组件，展示品牌数据-->
            <el-table :data="tableData" border class="trademark-table">
                <el-table-column label="序号" type="index" width="80px" align="center"/>
                <el-table-column prop="tmName" label="品牌名称" align="center"/>
                <el-table-column label="品牌Logo" align="center">
                    <template #default="{row}">
                        <img :src="row.logoUrl" alt="Logo加载失败" class="trademark-logo"/>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"/>
                <el-table-column prop="updateTime" label="最近修改" align="center"/>
                <el-table-column label="操作" align="center">
                    <template #default="{row}">
                        <el-button type="primary" icon="Edit" @click="handleUpdateTrademark(row)">
                            编辑
                        </el-button>
                        <el-popconfirm :title="`是否确认删除品牌：${row.tmName}？`" width="250"
                                       icon="WarnTriangleFilled" icon-color="#ff0000"
                                       confirm-button-type="danger"
                                       confirm-button-text="确认删除"
                                       @confirm="handleDeleteTrademark(row)">
                            <template #reference>
                                <el-button type="danger" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
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
        <!--添加、修改品牌对话框-->
        <el-dialog :model-value="dialogDisplayStatus === 1 || dialogDisplayStatus === 2"
                   :title="dialogTitle" :width="dialogWidth" @close="closeDialog">
            <el-form ref="trademarkFormRef" :rules="trademarkFormRules"
                     :model="trademarkParams" label-width="85">
                <el-form-item label="品牌名称" prop="tmName">
                    <el-input v-model="trademarkParams.tmName" placeholder="请输入品牌名称" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="品牌Logo" prop="logoUrl">
                    <!-- upload组件action属性需要带上前缀/api，否则代理服务器不会发送请求 -->
                    <el-upload class="avatar-uploader" :show-file-list="false"
                               action="/api/admin/product/fileUpload"
                               :before-upload="beforeLogoUpload"
                               :on-success="handleAvatarSuccess">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" alt=""/>
                        <el-icon v-else class="avatar-uploader-icon">
                            <UploadFilled/>
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button type="primary" @click="confirmDialog">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules, UploadProps} from "element-plus";

import {
    reqExistingTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark
} from "@/api/product/trademark";
import type {Records, Trademark, TrademarkResponseData} from "@/api/product/trademark/types";

let tableData = reactive<Records>([]);
let pageNo = ref<number>(1);//表格当前页码
let limit = ref<number>(10);//表格每页数据条数
let total = ref<number>(0);//表格总数据条数

//对话框展示状态。0-隐藏，1-添加品牌，2-修改品牌
let dialogDisplayStatus = ref<number>(0);
//对话框标题
let dialogTitle: string = computed(() => {
    if (dialogDisplayStatus.value === 1)
        return '添加品牌';
    if (dialogDisplayStatus.value === 2)
        return '修改品牌';
    return '';
});
//对话框宽度
let dialogWidth = computed(() => {
    let clientWidth = document.body.clientWidth;
    if (clientWidth < 1200)
        return '50%';
    return '600px';
});

const trademarkFormRef = ref<FormInstance>();//品牌表单引用
//品牌表单校验规则
const trademarkFormRules = reactive<FormRules>({
    tmName: [
        {required: true, message: '请输入品牌名称！', trigger: 'blur'},
        {validator: validatorTmName, trigger: 'blur'}
    ],
    logoUrl: [{required: true, message: '请上传品牌Logo图片！'}],
});
//表单数据
let trademarkParams = reactive<Trademark>({tmName: '', logoUrl: ''});

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

//添加品牌
const handleAddTrademark = async () => {
    if (dialogDisplayStatus.value !== 1) {
        trademarkFormRef.value?.clearValidate();//移除表单校验结果
        dialogDisplayStatus.value = 1;//打开对话框
        return;
    }
    sendAddOrUpdateRequest('添加');//发送请求
}
//修改品牌
const handleUpdateTrademark = (row: Trademark | undefined) => {
    if (dialogDisplayStatus.value !== 2) {
        trademarkFormRef.value?.clearValidate();//移除表单校验结果
        //将当前行的数据填入对话框中表单
        trademarkParams.id = (row as Trademark).id;
        trademarkParams.tmName = (row as Trademark).tmName;
        trademarkParams.logoUrl = (row as Trademark).logoUrl;
        dialogDisplayStatus.value = 2;//打开对话框
        return;
    }
    sendAddOrUpdateRequest('修改');//发送请求
}

//发送添加/修改请求
const sendAddOrUpdateRequest = async (operation: string) => {
    let result: any = await reqAddOrUpdateTrademark(trademarkParams);
    if (result.code === 200) {
        ElMessage.success(`${operation}品牌成功！`);
        closeDialog();//关闭对话框
        reqTrademarkData();//重新查询数据
    } else {
        ElMessage.error(`${operation}品牌失败，${result.data}！`);
    }
}

//删除品牌
const handleDeleteTrademark = async (row: Trademark) => {
    let result: any = await reqDeleteTrademark(row.id);
    if (result.code === 200) {
        ElMessage.success('删除品牌成功！');
        reqTrademarkData();//重新查询数据
    } else {
        ElMessage.error(`删除品牌失败，${result.data}！`);
    }
}

//关闭对话框回调
const closeDialog = () => {
    dialogDisplayStatus.value = 0;//关闭对话框
    //清空表单数据
    trademarkParams.tmName = '';
    trademarkParams.logoUrl = '';
}

//对话框确定按钮回调
const confirmDialog = () => trademarkFormRef.value?.validate(isValid => {
    if (!isValid) return;
    if (dialogDisplayStatus.value == 1)
        handleAddTrademark();
    else if (dialogDisplayStatus.value === 2)
        handleUpdateTrademark();
});

onMounted(() => {
    reqTrademarkData();
});

//上传图片组件->上传图片之前触发的钩子函数
const beforeLogoUpload: UploadProps['beforeUpload'] = rawFile => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
        ElMessage.error('品牌logo图片应为jpeg、png或gif格式！');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('品牌logo图片大小应小于2MB！');
        return false;
    }
    return true;
}

//图片上传成功钩子
const handleAvatarSuccess: UploadProps["onSuccess"] = response => {
    //response:即为当前这次上传图片post请求服务器返回的数据
    //收集上传图片的地址,添加一个新的品牌的时候带给服务器
    trademarkParams.logoUrl = response.data;
    //图片上传成功,清除掉对应图片校验结果
    trademarkFormRef.value?.clearValidate("logoUrl");
};

//校验对话框表单品牌名称
function validatorTmName(rule: any, value: any, callBack: any) {
    //自定义校验规则
    if (value.trim().length >= 2) {
        callBack();
    } else {
        //校验未通过返回的错误的提示信息
        callBack(new Error("品牌名称长度至少为2！"));
    }
}
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
