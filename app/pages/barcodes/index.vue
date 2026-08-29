<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <div class="flex justify-between items-center w-full">
        <h1 class="font-hector text-3xl font-semibold">
          {{ $t("barcodes.title") }}
        </h1>
        <Button
          color="white"
          text-color="dark"
          class="max-w-[131px] w-full font-semibold text-lg"
        >
          {{ $t("barcodes.create_new") }}
        </Button>
      </div>
      <Select
        :options="[t('barcodes.sort_by')]"
        class="max-w-[270px] w-full mt-9"
      />
      <div class="flex flex-col gap-4 mt-9">
        <div v-for="(group, date) in groupedHistory" :key="date">
          <div class="font-medium text-lg">
            {{ formatDate(date) }}
          </div>
          <div class="flex flex-col gap-1 w-full mt-3">
            <HistoryCard
              v-for="barcode in group"
              :key="barcode.id"
              :barcode="barcode.barcode"
              :time="
                barcode.time.split('T')[1]?.split(':')[0] +
                ':' +
                barcode.time.split('T')[1]?.split(':')[1]
              "
            />
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import Select from "~/shared/ui/Select.vue";
import HistoryCard from "~/features/barcodes/HistoryCard.vue";

const barcodes = ref([
  {
    id: 1,
    barcode: "PDF417+128 Barcode #SMITH_MA",
    time: "2021-01-01T12:00:00Z",
  },
  {
    id: 2,
    barcode: "PDF417+128 Barcode #SMITH_MA",
    time: "2021-01-01T12:00:00Z",
  },
  {
    id: 3,
    barcode: "PDF417+128 Barcode #SMITH_MA",
    time: "2021-01-01T12:00:00Z",
  },
  {
    id: 4,
    barcode: "PDF417+128 Barcode #SMITH_MA",
    time: "2021-01-01T12:00:00Z",
  },
]);

const groupedHistory = computed(() => {
  const groups: Record<string, typeof barcodes.value> = {};

  barcodes.value.forEach(barcode => {
    const date = barcode.time.split("T")[0];
    if (date && !groups[date]) {
      groups[date] = [];
    }
    if (date && groups[date]) {
      groups[date].push(barcode);
    }
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
const { t } = useI18n();
</script>
