<template>
  <div class="page-index">
    <el-row>
      <el-col :span="17">
        <MyBoard />
      </el-col>
      <el-col :span="7">
        <MyMenu />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyMenu from "../components/common/menu.vue";
import MyBoard from "../components/index/board.vue";

export default {
  layout: "default",
  components: {
    MyMenu,
    MyBoard
  }
};
</script>
<style>
@import "@/assets/css/public/footer/index.scss";
</style>
