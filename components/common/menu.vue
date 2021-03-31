<template>
  <div class="m-menu">
    <dl>
      <dt>課程分類<br /><span>Category</span></dt>
      <dd
        v-for="item in $store.state.category.category"
        :key="item.titleEN"
        @mouseenter="categoryMouseEnter"
        @mouseleave="categoryMouseLeave"
      >
        <i class="el-icon-arrow-left"></i>
        <p>
          {{ item.titleTW }} <span>{{ item.titleEN }}</span>
        </p>
        <i :class="item.icon"></i>
      </dd>
    </dl>
    <div
      v-if="current"
      @mouseenter="subCategoryMouseEnter"
      @mouseleave="subCategoryMouseLeave"
    >
      <template v-for="(item, index) in currentSubCategory">
        <h4 :key="item.titleEN">
          {{ item.titleTW }}<span>{{ item.titleEN }}</span>
        </h4>
        <br />

        <nuxt-link
          v-for="(item, index_) in item.units"
          :key="item.unitCode"
          :to="{
            path: '/unitCourse',
            query: { unitCode: item.unitCode, pages: 1 }
          }"
          >{{ item.unitName }}</nuxt-link
        >
        <br />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: ""
    };
  },
  computed: {
    currentSubCategory: function() {
      return this.$store.state.category.category.filter(
        item => item.titleEN === this.current
      )[0].subCategory;
    }
  },
  methods: {
    categoryMouseEnter: function(e) {
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this.current = e.target.querySelector("span").innerHTML;
    },
    categoryMouseLeave: function(e) {
      let self = this;
      self._timer = setTimeout(function() {
        self.current = "";
      }, 200);
    },
    subCategoryMouseEnter: function(e) {
      clearTimeout(this._timer);
    },
    subCategoryMouseLeave: function(e) {
      this.current = "";
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/common/menu.scss";
</style>
