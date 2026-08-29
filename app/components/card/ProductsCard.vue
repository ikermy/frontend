<template>
  <NuxtLink :to="link">
    <div class="h-[257px] w-full mb-2 rounded-lg overflow-hidden">
      <img :src="productImage" alt="" class="w-full h-full object-cover">
    </div>
    <div>
      <span class="text-lg font-medium">{{ price }}</span>
      <p class="text-xs font-medium">{{ title }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useAssets } from "~/shared/composables/useAssets";

export interface ProductsCardProps {
  title: string;
  price: string;
  image?: string;
  link: string;
}

const { title, price, image } = defineProps<ProductsCardProps>()
const { images } = useAssets();

const productImage = computed(() => image || images.productsCard);

</script>

<style scoped>

</style>