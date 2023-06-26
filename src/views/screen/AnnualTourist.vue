<template>
    <div class="annual-container">
        <div class="title">
            <p>年度游客量对比</p>
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

const initChart = () => {
    //获取echarts类的实例
    const chart = echarts.init(chartRef.value);
    //设置配置项
    chart.setOption({
        title: {
            text: '散点图',
            left: '45%',//调整位置
            textStyle: {
                color: '#bfa',
                fontSize: 20
            },
        },
        xAxis: {type: 'category'},
        yAxis: {},
        grid: {
            left: 45,
            right: 20,
            bottom: 20
        },
        series: [{
            type: 'scatter',
            data: [234, 564, 882, 135, 778, 259, 235, 634, 555, 199, 276, 398, 472],
            //标记图形设置
            symbol: "pin",
            symbolSize: 25,
            //图文标签
            label: {
                show: true,
                position: "top",
                fontSize: 16,
                color: "#5eff00"
            },
            itemStyle: {
                color: '#ff0000'
            }
        }]
    });
}

onMounted(() => initChart());
</script>

<style scoped lang="scss">
.annual-container {
  width: 100%;
  height: 100%;
  background: url('../../assets/images/screen/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

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