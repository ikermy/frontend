<template>
  <UModal
    :open="isOpen"
    class="bg-bg-secondary border-transparent rounded-[16px] z-[101] max-w-[550px] w-full"
    :ui="{ overlay: 'bg-bg-primary' }"
    @update:open="(value) => emit('update:isOpen', value)"
  >
    <template #header>
      <div class="flex flex-col gap-0 relative w-full p-1">
        <!-- Header: Title and Close Button -->
        <div class="flex items-center justify-between mb-6 relative">
          <h1 class="font-hector text-3xl font-medium text-white">
            {{ title }}
          </h1>
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

        <!-- Main Content Card -->
        <!-- <div class="flex flex-col rounded-[16px] border-[1px] border-white/20 mb-6"> -->
        <div class="flex flex-col">
          <!-- Crypto Selector -->
          <div
            class="flex px-4 py-3 gap-3 items-center justify-between w-full cursor-pointer bg-bg-secondary rounded-[12px] hover:bg-bg-tertiary transition-colors"
            @click="handleSelectCrypto"
          >
            <div class="flex gap-3 items-center w-full">
              <img
                :src="currencyIcon"
                :alt="selectedCurrency"
                class="w-9 h-9"
              />
              <div class="flex flex-col">
                <p class="text-sm font-medium text-white">{{ currencyName }}</p>
                <p
                  class="text-text-alternative-secondary text-sm font-semibold overflow-ellipsis whitespace-nowrap"
                >
                  {{ walletAddress }}
                </p>
              </div>
            </div>
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-5 h-5 text-text-alternative-secondary flex-shrink-0"
            />

          </div>
          
          <!-- Amount Display Section -->
          <div class="flex flex-col w-full py-3">
            <div class="flex items-center bg-white/10 rounded-[12px] gap-2 py-2 px-4">
              <div class="flex-1 min-w-0">
                <Input
                  :value="amount.toFixed(8)"
                  placeholder="0.00000000"
                  class="bg-transparent border-none p-0 text-lg font-semibold text-white placeholder:text-text-tertiary focus:ring-0 focus:outline-none w-full"
                  @input="(e: any) => handleAmountChange(e.target.value)"
                />
              </div>
              <p class="text-text-alternative-secondary font-semibold text-sm flex-shrink-0 whitespace-nowrap">
                {{ selectedCurrency }}
              </p>
              <div
                class="bg-white/15 px-2 py-[6px] rounded-[8px] font-semibold text-sm min-w-[100px] flex justify-center text-white whitespace-nowrap"
              >
                ≈ ${{ usdAmount.toLocaleString() }} USD
              </div>
            </div>
          </div>
        </div>

        <!-- Current Balance -->
        <p
          class="text-sm text-text-tertiary font-semibold mb-10"
        >
          {{ balanceLabel }}: ${{ currentBalance.toLocaleString() }} USD
        </p>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <Button
            color="tertiary"
            text-color="white"
            class="flex-1 px-6 py-3 text-base font-semibold"
            :on-click="handleCancel"
          >
            {{ cancelButtonText }}
          </Button>
          <Button
            color="primary"
            text-color="dark"
            class="flex-1 px-6 py-3 text-base font-semibold"
            :on-click="handleConfirm"
          >
            {{ confirmButtonText }}
          </Button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import Input from "~/shared/ui/Input.vue";
import { useCurrencyMapping } from "~/shared/composables/useCurrencyMapping";
import { useAssets } from "~/shared/composables/useAssets";

const { getCurrencyInfo } = useCurrencyMapping();

interface Props {
  isOpen: boolean;
  title?: string;
  selectedCurrency?: string;
  walletAddress?: string;
  btcAmount?: number;
  usdAmount?: number;
  currentBalance?: number;
  balanceLabel?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onSelectCrypto?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Top Up",
  selectedCurrency: "BTC",
  walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  btcAmount: 0.0000032432,
  usdAmount: 321,
  currentBalance: 0,
  balanceLabel: "Current balance",
  confirmButtonText: "Top Up and Generate",
  cancelButtonText: "Cancel",
  onConfirm: undefined,
  onCancel: undefined,
  onSelectCrypto: undefined,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "selectCrypto"): void;
}>();

const handleClose = () => {
  emit("update:isOpen", false);
  if (props.onCancel) {
    props.onCancel();
  }
  emit("cancel");
};

const handleCancel = () => {
  handleClose();
};

const handleConfirm = () => {
  if (props.onConfirm) {
    props.onConfirm();
  }
  emit("confirm");
  emit("update:isOpen", false);
};

const handleSelectCrypto = () => {
  if (props.onSelectCrypto) {
    props.onSelectCrypto();
  }
  emit("selectCrypto");
};

const currencyInfo = computed(() => getCurrencyInfo(props.selectedCurrency));
const { getCurrencyIcon } = useAssets();
const currencyIcon = computed(() => currencyInfo.value?.icon || getCurrencyIcon("BTC"));
const currencyName = computed(() => currencyInfo.value?.name || "Bitcoin");

const amount = ref(props.btcAmount);

watch(() => props.btcAmount, (newValue) => {
  amount.value = newValue;
});

const handleAmountChange = (value: string) => {
  const numValue = parseFloat(value) || 0;
  if (!isNaN(numValue)) {
    amount.value = numValue;
  }
};
</script>

