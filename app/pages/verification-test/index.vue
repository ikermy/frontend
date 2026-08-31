<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="font-hector text-3xl font-semibold text-white">
          {{ $t("verification-test.title") }}
        </h1>
        <Button color="white" text-color="dark" class="px-6 py-2 text-sm font-semibold" :on-click="handleCreateNew">
          {{ $t("verification-test.create_new") }}
        </Button>
      </div>

      <!-- Sort By -->
      <Select :options="[t('verification-test.sort_by')]" class="max-w-[270px] w-full mt-9" />

      <!-- Verification Items Groups -->
      <div class="mt-9">
        <PhotoGeneratorDateGroup v-for="(group, date) in groupedVerificationItems" :key="date" :date="date"
          :items="group" />
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
import { getVerificationTestService } from "~/shared/api";
import { useVerificationTestStore } from "~/shared/store";

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const { icons } = useAssets();
const verificationTestService = getVerificationTestService();
const verificationTestStore = useVerificationTestStore();

const handleCreateNew = () => {
  router.push(localePath("/verification-test/create"));
};

// Load verification test items from API if not already loaded
onMounted(async () => {
  if (!verificationTestStore.hasItems) {
    try {
      await verificationTestService.getItems();
    } catch (error) {
      console.error("Failed to load verification test items:", error);
    }
  }
});

// Get items from store with icons
const verificationItems = computed(() => {
  return verificationTestStore.items.map(item => ({
    ...item,
    icon: icons.userScan,
  }));
});

// Mock verification test items data (removed - now using API)

const groupedVerificationItems = computed(() => {
  const groups: Record<string, any[]> = {};

  verificationItems.value.forEach((item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      title: item.title,
      status: item.status,
      time: item.time,
      // icon: "/_nuxt/assets/svg/dark/barcodes.svg", // Using existing icon, can be replaced with verification-specific icon if available
      icon: icons.userScan, // Using existing icon, can be replaced with verification-specific icon if available
      onClick: () => {
        console.log("Verification Test item clicked:", item.id);
        // Navigate to details page
      },
    });
  });

  return groups;
});
</script>