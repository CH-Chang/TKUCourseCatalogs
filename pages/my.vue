<template>
  <div class="page-my">
    <el-row>
      <el-col :span="17">
        <my :editRes="editRes" />
      </el-col>
      <el-col :span="7">
        <selection />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import selection from "../components/common/selection.vue";
import my from "../components/my/index.vue";
import { apiGetEditRes } from "@/apis/member";
export default {
  layout: "default",
  middleware: ["auth"],
  components: {
    selection,
    my
  },
  async asyncData(ctx) {
    let responseEditRes = await apiGetEditRes();
    let editRes;
    if (responseEditRes.status === 200 && responseEditRes.data.res === 0) {
      editRes = {
        colleges: responseEditRes.data.data.colleges,
        schoolsystems: responseEditRes.data.data.schoolsystems,
        units: responseEditRes.data.data.units,
        years: ["一年級", "二年級", "三年級", "四年級", "五年級", "六年級"]
      };
    } else {
      editRes = {};
    }
    return {
      editRes
    };
  }
};
</script>
