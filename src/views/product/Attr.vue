<template>
    <CategorySelect :selectorEnabled="scene"/>

    <el-card class="box-card-table">
        <!--属性数据展示区-->
        <div v-show="scene">
            <el-button type="primary" :icon="Plus" :disabled="addBtnDisabled"
                       @click="handleAddAttr" class="add-attr-btn">
                添加平台属性
            </el-button>
            <el-table class="attr-table" border :header-cell-style="{ 'text-align': 'center' }"
                      :data="attrTableData">
                <el-table-column type="index" label="序号" width="80" align="center"/>
                <el-table-column prop="attrName" label="属性名称" width="120" align="center"/>
                <el-table-column label="属性值">
                    <template #default="{row}">
                        <el-tag v-for="item in row.attrValueList" :key="item.id"
                                style="margin:10px 10px 0 0">
                            {{ item.valueName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template #default="{row}">
                        <el-button type="primary" icon="Edit"
                                   @click="handleUpdateAttr(row)">
                            编辑
                        </el-button>
                        <el-popconfirm :title="`是否确认删除属性：${row.attrName}？`" width="250"
                                       icon="WarnTriangleFilled" icon-color="#ff0000"
                                       confirm-button-type="danger"
                                       confirm-button-text="确认删除"
                                       @confirm="handleDeleteAttr(row)">
                            <template #reference>
                                <el-button type="danger" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--添加、修改属性区-->
        <div v-show="!scene">
            <el-form>
                <el-form-item label="属性名称" style="width: 350px">
                    <el-input v-model="attrParams.attrName" placeholder="请输入属性名称"/>
                </el-form-item>
            </el-form>

            <el-button type="primary" :icon="Plus" @click="handleAddAttrValue"
                       :disabled="attrParams.attrName===''">
                添加属性值
            </el-button>

            <el-table border style="margin: 15px 0" :data="attrParams.attrValueList">
                <el-table-column type="index" label="序号" width="80" align="center"/>
                <el-table-column label="属性值" align="center">
                    <template #default="{row,$index}">
                        <!--动态切换属性值的编辑模式与查看模式-->
                        <!--添加一行时自动获取焦点，进入编辑模式，点击时进入编辑模式-->
                        <!--input框失去焦点后隐藏，进入查看模式-->
                        <!--为模板引用ref指定一个函数，在每次组件更新时被调用-->
                        <!--函数收到组件引用作为参数，在函数中将其保存在数组中，用于使input框获取焦点-->
                        <el-input :ref="(vc:any)=>attrValueInputs[$index]=vc" v-show="row.editFlag"
                                  v-model="row.valueName" @blur="onAttrValueInputBlur(row,$index)"/>
                        <div v-show="!row.editFlag"
                             @click="onEditValueName(row,$index)"
                             style="cursor: pointer">
                            {{ row.valueName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template #default="{row,$index}">
                        <el-popconfirm :title="`是否确认删除：${row.valueName}？`" width="250"
                                       icon="WarnTriangleFilled" icon-color="#ff0000"
                                       confirm-button-type="danger"
                                       confirm-button-text="确认删除"
                                       @confirm="onDeleteAttrValue($index)">
                            <template #reference>
                                <el-button type="danger" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="saveAttr"
                       :disabled="attrParams.attrName===''||attrParams.attrValueList.length===0">
                保存
            </el-button>
            <el-button type="primary" @click="cancelAttrEdit">取消</el-button>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import {computed, nextTick, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

import CategorySelect from "@/components/CategorySelect.vue";
import {useCategoryStore} from "@/stores/modules/category";
import type {
    AttrObj, AttrObjList, AttrResponseData, AttrValue
} from "@/api/product/attr/type";
import {reqAddOrUpdateAttr, reqAttrs, reqDeleteAttr} from "@/api/product/attr";

const categoryStore = useCategoryStore();//分类数据仓库
//是否禁用添加按钮，当三级分类都有值时启用
let addBtnDisabled = computed(() => {
    return !(categoryStore.c1Id && categoryStore.c2Id && categoryStore.c3Id);
});
const attrTableData = reactive<AttrObjList>([]);//属性表格数据
let scene = ref<boolean>(true);//控制card组件内容展示
//添加、修改属性值的标志位。0-展示分类，1-添加属性值，2-修改属性值
let addOrUpdateFlag = ref<number>(0);

//新增、修改属性时的数据
let attrParams = reactive<AttrObj>({
    attrName: '',//属性名称
    attrValueList: [],//属性值数组
    categoryId: '',//属性所属的三级分类id
    categoryLevel: 3,//属性所属的分类等级
});
let attrValueInputs = reactive<any>([]);//属性值表格中，属性值input组件ref数组

//监听三级分类id变化，有值时查询属性数据
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) {//三级分类没有值时，清空属性表格数据
        attrTableData.length = 0;
        return;
    }
    //三级分类有值时，查询属性数据
    reqAttrTableData();
});

//发送请求查询属性数据
const reqAttrTableData = async () => {
    const {c1Id, c2Id, c3Id} = categoryStore;
    const result: AttrResponseData = await reqAttrs(c1Id, c2Id, c3Id);
    if (result.code === 200) {
        attrTableData.length = 0;
        result.data.forEach(item => attrTableData.push(item));
    }
}

//添加属性
const handleAddAttr = () => {
    scene.value = !scene.value;
    addOrUpdateFlag.value = 1;
}

//修改属性
const handleUpdateAttr = (row: AttrObj) => {
    scene.value = !scene.value;
    addOrUpdateFlag.value = 2;
    //属性值数据赋值
    attrParams.id = row.id;
    attrParams.attrName = row.attrName;
    row.attrValueList.forEach(item => attrParams.attrValueList.push(item));
    attrParams.categoryId = row.categoryId;
}

//删除属性
const handleDeleteAttr = async (row: AttrObj) => {
    const result: any = await reqDeleteAttr(row.id);
    if (result.code === 200) {
        ElMessage.success('删除分类成功!');
        reqAttrTableData();//重新查询属性数据
    } else {
        ElMessage.error('删除分类失败!');
    }
}

//添加属性值
const handleAddAttrValue = () => {
    //向数据中添加一个空对象，editFlag用于控制表格行中input组件的显示/隐藏
    attrParams.attrValueList.push({valueName: '', editFlag: true});
    //数据改变后，表格中将新增一行，DOM更新完成后，使input组件获得焦点
    nextTick(() => attrValueInputs[attrParams.attrValueList.length - 1].focus());
}

//属性值输入框失去焦点时的回调
const onAttrValueInputBlur = (row: AttrValue, $index: number) => {
    //属性值不能为空，为空时将当前行移除
    if (row.valueName.trim() === '') {
        ElMessage.error('属性值不能为空！');
        attrParams.attrValueList.splice($index, 1);//移除数据
        return;
    }
    //属性值不能重复
    const repeat = attrParams.attrValueList.find(item => {//寻找是否有重复
        //row与item指向同一个对象，不进行比较
        if (row === item) return false;
        return row.valueName === item.valueName;
    });
    if (repeat) {
        ElMessage.error('属性值不能重复！');
        attrParams.attrValueList.splice($index, 1);//移除数据
        return;
    }
    row.editFlag = false;//属性值合法，退出编就模式
}

//属性值表格中属性值一列被点击时的回调
const onEditValueName = (row: AttrValue, $index: number) => {
    row.editFlag = true;//进入编辑模式
    //DOM更新后，当前行的input组件获得焦点
    nextTick(() => attrValueInputs[$index].focus());
}

//删除属性值
const onDeleteAttrValue = ($index: number) => {
    attrParams.attrValueList.splice($index, 1);//移除数据
}

//保存属性值
const saveAttr = async () => {
    let name: string;
    if (addOrUpdateFlag.value === 1)
        name = '添加';
    else if (addOrUpdateFlag.value === 2)
        name = '修改';
    else name = '';

    //发送请求
    const result: AttrResponseData = await reqAddOrUpdateAttr(attrParams);
    if (result.code === 200) {
        ElMessage.success(`${name}分类成功!`);
        reqAttrTableData();//重新查询属性数据
        cancelAttrEdit();
    } else {
        ElMessage.error(`${name}分类失败!`);
    }
}

//取消编辑
const cancelAttrEdit = () => {
    //清除属性值数据
    attrParams.attrName = '';
    attrParams.attrValueList.length = 0;
    attrParams.categoryId = '';
    scene.value = !scene.value;//返回属性展示界面
    addOrUpdateFlag.value = 0;//重置标志位
}
</script>

<style scoped lang="scss">
.box-card-table {
  .add-attr-btn {
    margin-bottom: 15px;
  }
}
</style>