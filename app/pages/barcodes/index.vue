<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <div class="flex justify-between items-center w-full">
        <h1 class="font-hector text-3xl font-semibold">
          {{ $t("barcodes.title") }}
        </h1>
        <NuxtLink :to="localePath('/generating')">
          <Button
            color="white"
            text-color="dark"
            class="max-w-[131px] w-full font-semibold text-lg"
          >
            {{ $t("barcodes.create_new") }}
          </Button>
        </NuxtLink>
      </div>

      <div
        v-if="!store.hasItems"
        class="flex items-center justify-center mt-24 text-text-tertiary"
      >
        {{ $t("barcodes.empty") }}
      </div>

      <div v-else class="flex flex-col gap-6 mt-9">
        <div v-for="(group, date) in groupedHistory" :key="date">
          <div class="font-medium text-lg">{{ formatDate(date) }}</div>
          <div class="flex flex-col gap-4 mt-3">
            <a
              v-for="item in group"
              :key="item.generationId || item.url"
              :href="item.url"
              target="_blank"
              rel="noopener"
              class="rounded-[12px] bg-bg-secondary p-3 flex flex-col gap-2 hover:opacity-90"
            >
              <img
                :src="item.url"
                :alt="item.format"
                class="w-full rounded-[8px] bg-bg-white"
              />
              <div class="flex justify-between text-sm text-text-tertiary">
                <span>{{ item.revision }}</span>
                <span>{{ formatTime(item.createdAt) }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

import Button from "~/shared/ui/Button.vue";
import { useBarcodeGenerationStore } from "~/shared/store";

const localePath = useLocalePath();
const store = useBarcodeGenerationStore();

const groupedHistory = computed(() => {
  const groups: Record<string, typeof store.items> = {};
  store.items.forEach(item => {
    const date = item.createdAt.split("T")[0];
    if (!date) return;
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
</script>
