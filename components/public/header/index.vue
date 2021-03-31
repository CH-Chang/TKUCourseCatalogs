<template>
  <div class="m-header">
    <el-row class="top">
      <el-col :span="12" class="left">
        <nuxt-link to="/">
          <img
            src="@/assets/img/logo-tku.svg"
            title="淡江大學 課程查詢系統"
            alt="淡江大學 課程查詢系統"
            class="logo"
          />
        </nuxt-link>
        <div class="titleArea">
          <h1 class="mainTitle">淡江大學</h1>
          <h2 class="subTitle">課程查詢系統</h2>
        </div>
      </el-col>
      <el-col :span="12" class="right">
        <div class="searchArea">
          <el-input
            type="text"
            v-model="search"
            placeholder="請輸入搜尋內容"
          ></el-input>
          <button class="el-button el-button--my">
            <i class="el-icon-search"></i>
          </button>
        </div>
        <p>TAMKANG UNIVERSITY - <span>COURSE INQUIRY SYSTEM</span></p>
      </el-col>
    </el-row>
    <el-row class="bottom">
      <ul>
        <li>
          <nuxt-link to="/my" class="setting">個人設置</nuxt-link>
        </li>
        <li>
          <nuxt-link
            :to="{
              path: '/possibleInUnit',
              query: { pages: 1 }
            }"
            class="elective"
            >系內課程</nuxt-link
          >
        </li>
        <li>
          <nuxt-link
            :to="{
              path: '/possibleOutUnit',
              query: { pages: 1 }
            }"
            class="curriculum"
            >系外課程</nuxt-link
          >
        </li>
        <li>
          <nuxt-link
            :to="{
              path: '/general',
              query: { pages: 1 }
            }"
            class="link"
            >通識課程</nuxt-link
          >
        </li>
        <li>
          <nuxt-link
            :to="{
              path: '/physical',
              query: { pages: 1 }
            }"
            class="english"
            >體育課程</nuxt-link
          >
        </li>
        <li>
          <nuxt-link to="/curriculum">我的課表</nuxt-link>
        </li>
      </ul>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      search: ""
    };
  }
};
</script>

<style lang="scss">
@import "@/assets/css/public/header/index.scss";
</style>
