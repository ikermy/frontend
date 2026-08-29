<template>
  <div class="flex flex-col gap-3 pt-4 border-t border-gray-700">
    <div
      v-if="runBarcodeValidation"
      class="flex items-center justify-between p-3 bg-bg-tertiary rounded-[12px] cursor-pointer hover:bg-[#FFFFFF1A] transition-colors"
    >
      <span class="text-white font-medium">{{ runBarcodeValidation }}</span>
      <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-text-tertiary" />
    </div>
    <div
      v-if="runDataValidation"
      class="flex items-center justify-between p-3 bg-bg-tertiary rounded-[12px] cursor-pointer hover:bg-[#FFFFFF1A] transition-colors"
    >
      <span class="text-white font-medium">{{ runDataValidation }}</span>
      <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-text-tertiary" />
    </div>
    <div
      v-if="detailsOfBarcode"
      class="flex items-center justify-between p-3 bg-bg-tertiary rounded-[12px] cursor-pointer hover:bg-[#FFFFFF1A] transition-colors"
    >
      <span class="text-white font-medium">{{ detailsOfBarcode }}</span>
      <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-text-tertiary" />
    </div>
    <div
      v-if="generationDate"
      class="flex items-center justify-between p-3 bg-bg-tertiary rounded-[12px]"
    >
      <span class="text-text-tertiary font-medium">{{ generationDateLabel }}</span>
      <span class="text-white font-medium">{{ generationDate }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";

interface Props {
  runBarcodeValidation?: string;
  runDataValidation?: string;
  detailsOfBarcode?: string;
  generationDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  runBarcodeValidation: "",
  runDataValidation: "",
  detailsOfBarcode: "",
  generationDate: "",
});

const { t } = useI18n();

const generationDateLabel = computed(() => t("store_orders.generation_date"));
</script>

