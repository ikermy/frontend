<template>
  <NuxtLayout name="main">
    <div class="h-screen flex flex-col overflow-hidden">
      <h1 class="font-hector text-3xl font-semibold text-white flex-shrink-0">
        {{ $t("notifications.title") }}
      </h1>
      <div class="pt-2 flex-1 flex overflow-hidden w-full mx-auto">
        <!-- Left Column - Categories -->
        <div class="w-[314px] flex-shrink-0 pr-2 border-r border-gray-700 overflow-y-auto">
          <NotificationCategories class="mt-6" :categories="categories" :active-category-id="activeCategoryId"
            @update:active-category-id="activeCategoryId = $event" />
        </div>

        <!-- Right Column - Notifications Content -->
        <div class="flex-1 flex flex-col min-w-0 pl-6 overflow-y-auto">
          <!-- Tabs -->
          <NotificationTabs :tabs="tabs" :active-tab="activeTab" @update:active-tab="activeTab = $event"
            class="flex-shrink-0" />

          <!-- Notifications Groups -->
          <div class="mt-6">
            <NotificationDateGroup v-for="(group, date) in groupedNotifications" :key="date" :date="date"
              :notifications="group" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import NotificationTabs from "~/features/notifications/NotificationTabs.vue";
import NotificationDateGroup from "~/features/notifications/NotificationDateGroup.vue";
import NotificationCategories from "~/features/notifications/NotificationCategories.vue";
import { useAssets } from "~/shared/composables/useAssets";
import { getNotificationsService } from "~/shared/api";
import { useNotificationsStore } from "~/shared/store";

const { t } = useI18n();
const { icons } = useAssets();
const notificationsService = getNotificationsService();
const notificationsStore = useNotificationsStore();

const activeTab = ref("all");
const activeCategoryId = ref("barcode");

const tabs = [
  {
    id: "all",
    label: t("notifications.all"),
  },
  {
    id: "updates",
    label: t("notifications.updates"),
  },
  {
    id: "news",
    label: t("notifications.news"),
  },
];

// Categories
const categories = [
  {
    id: "barcode",
    label: t("sidebar.barcodes"),
    icon: icons.barcodes,
    email: "user@example.com",
    date: "03/22",
    rating: 5,
  },
  {
    id: "mrz",
    label: t("sidebar.mrz"),
    icon: icons.mrz,
    email: "user@example.com",
    date: "03/22",
    rating: 4,
  },
  {
    id: "verification-test",
    label: "Verification Test",
    icon: icons.barcodes,
    email: "user@example.com",
    date: "03/22",
    badgeCount: 4,
    rating: 5,
  },
  {
    id: "lookup",
    label: "Lookup",
    icon: icons.barcodes,
    email: "user@example.com",
    date: "03/22",
    badgeCount: 4,
    rating: 3,
  },
  {
    id: "photo-generator",
    label: "Photo Generator",
    icon: icons.barcodes,
    email: "user@example.com",
    date: "03/22",
    badgeCount: 4,
    rating: 4,
  },
  {
    id: "exif-removal",
    label: "EXIF Removal",
    icon: icons.barcodes,
    email: "user@example.com",
    date: "03/22",
    rating: 5,
  },
  {
    id: "support",
    label: t("sidebar.help"),
    icon: icons.help,
    email: "user@example.com",
    date: "03/22",
    rating: 4,
  },
  {
    id: "referral",
    label: t("sidebar.referral"),
    icon: icons.referral,
    email: "user@example.com",
    date: "03/22",
    rating: 5,
  },
  {
    id: "store",
    label: t("sidebar.store_orders"),
    icon: icons.storeOrders,
    email: "user@example.com",
    date: "03/22",
    rating: 3,
  },
];

// Map category IDs to icons
const getCategoryIcon = (categoryId: string) => {
  const iconMap: Record<string, string> = {
    barcode: icons.barcodes,
    mrz: icons.mrz,
    'verification-test': icons.barcodes,
    lookup: icons.barcodes,
    'photo-generator': icons.barcodes,
    support: icons.help,
    referral: icons.referral,
    store: icons.storeOrders,
  };
  return iconMap[categoryId] || icons.barcodes;
};

// Fetch notifications if not already loaded
onMounted(async () => {
  if (!notificationsStore.hasNotifications) {
    try {
      await notificationsService.getNotifications();
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }
});

// Get notifications from store with icons
const notifications = computed(() => {
  return notificationsStore.notifications.map(notif => ({
    ...notif,
    icon: getCategoryIcon(notif.categoryId),
  }));
});


const filteredNotifications = computed(() => {
  let filtered = notifications.value;

  // Filter by category
  filtered = filtered.filter(
    (n) => n.categoryId === activeCategoryId.value
  );

  // Filter by tab
  if (activeTab.value !== "all") {
    filtered = filtered.filter(
      (n) => n.type === activeTab.value
    );
  }

  return filtered;
});

const groupedNotifications = computed(() => {
  const groups: Record<string, any[]> = {};

  filteredNotifications.value.forEach((notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      title: notification.title,
      time: notification.time,
      icon: notification.icon,
      onClick: () => {
        console.log("Notification clicked:", notification.id);
      },
    });
  });

  return groups;
});
</script>