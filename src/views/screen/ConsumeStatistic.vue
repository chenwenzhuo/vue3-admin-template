<template>
    <div class="consume-container">
        <div class="title">
            <p>游客消费数据统计</p>
            <p class="bg"></p>
        </div>
        <!-- 图形图表容器 -->
        <div class="chart" ref="chartRef"></div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';

const chartRef = ref();
//初始化图表
const initChart = () => {
    const chart = echarts.init(chartRef.value);//图形图表实例
    //配置图形图表
    chart.setOption({
        legend: {
            data: ['预期利润', '实际消费'],
            textStyle: {
                color: '#ffffff'
            },
            top: 10, right: 30
        },
        radar: {
            indicator: [
                {name: '消费', max: 6500},
                {name: '好感', max: 16000},
                {name: '出行', max: 30000},
                {name: '小吃', max: 38000},
                {name: '爱好', max: 52000},
                {name: '景点', max: 25000},
            ]
        },
        series: [{
            name: 'Budget vs spending',
            type: 'radar',
            data: [{
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: '预期利润'
            }, {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: '实际消费'
            }]
        }]
    });
}

onMounted(() => initChart());
</script>

<style scoped lang="scss">
.consume-container {
  width: 100%;
  height: 100%;
  background: url('../../assets/images/screen/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;

  .title {
    font-size: 18px;
    color: #ffffff;

    .bg {
      width: 68px;
      height: 7px;
      background: url("../../assets/images/screen/dataScreen-title.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
  }

  .chart {
    height: calc(100% - 30px);
  }
}
</style>