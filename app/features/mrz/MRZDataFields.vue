<template>
  <div class="flex flex-col gap-4">
    <!-- Labels Row -->
    <div class="grid grid-cols-6 gap-4 bg-bg-secondary rounded-[12px] p-4">
      <div v-for="label in labels" :key="label" class="flex flex-col gap-1">
        <!-- <p class="text-text-tertiary text-sm">{{ label }}</p>
        <p class="text-white text-sm font-medium">Label</p> -->
        <p class="text-white text-sm">{{ label }}</p>
        <p class="text-text-tertiary text-sm font-medium">Label</p>
      </div>
    </div>

    <!-- MRZ Lines -->
    <div class="flex flex-col gap-2">
      <div v-for="(line, index) in mrzLines" :key="index"
        class="flex items-center gap-3 bg-bg-secondary rounded-[12px] px-3 py-1">
        <p class="flex-1 text-white font-mono text-sm">{{ line }}</p>
        <button @click="handleCopy(line)"
          class="p-2 hover:bg-bg-tertiary hover:cursor-pointer rounded-lg transition-colors flex-shrink-0">
          <!-- <img
            :src="icons.copy"
            alt="Copy"
            class="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
          /> -->
          <img :src="icons.copy" alt="Copy" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssets } from '~/shared/composables/useAssets';

interface Props {
  labels: string[];
  mrzLines: string[];
  onCopy?: (text: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  labels: () => [
    "Generation Date",
    "Revision Date",
    "Issuing Country",
    "Document Type",
    "First name",
    "Surname",
  ],
  mrzLines: () => [],
  onCopy: undefined,
});

const { icons } = useAssets();

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  if (props.onCopy) {
    props.onCopy(text);
  }
};
</script>
