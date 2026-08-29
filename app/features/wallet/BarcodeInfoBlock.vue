<template>
  <div
    class="flex flex-col gap-2 rounded-[16px] px-4 py-[14px] border-[1px] border-bg-tertiary w-full h-full"
  >
    <div class="flex flex-col justify-between h-full">
      <div class="flex justify-between">
        <h3 class="font-inter text-lg font-medium">
          {{ $t("wallet.barcodes") }}
        </h3>
        <Button
          color="tertiary"
          text-color="white"
          class="px-4 py-2 text-sm h-9"
          @click="navigateTo(localePath('/buy-packages'))"
        >
          {{ $t("wallet.add") }}
        </Button>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm text-text-tertiary font-semibold">
          {{ $t("wallet.available") }}
        </p>
        <h2 class="text-xl font-semibold">
          {{ $t("wallet.barcodes_available", { count: 10, hours: 140 }) }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

const localePath = useLocalePath();
const router = useRouter();
</script>
