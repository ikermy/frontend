<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="font-hector text-3xl font-semibold">
          {{ $t("photo-generator.title") }}
        </h1>
        <Button color="white" text-color="dark" class="px-6 py-2 text-sm font-semibold" :on-click="handleCreateNew">
          {{ $t("photo-generator.create_new") }}
        </Button>
      </div>

      <!-- Tabs and Sort -->
      <div class="flex justify-between items-center gap-4 mt-9">
        <PhotoGeneratorTabs :tabs="tabs" :active-tab="activeTab" @update:active-tab="activeTab = $event"
          class="flex-shrink-0" />
        <Select :options="[t('photo-generator.sort_by')]" class="max-w-[270px] w-full flex-shrink-0" />
      </div>

      <!-- Items Groups -->
      <div class="mt-9">
        <PhotoGeneratorDateGroup v-for="(group, date) in groupedItems" :key="date" :date="date" :items="group" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Select from "~/shared/ui/Select.vue";
import Button from "~/shared/ui/Button.vue";
import PhotoGeneratorTabs from "~/features/photo-generator/PhotoGeneratorTabs.vue";
import PhotoGeneratorDateGroup from "~/features/photo-generator/PhotoGeneratorDateGroup.vue";
import { useAssets } from "~/shared/composables/useAssets";
import { getPhotoGeneratorService } from "~/shared/api";
import { usePhotoGeneratorStore } from "~/shared/store";

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const { icons } = useAssets();
const photoGeneratorService = getPhotoGeneratorService();
const photoGeneratorStore = usePhotoGeneratorStore();

const activeTab = ref("all");

const handleCreateNew = () => {
  router.push(localePath("/photo-generator/create"));
};

const tabs = [
  {
    id: "all",
    label: t("photo-generator.tabs.all"),
  },
  {
    id: "photos",
    label: t("photo-generator.tabs.photos"),
  },
  {
    id: "signatures",
    label: t("photo-generator.tabs.signatures"),
  },
];

// Map item types to icons
const getItemIcon = (type: string) => {
  return type === "photo" ? icons.photo : icons.signature;
};

// Load photo generator items from API if not already loaded
onMounted(async () => {
  if (!photoGeneratorStore.hasItems) {
    try {
      await photoGeneratorService.getItems();
    } catch (error) {
      console.error("Failed to load photo generator items:", error);
    }
  }
});

// Get items from store with icons
const photoItems = computed(() => {
  return photoGeneratorStore.items.map(item => ({
    ...item,
    icon: item.icon || getItemIcon(item.type),
  }));
});


const filteredItems = computed(() => {
  let filtered = photoItems.value;

  // Filter by tab
  if (activeTab.value !== "all") {
    filtered = filtered.filter((item) => item.type === activeTab.value);
  }

  return filtered;
});

const groupedItems = computed(() => {
  const groups: Record<string, any[]> = {};

  filteredItems.value.forEach((item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      title: item.title,
      status: item.status,
      time: item.time,
      icon: item.icon,
      onClick: () => {
        console.log("Photo Generator item clicked:", item.id);
        // Navigate to details page
      },
    });
  });

  return groups;
});
</script>