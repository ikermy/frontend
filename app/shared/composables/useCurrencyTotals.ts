import { computed } from "vue";
import type { Transaction } from "./useTransactionHistory";
import { useFormatters } from "./useFormatters";

export interface CurrencyTotal {
  currency: string;
  total: number;
  count: number;
  transactions: Transaction[];
}

export interface TransactionSummary {
  totalTransactions: number;
  currencyTotals: CurrencyTotal[];
  totalValue: number;
  averageValue: number;
}

export function useCurrencyTotals(transactions: Transaction[]) {
  const { parseTransactionValue } = useFormatters();

  const currencyTotals = computed(() => {
    const totalsMap = new Map<
      string,
      {
        total: number;
        count: number;
        transactions: Transaction[];
      }
    >();

    transactions.forEach(transaction => {
      const parsed = parseTransactionValue(transaction.value);

      if (parsed.type === "currency" || parsed.type === "combined") {
        const currency = parsed.currency || "USD";
        const amount = parsed.amount || 0;

        if (!totalsMap.has(currency)) {
          totalsMap.set(currency, {
            total: 0,
            count: 0,
            transactions: [],
          });
        }

        const existing = totalsMap.get(currency)!;
        existing.total += amount;
        existing.count += 1;
        existing.transactions.push(transaction);
      }
    });

    return Array.from(totalsMap.entries()).map(([currency, data]) => ({
      currency,
      total: data.total,
      count: data.count,
      transactions: data.transactions,
    }));
  });

  const summary = computed((): TransactionSummary => {
    const totals = currencyTotals.value;
    const totalTransactions = transactions.length;
    const totalValue = totals.reduce((sum, total) => sum + total.total, 0);
    const averageValue =
      totalTransactions > 0 ? totalValue / totalTransactions : 0;

    return {
      totalTransactions,
      currencyTotals: totals,
      totalValue,
      averageValue,
    };
  });

  const getTotalByCurrency = (currency: string): number => {
    const total = currencyTotals.value.find(t => t.currency === currency);
    return total?.total || 0;
  };

  const getTransactionsByCurrency = (currency: string): Transaction[] => {
    const total = currencyTotals.value.find(t => t.currency === currency);
    return total?.transactions || [];
  };

  const getTopCurrency = (): CurrencyTotal | null => {
    if (currencyTotals.value.length === 0) return null;

    return currencyTotals.value.reduce((top, current) =>
      current.total > top.total ? current : top
    );
  };

  const getCurrencyStats = () => {
    const totals = currencyTotals.value;
    const totalValue = totals.reduce((sum, total) => sum + total.total, 0);

    return totals.map(total => ({
      ...total,
      percentage: totalValue > 0 ? (total.total / totalValue) * 100 : 0,
    }));
  };

  return {
    currencyTotals,
    summary,
    getTotalByCurrency,
    getTransactionsByCurrency,
    getTopCurrency,
    getCurrencyStats,
  };
}
