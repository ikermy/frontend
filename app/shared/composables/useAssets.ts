/**
 * Assets Path Composable
 * Centralized asset path management
 *
 * In Nuxt 3, we use import.meta.glob to dynamically import assets
 * This ensures proper asset resolution in both dev and production
 */

// Dynamically import all assets - returns URLs
// Include both SVG and PNG files in dark folder (some images are there)
const darkIconsGlob = import.meta.glob("~/assets/svg/dark/*.{svg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});
const whiteIconsGlob = import.meta.glob("~/assets/svg/white/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
const imagesGlob = import.meta.glob("~/assets/images/*.{png,jpg,jpeg,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

// Helper to get asset from glob
const getAssetFromGlob = (
  glob: Record<string, unknown>,
  path: string
): string => {
  // import.meta.glob with 'query: ?url, import: default' returns keys like "~/assets/svg/dark/facebook.svg"
  // and values are URL strings
  const filename = path.split("/").pop() || "";

  // Find by exact filename match (most reliable)
  const found = Object.keys(glob).find(key => {
    const keyFilename = key.split("/").pop() || "";
    return keyFilename === filename || key.endsWith(`/${filename}`);
  });

  if (found && glob[found] && typeof glob[found] === "string") {
    return glob[found] as string;
  }

  // Fallback: try to find by partial path match
  const foundByPath = Object.keys(glob).find(
    key => key.includes(filename) || key.includes(path)
  );
  if (
    foundByPath &&
    glob[foundByPath] &&
    typeof glob[foundByPath] === "string"
  ) {
    return glob[foundByPath] as string;
  }

  return "";
};

export function useAssets() {
  /**
   * Get path to SVG icon in dark theme
   */
  const getDarkIcon = (iconName: string): string => {
    // Search by filename only, glob keys are full paths
    return getAssetFromGlob(darkIconsGlob, iconName) || "";
  };

  /**
   * Get path to SVG icon in white theme
   */
  const getWhiteIcon = (iconName: string): string => {
    return getAssetFromGlob(whiteIconsGlob, iconName) || "";
  };

  /**
   * Get path to image
   */
  const getImage = (imageName: string): string => {
    return getAssetFromGlob(imagesGlob, imageName) || "";
  };

  /**
   * Get path to SVG (general)
   */
  const getSvg = (svgName: string): string => {
    return (
      getAssetFromGlob(darkIconsGlob, `svg/${svgName}`) ||
      getAssetFromGlob(whiteIconsGlob, `svg/${svgName}`) ||
      ""
    );
  };

  /**
   * Currency icons mapping
   */
  const currencyIcons = {
    BTC: getDarkIcon("BTC-wallet.svg"),
    ETH: getDarkIcon("ETH-wallet.svg"),
    USDT: getDarkIcon("USDT-wallet.svg"),
    LTC: getDarkIcon("LTC-wallet.svg"),
    default: getDarkIcon("wallet.svg"),
  };

  /**
   * Get currency icon path
   */
  const getCurrencyIcon = (currency: string): string => {
    const upperCurrency = currency.toUpperCase();
    return (
      currencyIcons[upperCurrency as keyof typeof currencyIcons] ||
      currencyIcons.default
    );
  };

  /**
   * Common icons
   */
  const icons = {
    // Social
    facebook: getDarkIcon("facebook.svg"),
    instagram: getDarkIcon("inst.svg"),
    x: getDarkIcon("x.svg"),

    // UI
    close: getDarkIcon("close.svg"),
    chevronLeft: getDarkIcon("Chevron-Left.svg"),
    plus: getDarkIcon("plus.svg"),
    minus: getDarkIcon("Subtract.svg"),
    copy: getDarkIcon("copy.svg"),
    code: getDarkIcon("code.svg"),
    address: getDarkIcon("addy.svg"),

    // Features
    barcodes: getDarkIcon("barcodes.svg"),
    mrz: getDarkIcon("mrz.svg"),
    wallet: getDarkIcon("wallet.svg"),
    settings: getDarkIcon("settings.svg"),
    help: getDarkIcon("help.svg"),
    referral: getDarkIcon("referral.svg"),
    storeOrders: getDarkIcon("store-orders.svg"),
    notification: getDarkIcon("notification.svg"),
    bulk: getDarkIcon("bulk.svg"),
    photo: getDarkIcon("photo-svgrepo-com.svg"),
    signature: getDarkIcon("signature-svgrepo-com.svg"),
    userScan: getDarkIcon("user-scan-svgrepo-com.svg"),
    fieldGen: getDarkIcon("field_gen.svg"),
    qr: getDarkIcon("qr.svg"),

    // Wallet
    subscription: getDarkIcon("Subscription.svg"),
    package: getDarkIcon("Package.svg"),
    store: getDarkIcon("Store.svg"),
    success: getDarkIcon("Success.svg"),

    // Other
    account: getDarkIcon("account.svg"),
    telegram: getDarkIcon("Telegram.svg"),
    button: getDarkIcon("Button.svg"),
    group: getDarkIcon("Group.svg"),
    left: getDarkIcon("left.svg"),
    right: getDarkIcon("right.svg"),
    homeVideo: getDarkIcon("home-video.png"),
    barcodeMobile: getDarkIcon("barcode-mobile.svg"),
    barcodeTablet: getDarkIcon("barcode-tablet.svg"),
    barcodeAi: getDarkIcon("barcode_ai.svg"),
    aiDriven: getDarkIcon("ai_driven.svg"),
    verif: getDarkIcon("verif.svg"),
    barcode: getDarkIcon("Barcode.svg"),
    otherTools: getDarkIcon("other-tools.svg"),
    menuLineHorizontal: getDarkIcon("menu-line-horizontal.svg"),
    frame1321315575: getDarkIcon("Frame 1321315575.svg"),
  };

  /**
   * Images
   */
  const images = {
    store: getImage("store.png"),
    productsCard: getImage("products-card.png"),
    basketCard: getImage("basket-card.png"),
    veriScan: getImage("VeriScan.png"),
    checkpoint: getImage("checkpoint.png"),
    intellicheck: getImage("intellicheck.png"),
  };

  /**
   * Background images
   */
  const backgrounds = {
    error: getImage("bg-error.png"),
    errorTablet: getImage("bg-error-tablet.png"),
    errorMobile: getImage("bg-error-mobile.png"),
    wallet: getImage("bg-wallet.png"),
    walletTablet: getImage("tablet-bg-wallet.png"),
  };

  return {
    getDarkIcon,
    getWhiteIcon,
    getImage,
    getSvg,
    getCurrencyIcon,
    icons,
    backgrounds,
    images,
    currencyIcons,
  };
}
