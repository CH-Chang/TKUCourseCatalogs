<template>
  <el-row>
    <el-col :span="17">
      <course :courses="this.courses" :coursesCount="this.coursesCount" />
    </el-col>
    <el-col :span="7">
      <MyMenu />
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import MyMenu from "../components/common/menu.vue";

import course from "../components/common/course.vue";
import { apiGetUnitCourse } from "@/apis/course";
export default {
  components: {
    MyMenu,
    course
  },
  data() {
    return {};
  },
  async asyncData(ctx) {
    let { unitCode, pages } = ctx.query;
    let { status, data } = await apiGetUnitCourse({
      params: { unitCode, pages }
    });

    let courses, coursesCount;
    if (status == 200 && data.res == 0) {
      courses = data.courses;
      coursesCount = data.coursesCount;
    } else {
      courses = [];
    }
    return {
      unitCode,
      coursesCount,
      courses
    };
  },
  methods: {},

  watchQuery: true
};
</script>
