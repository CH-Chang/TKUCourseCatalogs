<template>
  <div class="page-physical">
    <el-row>
      <el-col :span="17">
        <course :courses="this.courses" :coursesCount="this.coursesCount" />
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
import { apiGetPossiblePhysical } from "@/apis/course";

export default {
  layout: "default",
  middleware: ["auth"],
  components: {
    selection,
    course
  },
  async asyncData(ctx) {
    let pages = ctx.query.pages;

    let response = await apiGetPossiblePhysical({ params: { pages } });

    let courses, coursesCount;
    if (response.status === 200 && response.data.res === 0) {
      courses = response.data.courses;
      coursesCount = response.data.coursesCount;
    } else {
      courses = [];
      coursesCount = 0;
    }

    return {
      courses,
      coursesCount
    };
  },
  watchQuery: true
};
</script>
