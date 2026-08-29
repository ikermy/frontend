import { useAssets } from "./useAssets";

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  precision: number;
  isCrypto: boolean;
}

export interface CurrencyBalance {
  currency: string;
  amount: number;
  usdValue: number;
  formattedValue: string;
  formattedUsdValue: string;
  info: CurrencyInfo;
}

export function useCurrencyMapping() {
  const { getCurrencyIcon: getCurrencyIconPath, icons } = useAssets();

  const currencyMap: Record<string, CurrencyInfo> = {
    BTC: {
      code: "BTC",
      name: "Bitcoin",
      symbol: "₿",
      icon: getCurrencyIconPath("BTC"),
      color: "#F7931A",
      precision: 8,
      isCrypto: true,
    },
    ETH: {
      code: "ETH",
      name: "Ethereum",
      symbol: "Ξ",
      icon: getCurrencyIconPath("ETH"),
      color: "#627EEA",
      precision: 6,
      isCrypto: true,
    },
    USDT: {
      code: "USDT",
      name: "Tether",
      symbol: "$",
      icon: getCurrencyIconPath("USDT"),
      color: "#26A17B",
      precision: 2,
      isCrypto: true,
    },
    LTC: {
      code: "LTC",
      name: "Litecoin",
      symbol: "Ł",
      icon: getCurrencyIconPath("LTC"),
      color: "#BFBBBB",
      precision: 6,
      isCrypto: true,
    },
    USD: {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      icon: icons.wallet,
      color: "#10B981",
      precision: 2,
      isCrypto: false,
    },
    EUR: {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      icon: icons.wallet,
      color: "#3B82F6",
      precision: 2,
      isCrypto: false,
    },
  };

  const getCurrencyInfo = (code: string): CurrencyInfo | null => {
    return currencyMap[code.toUpperCase()] || null;
  };

  const getAllCurrencies = (): CurrencyInfo[] => {
    return Object.values(currencyMap);
  };

  const getCryptoCurrencies = (): CurrencyInfo[] => {
    return Object.values(currencyMap).filter(currency => currency.isCrypto);
  };

  const getFiatCurrencies = (): CurrencyInfo[] => {
    return Object.values(currencyMap).filter(currency => !currency.isCrypto);
  };

  const formatCurrencyAmount = (
    amount: number,
    currencyCode: string,
    showSymbol: boolean = true
  ): string => {
    const currency = getCurrencyInfo(currencyCode);
    if (!currency) return amount.toString();

    const formattedAmount = amount.toFixed(currency.precision);
    return showSymbol
      ? `${currency.symbol}${formattedAmount}`
      : formattedAmount;
  };

  const formatCurrencyWithCode = (
    amount: number,
    currencyCode: string
  ): string => {
    const currency = getCurrencyInfo(currencyCode);
    if (!currency) return `${amount} ${currencyCode}`;

    const formattedAmount = amount.toFixed(currency.precision);
    return `${formattedAmount} ${currencyCode}`;
  };

  const formatCurrencyBalance = (
    amount: number,
    currencyCode: string,
    usdValue: number
  ): string => {
    const currency = getCurrencyInfo(currencyCode);
    if (!currency) return `${amount} ${currencyCode}`;

    const formattedAmount = amount.toFixed(currency.precision);
    const formattedUsdValue = usdValue.toFixed(2);

    return `${formattedAmount} ${currencyCode} ≈ $${formattedUsdValue}`;
  };

  const createCurrencyBalance = (
    currencyCode: string,
    amount: number,
    usdValue: number
  ): CurrencyBalance | null => {
    const currency = getCurrencyInfo(currencyCode);
    if (!currency) return null;

    return {
      currency: currencyCode,
      amount,
      usdValue,
      formattedValue: formatCurrencyWithCode(amount, currencyCode),
      formattedUsdValue: `$${usdValue.toFixed(2)}`,
      info: currency,
    };
  };

  const getCurrencyColor = (currencyCode: string): string => {
    const currency = getCurrencyInfo(currencyCode);
    return currency?.color || "#6B7280";
  };

  const getCurrencyIcon = (currencyCode: string): string => {
    const currency = getCurrencyInfo(currencyCode);
    return currency?.icon || icons.wallet;
  };

  const getCurrencyName = (currencyCode: string): string => {
    const currency = getCurrencyInfo(currencyCode);
    return currency?.name || currencyCode;
  };

  return {
    currencyMap,
    getCurrencyInfo,
    getAllCurrencies,
    getCryptoCurrencies,
    getFiatCurrencies,
    formatCurrencyAmount,
    formatCurrencyWithCode,
    formatCurrencyBalance,
    createCurrencyBalance,
    getCurrencyColor,
    getCurrencyIcon,
    getCurrencyName,
  };
}
