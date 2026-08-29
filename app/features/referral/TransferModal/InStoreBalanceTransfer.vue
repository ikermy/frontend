<template>
  <div class="flex flex-col gap-9">
    <!-- Transfer Card -->
    <div class="flex flex-col gap-4 border border-gray-500 rounded-[12px] p-4">
      <!-- Recipient Selection -->
      <div v-if="recipient" class="flex flex-col gap-2">
        <label class="text-sm text-white font-medium">
          {{ recipientLabel }}
        </label>
        <div
          @click="$emit('selectRecipient')"
          class="flex items-center gap-3 p-3 bg-transparent rounded-[12px] cursor-pointer hover:bg-white/10 transition-colors"
        >
          <img
            v-if="recipient.icon"
            :src="recipient.icon"
            :alt="recipient.name"
            class="w-10 h-10 rounded-full"
          />
          <div class="flex flex-col flex-1 min-w-0">
            <span class="text-white font-medium">{{ recipient.name }}</span>
            <span class="text-sm text-text-tertiary truncate">{{
              recipient.address
            }}</span>
          </div>
          <UIcon
            name="i-heroicons-chevron-down"
            class="w-5 h-5 text-text-tertiary flex-shrink-0"
          />
        </div>
      </div>

      <!-- Amount Input -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 bg-bg-tertiary rounded-[12px] pl-4 pr-2 h-12">
          <input
            :value="amount"
            type="number"
            :placeholder="amountPlaceholder"
            class="flex-1 bg-transparent text-white font-semibold text-lg border-none focus:outline-none focus:ring-0"
            :min="0"
            @input="handleAmountChange"
          />
          <span class="text-text-tertiary font-medium">{{ amountCurrency }}</span>
          <div
            v-if="convertedAmount"
            class="bg-[#FFFFFF26] rounded-[8px] px-3 py-1.5 ml-2"
          >
            <span class="text-sm text-white whitespace-nowrap">{{ convertedAmount }}</span>
          </div>
        </div>
      </div>

      <!-- Total Transfer Info (with multiplier) -->
      <div v-if="totalTransferAmount" class="pt-2">
        <p class="text-sm text-[#A6A6A6]">
          {{ totalTransferLabel }}: {{ totalTransferAmount }}
        </p>
      </div>
    </div>

    <!-- Transfer Button -->
    <Button
      color="white"
      text-color="dark"
      class="w-full h-12 text-base font-semibold"
      :on-click="handleTransfer"
      :disabled="!canTransfer"
    >
      {{ transferButtonText }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

interface Recipient {
  name: string;
  address: string;
  icon?: string;
}

interface Props {
  recipient?: Recipient;
  recipientLabel?: string;
  amount?: number;
  amountCurrency?: string;
  convertedAmount?: string;
  totalTransferAmount?: string;
  totalTransferLabel?: string;
  transferButtonText?: string;
  amountPlaceholder?: string;
  multiplier?: number;
  onTransfer?: (data: {
    amount: number;
    recipient: Recipient | undefined;
  }) => void;
  onSelectRecipient?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  recipientLabel: "Transfer to...",
  amountCurrency: "USD",
  transferButtonText: "Transfer",
  amountPlaceholder: "0",
  totalTransferLabel: "Will be transferred",
  recipient: undefined,
  amount: 0,
  convertedAmount: "",
  totalTransferAmount: "",
  multiplier: 1,
  onTransfer: undefined,
  onSelectRecipient: undefined,
});

const emit = defineEmits<{
  (e: "update:amount", value: number): void;
  (e: "selectRecipient"): void;
}>();

const canTransfer = computed(() => {
  return props.amount > 0 && props.recipient !== undefined;
});

const handleAmountChange = (event: Event) => {
  const value = parseFloat((event.target as HTMLInputElement).value) || 0;
  emit("update:amount", value);
};

const handleTransfer = () => {
  if (canTransfer.value && props.onTransfer) {
    props.onTransfer({
      amount: props.amount,
      recipient: props.recipient,
    });
  }
};
</script>

