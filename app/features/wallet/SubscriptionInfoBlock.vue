<template>
  <div
    class="flex flex-col gap-2 rounded-[16px] px-4 py-[14px] border-[1px] border-bg-tertiary w-full h-full"
  >
    <div class="flex flex-col justify-between h-full">
      <div class="flex justify-between">
        <h3 class="font-inter text-lg font-medium">
          {{ $t("wallet.subscription") }}
        </h3>
        <Button
          color="secondary"
          text-color="white"
          class="px-4 py-2 text-xs h-9"
        >
          {{ $t("wallet.left_time", { hours: 140 }) }}
        </Button>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm text-text-tertiary font-semibold">
          {{ $t("wallet.plan") }}
        </p>
        <h2 class="text-xl font-semibold">
          {{ $t("wallet.unlimited_plan", { hours: 168 }) }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
</script>
