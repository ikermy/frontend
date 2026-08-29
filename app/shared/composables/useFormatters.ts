export function useFormatters() {
  /**
   * Format date string to readable format
   * @param dateString - ISO date string
   * @returns Formatted date string (e.g., "10 February, 2025")
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  };

  /**
   * Format time from ISO date string
   * @param dateString - ISO date string
   * @returns Formatted time string (e.g., "12:03")
   */
  const formatTime = (dateString: string): string => {
    const timePart = dateString.split("T")[1];
    if (!timePart) return "";

    const [hours, minutes] = timePart.split(":");
    return `${hours}:${minutes}`;
  };

  /**
   * Format currency amount
   * @param amount - Amount to format
   * @param currency - Currency code (USD, EUR, etc.)
   * @param locale - Locale for formatting
   * @returns Formatted currency string
   */
  const formatCurrency = (
    amount: number,
    currency: string = "USD",
    locale: string = "en-US"
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  };

  /**
   * Format number with thousand separators
   * @param value - Number to format
   * @param locale - Locale for formatting
   * @returns Formatted number string
   */
  const formatNumber = (value: number, locale: string = "en-US"): string => {
    return new Intl.NumberFormat(locale).format(value);
  };

  /**
   * Format relative time (e.g., "2 hours ago", "3 days ago")
   * @param dateString - ISO date string
   * @returns Relative time string
   */
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  };

  /**
   * Parse transaction value string to extract amount and currency
   * @param valueString - Value string like "$600 USD" or "x12"
   * @returns Object with amount, currency, and type
   */
  const parseTransactionValue = (valueString: string) => {
    // Check if it's a quantity (starts with 'x')
    if (valueString.startsWith("x")) {
      const quantity = parseInt(valueString.slice(1));
      return {
        type: "quantity" as const,
        amount: quantity,
        currency: null,
        original: valueString,
      };
    }

    // Check if it's a currency amount
    const currencyMatch = valueString.match(/\$([\d,]+)\s*([A-Z]{3})?/);
    if (currencyMatch) {
      const amount = parseFloat(currencyMatch[1]?.replace(/,/g, "") || "0");
      const currency = currencyMatch[2] || "USD";
      return {
        type: "currency" as const,
        amount,
        currency,
        original: valueString,
      };
    }

    // Check for combined values like "x1, $30 USD"
    const combinedMatch = valueString.match(
      /x(\d+),\s*\$([\d,]+)\s*([A-Z]{3})?/
    );
    if (combinedMatch) {
      const quantity = parseInt(combinedMatch[1] || "0");
      const amount = parseFloat(combinedMatch[2]?.replace(/,/g, "") || "0");
      const currency = combinedMatch[3] || "USD";
      return {
        type: "combined" as const,
        quantity,
        amount,
        currency,
        original: valueString,
      };
    }

    return {
      type: "unknown" as const,
      amount: 0,
      currency: null,
      original: valueString,
    };
  };

  return {
    formatDate,
    formatTime,
    formatCurrency,
    formatNumber,
    formatRelativeTime,
    parseTransactionValue,
  };
}
