<template>
    <div class="map-container" ref="mapRef"></div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';

import ChinaJson from './China.json';//中国地图json数据

const mapRef = ref();//获取DOM元素
//注册地图
echarts.registerMap('China', {geoJSON: ChinaJson});

//初始化地图图表
const initMap = () => {
    //获取echarts类的实例
    const chart = echarts.init(mapRef.value);
    //设置实例的配置项
    chart.setOption({
        geo: [{
            map: 'China',//使用注册的中国地图
            roam: true,//使用鼠标滚轮缩放地图
            //地图的位置调试
            left: 150,
            top: 150,
            zoom: 1.2,
            //地图上的文字的设置
            label: {
                show: true,//文字显示出来
                color: "#ffffff",
                fontSize: 14
            },
            itemStyle: {
                //每一个多边形的样式
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: "red" // 0% 处的颜色
                    }, {
                        offset: 1, color: "blue" // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                opacity: .8
            },
            //地图高亮的效果
            emphasis: {
                itemStyle: {
                    color: "yellow"
                },
                label: {
                    color: "#ffffff",
                    fontSize: 32
                }
            }
        }],
        series: [{
            type: "lines",//航线的系列
            data: [{
                coords: [
                    [116.405285, 39.904989],  // 起点
                    [119.306239, 26.075302]   // 终点
                ],
                // 统一的样式设置
                lineStyle: {
                    color: "orange",
                    width: 5
                }
            }, {
                coords: [
                    [116.405285, 39.904989],  // 起点
                    [114.298572, 30.584355]   // 终点
                ],
                // 统一的样式设置
                lineStyle: {
                    color: "rgba(144, 238, 144, 1)",
                    width: 5
                }
            }, {
                coords: [
                    [116.405285, 39.904989],  // 起点
                    [107.8839, 30.067297]   // 终点
                ],
                // 统一的样式设置
                lineStyle: {
                    color: "rgba(179, 238, 18, 1)",
                    width: 5
                }
            }],
            //开启动画特效
            effect: {
                show: true,
                symbol: "arrow",
                color: "#5e5e5e",
                symbolSize: 15,
                trailLength: 0.1,
                roundTrip: true
            }
        }]
    });
}

onMounted(() => initMap());
</script>

<style scoped lang="scss">

</style>