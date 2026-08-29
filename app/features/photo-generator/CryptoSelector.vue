<template>
  <div
    @click="handleClick"
    class="flex items-center gap-3 p-3 bg-bg-secondary rounded-[12px] cursor-pointer hover:bg-bg-tertiary transition-colors"
  >
    <!-- Icon -->
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
      :style="{ backgroundColor: currencyInfo?.color || '#F7931A' }"
    >
      <img
        v-if="currencyInfo?.icon"
        :src="currencyInfo.icon"
        :alt="currencyInfo.name"
        class="w-8 h-8"
      />
    </div>

    <!-- Currency Info -->
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <p class="text-white font-medium text-sm">{{ currencyInfo?.name || currency }}</p>
      <p class="text-text-tertiary text-xs truncate">{{ address }}</p>
    </div>

    <!-- Chevron -->
    <UIcon
      name="i-heroicons-chevron-down"
      class="w-5 h-5 text-text-tertiary flex-shrink-0"
    />
  </div>
</template>

<script setup lang="ts">
import { useCurrencyMapping } from "~/shared/composables/useCurrencyMapping";

interface Props {
  currency?: string;
  address?: string;
  onClick?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  currency: "BTC",
  address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  onClick: undefined,
});

const { getCurrencyInfo } = useCurrencyMapping();
const currencyInfo = computed(() => getCurrencyInfo(props.currency));

const handleClick = () => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>

