<template>
  <div class="flex items-center gap-2">
    <span class="text-white font-semibold text-lg">
      {{ formattedAmount }} {{ currency }}
    </span>
    <span class="text-text-tertiary text-sm">
      ≈ {{ formattedUsd }} USD
    </span>
  </div>
</template>

<script setup lang="ts">
import { useCurrencyMapping } from "~/shared/composables/useCurrencyMapping";

interface Props {
  amount: number;
  currency?: string;
  usdValue: number;
}

const props = withDefaults(defineProps<Props>(), {
  currency: "BTC",
  usdValue: 0,
});

const { getCurrencyInfo, formatCurrencyWithCode } = useCurrencyMapping();

const formattedAmount = computed(() => {
  const currencyInfo = getCurrencyInfo(props.currency);
  if (!currencyInfo) return props.amount.toString();
  
  return props.amount.toFixed(currencyInfo.precision);
});

const formattedUsd = computed(() => {
  return props.usdValue.toFixed(2);
});
</script>

