<template>
  <el-row>
    <el-col :span="17">
      <course :courses="this.courses" />
    </el-col>
    <el-col :span="7">
      <selection />
    </el-col>
  </el-row>
</template>

<script>
import { apiGetSelectedCourse } from "@/apis/course";
import selection from "../components/common/selection.vue";
import course from "../components/curriculum/course.vue";
import courseTable from "../components/curriculum/courseTable.vue";
export default {
  components: {
    selection,
    course,
    courseTable
  },
  async asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error
  }) {
    let response = await apiGetSelectedCourse();
    let courses = [];

    if (response.status === 200 && response.data.res === 0) {
      courses = response.data.courses;
    }

    return {
      courses
    };
  }
};
</script>
