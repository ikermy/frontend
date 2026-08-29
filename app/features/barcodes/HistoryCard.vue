<template>
  <div
    class="flex items-center justify-between gap-4 bg-bg-secondary w-full rounded-[12px] px-[14px] py-3"
  >
    <div class="flex gap-2 items-center">
      <img src="assets/svg/dark/barcode-history.svg" alt="barcode" />
      <h4 class="text-sm font-medium">{{ barcode }}</h4>
    </div>
    <p class="text-[#888888] text-sm font-medium">{{ time }} AM</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  barcode: string;
  time: string;
}>();
</script>
