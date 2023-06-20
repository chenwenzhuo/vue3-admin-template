<template>
    <div class="tourist-container">
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="total">可预约总量<span>9999</span>人</p>
        </div>
        <div class="num-people">
            <span v-for="(item, index) in peopleCnt" :key="index">{{ item }}</span>
        </div>
        <!-- 盒子用于echarts展示图形图表 -->
        <div class="chart" ref="chartRef"></div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import 'echarts-liquidfill'

let peopleCnt = ref("215908人");
let chartRef = ref();//图表DOM节点

//初始化图表
const initChart = () => {
    //获取echarts类的实例
    const chart = echarts.init(chartRef.value);
    //设置实例的配置项
    chart.setOption({
        title: {//标题组件
            text: '水球图',
            textStyle: {
                color: '#29fcff',
                fontSize: 25
            }
        },
        //系列:决定展示什么样的图形图表
        series: {
            type: "liquidFill",//水球图
            data: [0.6, 0.4, 0.2],//展示的数据
            color: ['red', '#0f0', 'rgb(0, 0, 255)'],
            waveAnimation: true,//动画
            animationDuration: 3,
            animationDurationUpdate: 1,
            amplitude: 15,//波浪动画振幅
            radius: "100%",//半径
            outline: {//外层边框颜色设置
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: "skyblue",
                    borderColor: "#294D99",
                    borderWidth: 8,
                    shadowBlur: 20,
                    shadowColor: "rgba(0, 0, 0, 0.25)"
                }
            }
        },
        //布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    });
}

onMounted(() => initChart());
</script>

<style scoped lang="scss">
.tourist-container {
  margin-top: 10px;
  background: url("../../assets/images/screen/dataScreen-main-lb.png") no-repeat;
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

    .total {
      float: right;
      color: white;
      font-size: 20px;
      margin-right: 20px;

      span {
        color: yellowgreen;
      }
    }
  }

  .num-people {
    padding: 10px;
    margin-top: 30px;
    display: flex;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url('../../assets/images/screen/total.png') no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }

  .chart {
    width: 100%;
    height: 270px;
  }
}
</style>