<template>
  <UDrawer
    v-if="isMobile"
    :open="props.isOpen"
    class="bg-bg-secondary border-transparent rounded-[12px] z-[101]"
    :ui="{ overlay: 'bg-black/75' }"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <Content
        v-bind="contentProps"
        @update:is-open="emit('update:isOpen', $event)"
        @export="emit('export')"
      />
    </template>
  </UDrawer>
  <UModal
    v-else
    :open="props.isOpen"
    class="bg-bg-secondary border-transparent rounded-[12px] max-w-[700px] z-[101]"
    :ui="{ overlay: 'bg-black/75' }"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <Content
        v-bind="contentProps"
        @update:is-open="emit('update:isOpen', $event)"
        @export="emit('export')"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import Content from "~/features/store-orders/OrderDetailsModal/content.vue";

interface OrderDetails {
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
}

interface Props {
  isOpen: boolean;
  orderDetails?: OrderDetails;
  onExport?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  orderDetails: undefined,
  onExport: undefined,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "export"): void;
}>();

const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });
});

const contentProps = computed(() => ({
  orderNumber: props.orderDetails?.orderNumber || "",
  totalAmount: props.orderDetails?.totalAmount || "",
  productsInfo: props.orderDetails?.productsInfo || "",
  productImages: props.orderDetails?.productImages || [],
  purchasedLabel: props.orderDetails?.purchasedLabel || "",
  runBarcodeValidation: props.orderDetails?.runBarcodeValidation || "",
  runDataValidation: props.orderDetails?.runDataValidation || "",
  detailsOfBarcode: props.orderDetails?.detailsOfBarcode || "",
  generationDate: props.orderDetails?.generationDate || "",
  learnMoreButtonText: props.orderDetails?.learnMoreButtonText || "",
  onExport: props.onExport,
}));
</script>

