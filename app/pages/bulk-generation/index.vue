<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">

        <h1 class="font-hector text-3xl font-semibold mb-0 md:mb-8 text-start w-full md:w-auto">
          {{ $t("bulk-generation.title") }}
        </h1>

        <div class="flex gap-4 w-full md:w-auto">
          <button @click="handleDownloadTemplate"
            class="text-primary px-4 py-3 text-sm md:text-lg font-semibold bg-[#2B2B2B] rounded-[14px] hover:opacity-85 transition-opacity cursor-pointer flex-1 md:flex-none">
            Download an .XLS File Template
          </button>

          <button @click="handleTutorialClick"
            class="text-[var(--color-text-black)] px-4 py-3 text-sm md:text-lg font-semibold bg-[var(--color-bg-white)] rounded-[14px] hover:opacity-85 transition-opacity cursor-pointer flex-1 md:flex-none">
            Tutorial
          </button>
        </div>
      </div>

      <!-- File Upload or Download Modal -->
      <div class="flex-shrink-0">
        <FileUpload v-if="!showDownloadModal" :upload-text="t('bulk-generation.upload_file_here')"
          :file-type-text="t('bulk-generation.only_xls_files')" accept=".xls,.xlsx" :max-size="10 * 1024 * 1024"
          :generation-error="generationError" :generate-button-text="t('bulk-generation.generate')"
          @file-select="handleFileSelect" @error="handleFileError" @remove="handleFileRemove"
          @generate="handleGenerate" />

        <DownloadModal v-else :file-name="downloadedFileName" :file-size="downloadedFileSize"
          @close="showDownloadModal = false" @download-pdf417="handleDownloadPDF417"
          @download-128-codes="handleDownload128Codes" @download-complete-package="handleDownloadCompletePackage" />
      </div>

      <!-- History Section -->
      <div class="flex-shrink-0 mt-5">
        <HistorySection :title="t('bulk-generation.history')" :empty-text="t('bulk-generation.no_history')"
          :history-items="historyItems.length > 0 ? historyItems : undefined" />
      </div>
    </div>

  </NuxtLayout>
</template>

<script setup lang="ts">
import FileUpload from "~/features/bulk-generation/FileUpload.vue";
import HistorySection from "~/features/bulk-generation/HistorySection.vue";
import ErrorMessage from "~/features/bulk-generation/ErrorMessage.vue";
import DownloadModal from "~/features/bulk-generation/DownloadModal.vue";
import { getBulkGenerationService } from "~/shared/api";
import { useBulkGenerationStore } from "~/shared/store";

const { t } = useI18n();
const router = useRouter();
const bulkGenerationService = getBulkGenerationService();
const bulkGenerationStore = useBulkGenerationStore();

const errorMessage = ref<string | undefined>(undefined);
const generationError = ref<string | undefined>(undefined);
const showDownloadModal = ref(false);
const downloadedFileName = ref("filenamehere.xls");
const downloadedFileSize = ref("12mb");
const selectedFile = ref<File | null>(null);

// Get history items from store - only show if store has items
const historyItems = computed(() => {
  return bulkGenerationStore.hasItems ? bulkGenerationStore.items : [];
});

// Don't load history on mount - show empty state by default
// History will be populated when items are generated

const handleFileSelect = (file: File) => {
  console.log("File selected:", file);
  selectedFile.value = file;
  errorMessage.value = undefined;
  generationError.value = undefined;
};

const handleFileError = (error: string) => {
  errorMessage.value = error;
  generationError.value = undefined;
};

const handleGenerate = async () => {
  if (!selectedFile.value) {
    generationError.value = t("bulk-generation.generation_error");
    return;
  }

  try {
    generationError.value = undefined;
    
    // Upload file first
    const uploadResponse = await bulkGenerationService.uploadFile(selectedFile.value);
    
    // Generate barcodes
    const generateResponse = await bulkGenerationService.generate({
      fileId: uploadResponse.data.fileId,
    });

    // Item is automatically added to store by the service
    // Show download modal
    showDownloadModal.value = true;
    downloadedFileName.value = selectedFile.value.name;
  } catch (error: any) {
    generationError.value = error.message || t("bulk-generation.generation_error");
  }
};

const handleFileRemove = () => {
  selectedFile.value = null;
  generationError.value = undefined;
  errorMessage.value = undefined;
};

const handleDownloadTemplate = () => {
  showDownloadModal.value = true;
};

const handleTutorialClick = () => {
  router.push('/bulk-generation/tutorial');
}

const handleDownloadPDF417 = () => {
  console.log("Download PDF417");
  // Handle PDF417 download
};

const handleDownload128Codes = () => {
  console.log("Download 128 Codes");
  // Handle 128 Codes download
};

const handleDownloadCompletePackage = () => {
  console.log("Download Complete Package");
  // Handle Complete Package download
};
</script>
