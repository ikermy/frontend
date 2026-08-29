<template>
  <div class="flex flex-col gap-4">
    <h3 class="font-medium text-lg text-white text-center">
      {{ title }}
    </h3>

    <div class="bg-transparent rounded-[16px] p-3 flex justify-center">
      <table class="border-collapse border border-gray-800 w-full md:w-[800px]">
        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="index"
          >
            <td class="text-white text-sm font-medium py-3 px-2 md:px-4 border-b border-r border-gray-800">
              {{ row.label }}
            </td>
            <td class="text-white text-sm font-medium py-3 px-2 md:px-4 border-b border-gray-800">
              {{ row.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// const { t } = useI18n();

interface TableRow {
  label: string;
  value: string;
}

interface Props {
  title?: string;
  rows?: TableRow[];
}

const props = withDefaults(defineProps<Props>(), {
  // title: t("mrz.details.title"),
  title: "Details of Barcode",
  rows: () => [],
});
</script>

