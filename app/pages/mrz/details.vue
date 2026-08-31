<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <!-- Header with Actions -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <NuxtLink :to="localePath('/mrz')" class="flex items-center gap-2">
            <div class="size-8 flex items-center justify-center bg-gray-dark rounded-full">
              <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-white" />
            </div>
          </NuxtLink>
          <h1 class="font-hector text-3xl font-semibold">
            {{ $t("mrz.title") }}
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <Button color="white" text-color="dark" class="px-4 py-2 text-sm font-semibold" :on-click="handleReCreate">
            {{ $t("mrz.re_create") }}
          </Button>
          <Button color="white" text-color="dark" class="px-4 py-2 text-sm font-semibold bg-[#2B2B2B] text-white"
            :on-click="handleFreeAdjustment">
            {{ $t("mrz.free_adjustment") }}
          </Button>
          <button @click="handleDelete" class="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
            <UIcon name="i-heroicons-trash" class="w-5 h-5 text-negative hover:text-negative" />
          </button>
        </div>
      </div>

      <!-- Page Title -->
      <h2 class="font-hector text-2xl font-semibold mb-6">
        {{ mrzIdentifier }}
      </h2>

      <!-- MRZ Data Fields -->
      <MRZDataFields :labels="dataFieldsLabels" :mrz-lines="mrzLines" class="mb-6" />

      <div class="w-full h-px bg-[var(--ui-secondary)] mb-6"></div>

      <!-- MRZ Verification -->
      <MRZVerification :title="$t('mrz.verification.title')" :verification-cards="verificationCards"
        :validate-button-text="$t('mrz.verification.run_validation')"
        :package-plan-text="$t('mrz.verification.package_plan_text')"
        :pay-as-you-go-text="$t('mrz.verification.pay_as_you_go_text')" :on-validate="handleValidation" class="mb-6" />

      <div class="w-full h-px bg-[var(--ui-secondary)] mb-6"></div>

      <!-- Details Table -->
      <MRZDetailsTable :title="$t('mrz.details.title')" :rows="detailsRows" />

      <!-- Delete Confirmation Modal -->
      <ConfirmModal :is-open="isDeleteModalOpen" :title="$t('mrz.delete_modal.title')"
        :description="$t('mrz.delete_modal.description')" :confirm-button-text="$t('mrz.delete_modal.delete_button')"
        :cancel-button-text="$t('mrz.delete_modal.cancel_button')" @update:is-open="isDeleteModalOpen = $event"
        @confirm="handleDeleteConfirm" @cancel="handleDeleteCancel" />

      <!-- Free Adjustment Modal -->
      <InfoModal :is-open="isFreeAdjustmentModalOpen" :title="$t('mrz.free_adjustment_modal.title')"
        :description="$t('mrz.free_adjustment_modal.description')"
        :confirm-button-text="$t('mrz.free_adjustment_modal.proceed_button')"
        :cancel-button-text="$t('mrz.free_adjustment_modal.cancel_button')" icon="i-heroicons-exclamation-triangle"
        @update:is-open="isFreeAdjustmentModalOpen = $event" @confirm="handleFreeAdjustmentConfirm"
        @cancel="handleFreeAdjustmentCancel" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import Button from "~/shared/ui/Button.vue";
import MRZDataFields from "~/features/mrz/MRZDataFields.vue";
import MRZVerification from "~/features/mrz/MRZVerification.vue";
import MRZDetailsTable from "~/features/mrz/MRZDetailsTable.vue";
import ConfirmModal from "~/shared/ui/ConfirmModal.vue";
import InfoModal from "~/shared/ui/InfoModal.vue";
import { useAssets } from "~/shared/composables/useAssets";

const { t } = useI18n();
const localePath = useLocalePath();
const { images } = useAssets();

const isDeleteModalOpen = ref(false);
const isFreeAdjustmentModalOpen = ref(false);

const mrzIdentifier = ref("MRZ #958185_SMITH_MA");

const dataFieldsLabels = [
  t("mrz.data_fields.generation_date"),
  t("mrz.data_fields.revision_date"),
  t("mrz.data_fields.issuing_country"),
  t("mrz.data_fields.document_type"),
  t("mrz.data_fields.first_name"),
  t("mrz.data_fields.surname"),
];

const mrzLines = [
  "P<USASMITH<<JOHN<<<<<<<<<<<<<<<<<<<<",
  "1234567890USA8001019M2501012<<<<<<<<",
  "Optional 3-rd line if needed...",
];

const verificationCards = [
  {
    label: "VS VeriScan",
    logoText: "VS",
    logoBgClass: "bg-blue-600",
    icon: images.veriScan
  },
  {
    label: "checkpoint from MRI Software",
    logoText: "✓",
    logoBgClass: "bg-orange-600",
    icon: images.checkpoint
  },
  {
    label: "intellicheck",
    logoText: "i",
    logoBgClass: "bg-blue-600",
    icon: images.intellicheck
  },
];

const detailsRows = [
  { label: t("mrz.data_fields.generation_date"), value: "Label" },
  { label: t("mrz.data_fields.revision_date"), value: "Label" },
  { label: t("mrz.data_fields.issuing_country"), value: "Label" },
  { label: t("mrz.data_fields.document_type"), value: "Label" },
  { label: t("mrz.details.surname"), value: "Label" },
  { label: t("mrz.details.given_names"), value: "Label" },
  { label: t("mrz.details.date_of_birth"), value: "Label" },
  { label: t("mrz.details.sex"), value: "03 Mar. 2024" },
  { label: t("mrz.details.expiration_date"), value: "03 Mar. 2024" },
  { label: t("mrz.details.document_number"), value: "03 Mar. 2024" },
  { label: t("mrz.details.personal_number"), value: "03 Mar. 2024" },
  { label: t("mrz.details.height"), value: "03 Mar. 2024" },
];

const handleReCreate = () => {
  console.log("Re-Create clicked");
};

const handleFreeAdjustment = () => {
  isFreeAdjustmentModalOpen.value = true;
};

const handleFreeAdjustmentConfirm = () => {
  console.log("Proceed to Adjustment clicked");
  // Navigate to adjustment page or open adjustment form
};

const handleFreeAdjustmentCancel = () => {
  isFreeAdjustmentModalOpen.value = false;
};

const handleDelete = () => {
  isDeleteModalOpen.value = true;
};

const handleDeleteConfirm = () => {
  console.log("MRZ deleted");
  // Here you would call API to delete MRZ
  // After successful deletion, navigate back or show success message
};

const handleDeleteCancel = () => {
  isDeleteModalOpen.value = false;
};

const handleValidation = () => {
  console.log("Run validation clicked");
};
</script>
