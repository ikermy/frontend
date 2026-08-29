<template>
  <div class="flex flex-col gap-4 mt-8">
    <div class="flex justify-between items-center">
      <p class="font-medium text-3xl text-white">
        {{ title }}
      </p>

      <Select :options="['All', 'PDF417', '128 Codes', 'Complete Package']" class="max-w-[270px] w-full"
        placeholder="Sort by" />
    </div>

    <!-- History Container -->
    <div
      class="flex flex-col bg-transparent rounded-[16px] p-6 overflow-y-auto transition-colors border border-gray-700"
      style="min-height: 436px;" :class="{ 'items-center justify-center': !hasHistory }">
      <p v-if="!hasHistory" class="text-text-tertiary text-xl text-center">
        {{ emptyText }}
      </p>

      <!-- History Items Grouped by Date -->
      <div v-else class="flex flex-col gap-6 w-full">
        <div v-for="(items, date) in groupedHistory" :key="date" class="flex flex-col gap-3">
          <!-- Date Header -->
          <h3 class="font-medium text-lg text-white">
            {{ formatDate(date) }}
          </h3>

          <!-- Items for this date -->
          <div class="flex flex-col gap-2">
            <HistoryItem v-for="(item, index) in items" :key="item.id || index" :batch-name="item.batchName"
              :type="item.type" :status="item.status" :time="item.time" :price="item.price" :currency="item.currency"
              @download-full="handleDownloadFull(item)" @download-pdf417="handleDownloadPDF417(item)"
              @download-128-codes="handleDownload128Codes(item)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Select from "~/shared/ui/Select.vue";
import HistoryItem from "~/features/bulk-generation/HistoryItem.vue";

interface HistoryItemData {
  id: string;
  date: string;
  batchName: string;
  type: string;
  status: string;
  time: string;
  price: number;
  currency?: string;
}

interface Props {
  title?: string;
  emptyText?: string;
  historyItems?: HistoryItemData[];
  onItemRemove?: (id: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "History",
  emptyText: "No history",
  historyItems: () => [], // Empty by default - shows empty state
  onItemRemove: undefined,
});

const hasHistory = computed(() => {
  return props.historyItems && props.historyItems.length > 0;
});

const groupedHistory = computed(() => {
  if (!props.historyItems || props.historyItems.length === 0) {
    return {};
  }

  const groups: Record<string, HistoryItemData[]> = {};

  props.historyItems.forEach((item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  });

  // Sort dates in descending order
  return Object.fromEntries(
    Object.entries(groups).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    })
  );
});

const formatDate = (dateString: string | number) => {
  try {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString("en-US", { month: "long" });
    const year = dateObj.getFullYear();
    return `${day} ${month}, ${year}`;
  } catch {
    return String(dateString);
  }
};

const handleDownloadFull = (item: HistoryItemData) => {
  console.log("Download full package:", item);
};

const handleDownloadPDF417 = (item: HistoryItemData) => {
  console.log("Download PDF417:", item);
};

const handleDownload128Codes = (item: HistoryItemData) => {
  console.log("Download 128 Codes:", item);
};
</script>
