<template>
  <div class="flex flex-col gap-9 w-full">
    <!-- Header -->
    <div class="flex items-center justify-center w-full relative">
      <button
        @click="handleBack"
        class="p-2 hover:bg-bg-tertiary rounded-lg transition-colors bg-transparent cursor-pointer absolute left-0"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-white" />
      </button>
      <h2 class="text-2xl font-bold font-hector">{{ title }}</h2>
    </div>

    <!-- Source Selection -->
    <div v-if="sourceOptions && sourceOptions.length > 0" class="flex gap-2 w-full">
      <button
        v-for="(option, index) in sourceOptions"
        :key="index"
        @click="selectedSourceIndex = index"
        :class="[
          'flex-1 h-[60px] rounded-[12px] font-semibold text-sm transition-colors cursor-pointer',
          selectedSourceIndex === index
            ? 'bg-white text-black hover:bg-white/90'
            : 'bg-[#FFFFFF1A] text-white hover:bg-[#FFFFFF26]',
        ]"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Transfer Components - Conditional Rendering -->
    <InStoreBalanceTransfer
      v-if="selectedSource && selectedSource.multiplier !== undefined"
      :recipient="recipient"
      :recipient-label="recipientLabel"
      :amount="localAmount"
      :amount-currency="amountCurrency"
      :converted-amount="convertedAmount"
      :total-transfer-amount="totalTransferAmount"
      :total-transfer-label="totalTransferLabel"
      :transfer-button-text="transferButtonText"
      :amount-placeholder="amountPlaceholder"
      :multiplier="selectedSource.multiplier"
      :on-transfer="handleTransfer"
      :on-select-recipient="handleSelectRecipient"
      @update:amount="localAmount = $event"
      @select-recipient="emit('selectRecipient')"
    />

    <OracleWalletTransfer
      v-else-if="selectedSource && selectedSource.value"
      :recipient="recipient"
      :recipient-label="recipientLabel"
      :amount="localAmount"
      :wallet-currency="selectedSource.value"
      :converted-amount="convertedAmount"
      :total-transfer-amount="totalTransferAmount"
      :total-transfer-label="totalTransferLabel"
      :transfer-button-text="transferButtonText"
      :amount-placeholder="amountPlaceholder"
      :on-transfer="handleTransfer"
      :on-select-recipient="handleSelectRecipient"
      @update:amount="localAmount = $event"
      @select-recipient="emit('selectRecipient')"
    />
  </div>
</template>

<script setup lang="ts">
import InStoreBalanceTransfer from "./InStoreBalanceTransfer.vue";
import OracleWalletTransfer from "./OracleWalletTransfer.vue";

interface SourceOption {
  label: string;
  multiplier?: number;
  value?: string;
}

interface Recipient {
  name: string;
  address: string;
  icon?: string;
}

interface Props {
  title?: string;
  sourceOptions?: SourceOption[];
  recipient?: Recipient;
  recipientLabel?: string;
  amount?: number;
  amountCurrency?: string;
  convertedAmount?: string;
  totalTransferAmount?: string;
  totalTransferLabel?: string;
  transferButtonText?: string;
  amountPlaceholder?: string;
  onTransfer?: (data: {
    amount: number;
    sourceIndex: number;
    recipient: Recipient | undefined;
  }) => void;
  onSelectRecipient?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Transfer",
  recipientLabel: "Transfer to...",
  amountCurrency: "USD",
  transferButtonText: "Transfer",
  amountPlaceholder: "0",
  totalTransferLabel: "Will be transferred",
  sourceOptions: () => [],
  recipient: undefined,
  amount: 0,
  convertedAmount: "",
  totalTransferAmount: "",
  onTransfer: undefined,
  onSelectRecipient: undefined,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "selectRecipient"): void;
  (e: "update:amount", value: number): void;
  (e: "update:sourceIndex", value: number): void;
}>();

const selectedSourceIndex = ref(0);
const localAmount = ref(props.amount);

watch(localAmount, (newValue) => {
  emit("update:amount", newValue || 0);
});

watch(() => props.amount, (newValue) => {
  localAmount.value = newValue;
});

watch(selectedSourceIndex, (newValue) => {
  emit("update:sourceIndex", newValue);
});

const selectedSource = computed(() => {
  return props.sourceOptions[selectedSourceIndex.value];
});

const handleTransfer = (data: { amount: number; recipient: Recipient | undefined }) => {
  if (props.onTransfer) {
    props.onTransfer({
      amount: data.amount,
      sourceIndex: selectedSourceIndex.value,
      recipient: data.recipient,
    });
  }
};

const handleSelectRecipient = () => {
  if (props.onSelectRecipient) {
    props.onSelectRecipient();
  }
  emit("selectRecipient");
};

const handleBack = () => {
  const router = useRouter();
  const localePath = useLocalePath();
  router.push(localePath("/referral"));
};

</script>
