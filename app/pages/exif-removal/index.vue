<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto min-h-screen">
      <!-- Title -->
      <h1 class="font-hector text-3xl font-semibold text-white mb-12 text-center">
        {{ $t("exif-removal.title") }}
      </h1>

      <!-- File Upload or File Info Card -->
      <div class="w-full flex justify-center items-center flex-1">
        <!-- Upload State -->
        <div
          v-if="!uploadedFile"
          class="relative flex flex-col items-center justify-center gap-3 bg-bg-secondary rounded-[12px] cursor-pointer transition-colors hover:bg-bg-tertiary"
          style="width: 500px; height: 177px;"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="fileInput?.click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
          
          <!-- Upload Icon -->
          <UIcon
            name="i-heroicons-arrow-down-tray"
            class="w-12 h-12 text-white"
          />

          <!-- Upload Text -->
          <div class="flex flex-col items-center gap-1">
            <p class="text-white font-medium text-base">{{ $t("exif-removal.upload_text") }}</p>
            <p class="text-text-tertiary text-sm">{{ $t("exif-removal.file_type_text") }}</p>
          </div>
        </div>

        <!-- File Info Card -->
        <div
          v-else
          class="flex flex-col justify-between bg-bg-secondary rounded-[12px] p-4"
          style="width: 500px; height: 266px;"
        >
          <!-- File Information Section -->
          <div class="relative flex flex-col items-start gap-3 p-2 bg-bg-tertiary rounded-[12px]">
            <!-- Close Button -->
            <button
              @click.stop="handleRemove"
              class="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full hover:bg-bg-secondary transition-colors z-10"
            >
              <UIcon
                name="i-heroicons-x-mark"
                class="w-5 h-5 text-white"
              />
            </button>

            <!-- File Icon -->
            <div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <UIcon
                name="i-heroicons-document-text"
                class="w-5 h-5 text-white"
              />
            </div>

            <!-- File Name and Size -->
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <p class="text-white font-medium text-sm">{{ uploadedFile.name }}</p>
              <p class="text-text-tertiary text-xs">{{ formatFileSize(uploadedFile.size) }}</p>
            </div>
          </div>

          <!-- Summary and Action Section -->
          <div class="flex flex-col gap-4">
            <!-- Total -->
            <div class="flex items-center justify-between px-2">
              <p class="text-white font-medium text-lg">Total</p>
              <p class="text-white font-medium text-lg">${{ totalCost.toLocaleString() }}</p>
            </div>

            <!-- Remove EXIF Data Button -->
            <Button
              color="primary"
              text-color="dark"
              class="w-full h-12 text-base font-semibold"
              :on-click="handleRemoveEXIF"
            >
              Remove EXIF Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

const { t } = useI18n();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const uploadedFile = ref<File | null>(null);
const totalCost = ref(2500);

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    handleFileSelect(file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    handleFileSelect(file);
  }
};

const handleFileSelect = (file: File) => {
  uploadedFile.value = file;
  console.log("File selected:", file);
  // Handle file selection for EXIF removal
};

const handleRemove = () => {
  uploadedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleRemoveEXIF = () => {
  console.log("Remove EXIF Data for file:", uploadedFile.value?.name);
  // Handle EXIF removal
};
</script>