import { useAssets } from "./useAssets";

export interface SidebarMenuItem {
  id: string;
  path: string;
  label: string;
  icon: string;
  hasDropdown: boolean;
  order: number;
  isVisible: boolean;
  badge?: {
    text: string;
    color: string;
    variant: "primary" | "secondary" | "success" | "warning" | "error";
  };
  children?: SidebarMenuItem[];
}

export interface SidebarConfig {
  items: SidebarMenuItem[];
  showBalance: boolean;
  showAdvertisement: boolean;
  logoText: string;
  logoPath: string;
}

export function useSidebarMenu() {
  const { t } = useI18n();
  const localePath = useLocalePath();
  const { icons } = useAssets();

  const menuItems: SidebarMenuItem[] = [
    {
      id: "barcodes",
      path: "/barcodes",
      label: t("sidebar.barcodes"),
      icon: icons.barcodes,
      hasDropdown: false,
      order: 1,
      isVisible: true,
    },
    {
      id: "mrz",
      path: "/mrz",
      label: t("sidebar.mrz"),
      icon: icons.mrz,
      hasDropdown: false,
      order: 2,
      isVisible: true,
    },
    {
      id: "other-tools",
      path: "/other-tools",
      label: t("sidebar.other_tools"),
      icon: icons.otherTools,
      hasDropdown: true,
      order: 3,
      isVisible: true,
      children: [
        {
          id: "qr-generator",
          path: "/qr-generator",
          label: t("sidebar.qr_generator"),
          icon: icons.qr,
          hasDropdown: false,
          order: 1,
          isVisible: true,
        },
        {
          id: "field-generator",
          path: "/field-generator",
          label: t("sidebar.field_generator"),
          icon: icons.fieldGen,
          hasDropdown: false,
          order: 2,
          isVisible: true,
        },
        {
          id: "verification-test",
          path: "/verification-test",
          label: t("sidebar.verification_test"),
          icon: icons.barcodes,
          hasDropdown: false,
          order: 3,
          isVisible: true,
        },
        {
          id: "lookup",
          path: "/lookup",
          label: t("sidebar.lookup"),
          icon: icons.barcodes,
          hasDropdown: false,
          order: 4,
          isVisible: true,
        },
        {
          id: "photo-generator",
          path: "/photo-generator",
          label: t("sidebar.photo_generator"),
          icon: icons.barcodes,
          hasDropdown: false,
          order: 5,
          isVisible: true,
        },
        {
          id: "exif-removal",
          path: "/exif-removal",
          label: t("sidebar.exif_removal"),
          icon: icons.barcodes,
          hasDropdown: false,
          order: 6,
          isVisible: true,
        },
      ],
    },
    {
      id: "wallet",
      path: "/wallet",
      label: t("sidebar.wallet"),
      icon: icons.wallet,
      hasDropdown: false,
      order: 4,
      isVisible: true,
    },
    {
      id: "bulk-generation",
      path: "/bulk-generation",
      label: t("sidebar.bulk_generation"),
      icon: icons.bulk,
      hasDropdown: false,
      order: 5,
      isVisible: true,
    },
    {
      id: "store-orders",
      path: "/store-orders",
      label: t("sidebar.store_orders"),
      icon: icons.storeOrders,
      hasDropdown: false,
      order: 6,
      isVisible: true,
    },

    {
      id: "notifications",
      path: "/notifications",
      label: t("sidebar.notifications"),
      icon: icons.notification,
      hasDropdown: false,
      order: 7,
      isVisible: true,
    },
    {
      id: "referral",
      path: "/referral",
      label: t("sidebar.referral"),
      icon: icons.referral,
      hasDropdown: false,
      order: 8,
      isVisible: true,
    },
    {
      id: "help",
      path: "/help",
      label: t("sidebar.help"),
      icon: icons.help,
      hasDropdown: false,
      order: 9,
      isVisible: true,
    },
    {
      id: "settings",
      path: "/settings",
      label: t("sidebar.settings"),
      icon: icons.settings,
      hasDropdown: false,
      order: 10,
      isVisible: true,
    },
  ];

  const sidebarConfig: SidebarConfig = {
    items: menuItems,
    showBalance: true,
    showAdvertisement: true,
    logoText: "LOGO",
    logoPath: "/",
  };

  const getVisibleItems = (): SidebarMenuItem[] => {
    return menuItems
      .filter(item => item.isVisible)
      .sort((a, b) => a.order - b.order);
  };

  const getItemById = (id: string): SidebarMenuItem | undefined => {
    return menuItems.find(item => item.id === id);
  };

  const getItemByPath = (path: string): SidebarMenuItem | undefined => {
    return menuItems.find(item => item.path === path);
  };

  const getItemsWithDropdown = (): SidebarMenuItem[] => {
    return menuItems.filter(item => item.hasDropdown && item.isVisible);
  };

  const getItemsWithoutDropdown = (): SidebarMenuItem[] => {
    return menuItems.filter(item => !item.hasDropdown && item.isVisible);
  };

  const updateItemVisibility = (id: string, isVisible: boolean): void => {
    const item = getItemById(id);
    if (item) {
      item.isVisible = isVisible;
    }
  };

  const addItem = (item: Omit<SidebarMenuItem, "id">): string => {
    const id = item.path.replace("/", "").replace(/-/g, "_");
    const newItem: SidebarMenuItem = {
      id,
      ...item,
    };
    menuItems.push(newItem);
    return id;
  };

  const removeItem = (id: string): boolean => {
    const index = menuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      menuItems.splice(index, 1);
      return true;
    }
    return false;
  };

  const updateItem = (
    id: string,
    updates: Partial<SidebarMenuItem>
  ): boolean => {
    const item = getItemById(id);
    if (item) {
      Object.assign(item, updates);
      return true;
    }
    return false;
  };

  const getLocalizedPath = (path: string): string => {
    return localePath(path);
  };

  return {
    menuItems: readonly(menuItems),
    sidebarConfig: readonly(sidebarConfig),
    getVisibleItems,
    getItemById,
    getItemByPath,
    getItemsWithDropdown,
    getItemsWithoutDropdown,
    updateItemVisibility,
    addItem,
    removeItem,
    updateItem,
    getLocalizedPath,
  };
}
