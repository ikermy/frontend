<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <p class="text-primary font-semibold">{{ productsInfo }}</p>
        <p class="text-white font-medium text-2xl">{{ totalAmount }}</p>
      </div>
      <Button
        v-if="exportButtonText"
        color="white"
        text-color="dark"
        class="px-4 py-2 text-sm h-9 max-w-fit"
        :on-click="handleExport"
      >
        <div class="flex items-center gap-2">
          <span>{{ exportButtonText }}</span>
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

interface Props {
  productsInfo: string;
  totalAmount: string;
  exportButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  exportButtonText: "",
});

const emit = defineEmits<{
  (e: "export"): void;
}>();

const handleExport = () => {
  emit("export");
};
</script>

