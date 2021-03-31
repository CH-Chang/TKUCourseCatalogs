<template>
  <div class="m-board">
    <el-row class="boardTop" :gutter="10">
      <el-col :span="16" class="boardCarouselArea">
        <MyCarousel />
      </el-col>
      <el-col :span="8" class="boardAccountArea">
        <img src="@/assets/img/icon-user.svg" />
        <p>
          嗨，<span>{{ getUsername }}</span
          >！
        </p>
        <nuxt-link to="#" v-if="this.$store.state.auth.isLogin">
          <el-button round size="medium" @click="logoutClick"
            >帳戶登出</el-button
          >
        </nuxt-link>
        <nuxt-link to="/member" v-else>
          <el-button round size="medium">登入 / 註冊</el-button>
        </nuxt-link>
      </el-col>
    </el-row>
    <el-row class="boardBottom" :gutter="10">
      <el-col :span="8" class="boardAppArea">
        <img
          src="http://s04.calm9.com/qrcode/2020-06/4FHY2AKIFI.png"
          alt="淡江課程APP"
        />
        <h1>淡江課APP</h1>
        <p>即將推出 <span>查課更方便</span></p>
      </el-col>
      <el-col :span="16" class="boardSystemArea">4444</el-col>
    </el-row>
  </div>
</template>

<script>
import MyCarousel from "./carousel.vue";
import { apiLogout } from "@/apis/member";

export default {
  components: {
    MyCarousel
  },
  methods: {
    async logoutClick() {
      console.log("click");
      let response = await apiLogout();
      if (response.status === 200 && response.data.res === 0) {
        location.reload();
      }
    }
  },
  computed: {
    getUsername: function() {
      if (this.$store.state.auth.isLogin) return this.$store.state.auth.name;
      else return "您好";
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/index/board.scss";
</style>
