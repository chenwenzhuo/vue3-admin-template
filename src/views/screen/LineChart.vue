<template>
    <div class="line-chart-container">
        <div class="title">
            <p>过去七天游客数量趋势</p>
            <img src="../../assets/images/screen/dataScreen-title.png" alt="">
        </div>
        <div class="line-chart" ref='lineChartRef'></div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';

const lineChartRef = ref();

//初始化图表
const initChart = () => {
    //获取echarts类的实例
    const chart = echarts.init(lineChartRef.value);
    //设置实例的配置项
    chart.setOption({
        //标题组件
        // title: {text: "游客数量"},
        //x|y轴
        xAxis: {
            type: "category",
            //两侧不留白
            boundaryGap: false,
            //分割线不要
            splitLine: {show: false},
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            //轴线的设置
            axisLine: {show: true},
            //刻度
            axisTick: {show: true}
        },
        yAxis: {
            splitLine: {show: false},
            //轴线的设置
            axisLine: {show: true},
            //刻度
            axisTick: {show: true}
        },
        grid: {
            left: 60,
            right: 20,
            top: 40,
            bottom: 30
        },
        series: [{
            type: "line",
            data: [120, 1240, 66, 2299, 321, 890, 1200],
            //平滑曲线的设置
            smooth: true,
            //区域填充样式
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: "red" // 0% 处的颜色
                    }, {
                        offset: 1, color: "blue" // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            }
        }]
    });
}

onMounted(() => initChart());
</script>

<style scoped lang="scss">
.line-chart-container {
  width: 100%;
  height: 100%;
  background: url('../../assets/images/screen/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;

  .title {
    font-size: 20px;
    color: #ffffff;
  }

  .line-chart {
    height: calc(100% - 40px);
  }
}
</style>