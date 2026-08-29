<template>
  <div class="overflow-y-hidden h-full">
    <div
      class="flex flex-col max-w-[510px] mx-auto my-auto w-full mt-7 items-center h-full justify-center mobile:px-4 mobile:max-w-full">
      <img :src="icons.qr" alt="qr" class="w-64 h-64" />
      <h4 class="mt-4 font-hector text-2xl font-medium">
        {{ $t("modals.pay.title") }}
      </h4>
      <div class="flex justify-between mx-auto w-full mobile:flex-col">
        <p class="text-lg font-medium">
          {{ $t("modals.pay.transfer") }}
        </p>
        <p class="text-lg font-medium">Bitcoin Wallet</p>
      </div>
      <div class="flex justify-between w-full mt-7 mobile:flex-col">
        <p class="text-lg font-medium">{{ $t("modals.pay.btc_address") }}:</p>
        <div class="flex items-center gap-2">
          <p class="text-lg font-medium">1Pn85Vjc2zN3rfvDYXmZUsfT1p9j4</p>
          <img :src="icons.copy" alt="copy" class="w-4 h-4 cursor-pointer"
            @click="copyToClipboard('1Pn85Vjc2zN3rfvDYXmZUsfT1p9j4')" />
        </div>
      </div>
      <Button color="white" text-color="dark" class="mt-12 w-full">
        {{ $t("modals.pay.topup_with_oracle") }}
      </Button>
      <div class="flex justify-around w-full mt-4 gap-2">
        <div
          class="text-lg font-medium bg-white/10 rounded-[12px] py-3 flex justify-center w-full items-center gap-[2px] cursor-pointer">
          <img :src="icons.code" alt="copy" class="w-5 h-5" />

          {{ $t("modals.pay.share_code") }}
        </div>
        <div
          class="text-lg font-medium bg-white/10 rounded-[12px] py-3 flex justify-center w-full items-center gap-[2px] cursor-pointer">
          <img :src="icons.address" alt="copy" class="w-5 h-5" />

          {{ $t("modals.pay.share_addy") }}
        </div>
      </div>
      <p class="text-lg font-medium w-full mt-4 text-center">
        {{ $t("modals.pay.cancel") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssets } from "~/shared/composables/useAssets";
import Button from "~/shared/ui/Button.vue";
const { icons } = useAssets();

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>
