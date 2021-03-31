<template>
  <div class="m-selection">
    <dl>
      <dt>已選課程<br /><span>Selected</span></dt>
      <dd>
        <p>
          課程總數：
          <span>{{ this.$store.state.selection.totalCourses }}</span> 堂
        </p>
      </dd>
      <dd>
        <p>
          學分總數：
          <span>{{ this.$store.state.selection.totalCredits }}</span> 學分
        </p>
      </dd>
      <dd>
        <p>
          必修總數：
          <span>{{ this.$store.state.selection.totalRequiredCredits }}</span>
          學分
        </p>
      </dd>
      <dd>
        <p>
          選修總數：
          <span>{{ this.$store.state.selection.totalElectiveCredits }}</span>
          學分
        </p>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/assets/css/common/selection.scss";
</style>
