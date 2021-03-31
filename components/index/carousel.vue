<template>
  <el-carousel :interval="3000" class="carousel" height="250px">
    <el-carousel-item
      v-for="(item, index) in carousel"
      :key="index"
      class="carousel-item"
    >
      <img
        :src="item.img"
        :title="item.title"
        :alt="item.alt"
        class="carousel-item-img"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {
      carousel: [
        {
          title: "測試資料一",
          alt: "測試資料一",
          img:
            "https://photo.tku.edu.tw/photos/2020_627757c3-0804-44a3-a31a-f3c8e583200e.jpg"
        },
        {
          title: "測試資料二",
          alt: "測試資料二",
          img:
            "https://photo.tku.edu.tw/photos/2020_cc7a16ab-211f-48c0-8e2c-1356b6515028.jpg"
        },
        {
          title: "測試資料三",
          alt: "測試資料三",
          img:
            "https://photo.tku.edu.tw/photos/2020_85e6324d-9599-484a-bf33-f2fd064d0e60.jpg"
        },
        {
          title: "測試資料四",
          alt: "測試資料四",
          img:
            "https://photo.tku.edu.tw/photos/2020_e0f5e8f1-df73-4695-b895-e5cd4bf49eac.jpg"
        },
        {
          title: "測試資料五",
          alt: "測試資料五",
          img:
            "https://photo.tku.edu.tw/photos/2020_dd479f29-6968-4c41-b7d8-48f97e564efb.jpg"
        },
        {
          title: "測試資料六",
          alt: "測試資料六",
          img:
            "https://photo.tku.edu.tw/photos/2020_0eb44041-066b-40a9-82c4-bc4f2ddf3610.jpg"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
@import "@/assets/css/index/carousel.scss";
</style>
