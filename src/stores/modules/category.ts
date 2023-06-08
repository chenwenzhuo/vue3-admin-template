//商品分类组件相关数据二级仓库
import {reactive, ref, watch} from "vue";
import {defineStore} from "pinia";

import {reqC1, reqC2, reqC3} from "@/api/product/attr";
import type {CategoryObj, CategoryResponseData} from "@/api/product/attr/type";

export const useCategoryStore = defineStore('Category', () => {
    const c1Data = reactive<CategoryObj[]>([]);//一级分类选项数组
    let c1Id = ref<number | string>('');//一级分类选中项的id

    const c2Data = reactive<CategoryObj[]>([]);//二级分类选项数组
    let c2Id = ref<number | string>('');//二级分类选中项的id

    const c3Data = reactive<CategoryObj[]>([]);//三级分类选项数组
    let c3Id = ref<number | string>('');//三级分类选中项的id

    //查询一级分类
    const reqCategory1 = async () => {
        let result: CategoryResponseData = await reqC1();
        if (result.code === 200) {
            c1Data.length = 0;//加入新数据前先清空原数据
            result.data.forEach((item: any) => c1Data.push(item));
        }
    }

    //查询二级分类
    const reqCategory2 = async () => {
        let result: CategoryResponseData = await reqC2(c1Id.value);
        if (result.code === 200) {
            c2Data.length = 0;//加入新数据前先清空原数据
            result.data.forEach((item: any) => c2Data.push(item));
        }
    }

    //查询三级分类
    const reqCategory3 = async () => {
        let result: CategoryResponseData = await reqC3(c2Id.value);
        if (result.code === 200) {
            c3Data.length = 0;//加入新数据前先清空原数据
            result.data.forEach((item: any) => c3Data.push(item));
        }
    }

    //重置仓库数据
    const resetCategory = () => {
        c1Data.length = 0;
        c1Id.value = '';
        c2Data.length = 0;
        c2Id.value = '';
        c3Data.length = 0;
        c3Id.value = '';
    }

    watch(() => c1Id.value, () => {//一级分类选中项发生变化时
        //清空二级、三级分类数据
        c2Data.length = 0;
        c2Id.value = '';
        c3Data.length = 0;
        c3Id.value = '';
        if (c1Id.value)//一级分类有选择，查询对应二级分类
            reqCategory2();
    });
    watch(() => c2Id.value, () => {//二级分类选中项发生变化时
        //清空三级分类数据
        c3Data.length = 0;
        c3Id.value = '';
        if (c2Id.value)//二级分类有选择，查询对应三级分类
            reqCategory3();
    });

    return {
        c1Data, c1Id, c2Data, c2Id, c3Data, c3Id,
        reqCategory1, reqCategory2, reqCategory3, resetCategory
    }
});
