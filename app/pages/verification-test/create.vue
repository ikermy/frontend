<template>
  <div class="h-screen w-full flex flex-col bg-bg-primary">
    <div class="flex flex-col flex-1 px-6 py-5 max-w-2xl mx-auto items-center justify-center">
      <!-- Header -->
      <div class="flex items-center justify-center gap-2 mb-6">
        <Button
          color="tertiary"
          text-color="white"
          leading-icon="i-heroicons-chevron-left"
          class="px-4 py-2 text-sm font-semibold rounded-full"
          :on-click="handleBack"
        >
          {{ $t("verification-test.back") }}
        </Button>
      </div>

      <!-- Title -->
      <h1 class="font-hector text-3xl font-semibold text-white mb-12 text-center">
        {{ $t("verification-test.title") }}
      </h1>

      <!-- File Upload -->
      <div class="w-full flex justify-center items-center flex-1">
        <div
          v-if="!selectedFileName"
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
            accept=".xlsx,.xls"
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
            <p class="text-white font-medium text-base">{{ $t("verification-test.upload_text") }}</p>
            <p class="text-text-tertiary text-sm">{{ $t("verification-test.file_type_text") }}</p>
          </div>
        </div>

        <!-- File Info Card -->
        <FileInfoCard
          v-else
          :file-name="selectedFileName"
          :file-size="selectedFileSize"
          :total="randomTotal"
          @close="handleFileRemove"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import Button from "~/shared/ui/Button.vue";
import FileInfoCard from "~/features/verification-test/FileInfoCard.vue";

definePageMeta({
  layout: "empty",
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const selectedFileName = ref("");
const selectedFileSize = ref(0);
const randomTotal = ref(2500); // Default value

// Generate random total between 1000 and 5000
const generateRandomTotal = () => {
  return Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
};

const handleBack = () => {
  router.push(localePath("/verification-test"));
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
  console.log("File selected:", file);
  selectedFileName.value = file.name;
  selectedFileSize.value = file.size;
  randomTotal.value = generateRandomTotal(); // Generate new random total for each file
};

const handleFileRemove = () => {
  console.log("File removed");
  selectedFileName.value = "";
  selectedFileSize.value = 0;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleSubmit = () => {
  console.log("Submit for verification", {
    fileName: selectedFileName.value,
    fileSize: selectedFileSize.value,
    total: randomTotal.value,
  });
  // Open modal for confirmation (optional, can be removed if not needed)
  // isFileInfoModalOpen.value = true;
  // Or handle submission directly
  // Handle submission logic here
};
</script>

