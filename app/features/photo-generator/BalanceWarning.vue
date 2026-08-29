<template>
  <div
    v-if="show"
    class="bg-bg-tertiary rounded-[12px] px-4 py-3 flex flex-col gap-2"
  >
    <h3 class="text-white font-bold text-base">
      {{ title }}
    </h3>
    <p class="text-white font-medium text-sm leading-relaxed">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show?: boolean;
  title?: string;
  message?: string;
  availableBalance?: number;
  requiredAmount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: "Insufficient Balance",
  message: undefined,
  availableBalance: 0,
  requiredAmount: 0,
});

const message = computed(() => {
  if (props.message) {
    return props.message;
  }
  const deficit = props.requiredAmount - props.availableBalance;
  return `Your wallet has $${props.availableBalance.toLocaleString()} available. You need $${deficit.toLocaleString()} more to pay and generate the document.`;
});
</script>

