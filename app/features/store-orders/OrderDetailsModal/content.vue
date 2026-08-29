<template>
  <div class="flex flex-col gap-6 w-full p-6">
    <!-- Header -->
    <OrderDetailsHeader
      :order-number="orderNumber"
      @close="handleClose"
    />

    <!-- Product Images -->
    <OrderDetailsImages
      v-if="productImages && productImages.length > 0"
      :product-images="productImages"
    />

    <!-- Product Info and Export -->
    <OrderDetailsInfo
      :products-info="productsInfo"
      :total-amount="totalAmount"
      :export-button-text="exportButtonText"
      @export="handleExport"
    />

    <!-- Barcode Details -->
    <OrderDetailsBarcodeInfo
      v-if="hasBarcodeInfo"
      :run-barcode-validation="runBarcodeValidation"
      :run-data-validation="runDataValidation"
      :details-of-barcode="detailsOfBarcode"
      :generation-date="generationDate"
    />

    <!-- Footer Learn More Button -->
    <div v-if="learnMoreButtonText" class="pt-2">
      <Button
        color="white"
        text-color="dark"
        class="w-full h-12 text-base font-semibold"
        :on-click="handleLearnMore"
      >
        {{ learnMoreButtonText }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import OrderDetailsHeader from "~/features/store-orders/OrderDetailsModal/components/OrderDetailsHeader.vue";
import OrderDetailsImages from "~/features/store-orders/OrderDetailsModal/components/OrderDetailsImages.vue";
import OrderDetailsInfo from "~/features/store-orders/OrderDetailsModal/components/OrderDetailsInfo.vue";
import OrderDetailsBarcodeInfo from "~/features/store-orders/OrderDetailsModal/components/OrderDetailsBarcodeInfo.vue";
import { useI18n } from "#imports";

interface Props {
  orderNumber: string;
  totalAmount: string;
  productsInfo: string;
  productImages: string[];
  purchasedLabel?: string;
  runBarcodeValidation?: string;
  runDataValidation?: string;
  detailsOfBarcode?: string;
  generationDate?: string;
  learnMoreButtonText?: string;
  onExport?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  purchasedLabel: "",
  runBarcodeValidation: "",
  runDataValidation: "",
  detailsOfBarcode: "",
  generationDate: "",
  learnMoreButtonText: "",
  onExport: undefined,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "export"): void;
}>();

const { t } = useI18n();

const exportButtonText = computed(() => t("store_orders.export"));

const hasBarcodeInfo = computed(() => {
  return (
    props.runBarcodeValidation ||
    props.runDataValidation ||
    props.detailsOfBarcode ||
    props.generationDate
  );
});

const handleClose = () => {
  emit("update:isOpen", false);
};

const handleExport = () => {
  if (props.onExport) {
    props.onExport();
  }
  emit("export");
};

const handleLearnMore = () => {
  // Handle learn more action
};
</script>

