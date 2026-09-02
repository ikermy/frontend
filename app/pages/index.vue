<template>
  <div class="flex flex-col gap-4 relative">
    <div class="flex flex-col gap-2 mt-[110px] desktop:px-[76px] px-[24px]">
      <h1 class="text-[64px] font-normal uppercase font-hector hidden desktop:block">
        {{ $t("home.title") }}
      </h1>
      <p class="text-[22px] font-inter desktop:max-w-[1189px] leading-[145%] hidden desktop:block">
        {{ $t("home.desc") }}
      </p>
      <p class="text-[22px] font-inter desktop:max-w-[1189px] leading-[145%] desktop:hidden block">
        {{ $t("home.mobile_desc") }}
      </p>
    </div>
    <img :src="icons.homeVideo" alt="video"
      class="w-full mt-[54px] px-9 max-h-[679px] size-full max-w-full rounded-[10px]" />
    <div class="flex flex-col gap-2 mt-[110px] px-[76px]">
      <h1 class="desktop:text-[48px] text-[32px] font-normal desktop:uppercase font-hector leading-[120%]">
        {{ $t("home.second_title") }}
      </h1>
      <div class="flex justify-between mt-12 desktop:flex-row flex-col gap-8">
        <div v-for="block in blocks" :key="block.title" class="flex flex-col w-full">
          <img :src="block.icon" alt="" class="mb-3 w-11" />
          <h4 class="font-hector desktop:text-[28px] text-[20px] mb-1">
            {{ $t(block.title) }}
          </h4>
          <p class="font-inter text-[16px] text-text-tertiary">
            {{ $t(block.desc) }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="flex gap-2 mt-[110px] desktop:flex-row flex-col relative items-center justify-between desktop:pr-[100px] w-full">
      <img :src="icons.barcodeMobile" alt="" class="w-[300px] desktop:hidden tablet:hidden block" />
      <img :src="icons.barcodeTablet" alt="" class="desktop:hidden tablet:block hidden" />
      <img :src="icons.barcodeAi" alt="" class="desktop:block hidden" />
      <div class="grid grid-cols-2 grid-rows-2 gap-3 mobile:grid-cols-1">
        <div v-for="stat in stats" :key="stat.title"
          class="bg-bg-secondary/60 pb-[20px] pl-[20px] pt-[52px] flex flex-col rounded-[16px] min-w-[250px] w-full">
          <h4 class="text-[20px]">{{ $t(stat.title) }}</h4>
          <h3 class="text-[36px] font-hector mb-2">
            {{ $t(stat.value) }}
          </h3>
        </div>
      </div>
    </div>
    <div class="flex flex-col px-[76px]">
      <div class="flex justify-between items-center">
        <h3 class="font-normal font-hector leading-[120%] desktop:text-[48px] text-[28px]">
          {{ $t("home.whatsnew") }}
        </h3>
        <div class="flex gap-3">
          <img :src="icons.left" alt="" class="cursor-pointer" @click="onClickPrev" />
          <img :src="icons.right" alt="" class="cursor-pointer mt-2" @click="onClickNext" />
        </div>
      </div>
      <UCarousel ref="carousel" v-slot="{ item }" :items="carouselItems" class="gap-2 flex w-full mt-[38px]"
        :prev="{ onClick: onClickPrev }" :next="{ onClick: onClickNext }"
        :ui="{ item: 'basis-1/3.5 tablet:basis-1/1.8 mobile:basis-1/1' }">
        <div v-if="item" class="flex flex-col gap-2">
          <div class="size-full min-h-[218px] min-w-[383px] rounded-[12px] bg-bg-tertiary" />
          <p class="text-[18px] font-medium">
            {{ $t(item.title) }}
          </p>
        </div>
      </UCarousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssets } from "~/shared/composables/useAssets";

const { icons } = useAssets();
const activeIndex = ref(0);
const carouselRef = useTemplateRef("carousel");

function onClickPrev() {
  activeIndex.value--;
  carouselRef.value?.emblaApi?.scrollTo(activeIndex.value);
}
function onClickNext() {
  activeIndex.value++;
  carouselRef.value?.emblaApi?.scrollTo(activeIndex.value);
}
const stats = [
  {
    title: "home.stats.jurisdictions",
    value: "50+",
  },
  {
    title: "home.stats.barcode_changes",
    value: "100+",
  },
  {
    title: "home.stats.users",
    value: "15k+",
  },
  {
    title: "home.stats.generations",
    value: "500k+",
  },
];
const blocks = [
  {
    icon: icons.fieldGen,
    title: "home.blocks.field_gen",
    desc: "home.blocks.field_gen_desc",
  },
  {
    icon: icons.aiDriven,
    title: "home.blocks.ai_driven",
    desc: "home.blocks.ai_driven_desc",
  },
  {
    icon: icons.verif,
    title: "home.blocks.verif",
    desc: "home.blocks.verif_desc",
  },
];

const carouselItems = [
  {
    title: "Unlocking Tomorrow: Our AI-Powered Analytics Goes Live",
  },
  {
    title: "Unlocking Tomorrow: Our AI-Powered Analytics Goes Live",
  },
  {
    title: "Unlocking Tomorrow: Our AI-Powered Analytics Goes Live",
  },
  {
    title: "Unlocking Tomorrow: Our AI-Powered Analytics Goes Live",
  },
  {
    title: "Unlocking Tomorrow: Our AI-Powered Analytics Goes Live",
  },
];
useHead({
  title: "Barcode AI - Smart Barcode Solution",
  meta: [
    {
      name: "description",
      content: "Smart barcode and MRZ generation platform",
    },
  ],
});
</script>
