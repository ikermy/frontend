import { ref, computed, type Ref, type MaybeRefOrGetter, toValue } from "vue";

export interface Transaction {
  id: number;
  title: string;
  date: string;
  category: string;
  value: string;
  svg?: string;
  status: string;
}

export interface TransactionCategory {
  key: string;
  label: string;
  filter: (transaction: Transaction) => boolean;
}

export function useTransactionHistory(
  initialHistory: MaybeRefOrGetter<Transaction[]>
) {
  const history = computed(() => toValue(initialHistory));
  const filterCategory = ref<string>("");

  const categories: TransactionCategory[] = [
    {
      key: "all",
      label: "All",
      filter: () => true,
    },
    {
      key: "top_ups",
      label: "Top ups",
      filter: transaction => transaction.category === "Top up",
    },
    {
      key: "store",
      label: "Store",
      filter: transaction => transaction.category === "Store",
    },
    {
      key: "purchases",
      label: "Purchases",
      filter: transaction => transaction.category === "Purchase",
    },
  ];

  // Set default filter
  if (categories.length > 0) {
    filterCategory.value = categories[0]?.key || "";
  }

  const filteredHistory = computed(() => {
    const selectedCategory = categories.find(
      cat => cat.key === filterCategory.value
    );
    if (!selectedCategory) return history.value;

    return history.value.filter(selectedCategory.filter);
  });

  const groupedHistory = computed(() => {
    const groups: Record<string, Transaction[]> = {};

    filteredHistory.value.forEach(transaction => {
      const date = transaction.date.split("T")[0];
      if (date) {
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
      }
    });

    return groups;
  });

  const setFilter = (categoryKey: string) => {
    filterCategory.value = categoryKey;
  };

  const addTransaction = (transaction: Transaction) => {
    // Note: This won't work if history is computed from store
    // Use store actions directly instead
    console.warn(
      "addTransaction: Use store actions directly for reactive data"
    );
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    // Note: This won't work if history is computed from store
    // Use store actions directly instead
    console.warn(
      "updateTransaction: Use store actions directly for reactive data"
    );
  };

  const removeTransaction = (id: number) => {
    // Note: This won't work if history is computed from store
    // Use store actions directly instead
    console.warn(
      "removeTransaction: Use store actions directly for reactive data"
    );
  };

  return {
    history,
    categories,
    filterCategory: readonly(filterCategory),
    filteredHistory,
    groupedHistory,
    setFilter,
    addTransaction,
    updateTransaction,
    removeTransaction,
  };
}
