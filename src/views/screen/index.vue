<template>
    <div class="container">
        <!--数据大屏展示内容区域-->
        <div ref="screenRef" class="screen">
            <div class="top">
                <ScreenTop/>
            </div>
            <div class="bottom">
                <div class="bottom-left">
                    <Tourist class="tourist"/>
                    <Gender class="gender"/>
                    <Age class="age"/>
                </div>
                <div class="bottom-center">
                    <Map class="map"/>
                    <LineChart class="line-chart"/>
                </div>
                <div class="bottom-right">底部右侧</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import ScreenTop from "@/views/screen/ScreenTop.vue";
import Tourist from "@/views/screen/Tourist.vue";
import Gender from "@/views/screen/Gender.vue";
import Age from "@/views/screen/Age.vue";
import Map from "@/views/screen/map/Map.vue";
import LineChart from "@/views/screen/LineChart.vue";

const screenRef = ref();//数据大屏容器盒子的DOM元素引用

//定义数据大屏缩放比例
const getScale = (width: number = 1920, height: number = 1080) => {
    //计算宽高缩放的比例
    const scaleW = window.innerWidth / width;
    const scaleH = window.innerHeight / height;
    return Math.min(scaleW, scaleH);
}

onMounted(() => {
    // 对子元素进行缩放和变换，translate参数值为子元素本身长宽比例
    screenRef.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
});

//监听视口大小变化
window.onresize = () => screenRef.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/screen/bg.png") no-repeat;
  background-size: cover;

  .screen {
    width: 1920px;
    height: 1080px;
    position: fixed;
    //transform-origin设置盒子左上角为变换原点
    //left、top值为父元素的比例，使盒子左上角位于父元素中心点
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .bottom-left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }

        .gender, .age {
          flex: 1;
        }
      }

      .bottom-right {
        flex: 1;
      }

      .bottom-center {
        flex: 1.5;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
        }

        .line-chart {
          flex: 1;
        }
      }
    }
  }
}
</style>