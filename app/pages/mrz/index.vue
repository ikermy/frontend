<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="font-hector text-3xl font-semibold">
          {{ $t("mrz.title") }}
        </h1>
        <Button color="white" text-color="dark" class="px-6 py-2 text-sm font-semibold" :on-click="handleCreateNew">
          {{ $t("mrz.create_new") }}
        </Button>
      </div>

      <!-- Sort By -->
      <Select :options="[t('mrz.sort_by')]" class="max-w-[270px] w-full mt-9" />

      <!-- MRZ Items Groups -->
      <div class="mt-9">
        <MRZDateGroup v-for="(group, date) in groupedMRZItems" :key="date" :date="date" :items="group" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Select from "~/shared/ui/Select.vue";
import Button from "~/shared/ui/Button.vue";
import MRZDateGroup from "~/features/mrz/MRZDateGroup.vue";
import { useAssets } from "~/shared/composables/useAssets";
import { getMRZService } from "~/shared/api";
import { useMRZStore } from "~/shared/store";

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const { icons } = useAssets();
const mrzService = getMRZService();
const mrzStore = useMRZStore();

const handleCreateNew = () => {
  console.log("Create new MRZ");
  // Navigate to create MRZ page or open modal
};

// Load MRZ items from API if not already loaded
onMounted(async () => {
  if (!mrzStore.hasItems) {
    try {
      await mrzService.getItems();
    } catch (error) {
      console.error("Failed to load MRZ items:", error);
    }
  }
});

// Get items from store with icons
const mrzItems = computed(() => {
  return mrzStore.items.map(item => ({
    ...item,
    icon: item.icon || icons.mrz,
  }));
});


const groupedMRZItems = computed(() => {
  const groups: Record<string, any[]> = {};

  mrzItems.value.forEach((item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      identifier: item.identifier,
      time: item.time,
      icon: item.icon,
      onClick: () => {
        router.push(localePath('/mrz/details'));
      },
    });
  });

  return groups;
});
</script>
