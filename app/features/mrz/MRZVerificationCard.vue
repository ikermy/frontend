<template>
  <div class="flex items-center gap-3 p-4 bg-bg-secondary rounded-[12px]">
    <!-- Logo/Icon -->
    <div
      v-if="!icon"
      class="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0"
      :class="logoBgClass"
    >
      <span v-if="logoText" class="text-white font-bold text-lg">{{ logoText }}</span>
    </div>

    <!-- Image or Text -->
    <img
      v-if="icon"
      :src="`/${icon}`"
      :alt="label"
      class="h-8 object-contain"
    />
    <p v-else class="text-white font-medium text-sm">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  logoText?: string;
  icon?: string;
  logoBgClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  logoText: undefined,
  icon: undefined,
  logoBgClass: "bg-blue-600",
});
</script>

