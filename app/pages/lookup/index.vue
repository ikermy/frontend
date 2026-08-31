<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="font-hector text-3xl font-semibold">
          {{ $t("lookup.title") }}
        </h1>
        <Button color="white" text-color="dark" class="px-6 py-2 text-sm font-semibold" :on-click="handleCreateNew">
          {{ $t("lookup.create_new") }}
        </Button>
      </div>

      <!-- Sort By -->
      <Select :options="[t('lookup.sort_by')]" class="max-w-[270px] w-full mt-9" />

      <!-- Lookup Items Groups -->
      <div class="mt-9">
        <PhotoGeneratorDateGroup v-for="(group, date) in groupedLookupItems" :key="date" :date="date" :items="group" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import Select from "~/shared/ui/Select.vue";
import Button from "~/shared/ui/Button.vue";
import PhotoGeneratorDateGroup from "~/features/photo-generator/PhotoGeneratorDateGroup.vue";
import { useAssets } from "~/shared/composables/useAssets";
import { getLookupService } from "~/shared/api";
import { useLookupStore } from "~/shared/store";

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const { icons } = useAssets();
const lookupService = getLookupService();
const lookupStore = useLookupStore();

const handleCreateNew = () => {
  router.push(localePath("/lookup/create"));
};

// Load lookup items from API if not already loaded
onMounted(async () => {
  if (!lookupStore.hasItems) {
    try {
      await lookupService.getItems();
    } catch (error) {
      console.error("Failed to load lookup items:", error);
    }
  }
});

// Get items from store
const lookupItems = computed(() => lookupStore.items);

const groupedLookupItems = computed(() => {
  const groups: Record<string, any[]> = {};

  lookupItems.value.forEach((item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      title: item.title,
      status: item.status,
      time: item.time,
      icon: icons.group, // Using existing icon, can be replaced with lookup-specific icon if available
      onClick: () => {
        console.log("Lookup item clicked:", item.id);
        // Navigate to details page
      },
    });
  });

  return groups;
});
</script>