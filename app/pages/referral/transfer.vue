<template>
  <div class="transfer-page" :style="transferPageStyle">
    <div class="container">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <!-- <div class="max-w-1/2 w-full bg-transparent h-screen px-14 py-12 gradient-border-container"> -->
        <div class="max-w-[55%] w-full bg-transparent h-screen px-24 py-16 gradient-border-container">
          <Content
            :title="title"
            :source-options="sourceOptions"
            :recipient="recipient"
            :recipient-label="recipientLabel"
            :amount="transferAmount"
            amount-currency="USD"
            :converted-amount="convertedAmount"
            :total-transfer-amount="totalTransferAmount"
            :total-transfer-label="totalTransferLabel"
            :transfer-button-text="transferButtonText"
            :amount-placeholder="amountPlaceholder"
            :on-transfer="handleTransfer"
            :on-select-recipient="() => {}"
            @update:amount="transferAmount = $event"
            @update:source-index="selectedSourceIndex = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Content from "~/features/referral/TransferModal/content.vue";
import { useMoneyFormatting } from "~/shared/composables/useMoneyFormatting";
import { useAssets } from "~/shared/composables/useAssets";

definePageMeta({
  layout: 'empty'
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const { formatTotalBalance } = useMoneyFormatting();
const { getCurrencyIcon, backgrounds } = useAssets();

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

const transferPageStyle = computed(() => {
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

// Transfer data
const transferAmount = ref(600);
const selectedSourceIndex = ref(0);

const title = computed(() => t("referral.transfer_modal.title"));
const recipientLabel = computed(() => t("referral.transfer_modal.transfer_to"));
const transferButtonText = computed(() => t("referral.transfer_modal.transfer_button"));
const amountPlaceholder = computed(() => t("referral.transfer_modal.amount_placeholder"));
const totalTransferLabel = computed(() => t("referral.transfer_modal.will_be_transferred"));

const sourceOptions = computed(() => [
  { label: t("referral.transfer_modal.in_store_balance"), multiplier: 2 },
  { label: t("referral.transfer_modal.oracle_wallet"), value: "USDT" },
]);

const recipient = computed(() => ({
  name: "Bitcoin",
  address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  icon: getCurrencyIcon("BTC"),
}));

const selectedSource = computed(() => {
  return sourceOptions.value[selectedSourceIndex.value];
});

const convertedAmount = computed(() => {
  // Mock conversion: 600 USD ≈ 0.00000231 BTC
  const btcAmount = transferAmount.value / 260000; // Approximate rate
  return `≈ ${btcAmount.toFixed(8)} BTC`;
});

const totalTransferAmount = computed(() => {
  const multiplier = selectedSource.value?.multiplier || 1;
  const total = transferAmount.value * multiplier;
  return formatTotalBalance(total, "USD");
});

const handleTransfer = (data: {
  amount: number;
  sourceIndex: number;
  recipient: any;
}) => {
  console.log("Transfer:", data);
  // Here you would call API to process transfer
  router.push(localePath("/referral"));
};

</script>

<style scoped>
.transfer-page {
  /* Background styles are applied via :style binding */
}

.gradient-border-container {
  position: relative;
}

.gradient-border-container::before,
.gradient-border-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  pointer-events: none;
}

.gradient-border-container::before {
  left: 0;
  background: linear-gradient(
    to bottom,
    rgb(107, 114, 128) 0%,
    rgb(107, 114, 128) 50%,
    transparent 100%
  );
}

.gradient-border-container::after {
  right: 0;
  background: linear-gradient(
    to bottom,
    rgb(107, 114, 128) 0%,
    rgb(107, 114, 128) 50%,
    transparent 100%
  );
}
</style>
