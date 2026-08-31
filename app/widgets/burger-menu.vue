<template>
  <div
    v-if="isTablet && isOpen"
    class="bg-bg-white absolute z-40 size-full top-0 px-4 mt-[48px]"
  >
    <div class="flex flex-col gap-3 my-[48px]">
      <NuxtLink
        v-for="value in items"
        :key="value.label"
        :to="localePath(value.path)"
        class="text-[28px] cursor-pointer"
        @click="burgerMenuStore.close()"
      >
        {{ value.label }}
      </NuxtLink>
    </div>
    <div class="flex mt-[48px] gap-[15px]">
      <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
        <img :src="icons.facebook" alt="Facebook" class="w-11 h-11" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
        <img :src="icons.instagram" alt="Instagram" class="w-11 h-11" />
      </a>
      <a href="https://x.com" target="_blank" rel="noopener" aria-label="X">
        <img :src="icons.x" alt="X" class="w-11 h-11" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBurgerMenuStore } from "~/shared/store/useBurgerMenu";
import { useAssets } from "~/shared/composables/useAssets";

const { t } = useI18n();
const localePath = useLocalePath();
const { icons } = useAssets();

const isTablet = ref(false);

onMounted(() => {
  const checkTablet = () => {
    isTablet.value = window.innerWidth < 1024;
  };

  checkTablet();
  window.addEventListener("resize", checkTablet);

  onUnmounted(() => {
    window.removeEventListener("resize", checkTablet);
  });
});

const items = [
  {
    label: t("home.home"),
    path: "/",
  },
  {
    label: t("home.store"),
    path: "/stores",
  },
  {
    label: t("home.barcode"),
    path: "/barcodes",
  },
  {
    label: t("home.discussion"),
    path: "/mrz",
  },
  {
    label: t("home.faq"),
    path: "/faqs",
  },
];

const burgerMenuStore = useBurgerMenuStore();

const isOpen = computed(() => burgerMenuStore.isOpen);
</script>
