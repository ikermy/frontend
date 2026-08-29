<template>
  <div class="flex items-center justify-between w-full">
    <h2 class="text-2xl font-bold font-hector text-white">{{ orderNumber }}</h2>
    <button
      @click="handleClose"
      class="p-2 hover:bg-bg-tertiary rounded-lg transition-colors bg-transparent cursor-pointer"
    >
      <UIcon name="i-heroicons-x-mark" class="w-6 h-6 text-white" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  orderNumber: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleClose = () => {
  emit("close");
};
</script>

