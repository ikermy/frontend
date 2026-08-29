<template>
  <div v-if="productImages && productImages.length > 0" class="flex gap-2 flex-wrap">
    <div
      v-for="(image, index) in productImages"
      :key="index"
      class="w-24 h-24 bg-bg-tertiary rounded-[12px] overflow-hidden flex items-center justify-center"
    >
      <img
        v-if="image"
        :src="image"
        :alt="`Product ${index + 1}`"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  productImages: string[];
}

defineProps<Props>();
</script>

