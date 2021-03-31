<template>
  <el-row class="m-member">
    <el-col :span="12" class="memberLeft">
      <div class="logoArea">
        <div class="logo"></div>
        <div class="titleArea">
          <h1 class="mainTitle">淡江大學</h1>
          <h2 class="subTitle">課程查詢系統</h2>
        </div>
      </div>
    </el-col>
    <el-col :span="12" class="memberRight">
      <nuxt />
    </el-col>
  </el-row>
</template>

<style lang="scss">
@import "@/assets/css/layout/member/index.scss";
</style>
