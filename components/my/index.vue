<template>
  <div class="m-my">
    <el-tabs tabPosition="top">
      <el-tab-pane label="個人資料維護">
        <infoForm :editRes="editRes" />
      </el-tab-pane>
      <el-tab-pane label="帳戶密碼更改">
        <passwordResetForm />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import infoForm from "./infoForm.vue";
import passwordResetForm from "./passwordResetForm.vue";
export default {
  props: {
    editRes: Object
  },
  components: {
    infoForm,
    passwordResetForm
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "@/assets/css/my/index.scss";
</style>
