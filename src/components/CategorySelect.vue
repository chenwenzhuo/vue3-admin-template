<template>
  <!--三级分类选择器-->
    <el-card class="box-card-form">
        <el-form :inline="true" :disabled="!selectorEnabled">
            <el-form-item label="一级分类">
                <el-select v-model="categoryStore.c1Id">
                    <el-option v-for="item in categoryStore.c1Data" :key="item.id"
                               :label="item.name" :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="categoryStore.c2Id">
                    <el-option v-for="item in categoryStore.c2Data" :key="item.id"
                               :label="item.name" :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="categoryStore.c3Id">
                    <el-option v-for="item in categoryStore.c3Data" :key="item.id"
                               :label="item.name" :value="item.id"/>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useCategoryStore} from "@/stores/modules/category";

const categoryStore = useCategoryStore();//分类数据仓库

//接收父组件传入的参数
//selectorEnabled-控制选择器是否启用
defineProps({
    selectorEnabled: {
        type: Boolean,
        default: true
    }
});

onMounted(() => {
    categoryStore.reqCategory1();//查询一级分类数据
});
</script>

<style scoped lang="scss">
.box-card-form {
  margin-bottom: 20px;

  .el-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
