<template>
  <div class="overflow-y-hidden">
    <div class="flex flex-col max-w-[500px] mx-auto w-full mt-7 relative">
      <img
        :src="icons.chevronLeft"
        alt="arrow-left"
        class="h-10 fill-black absolute cursor-pointer"
        @click="router.back()"
      />
      <div class="flex items-center justify-center">
        <h1 class="font-hector text-3xl font-medium mx-auto">
          {{ $t("modals.buyPackages.title") }}
        </h1>
      </div>
      <div class="flex mt-[38px] gap-[10px] h-full flex-col w-full">
        <div
          class="rounded-[12px] flex justify-between items-center py-[10px] px-3 cursor-pointer size-full transition-all duration-300"
          :class="{
            'bg-white text-black': selectedPackage === packageEl.id,
            'bg-white/10': selectedPackage !== packageEl.id,
          }"
          @click="selectedPackage = packageEl.id"
          v-for="packageEl in packages"
          :key="packageEl.id"
        >
          <p class="text-sm font-semibold">
            {{ packageEl.name }}
          </p>
          <p class="text-xl font-medium">${{ packageEl.price }}</p>
        </div>
      </div>

      <div
        class="rounded-[16px] flex flex-col gap-2 mt-[38px] w-full border-[1px] border-white/20"
      >
        <p class="text-lg font-semibold px-[22px] mt-3">
          {{ $t("modals.buyPackages.purchase") }}
        </p>
        <div
          class="flex justify-between items-center py-[14px] gap-3 px-6 h-full"
        >
          <div class="flex gap-3">
            <img
              :src="icons.frame1321315575"
              alt="BTC"
              class="w-10 h-10"
            />
            <div class="flex flex-col">
              <p class="text-sm font-semibold">
                {{ $t("wallet.total_balance") }}
              </p>
              <p class="text-text-tertiary text-sm font-semibold">$200 USD</p>
            </div>
          </div>
          <img
            :src="icons.chevronLeft"
            alt="Expand"
            class="py-3 rotate-270 brightness-75 cursor-pointer"
          />
        </div>
      </div>
      <div
        class="rounded-[16px] border-white/20 border-solid border-[1px] flex flex-col mt-3 w-full"
      >
        <p class="text-lg font-semibold px-[22px] py-[14px]">
          {{ $t("modals.buyPackages.promo_code") }}
        </p>

        <div class="flex flex-col gap-3 w-full">
          <div
            class="flex mx-3 items-center bg-white/10 rounded-[12px] gap-2 mb-[14px]"
          >
            <input
              type="text"
              class="rounded-[12px] text-sm font-semibold w-full h-10 px-4 py-2 focus:outline-none"
              :placeholder="$t('modals.buyPackages.enter')"
            />
            <Button
              color="white"
              text-color="white"
              class="mx-2 my-[6px] rounded-[8px] text-sm font-semibold h-[32px] bg-bg-tertiary"
              >{{ $t("modals.buyPackages.apply") }}</Button
            >
          </div>
        </div>
      </div>

      <Button color="white" text-color="dark" class="mt-[24px]" :on-click="() => router.push('/wallet/pay')">
        {{ $t("modals.buyPackages.buy") }}
        ${{ packages[selectedPackage - 1]?.price }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import Button from "~/shared/ui/Button.vue";
import { useAssets } from "~/shared/composables/useAssets";

const router = useRouter();
const { icons } = useAssets();
const packages = [
  {
    id: 1,
    name: "Unlimited for 30 minutes",
    price: 50,
  },
  {
    id: 2,
    name: "Unlimited for 30 minutes",
    price: 50,
  },
  {
    id: 3,
    name: "Unlimited for 30 minutes",
    price: 50,
  },
  {
    id: 4,
    name: "Unlimited for 30 minutes",
    price: 50,
  },
  {
    id: 5,
    name: "Unlimited for 30 minutes",
    price: 50,
  },
  {
    id: 6,
    name: "Unlimited for 30 minutes",
    price: 50,
  },
  {
    id: 7,
    name: "Unlimited for 30 minutes",
    price: 50,
  },
];
const selectedPackage = ref(1);
</script>
