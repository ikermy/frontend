<template>
  <p class="text-text-tertiary text-sm">
    {{ label }}: {{ formattedBalance }}
  </p>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  balance: number;
  currency?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Current balance",
  balance: 0,
  currency: "USD",
});

const formattedBalance = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: props.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.balance);
});
</script>

