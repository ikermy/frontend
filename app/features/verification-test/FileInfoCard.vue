<template>
  <div
    v-if="fileName"
    class="flex flex-col justify-between bg-bg-secondary rounded-[12px] p-4"
    :style="{ width: '500px', height: showBalanceWarning ? '368px' : '266px' }"
  >
    <!-- File Information Section -->
    <div class="relative flex flex-col items-start gap-3 p-2 bg-bg-tertiary rounded-[12px]">
      <!-- Close Button -->
      <button
        @click.stop="handleClose"
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
        <p class="text-white font-medium text-sm">{{ fileName }}</p>
        <p class="text-text-tertiary text-xs">{{ formattedFileSize }}</p>
      </div>
    </div>

    <!-- Summary and Action Section -->
    <div class="flex flex-col gap-4">
      <!-- Total -->
      <div class="flex items-center justify-between px-2">
        <p class="text-white font-medium text-lg">
          {{ $t("verification-test.total") }}
        </p>
        <p class="text-white font-medium text-lg">
          ${{ total.toLocaleString() }}
        </p>
      </div>

      <!-- Balance Warning -->
      <BalanceWarning
        v-if="showBalanceWarning"
        :show="showBalanceWarning"
        :available-balance="availableBalance"
        :required-amount="total"
      />

      <!-- Submit Button -->
      <Button
        color="primary"
        text-color="dark"
        class="w-full h-12 text-base font-semibold"
        :on-click="handleSubmit"
      >
        {{ showBalanceWarning ? $t("verification-test.top_up_and_submit") : $t("verification-test.submit_button") }}
      </Button>
    </div>

    <!-- Top Up Modal -->
    <TopUpModal
      :is-open="isTopUpModalOpen"
      :title="$t('photo-generator.top_up.title')"
      :selected-currency="'BTC'"
      :wallet-address="'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'"
      :btc-amount="0.0000032432"
      :usd-amount="321"
      :current-balance="availableBalance"
      :balance-label="$t('photo-generator.top_up.current_balance')"
      :confirm-button-text="$t('verification-test.top_up_and_submit')"
      :cancel-button-text="$t('photo-generator.top_up.cancel_button')"
      @update:is-open="isTopUpModalOpen = $event"
      @confirm="handleTopUpConfirm"
      @cancel="handleTopUpCancel"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import BalanceWarning from "~/features/photo-generator/BalanceWarning.vue";
import TopUpModal from "~/features/photo-generator/TopUpModal.vue";

interface Props {
  fileName?: string;
  fileSize?: number;
  total?: number;
  availableBalance?: number;
  onClose?: () => void;
  onSubmit?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  fileName: undefined,
  fileSize: 0,
  total: 2500,
  availableBalance: 1000,
  onClose: undefined,
  onSubmit: undefined,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit"): void;
}>();

const { t } = useI18n();

const isTopUpModalOpen = ref(false);

const showBalanceWarning = computed(() => {
  return props.availableBalance < props.total;
});

const formattedFileSize = computed(() => {
  if (props.fileSize === 0) return "23mb";
  
  const bytes = props.fileSize;
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(Math.max(i, 0), sizes.length - 1);
  const sizeLabel = sizes[index];
  if (!sizeLabel) return "0 Bytes";
  return Math.round(bytes / Math.pow(k, index) * 100) / 100 + " " + sizeLabel.toLowerCase();
});

const handleClose = () => {
  if (props.onClose) {
    props.onClose();
  }
  emit("close");
};

const handleSubmit = () => {
  if (showBalanceWarning.value) {
    // Open Top Up Modal if balance is insufficient
    isTopUpModalOpen.value = true;
  } else {
    // Submit directly if balance is sufficient
    if (props.onSubmit) {
      props.onSubmit();
    }
    emit("submit");
  }
};

const handleTopUpConfirm = () => {
  console.log("Top Up and Submit for verification");
  // Handle top up and submit
  isTopUpModalOpen.value = false;
  if (props.onSubmit) {
    props.onSubmit();
  }
  emit("submit");
};

const handleTopUpCancel = () => {
  isTopUpModalOpen.value = false;
};
</script>

