<template>
  <div class="page-possibleInUnit">
    <el-row>
      <el-col :span="17">
        <course :courses="courses" :coursesCount="coursesCount" />
      </el-col>
      <el-col :span="7">
        <selection />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import selection from "../components/common/selection.vue";
import course from "../components/common/course.vue";
import { apiGetPossibleOutUnit } from "@/apis/course";

export default {
  layout: "default",
  middleware: ["auth"],
  components: {
    selection,
    course
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
    let courses, coursesCount;
    let pages = query.pages;
    let response = await apiGetPossibleOutUnit({ params: { pages } });
    if (response.status === 200 && response.data.res === 0) {
      courses = response.data.courses;
      coursesCount = response.data.coursesCount;
    } else {
      courses = [];
    }
    return {
      courses,
      coursesCount
    };
  },
  watchQuery: true
};
</script>
