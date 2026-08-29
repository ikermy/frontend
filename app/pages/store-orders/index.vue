<template>
    <NuxtLayout name="main">
        <div class="pt-2 h-full flex flex-col w-full mx-auto">
            <h1 class="font-hector text-3xl font-semibold">
                {{ $t("store_orders.title") }}
            </h1>
            <Select
                :options="[t('barcodes.sort_by')]"
                class="max-w-[270px] w-full mt-9"
            />
            <div class="mt-9 flex flex-col gap-4">
                <OrderCard
                    v-for="(order, index) in orders"
                    :key="index"
                    :order-number="order.orderNumber"
                    :total-amount="order.totalAmount"
                    :purchased-label="order.purchasedLabel"
                    :products-info="order.productsInfo"
                    :product-images="order.productImages"
                    :learn-more-button-text="order.learnMoreButtonText"
                    :container-class="order.containerClass"
                    :on-learn-more="() => router.push(localePath('/store-orders/details'))"
                />
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
import Select from "~/shared/ui/Select.vue";
import OrderCard from "~/features/store-orders/OrderCard.vue";
import { useAssets } from "~/shared/composables/useAssets";

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const { images } = useAssets();

const basketCardImage = images.basketCard;

const orders = [
  {
    orderNumber: "Order Nº2133N32 March 25, 2024",
    totalAmount: "$ 100",
    purchasedLabel: t('store_orders.purchased'),
    productsInfo: "Products, 5 pcs.",
    productImages: [
      basketCardImage,
      basketCardImage,
      basketCardImage,
      basketCardImage,
      basketCardImage,
    ],
    learnMoreButtonText: t('store_orders.learn_more'),
    containerClass: "w-full",
    runBarcodeValidation: t('store_orders.run_barcode_validation'),
    runDataValidation: t('store_orders.run_data_validation'),
    detailsOfBarcode: t('store_orders.details_of_barcode'),
    generationDate: "March 25, 2024",
  },
  {
    orderNumber: "Order Nº2416N25 April 4, 2024",
    totalAmount: "$ 180",
    purchasedLabel: t('store_orders.purchased'),
    productsInfo: "Products, 1 pcs.",
    productImages: [
      basketCardImage,
    ],
    learnMoreButtonText: t('store_orders.learn_more'),
    containerClass: "w-full",
    runBarcodeValidation: t('store_orders.run_barcode_validation'),
    runDataValidation: t('store_orders.run_data_validation'),
    detailsOfBarcode: t('store_orders.details_of_barcode'),
    generationDate: "April 4, 2024",
  },
  {
    orderNumber: "Order Nº2145N44 March 28, 2024",
    totalAmount: "$ 250",
    purchasedLabel: t('store_orders.purchased'),
    productsInfo: "Products, 3 pcs.",
    productImages: [
      basketCardImage,
      basketCardImage,
      basketCardImage,
    ],
    learnMoreButtonText: t('store_orders.learn_more'),
    containerClass: "w-full",
    runBarcodeValidation: t('store_orders.run_barcode_validation'),
    runDataValidation: t('store_orders.run_data_validation'),
    detailsOfBarcode: t('store_orders.details_of_barcode'),
    generationDate: "March 28, 2024",
  },
  {
    orderNumber: "Order Nº2256N55 April 1, 2024",
    totalAmount: "$ 180",
    purchasedLabel: t('store_orders.purchased'),
    productsInfo: "Products, 7 pcs.",
    productImages: [
      basketCardImage,
      basketCardImage,
      basketCardImage,
      basketCardImage,
      basketCardImage,
      basketCardImage,
      basketCardImage,
    ],
    learnMoreButtonText: t('store_orders.learn_more'),
    containerClass: "w-full",
    runBarcodeValidation: t('store_orders.run_barcode_validation'),
    runDataValidation: t('store_orders.run_data_validation'),
    detailsOfBarcode: t('store_orders.details_of_barcode'),
    generationDate: "April 1, 2024",
  },
];

</script>