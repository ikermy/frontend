<template>
  <div
    class="flex flex-col gap-2 bg-bg-secondary rounded-[16px] px-4 py-[14px] max-w-[664px]"
  >
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h3 class="text-sm text-text-tertiary font-semibold">
          {{ $t("wallet.total_balance") }}
        </h3>
        <h2 class="text-[20px] font-semibold">{{ totalBalance }}</h2>
      </div>
      <Button
        color="tertiary"
        text-color="white"
        class="px-4 py-2 text-sm h-9"
        @click="navigateTo(localePath('/top-up'))"
      >
        {{ $t("wallet.top_up") }}
      </Button>
    </div>
    <div class="w-full h-[1px] bg-text-secondary mt-2"></div>
    <div class="flex flex-col gap-3 px-3 py-2">
      <CurrencySlot
        v-for="currency in currencies"
        :name="currency.name"
        :value="currency.value"
        :svg="currency.svg"
        :color="currency.color"
        :key="currency.name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import CurrencySlot from "./CurrencySlot.vue";
import { useCurrencyMapping } from "~/shared/composables/useCurrencyMapping";
import { useMoneyFormatting } from "~/shared/composables/useMoneyFormatting";
import { useAssets } from "~/shared/composables/useAssets";
import { getWalletService } from "~/shared/api";
import { useWalletStore } from "~/shared/store";

const localePath = useLocalePath();
const router = useRouter();

const { createCurrencyBalance, getCurrencyIcon, getCurrencyName } =
  useCurrencyMapping();
const { formatTotalBalance, calculateTotalValue } = useMoneyFormatting();
const { icons } = useAssets();
const walletService = getWalletService();
const walletStore = useWalletStore();

// Load balances from API if not already loaded
onMounted(async () => {
  if (!walletStore.hasBalances) {
    try {
      await walletService.getBalances();
    } catch (error) {
      console.error('Failed to load balances:', error);
    }
  }
});

// Get balances from store
const balances = computed(() => walletStore.balances);

// Create currency balances with formatted values
const currencies = computed(() => {
  return balances.value.map(balance => {
    const currencyBalance = createCurrencyBalance(
      balance.currency,
      balance.amount,
      balance.usdValue
    );

    if (!currencyBalance) {
      return {
        name: balance.currency,
        value: `${balance.amount} ${balance.currency}`,
        svg: icons.wallet,
        color: "#6B7280",
      };
    }

    return {
      name: currencyBalance.info.name,
      value:
        currencyBalance.formattedValue +
        ` ≈ ${currencyBalance.formattedUsdValue}`,
      svg: currencyBalance.info.icon,
      color: currencyBalance.info.color,
    };
  });
});

// Calculate total balance in USD
const totalBalance = computed(() => {
  const totalUsdValue = calculateTotalValue(balances.value);
  return formatTotalBalance(totalUsdValue, "USD");
});
</script>
