<template>
  <div
    class="flex flex-col bg-bg-secondary rounded-[16px] overflow-hidden"
    :class="containerClass"
  >
    <!-- Header Section -->
    <div class="bg-bg-tertiary px-4 py-3 flex justify-between items-center">
      <div class="flex flex-col">
        <p class="text-white font-medium">{{ orderNumber }}</p>
      </div>
      <div class="flex items-center">
        <p class="text-white font-semibold">{{ totalAmount }}</p>
      </div>
    </div>

    <!-- Body Section -->
    <div class="px-4 py-4 flex flex-col max-[600px]:flex-col md:flex-row md:justify-between md:items-center gap-4">
      <!-- Left Side -->
      <div class="flex flex-col gap-2 max-[600px]:w-full">
        <div class="flex flex-col gap-2 max-[600px]:flex-row max-[600px]:justify-between max-[600px]:items-center">
          <div class="flex flex-col gap-2">
            <p class="text-primary font-semibold">{{ purchasedLabel }}</p>
            <p class="text-white font-medium">{{ productsInfo }}</p>
          </div>
          <Button
            v-if="learnMoreButtonText"
            color="white"
            text-color="dark"
            class="px-4 py-2 text-sm h-9 max-w-fit max-[600px]:self-end"
            :on-click="onLearnMore"
          >
            {{ learnMoreButtonText }}
          </Button>
        </div>
      </div>

      <!-- Right Side - Product Images -->
      <div v-if="productImages && productImages.length > 0" class="flex gap-2 max-[600px]:w-full max-[600px]:justify-start">
        <div
          v-for="(image, index) in displayedImages"
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
        <!-- Counter for remaining images -->
        <div
          v-if="remainingCount > 0"
          class="w-24 h-24 bg-transparent border border-gray-700 rounded-[12px] flex items-center justify-center"
        >
          <span class="text-white font-semibold text-base">+{{ remainingCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

interface Props {
  orderNumber: string;
  totalAmount: string;
  purchasedLabel?: string;
  productsInfo: string;
  productImages?: string[];
  learnMoreButtonText?: string;
  containerClass?: string;
  onLearnMore?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  purchasedLabel: "Purchased",
  productImages: () => [],
  learnMoreButtonText: "Learn More",
  containerClass: "",
  onLearnMore: undefined,
});

const maxVisibleImages = 3;

const displayedImages = computed(() => {
  return props.productImages.slice(0, maxVisibleImages);
});

const remainingCount = computed(() => {
  return Math.max(0, props.productImages.length - maxVisibleImages);
});
</script>

