<template>
  <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2 rounded-[12px] hover:cursor-pointer transition-colors">
    <!-- Left Side -->
    <div class="flex items-start gap-3 flex-1 min-w-0 w-full md:w-auto">
      <!-- Icon -->
      <div class="w-12 h-12 bg-[var(--ui-green-primary)] rounded-[12px] flex items-center justify-center flex-shrink-0">
        <UIcon
          name="i-heroicons-bolt"
          class="w-6 h-6 text-[var(--color-text-black)]"
        />
      </div>

      <!-- Info -->
      <div class="flex flex-col gap-0 flex-1 min-w-0">
        <p class="text-white font-medium text-sm">{{ batchName }}</p>
        <div class="flex items-center gap-2 flex-wrap mb-2">
          <p class="text-[var(--color-text-secondary)] text-sm">{{ type }}</p>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="h-7 w-17 flex items-center justify-center rounded-[8px] border border-[var(--ui-bg-tertiary)] px-2">
            <p class="text-primary text-xs font-semibold">{{ status }}</p>
          </div>
          <p class="text-white text-xs font-semibold whitespace-nowrap">{{ time }}</p>
        </div>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex flex-col items-end md:items-center gap-3 flex-shrink-0 w-full md:w-auto">
      <!-- Price -->
      <div class="flex justify-end items-end w-full md:w-full">
        <p class="text-white font-medium text-sm whitespace-nowrap">${{ price.toLocaleString() }} {{ currency || "USD" }}</p>
      </div>

      <!-- Download Buttons -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
        <button
          @click.stop="$emit('download-full')"
          class="px-3 py-1.5 bg-primary rounded-[8px] text-[var(--color-text-black)] text-xs font-semibold hover:opacity-85 transition-opacity whitespace-nowrap w-full md:w-auto"
        >
          Full Download
        </button>
        <button
          @click.stop="$emit('download-pdf417')"
          class="px-3 py-1.5 bg-bg-tertiary hover:bg-[var(--ui-bg-tertiary)] rounded-[8px] text-primary text-xs font-semibold hover:opacity-85 transition-opacity whitespace-nowrap w-full md:w-auto"
        >
          PDF417
        </button>
        <button
          @click.stop="$emit('download-128-codes')"
          class="px-3 py-1.5 bg-bg-tertiary rounded-[8px] text-primary text-xs font-semibold hover:opacity-85 transition-opacity whitespace-nowrap w-full md:w-auto"
        >
          128 Codes
        </button>
      </div>
    </div>
  </div>
  <div class="h-px w-full bg-[var(--ui-bg-tertiary)]"></div>
</template>

<script setup lang="ts">
interface Props {
  batchName: string;
  type: string;
  status: string;
  time: string;
  price: number;
  currency?: string;
}

defineProps<Props>();

defineEmits<{
  (e: "download-full"): void;
  (e: "download-pdf417"): void;
  (e: "download-128-codes"): void;
}>();
</script>

