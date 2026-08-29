<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <!-- Header with Back Button -->
      <div class="flex items-center gap-2 mb-6">
        <NuxtLink :to="localePath('/store-orders')" class="flex items-center gap-2">
          <div class="size-8 flex items-center justify-center bg-gray-dark rounded-full">
            <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 text-white" />
          </div>
        </NuxtLink>
        <h1 class="font-hector text-3xl font-semibold">
          {{ $t("store_orders.order_details") }}
        </h1>
      </div>

      <!-- Orders List as Accordion -->
      <div class="flex flex-col gap-0">
        <OrderDetailsItem
          v-for="(order, index) in orders"
          :key="index"
          :order="order"
          :is-expanded="index === 0"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import OrderDetailsItem from "~/features/store-orders/OrderDetailsItem.vue";
import { useAssets } from "~/shared/composables/useAssets";

const { t } = useI18n();
const localePath = useLocalePath();
const { images } = useAssets();

const basketCardImage = images.basketCard;

const orders = [
  {
    id: "1",
    productImage: basketCardImage,
    title: "1 420P",
    description: "Apple card 1000 руб, РУ регион, х2",
    login: "4ccgpt4o@gmail.com",
    password: "$(n3@#bk7ds&8:",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "2",
    productImage: basketCardImage,
    title: "1 420P",
    description: "Apple card 1000 руб, РУ регион, х2",
    login: "example@email.com",
    password: "password123",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "3",
    productImage: basketCardImage,
    title: "1 420P",
    description: "Apple card 1000 руб, РУ регион, х2",
    login: "test@email.com",
    password: "test123",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "4",
    productImage: basketCardImage,
    title: "1 420P",
    description: "Apple card 1000 руб, РУ регион, х2",
    login: "user@email.com",
    password: "user123",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "5",
    productImage: basketCardImage,
    title: "1 420P",
    description: "Apple card 1000 руб, РУ регион, х2",
    login: "admin@email.com",
    password: "admin123",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: "6",
    productImage: basketCardImage,
    title: "1 420P",
    description: "Apple card 1000 руб, РУ регион, х2",
    login: "demo@email.com",
    password: "demo123",
    loremText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
</script>

