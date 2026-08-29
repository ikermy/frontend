<template>
  <div class="flex gap-3 items-center">
    <img :src="props.svg" alt="currency" class="w-9 h-9" />
    <div class="flex flex-col">
      <h4 class="text-lg font-medium">{{ props.name }}</h4>
      <h2 class="text-sm font-semibold text-text-tertiary">
        {{ props.value }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  value: string;
  svg: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "#6B7280",
});
</script>
