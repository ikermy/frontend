<template>
  <div class="page lg:py-12 py-7 overflow-x-hidden">
    <div class="container">
      <div>
        <NuxtLink :to="$localePath('/stores')" class="flex items-center gap-2 lg:mb-7 mb-6">
          <div class="size-8 flex items-center justify-center bg-gray-dark rounded-full"><BackIcon /></div>
          <span class="lg:text-xl">Back</span>
        </NuxtLink>
      </div>
      <div class="lg:grid lg:grid-cols-2 gap-11 max-w-full">
        <div class="flex gap-4 md:h-[590px] h-[366px] max-w-full max-lg:mb-8">
          <Swiper :modules="[Thumbs]" :slides-per-view="6.5" direction="vertical" :space-between="8" :watch-slides-progress="true" :free-mode="true" @swiper="onThumbsSwiper" class="max-h-[590px] max-w-[70px] min-w-[70px] !mx-0 lg:!flex !hidden">
            <SwiperSlide v-for="item in 5" :key="item" class="rounded-[12px] overflow-hidden">
              <img :src="images.store" alt="" class="w-full h-full object-cover">
            </SwiperSlide>
          </Swiper>
          <Swiper :modules="[Thumbs]" :thumbs="{ swiper: thumbsSwiper }"  :breakpoints="breakpoints" class="lg:max-w-[527px] max-w-full !mx-0 main-slider">
            <SwiperSlide v-for="item in 5" :key="item">
              <img :src="images.store" alt="" class="w-full h-full object-cover rounded-[24px]">
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="flex flex-col justify-between">
          <div>     
              <h1 class="md:text-[28px] text-2xl font-semibold  mb-2.5">Adobe PRO 2 years</h1>
              <div class="flex items-center gap-2 mb-5">
                <span class="text-xl font-hector">1 050 ₽</span>
                <span class="text-white/55 text-sm">1490 ₽</span>
              </div>
              <p class="text-sm mb-6">Introducing Quantum Flux – the world's first molecular hydration system that defies conventional drinking experiences. This isn't just a water bottle; it's a personal hydration ecosystem engineered for the modern adventurer.</p>
              <h4 class="font-semibold mb-3">Placeholder</h4>
              <ul class="flex flex-wrap gap-2 lg:m-0 md:mb-16 mb-8">
                <li><Button text-color="white" color="primary" class="max-h-9">Variant 2</Button></li>
                <li><Button text-color="white" color="primary" class="max-h-9">Variant 3</Button></li>
                <li><Button text-color="white" color="primary" class="max-h-9">Variant 4</Button></li>
              </ul>
          </div>
          <div class="flex items-center gap-6 max-lg:flex-col max-lg:w-full">
            <div class="qty max-w-[115px] flex items-stretch justify-center gap-1.5">
              <button type="button" class="w-[30px] h-[30px] flex items-center justify-center bg-gray-dark rounded-lg cursor-pointer" @click="decrementQuantity"><MinusIcon /></button>
              <input type="number" :value="quantity" class="max-w-11 bg-gray-dark flex items-center justify-center text-center border-none outline-none rounded-lg text-sm font-semibold">
              <button type="button" class="w-[30px] h-[30px] flex items-center justify-center bg-gray-dark rounded-lg cursor-pointer" @click="incrementQuantity"><PlusIcon /></button>
            </div>
            <Button text-color="dark" color="white" class="flex-grow max-lg:w-full">Add to cart</Button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import Button from '~/shared/ui/Button.vue';
import MinusIcon from '~/components/icons/MinusIcon.vue';
import PlusIcon from '~/components/icons/PlusIcon.vue';
import BackIcon from '~/components/icons/BackIcon.vue';
import { useAssets } from "~/shared/composables/useAssets";
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Thumbs } from 'swiper/modules';

const { images } = useAssets();

const thumbsSwiper = ref<any | null>(null)

const quantity = ref(1)

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
const incrementQuantity = () => {
  quantity.value++
}

const onThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper
}

const breakpoints = {
  320: {
    slidesPerView: 1.05,
    spaceBetween: 8,
  },
  768: {
    slidesPerView: 1.3,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 1,
    spaceBetween: 24,
  },
}

</script>

<style scoped>

.swiper-slide-thumb-active {
  border: 1px solid #1BE7BE;
  border-radius: 12px;
  overflow: hidden;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

@media (max-width: 768px) {
  .main-slider {
    width: 100%;
    overflow: visible!important;
  }
}
</style>