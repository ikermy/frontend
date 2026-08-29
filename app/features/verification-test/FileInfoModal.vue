<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[101] flex items-center justify-center bg-black/75 backdrop-blur-sm"
    @click.self="handleClose"
  >
    <div class="bg-bg-secondary rounded-[16px] max-w-[500px] w-full mx-4 p-6 flex flex-col gap-6">
      <!-- Header with Close Button -->
      <div class="flex justify-end">
        <button
          @click="handleClose"
          class="w-8 h-8 flex items-center justify-center bg-bg-tertiary rounded-full hover:bg-bg-secondary transition-colors"
        >
          <UIcon
            name="i-heroicons-x-mark"
            class="w-5 h-5 text-white"
          />
        </button>
      </div>

      <!-- File Info Section -->
      <div class="flex flex-col gap-3">
        <!-- File Icon -->
        <div class="w-16 h-16 bg-bg-tertiary rounded-[12px] flex items-center justify-center">
          <UIcon
            name="i-heroicons-document-text"
            class="w-8 h-8 text-white"
          />
        </div>

        <!-- File Name -->
        <div class="flex flex-col gap-1">
          <p class="text-text-tertiary text-sm font-medium">
            {{ $t("verification-test.file_name") }}
          </p>
          <p class="text-white text-base font-medium">
            {{ fileName }}
          </p>
        </div>

        <!-- File Size -->
        <p class="text-text-tertiary text-sm font-medium">
          {{ formattedFileSize }}
        </p>
      </div>

      <!-- Total Section -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-700">
        <p class="text-white font-medium text-base">
          {{ $t("verification-test.total") }}
        </p>
        <p class="text-white font-medium text-base">
          ${{ total.toLocaleString() }}
        </p>
      </div>

      <!-- Submit Button -->
      <Button
        color="primary"
        text-color="dark"
        class="w-full px-6 py-3 text-base font-semibold"
        :on-click="handleSubmit"
      >
        {{ $t("verification-test.submit_button") }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

interface Props {
  isOpen: boolean;
  fileName?: string;
  fileSize?: number;
  total?: number;
  onSubmit?: () => void;
  onClose?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  fileName: "Document.pdf",
  fileSize: 0,
  total: 2500,
  onSubmit: undefined,
  onClose: undefined,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "submit"): void;
  (e: "close"): void;
}>();

const formattedFileSize = computed(() => {
  if (props.fileSize === 0) return "23mb";
  
  const bytes = props.fileSize;
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
});

const handleClose = () => {
  emit("update:isOpen", false);
  if (props.onClose) {
    props.onClose();
  }
  emit("close");
};

const handleSubmit = () => {
  if (props.onSubmit) {
    props.onSubmit();
  }
  emit("submit");
};
</script>

