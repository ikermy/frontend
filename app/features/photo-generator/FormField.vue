<template>
  <div class="flex items-center justify-between gap-3 bg-bg-secondary rounded-[12px] px-4 py-3">
    <label class="text-white font-medium text-sm flex-shrink-0">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
}

const props = defineProps<Props>();
</script>

