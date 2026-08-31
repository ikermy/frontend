<template>
  <div class="page">
    <ShopCategoryAndSearch center/>
    <div class="container lg:py-[60px] py-10">
      <Swiper 
        class="relative mb-14 lg:h-auto h-[500px]"
        :modules="[Pagination, Autoplay]"
        :space-between="32"
        :speed="1000"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
        :pagination="{
          el: '.slider-pagination',
          clickable: true,
        }"
        >
        <SwiperSlide v-for="item in 5" :key="item" class="relative h-full rounded-[24px] overflow-hidden">
          <div class="bg h-full w-full"><img :src="images.store" alt="" class="h-full w-full object-cover"></div>
          <div class="absolute top-10 left-10">
            <p class="text-lg font-medium mb-1">Product</p>
            <h2 class="lg:text-[28px] lg:mb-9">Microsoft office 360</h2>
            <Button text-color="dark" color="primary" class="px-4 py-3 font-medium">Learn more</Button>
          </div>
        </SwiperSlide>
      <div class="slider-pagination swiper-pagination absolute md:bottom-10 bottom-6 md:left-10 left-4 w-full h-1 z-10 flex items-center justify-start gap-2"></div>
      </Swiper>
      <div>
        <h2 class="mb-7 text-3xl">All products</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <ProductsCard title="Microsoft office 360" price="100" link="/stores/1" v-for="item in 10" :key="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import Button from '~/shared/ui/Button.vue';
import ProductsCard from '~/components/card/ProductsCard.vue';
import ShopCategoryAndSearch from './components/ShopCategoryAndSearch.vue';
import { useAssets } from "~/shared/composables/useAssets";

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

const { images } = useAssets();
</script>

<style scoped lang="css">


.swiper-pagination {
}

:deep(.swiper-pagination-bullet) {
  width: 48px;
  height: 4px;
  background-color: #fff;
  opacity: .5;
  transition: all .3s ease-in-out;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  width: 71px;
}


</style>