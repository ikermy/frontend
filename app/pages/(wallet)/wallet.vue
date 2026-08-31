<template>
  <NuxtLayout name="main">
    <div class="pt-2 flex flex-col mx-auto overflow-y-auto">
      <h1 class="font-hector text-3xl font-semibold">
        {{ $t("wallet.title") }}
      </h1>
      <div class="flex gap-4 mt-[38px] w-full mobile:flex-col">
        <BalanceBlock class="desktop:max-w-[664px] w-full" />
        <div class="flex flex-col gap-4 w-full desktop:max-w-[396px]">
          <BarcodeInfoBlock class="h-full" />
          <SubscriptionInfoBlock class="h-full" />
        </div>
      </div>
      <div class="flex justify-between items-center mt-[24px]">
        <h1 class="font-inter text-3xl font-semibold">
          {{ $t("wallet.history.title") }}
        </h1>
        <Select :options="[t('wallet.history.sort_by.title')]" class="max-w-[270px] w-full" />
      </div>
      <div class="mt-4">
        <div class="flex gap-2">
          <div class="px-3 py-2 rounded-[12px] cursor-pointer font-medium" v-for="(category, index) in categories"
            :key="category" :class="filterCategory === transactionCategories[index]?.key
              ? 'bg-white text-black'
              : 'bg-bg-tertiary text-white'
              " @click="handleCategoryChange(index)">
            {{ category }}
          </div>
        </div>
      </div>
      <div class="mt-7">
        <div v-for="(group, date) in groupedHistory" :key="date" class="mb-6">
          <div class="font-medium text-lg">
            {{ formatDate(date) }}
          </div>
          <div class="">
            <TransactionSlot v-for="transaction in group" :key="transaction.id" :title="transaction.title"
              :category="transaction.category" :value="transaction.value" :svg="transaction.svg || icons.barcode"
              :status="transaction.status" :dateMinutes="formatTime(transaction.date)" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import BalanceBlock from "~/features/wallet/balance/BalanceBlock.vue";
import BarcodeInfoBlock from "~/features/wallet/BarcodeInfoBlock.vue";
import SubscriptionInfoBlock from "~/features/wallet/SubscriptionInfoBlock.vue";
import TransactionSlot from "~/features/wallet/TransactionSlot.vue";
import Select from "~/shared/ui/Select.vue";
import { useTransactionHistory } from "~/shared/composables/useTransactionHistory";
import { useFormatters } from "~/shared/composables/useFormatters";
import { useCurrencyTotals } from "~/shared/composables/useCurrencyTotals";
import { useAssets } from "~/shared/composables/useAssets";
import { getWalletService } from "~/shared/api";
import { useWalletStore } from "~/shared/store";

const { t } = useI18n();
const { formatDate, formatTime } = useFormatters();
const { icons } = useAssets();
const walletService = getWalletService();
const walletStore = useWalletStore();

// Map transaction categories to icons
const getTransactionIcon = (category: string, title: string) => {
  if (category === "Top up") return icons.success;
  if (title.includes("Barcode")) return icons.barcode;
  if (title.includes("package")) return icons.package;
  if (title.includes("Store")) return icons.store;
  if (title.includes("Unlimited") || title.includes("subscription")) return icons.subscription;
  return icons.barcode;
};

// Fetch transactions
onMounted(async () => {
  if (!walletStore.hasTransactions) {
    try {
      const response = await walletService.getTransactions();
      // Map icons to transactions
      response.data.forEach(tx => {
        const existingTx = walletStore.transactions.find(t => t.id === tx.id);
        if (!existingTx || !existingTx.svg) {
          walletStore.updateTransaction(tx.id, {
            svg: getTransactionIcon(tx.category, tx.title),
          });
        }
      });
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  }
});

// Get transactions from store with icons
const transactions = computed(() => {
  return walletStore.transactions.map(tx => ({
    ...tx,
    svg: tx.svg || getTransactionIcon(tx.category, tx.title),
  }));
});

// Update icons in store if missing
watch(() => walletStore.transactions, () => {
  walletStore.transactions.forEach(tx => {
    if (!tx.svg) {
      walletStore.updateTransaction(tx.id, {
        svg: getTransactionIcon(tx.category, tx.title),
      });
    }
  });
}, { deep: true, immediate: true });

// Initialize transaction history with localized categories
// Pass computed directly - useTransactionHistory now supports reactive data
const {
  categories: transactionCategories,
  filterCategory,
  groupedHistory,
  setFilter,
} = useTransactionHistory(transactions);

// Create localized categories for display
const categories = computed(() => [
  t("wallet.history.categories.all"),
  t("wallet.history.categories.top_ups"),
  t("wallet.history.categories.store"),
  t("wallet.history.categories.purchases"),
]);

// Currency totals for analytics
const { summary: currencySummary } = useCurrencyTotals(transactions.value);

// Handle category filter change
const handleCategoryChange = (categoryIndex: number) => {
  const categoryKey = transactionCategories[categoryIndex]?.key;
  if (categoryKey) {
    setFilter(categoryKey);
  }
};
</script>
