<template>
    <div class="age-container">
        <div class="top">
            <p class="title">年龄比例</p>
            <p class="bg"></p>
        </div>
        <div class="chart" ref="chartRef"></div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';

const chartRef = ref();

//初始化图表
const initChart = () => {
    //获取echarts类的实例
    const chart = echarts.init(chartRef.value);
    //设置实例的配置项
    chart.setOption({
        tooltip: {
            trigger: "item"
        },
        legend: {
            right: 60,
            top: 40,
            orient: "vertical",//图例组件方向的设置
            textStyle: {
                color: "white",
                fontSize: 14
            }
        },
        series: [{
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            right: '15%',
            itemStyle: {
                borderRadius: 20,
                borderColor: "#ffffff",
                borderWidth: 2
            },
            label: {
                show: true,
                position: "inside",
                color: "#ffffff"
            },
            labelLine: {
                show: false
            },
            emphasis: {
                scale: true,
                scaleSize: 20,
                focus: 'self'
            },
            data: [
                {value: 351, name: "0～10"},
                {value: 535, name: "11～20"},
                {value: 1880, name: "21～30"},
                {value: 1234, name: "31～40"},
                {value: 791, name: "41～50"},
                {value: 983, name: "51及以上"},
            ]
        }],
        //调整图形图表的位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    });
}

onMounted(() => initChart());
</script>

<style scoped lang="scss">
.age-container {
  width: 100%;
  height: 100%;
  background: url('../../assets/images/screen/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;

  .top {
    margin-left: 20px;

    .title {
      font-size: 20px;
      color: #ffffff;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url('../../assets/images/screen/dataScreen-title.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
  }

  .chart {
    height: 260px;
  }
}
</style>