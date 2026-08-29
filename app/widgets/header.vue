<template>
  <div class="w-full px-9 py-[24px] flex justify-between items-center relative header">
    <NuxtLink :to="localePath('/')">
      <h1 class="text-2xl font-roboto uppercase font-bold cursor-pointer">
        Logo
      </h1>
    </NuxtLink>
    <div class="gap-[30px] absolute right-0 w-full justify-center hidden desktop:flex">
      <NuxtLink :to="localePath('/')"> {{ t("home.home") }} </NuxtLink>
      <NuxtLink :to="localePath('/barcodes')"> {{ t("home.store") }} </NuxtLink>
      <NuxtLink :to="localePath('/mrz')"> {{ t("home.discussion") }} </NuxtLink>
      <NuxtLink :to="localePath('/mrz')"> {{ t("home.faq") }} </NuxtLink>
    </div>
    <div class="flex gap-[10px] desktop:gap-[20px] items-center justify-between">
      <div class="items-center hidden desktop:flex gap-1">
        <span class="text-sm">EN</span>
        <UIcon name="i-heroicons-chevron-down" class="h-4 w-4" />
      </div>
      <img :src="icons.button" alt="Search" class="cursor-pointer my-auto w-9 pt-[6px]" />
      <div class="border-bg-tertiary border-[1px] rounded-[16px] px-[14px] py-3 font-semibold text-sm">
        <h4>1700 <span class="text-text-tertiary">$</span></h4>
      </div>
      <div class="relative">
        <img :src="icons.minus" alt="User" class="w-6 h-6 cursor-pointer" />
        <div
          class="absolute top-[-5px] right-[-5px] w-4 h-4 bg-bg-secondary rounded-[12px] flex items-center justify-center p-2">
          <p class="text-[8px] font-semibold">13</p>
        </div>
      </div>
      <img :src="icons.account" alt="Search" class="cursor-pointer my-auto w-8 mt-[6px] hidden desktop:block" />
      <img v-if="!burgerMenuStore.isOpen" :src="icons.menuLineHorizontal" alt="Search"
        class="cursor-pointer my-auto w-9 mt-[6px] block desktop:hidden" @click="burgerMenuStore.toggle()" />
      <img v-if="burgerMenuStore.isOpen" :src="icons.close" alt="Search"
        class="cursor-pointer my-auto w-9 mt-[6px] block desktop:hidden" @click="burgerMenuStore.toggle()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBurgerMenuStore } from "~/shared/store/useBurgerMenu";
import { useAssets } from "~/shared/composables/useAssets";

const burgerMenuStore = useBurgerMenuStore();
const { icons } = useAssets();

const localePath = useLocalePath();
const { t } = useI18n();
</script>
