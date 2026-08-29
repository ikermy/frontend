<template>
  <div class="flex justify-between items-center">
    <div class="flex gap-[10px]">
      <img :src="props.svg" alt="transaction" />
      <div class="flex flex-col mt-5">
        <h3 class="font-semibold">
          {{ props.title }}
        </h3>
        <h5 class="text-text-secondary text-sm">
          {{ props.category }}
        </h5>
        <p class="text-text-tertiary text-sm">
          {{ props.value }}
        </p>
      </div>
    </div>
    <div class="flex flex-col gap-2 items-end">
      <p class="text-xs text-text-tertiary">
        {{ props.dateMinutes }}
      </p>
      <div
        color="white"
        text-color="dark"
        class="rounded-[12px] font-medium px-[10px] h-8 my-auto flex items-center"
        :class="statusButton"
      >
        {{ props.status }}
      </div>
    </div>
  </div>
  <div class="w-full h-[1px] bg-bg-tertiary mt-[10px]"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  category: string;
  value: string;
  svg: string;
  status: string;
  dateMinutes: string;
}>();
const statusButton = computed(() => {
  return props.status === "Success"
    ? "bg-primary text-black"
    : props.status === "Pending"
      ? "bg-[#F2FF00] text-black"
      : props.status === "Canceled"
        ? "bg-bg-tertiary text-negative"
        : "bg-negative text-white";
});
</script>
