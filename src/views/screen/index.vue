<template>
    <div class="container">
        <!--数据大屏展示内容区域-->
        <div ref="screenRef" class="screen">
            <div class="top">
                <ScreenTop/>
            </div>
            <div class="bottom">
                <div class="bottom-left">底部左侧</div>
                <div class="bottom-center">底部中间</div>
                <div class="bottom-right">底部右侧</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import ScreenTop from "@/views/screen/ScreenTop.vue";

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
      }

      .bottom-right {
        flex: 1;
      }

      .bottom-center {
        flex: 2;
      }
    }
  }
}
</style>