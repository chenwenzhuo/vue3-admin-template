<template>
    <div class="top-container">
        <div class="top-left">
            <span class="left-btn" @click="goHome">首页</span>
        </div>
        <div class="top-center">
            <div class="title">智慧旅游可视化大数据平台</div>
        </div>
        <div class="top-right">
            <span class="right-btn">统计报告</span>
            <span class="time">当前时间：{{ curTime }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import moment from "moment";

let curTime = ref<string>('');
let timer: any = null;
let $router = useRouter();//获取路由器对象

//按钮的点击回调
const goHome = () => {
    $router.push("/home");
};

//设置定时器更新时间
onMounted(() => timer = setInterval(
    () => curTime.value = moment().format('YYYY年MM月DD日 HH:mm:ss'),
    1000
));
//组件卸载前停止定时器
onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped lang="scss">
.top-container {
  width: 100%;
  height: 40px;
  display: flex;

  //左右两部分按钮的公共样式
  .top-left .left-btn,
  .top-right .right-btn {
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 20px;
    color: #29fcff;
    background-size: 100% 100%;
    cursor: pointer;
  }

  .top-left {
    flex: 1.5;
    background: url("../../assets/images/screen/dataScreen-header-left-bg.png") no-repeat;
    background-size: cover;

    .left-btn {
      float: right;
      background: url("../../assets/images/screen/dataScreen-header-btn-bg-l.png") no-repeat;
    }
  }

  .top-center {
    flex: 2;

    .title {
      width: 100%;
      height: 74px;
      background: url('../../assets/images/screen/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .top-right {
    flex: 1.5;
    background: url("../../assets/images/screen/dataScreen-header-right-bg.png") no-repeat;
    background-size: cover;

    .right-btn {
      float: left;
      font-size: 16px;
      background: url("../../assets/images/screen/dataScreen-header-btn-bg-r.png") no-repeat;
    }

    .time {
      float: right;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #29fcff;
      margin-right: 10px;
    }
  }
}
</style>