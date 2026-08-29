<template>
  <div
    class="relative flex flex-col items-center gap-8 bg-transparent rounded-[16px] p-6 border border-gray-700"
    style="min-height: 460px;"
  >
    <!-- Close Button -->
    <button
      @click.stop="handleClose"
      class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[var(--color-bg-tertiary)] rounded-full hover:bg-bg-secondary transition-colors z-10"
    >
      <UIcon
        name="i-heroicons-x-mark"
        class="w-5 h-5 text-white"
      />
    </button>

    <!-- Top Section: Your file -->
    <div class="flex items-center gap-3 mb-6">
      <p class="text-text-tertiary font-medium text-sm">Your file</p>
      <div class="w-8 h-8 bg-bg-tertiary rounded-[8px] flex items-center justify-center">
        <img src="assets/svg/dark/file-svgrepo-primary.svg" alt="File" class="w-5 h-5" />
      </div>
      <div class="flex flex-col">
        <p class="text-white font-medium text-sm">{{ fileName }}</p>
        <p class="text-text-tertiary text-xs">{{ fileSize }}</p>
      </div>
    </div>

    <!-- Central Modal Card -->
    <div class="flex flex-col items-center gap-10 border border-[var(--color-bg-tertiary)] rounded-[16px] p-5 w-full max-w-md">
      <!-- File Icon -->
       <div class="flex flex-col justify-center items-center gap-2">
           <div class="w-11 h-11 bg-primary rounded-[12px] flex items-center justify-center border border-primary">
             <img src="assets/svg/dark/file-svgrepo-com.svg" alt="File" class="w-6 h-6" />
           </div>
           <!-- New file name label -->
           <p class="text-white font-medium text-base">New file name</p>

       </div>


      <!-- Download Buttons -->
      <div class="flex flex-col gap-3 w-full">
        <button
          class="w-full px-6 py-3 bg-bg-tertiary rounded-[12px] text-primary font-semibold text-base hover:opacity-85 transition-opacity"
          @click="handleDownloadPDF417"
        >
          Download PDF417
        </button>
        
        <button
          class="w-full px-6 py-3 bg-bg-tertiary rounded-[12px] text-primary font-semibold text-base hover:opacity-85 transition-opacity"
          @click="handleDownload128Codes"
        >
          Download 128 Codes
        </button>
        
        <button
          class="w-full px-6 py-3 bg-primary rounded-[12px] text-[var(--color-text-black)] font-semibold text-base hover:opacity-85 transition-opacity"
          @click="handleDownloadCompletePackage"
        >
          Download Complete Package
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fileName?: string;
  fileSize?: string;
  onClose?: () => void;
  onDownloadPDF417?: () => void;
  onDownload128Codes?: () => void;
  onDownloadCompletePackage?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  fileName: "filenamehere.xls",
  fileSize: "12mb",
  onClose: undefined,
  onDownloadPDF417: undefined,
  onDownload128Codes: undefined,
  onDownloadCompletePackage: undefined,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "download-pdf417"): void;
  (e: "download-128-codes"): void;
  (e: "download-complete-package"): void;
}>();

const handleClose = () => {
  if (props.onClose) {
    props.onClose();
  }
  emit("close");
};

const handleDownloadPDF417 = () => {
  if (props.onDownloadPDF417) {
    props.onDownloadPDF417();
  }
  emit("download-pdf417");
};

const handleDownload128Codes = () => {
  if (props.onDownload128Codes) {
    props.onDownload128Codes();
  }
  emit("download-128-codes");
};

const handleDownloadCompletePackage = () => {
  if (props.onDownloadCompletePackage) {
    props.onDownloadCompletePackage();
  }
  emit("download-complete-package");
};
</script>

