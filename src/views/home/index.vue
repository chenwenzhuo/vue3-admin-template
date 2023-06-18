<template>
    <el-card>
        <div class="container">
            <img :src="userStore.userState.avatar" alt="" class="avatar">
            <div class="text-info">
                <span class="greeting">{{ userStore.userState.username }}，{{ getTimeDesc() }}好！</span>
                <span class="platform-name">商品管理运营平台</span>
            </div>
        </div>
    </el-card>
    <div class="icon-wrapper">
        <svg-icon name="welcome" width="500px" height="500px"/>
    </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/modules/user";
import {getTimeDesc} from "@/utils/utils";
import SvgIcon from "@/components/SvgIcon.vue";

const userStore = useUserStore();
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .text-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: 30px;

    .greeting {
      font-size: 35px;
      font-weight: bolder;
      margin-bottom: 15px;
    }

    .platform-name {
      font-size: 18px;
      font-style: italic;
      color: darkcyan;
    }
  }
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>