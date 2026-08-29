import { computed } from "vue";
import { useFormatters } from "./useFormatters";
import { useCurrencyMapping } from "./useCurrencyMapping";

export interface MoneyAmount {
  amount: number;
  currency: string;
  usdValue?: number;
}

export interface FormattedMoney {
  original: MoneyAmount;
  display: string;
  short: string;
  full: string;
  symbol: string;
  code: string;
}

export function useMoneyFormatting() {
  const { formatCurrency, formatNumber } = useFormatters();
  const {
    getCurrencyInfo,
    formatCurrencyBalance,
    formatCurrencyWithCode,
    createCurrencyBalance,
  } = useCurrencyMapping();

  /**
   * Format money amount with currency symbol and code
   */
  const formatMoney = (
    amount: number,
    currency: string,
    options: {
      showSymbol?: boolean;
      showCode?: boolean;
      precision?: number;
      locale?: string;
    } = {}
  ): string => {
    const {
      showSymbol = true,
      showCode = true,
      precision,
      locale = "en-US",
    } = options;

    const currencyInfo = getCurrencyInfo(currency);
    const finalPrecision = precision ?? currencyInfo?.precision ?? 2;

    if (showSymbol && showCode) {
      return formatCurrencyWithCode(amount, currency);
    }

    if (showSymbol) {
      const symbol = currencyInfo?.symbol || currency;
      return `${symbol}${amount.toFixed(finalPrecision)}`;
    }

    if (showCode) {
      return `${amount.toFixed(finalPrecision)} ${currency}`;
    }

    return amount.toFixed(finalPrecision);
  };

  /**
   * Format money with USD equivalent
   */
  const formatMoneyWithUsd = (
    amount: number,
    currency: string,
    usdValue: number
  ): string => {
    return formatCurrencyBalance(amount, currency, usdValue);
  };

  /**
   * Format money for display in balance blocks
   */
  const formatBalanceDisplay = (
    amount: number,
    currency: string,
    usdValue: number
  ): FormattedMoney => {
    const currencyInfo = getCurrencyInfo(currency);
    const precision = currencyInfo?.precision ?? 2;

    const display = formatMoneyWithUsd(amount, currency, usdValue);
    const short = formatMoney(amount, currency, { showCode: false });
    const full = formatMoney(amount, currency, { showCode: true });
    const symbol = currencyInfo?.symbol || currency;
    const code = currency;

    return {
      original: { amount, currency, usdValue },
      display,
      short,
      full,
      symbol,
      code,
    };
  };

  /**
   * Format total balance
   */
  const formatTotalBalance = (
    totalUsdValue: number,
    primaryCurrency: string = "USD"
  ): string => {
    return formatMoney(totalUsdValue, primaryCurrency, {
      showSymbol: true,
      showCode: true,
    });
  };

  /**
   * Format percentage change
   */
  const formatPercentageChange = (
    current: number,
    previous: number,
    options: {
      showSign?: boolean;
      precision?: number;
    } = {}
  ): string => {
    const { showSign = true, precision = 2 } = options;

    if (previous === 0) return "0.00%";

    const change = ((current - previous) / previous) * 100;
    const sign = showSign && change > 0 ? "+" : "";

    return `${sign}${change.toFixed(precision)}%`;
  };

  /**
   * Format large numbers with K, M, B suffixes
   */
  const formatLargeNumber = (
    value: number,
    options: {
      precision?: number;
      locale?: string;
    } = {}
  ): string => {
    const { precision = 1, locale = "en-US" } = options;

    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(precision)}B`;
    }

    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(precision)}M`;
    }

    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(precision)}K`;
    }

    return value.toFixed(precision);
  };

  /**
   * Parse money string to amount and currency
   */
  const parseMoneyString = (moneyString: string): MoneyAmount | null => {
    // Match patterns like "$100", "100 USD", "€50.25", "0.001 BTC"
    const patterns = [
      /^(\$|€|£|¥)([\d,]+\.?\d*)$/, // Symbol first
      /^([\d,]+\.?\d*)\s+([A-Z]{3,4})$/, // Amount then currency code
      /^([\d,]+\.?\d*)\s*([₿|Ξ|Ł])$/, // Amount then crypto symbol
    ];

    for (const pattern of patterns) {
      const match = moneyString.match(pattern);
      if (match) {
        const amount = parseFloat(
          match[1]?.replace(/,/g, "") || match[2]?.replace(/,/g, "") || "0"
        );
        const currency = match[2] || match[1] || "";

        // Map symbols to currency codes
        const symbolMap: Record<string, string> = {
          $: "USD",
          "€": "EUR",
          "£": "GBP",
          "¥": "JPY",
          "₿": "BTC",
          Ξ: "ETH",
          Ł: "LTC",
        };

        const currencyCode = symbolMap[currency] || currency;

        return { amount, currency: currencyCode };
      }
    }

    return null;
  };

  /**
   * Calculate total value of multiple currencies in USD
   */
  const calculateTotalValue = (balances: MoneyAmount[]): number => {
    return balances.reduce((total, balance) => {
      return total + (balance.usdValue || 0);
    }, 0);
  };

  return {
    formatMoney,
    formatMoneyWithUsd,
    formatBalanceDisplay,
    formatTotalBalance,
    formatPercentageChange,
    formatLargeNumber,
    parseMoneyString,
    calculateTotalValue,
    createCurrencyBalance,
  };
}
