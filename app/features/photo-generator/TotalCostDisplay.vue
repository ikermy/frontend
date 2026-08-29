<template>
  <div class="flex items-center justify-between">
    <span class="text-white font-medium text-base">
      {{ label }}
    </span>
    <span class="text-white font-semibold text-base">
      {{ formattedCost }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  cost: number;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Total",
  cost: 0,
});

const formattedCost = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.cost);
});
</script>

