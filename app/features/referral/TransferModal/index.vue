<template>
  <!-- Gradient Background Overlay -->
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-[100] pointer-events-none transfer-gradient-overlay"
    :style="overlayStyle"
  />
  <UDrawer
    v-if="isMobile"
    :open="props.isOpen"
    class="bg-bg-secondary border-transparent rounded-[12px] z-[101]"
    :ui="{ overlay: 'bg-transparent' }"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <Content
        v-bind="contentProps"
        @update:is-open="emit('update:isOpen', $event)"
        @select-recipient="emit('selectRecipient')"
        @update:amount="emit('update:amount', $event)"
        @update:source-index="emit('update:sourceIndex', $event)"
      />
    </template>
  </UDrawer>
  <UModal
    v-else
    :open="props.isOpen"
    class="bg-bg-secondary border-transparent rounded-[12px] max-w-[500px] z-[101]"
    :ui="{ overlay: 'bg-transparent' }"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <Content
        v-bind="contentProps"
        @update:is-open="emit('update:isOpen', $event)"
        @select-recipient="emit('selectRecipient')"
        @update:amount="emit('update:amount', $event)"
        @update:source-index="emit('update:sourceIndex', $event)"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import Content from "./content.vue";
import { useAssets } from "~/shared/composables/useAssets";

const { backgrounds } = useAssets();

const windowWidth = ref(0);

onMounted(() => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
    const updateWidth = () => {
      windowWidth.value = window.innerWidth;
    };
    window.addEventListener('resize', updateWidth);
    onUnmounted(() => {
      window.removeEventListener('resize', updateWidth);
    });
  }
});

const overlayStyle = computed(() => {
  const isMobile = windowWidth.value <= 480;
  const isTablet = windowWidth.value <= 1024 && windowWidth.value > 480;
  
  let bgImage = backgrounds.error;
  if (isMobile) {
    bgImage = backgrounds.errorMobile;
  } else if (isTablet) {
    bgImage = backgrounds.errorTablet;
  }
  
  return {
    backgroundImage: `url('${bgImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
});

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
  isOpen: boolean;
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
  sourceOptions: () => [],
  recipient: undefined,
  recipientLabel: "Transfer to...",
  amount: 0,
  amountCurrency: "USD",
  convertedAmount: "",
  totalTransferAmount: "",
  totalTransferLabel: "Will be transferred",
  transferButtonText: "Transfer",
  amountPlaceholder: "0",
  onTransfer: undefined,
  onSelectRecipient: undefined,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "selectRecipient"): void;
  (e: "update:amount", value: number): void;
  (e: "update:sourceIndex", value: number): void;
}>();

const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });
});

const contentProps = computed(() => ({
  title: props.title,
  sourceOptions: props.sourceOptions,
  recipient: props.recipient,
  recipientLabel: props.recipientLabel,
  amount: props.amount,
  amountCurrency: props.amountCurrency,
  convertedAmount: props.convertedAmount,
  totalTransferAmount: props.totalTransferAmount,
  totalTransferLabel: props.totalTransferLabel,
  transferButtonText: props.transferButtonText,
  amountPlaceholder: props.amountPlaceholder,
  onTransfer: props.onTransfer,
  onSelectRecipient: props.onSelectRecipient,
}));
</script>

<style scoped>
.transfer-gradient-overlay {
  /* Background styles are applied via :style binding */
}
</style>
