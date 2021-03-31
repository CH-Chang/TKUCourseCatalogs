<template>
  <el-container>
    <el-header>
      <My-Header />
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer>
      <My-Footer />
    </el-footer>
  </el-container>
</template>

<script>
import MyHeader from "../components/public/header/index.vue";
import MyFooter from "../components/public/footer/index.vue";
export default {
  components: {
    MyHeader,
    MyFooter
  }
};
</script>

<style lang="scss">
@import "@/assets/css/layout/default/index.scss";
</style>
