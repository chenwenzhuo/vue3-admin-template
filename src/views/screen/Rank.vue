<template>
    <div class="rank-container">
        <div class="title">
            <p>热门景区排行</p>
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
    //获取echarts类的实例
    const chart = echarts.init(chartRef.value);
    //设置配置项
    chart.setOption({
        title: {
            text: '景区排行',//主标题
            left: '45%',//调整位置
            textStyle: {
                color: '#bfa',
                fontSize: 25
            },
            subtext: '子标题',//二级标题
            subtextStyle: {
                color: '#bfa',
                fontSize: 18,
            }
        },
        xAxis: {
            type: 'category',//图形图表在x轴上均匀分布
        },
        yAxis: {},
        series: [{
            type: 'bar',//柱状图
            data: [21, 45, 64, 33, 86, 17],
            label: {//图形上的文本标签
                show: true,//展示标签
                position: 'insideTop',//展示在柱形图内部、顶部
                color: '#ffffff',
            },
            showBackground: true,
            backgroundStyle: {
                color: {//渐变色
                    type: "linear",//线性渐变
                    //渐变范围，x==x2，表示横向不渐变，纵向从上方80%位置开始到下方0位置为止渐变
                    x: 0,
                    y: 0.8,
                    x2: 0,
                    y2: 0,
                    //渐变过程中的各个颜色
                    colorStops: [{
                        offset: 0, color: "#e07373" // 0% 处的颜色
                    }, {
                        offset: 1, color: "#1f64cb" // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                borderRadius: 20,//背景圆角
            },
            itemStyle: {
                borderRadius: [15, 15, 0, 0],//柱条圆角，顺时针左上，右上，右下，左下
                color: function (data: any) {
                    //给每一个柱条这是背景颜色
                    let arr = ["red", "orange", "yellowgreen", "green", "purple", "skyblue"];
                    return arr[data.dataIndex];
                }
            }
        }, {
            type: 'line',//折线图
            data: [21, 45, 64, 33, 86, 17],
            lineStyle: {//线条样式
                color: '#fffc00'
            },
            smooth: true,//平滑曲线
        }, {
            type: 'bar',//柱状图
            data: [35, 67, 12, 87, 61, 32],
            label: {//图形上的文本标签
                show: true,//展示标签
                position: 'insideTop',//展示在柱形图内部、顶部
                color: '#ffffff',
            },
            showBackground: true,
            backgroundStyle: {
                color: {//渐变色
                    type: "linear",//线性渐变
                    //渐变范围，x==x2，表示横向不渐变，纵向从上方80%位置开始到下方0位置为止渐变
                    x: 0,
                    y: 0.8,
                    x2: 0,
                    y2: 0,
                    //渐变过程中的各个颜色
                    colorStops: [{
                        offset: 0, color: "#e07373" // 0% 处的颜色
                    }, {
                        offset: 1, color: "#1f64cb" // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                borderRadius: 20,//背景圆角
            },
            itemStyle: {
                borderRadius: [15, 15, 0, 0],//柱条圆角，顺时针左上，右上，右下，左下
                color: function (data: any) {
                    //给每一个柱条这是背景颜色
                    let arr = ["red", "orange", "yellowgreen", "green", "purple", "skyblue"];
                    return arr[data.dataIndex];
                }
            }
        }],
        tooltip: {
            backgroundColor: 'rgba(150,250,150,1)'
        },
        grid: {
            left: 40,
            right: 20,
            bottom: 20
        }
    });
}

onMounted(() => initChart());
</script>

<style scoped lang="scss">
.rank-container {
  width: 100%;
  height: 100%;
  background: url("../../assets/images/screen/dataScreen-main-cb.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

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