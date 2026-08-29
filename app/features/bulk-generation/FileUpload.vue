<template>
  <div class="relative flex flex-col items-center gap-3 bg-transparent rounded-[16px] p-12 border border-gray-700"
    style="min-height: 460px;"
    :class="{ 'border-primary justify-center': isDragging && !uploadedFile, 'justify-center': !uploadedFile }"
    @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
    @click="!uploadedFile ? fileInput?.click() : null">
    <input ref="fileInput" type="file" :accept="accept" class="hidden" @change="handleFileChange" />

    <!-- File Selected State -->
    <template v-if="uploadedFile && !generationError">
      <!-- Close Button -->
      <button @click.stop="handleRemove"
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-bg-tertiary rounded-full hover:bg-bg-secondary transition-colors z-10">
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-white" />
      </button>

      <!-- File Icon -->
      <div class="w-12 h-12 bg-primary rounded-[12px] flex items-center justify-center">
        <img src="assets/svg/dark/file-svgrepo-com.svg" alt="Close" class="w-5 h-5" />
        <!-- <UIcon
          name="i-heroicons-document-text"
          class="w-10 h-10 text-white"
        /> -->
      </div>


      <!-- File Name -->
      <div class="flex flex-col items-center mb-4">
        <p class="text-white font-medium text-base text-center">{{ uploadedFile.name }}</p>

        <!-- File Size -->
        <p class="text-text-tertiary text-sm">{{ formatFileSize(uploadedFile.size) }}</p>

      </div>

      <!-- Barcodes and Total Section -->
      <div class="flex items-end justify-between w-full max-w-md mt-6 px-4">
        <!-- Left Side -->
        <div class="flex flex-col">
          <p class="text-text-tertiary text-sm font-semibold mb-1">Barcodes</p>
          <p class="text-white font-bold text-2xl">Total</p>
        </div>

        <!-- Right Side -->
        <div class="flex flex-col items-end">
          <!-- Overlapping Avatars -->
          <p class="text-text-tertiary text-sm mb-1">12 x $5</p>
          <p class="text-white text-base font-bold">${{ totalAmount }}</p>
        </div>
      </div>

      <!-- Error Message for Invalid File Extension -->
      <div v-if="generationError" class="mt-6 w-full max-w-md">
        <ErrorMessage :message="generationError" />
      </div>

      <!-- Generate Button -->
      <div class="mt-6 w-full max-w-md px-4">
        <Button color="primary" text-color="dark" class="w-full px-8 py-3 text-base font-semibold"
          :on-click="handleGenerate">
          {{ generateButtonText }}
        </Button>
      </div>
    </template>

    <!-- File Selected with Error State -->
    <template v-else-if="uploadedFile && generationError">
      <!-- Close Button -->
      <button @click.stop="handleRemove"
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-bg-tertiary rounded-full hover:bg-bg-secondary transition-colors">
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-text-tertiary hover:text-white" />

      </button>

      <!-- File Icon -->
      <div class="w-12 h-12 bg-primary rounded-[12px] flex items-center justify-center border-2 border-bg-tertiary">
        <!-- <img src="assets/svg/dark/file-svgrepo-com.svg" alt="Close" class="w-5 h-5" /> -->
        <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-white" />
      </div>

      <!-- File Name -->
      <p class="text-white font-medium text-base text-center">{{ uploadedFile.name }}</p>

      <!-- File Size -->
      <p class="text-white text-sm">{{ formatFileSize(uploadedFile.size) }}</p>

      <!-- Error Message Box -->
      <div class="flex flex-col p-6 bg-transparent rounded-[16px] border border-negative w-full max-w-md mt-4">
        <p class="text-white text-sm leading-relaxed">
          {{ generationError }}
        </p>
      </div>

      <!-- Generate Button -->
      <Button color="primary" text-color="dark" class="mt-6 px-8 py-3 text-base font-semibold"
        :on-click="handleGenerate">
        {{ generateButtonText }}
      </Button>
    </template>

    <!-- Upload State (Default) -->
    <template v-else>
      <!-- Loading State -->
      <template v-if="isLoading">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="text-white font-medium text-base">Processing file...</p>
        </div>
      </template>

      <!-- Upload State -->
      <template v-else>
        <!-- Upload Icon -->
        <UIcon name="i-heroicons-arrow-down-tray" class="w-12 h-12 text-white cursor-pointer" />
        <!-- <img src="assets/svg/dark/file-svgrepo-com.svg" alt="Close" class="w-5 h-5" /> -->

        <!-- Upload Text -->
        <div class="flex flex-col items-center gap-1">
          <p class="text-white font-medium text-base">{{ uploadText }}</p>
          <p class="text-text-tertiary text-sm">{{ fileTypeText }}</p>
        </div>

        <!-- Validation Error Message -->
        <p v-if="errorMessage" class="text-negative text-sm mt-2">
          {{ errorMessage }}
        </p>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import ErrorMessage from "~/features/bulk-generation/ErrorMessage.vue";

interface Props {
  accept?: string;
  uploadText?: string;
  fileTypeText?: string;
  maxSize?: number; // in bytes
  generationError?: string;
  generateButtonText?: string;
  totalAmount?: string;
  onFileSelect?: (file: File) => void;
  onError?: (error: string) => void;
  onRemove?: () => void;
  onGenerate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  accept: ".xls,.xlsx",
  uploadText: "Upload file here",
  fileTypeText: "Only .XLS files",
  maxSize: 10 * 1024 * 1024, // 10MB
  generationError: undefined,
  generateButtonText: "Generate",
  totalAmount: "60",
  onFileSelect: undefined,
  onError: undefined,
  onRemove: undefined,
  onGenerate: undefined,
});

const emit = defineEmits<{
  (e: "fileSelect", file: File): void;
  (e: "error", message: string): void;
  (e: "remove"): void;
  (e: "generate"): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const uploadedFile = ref<File | null>(null);
const errorMessage = ref<string>("");
const isLoading = ref(false);

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const validateFile = (file: File): string | null => {
  // Check file size
  if (file.size > props.maxSize) {
    return `File size must be less than ${formatFileSize(props.maxSize)}`;
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const isValidExtension =
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx") ||
    file.type === "application/vnd.ms-excel" ||
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  if (!isValidExtension) {
    return "Only .XLS and .XLSX files are allowed";
  }

  return null;
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    processFile(file);
  }
};

const processFile = (file: File) => {
  errorMessage.value = "";
  isLoading.value = true;

  // Small delay to show loading state, then process file
  setTimeout(() => {
    isLoading.value = false;

    // Always set the uploaded file to show it in the UI
    uploadedFile.value = file;

    const validationError = validateFile(file);
    if (validationError) {
      errorMessage.value = validationError;
      if (props.onError) {
        props.onError(validationError);
      }
      emit("error", validationError);
      return;
    }

    // If validation passed, emit file select
    if (props.onFileSelect) {
      props.onFileSelect(file);
    }
    emit("fileSelect", file);
  }, 100);
};

const handleRemove = () => {
  uploadedFile.value = null;
  errorMessage.value = "";
  isLoading.value = false;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  if (props.onRemove) {
    props.onRemove();
  }
  emit("remove");
};

const handleGenerate = () => {
  if (props.onGenerate) {
    props.onGenerate();
  }
  emit("generate");
};
</script>
