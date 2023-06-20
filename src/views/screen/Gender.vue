<template>
    <div class="gender-container">
        <div class="top">
            <p class="title">男女比例</p>
            <p class="bg"></p>
        </div>

        <div class="gender-avatars">
            <div class="man">
                <img src="../../assets/images/screen/man.png" alt="">
            </div>
            <div class="women">
                <img src="../../assets/images/screen/woman.png" alt="">
            </div>
        </div>

        <div class="rate">
            <p>男士58%</p>
            <p>女士42%</p>
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
        title: {
            text: '男女比例',
            textStyle: {color: 'skyblue'},
            left: "center"
        },
        xAxis: {
            show: false,
            //坐标轴刻度最大最小值
            min: 0,
            max: 100
        },
        yAxis: {
            show: false,
            type: "category"
        },
        series: [{
            type: 'bar',
            data: [58],
            barWidth: 20,
            z: 100,
            itemStyle: {
                color: "skyblue",
                borderRadius: 20
            }
        }, {
            type: "bar",
            data: [100],
            barWidth: 20,
            //调整女士柱条位置
            barGap: "-100%",
            itemStyle: {
                color: "pink",
                borderRadius: 20
            }
        }],
        grid: {
            top: 0,
            bottom: 0,
            left: 40,
            right: 40,
        }
    });
}

onMounted(() => initChart());
</script>

<style scoped lang="scss">
.gender-container {
  width: 100%;
  height: 100%;
  background: url('../../assets/images/screen/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

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

  .gender-avatars {
    display: flex;
    justify-content: center;

    .man, .women {
      margin: 35px 40px 20px 40px;
      width: 111px;
      height: 115px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .man {
      background: url('../../assets/images/screen/man-bg.png') no-repeat;
    }

    .women {
      background: url('../../assets/images/screen/woman-bg.png') no-repeat;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;

    p {
      margin: 0 40px;
      font-size: 20px;
      color: #ffffff;
    }
  }

  .chart {
    height: 100px;
  }
}
</style>
