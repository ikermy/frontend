<template>
  <div class="flex flex-col gap-2 mt-2">
    <span class="text-xs font-medium text-text-tertiary">
      {{ $t("settings.telegram_username_history_title") }}
    </span>

    <div v-if="isLoading" class="text-xs text-text-secondary">
      {{ $t("settings.saving") }}
    </div>
    <div v-else-if="error" class="text-xs text-red-500">
      {{ error }}
    </div>
    <div
      v-else-if="entries.length === 0"
      class="text-xs text-text-secondary"
    >
      {{ $t("settings.telegram_username_history_empty") }}
    </div>
    <ul v-else class="flex flex-col gap-1">
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="flex items-center justify-between gap-2 bg-bg-secondary rounded-[12px] px-3 py-2 text-xs"
      >
        <span class="text-text-tertiary truncate">
          <template v-if="entry.eventType === 'removed'">
            <span class="line-through">@{{ entry.previousTelegramUsername }}</span>
            <span class="ml-1">{{ eventLabel(entry.eventType) }}</span>
          </template>
          <template v-else-if="entry.eventType === 'changed'">
            @{{ entry.previousTelegramUsername }} → @{{ entry.telegramUsername }}
          </template>
          <template v-else>
            @{{ entry.telegramUsername }}
          </template>
        </span>
        <span class="text-text-tertiary opacity-70 shrink-0">
          {{ formatDate(entry.changedAt) }}
        </span>
      </li>
    </ul>

    <button
      v-if="entries.length < total"
      type="button"
      class="text-xs text-blue-500 self-start"
      :disabled="isLoadingMore"
      @click="loadMore"
    >
      {{ $t("settings.telegram_username_history_show_more") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { getAuthService } from "~/shared/api/services";
import type { TelegramUsernameHistoryEntry } from "~/shared/api/types";

const { t } = useI18n();

const entries = ref<TelegramUsernameHistoryEntry[]>([]);
const total = ref(0);
const page = ref(1);
const limit = 20;
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref("");

function eventLabel(eventType: string): string {
  const key = `settings.telegram_username_history_${eventType}`;
  const label = t(key);
  // vue-i18n возвращает ключ, если перевода нет — тогда отдаём сырой тип.
  return label === key ? eventType : label;
}

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

async function fetchPage(targetPage: number, append: boolean) {
  try {
    if (append) {
      isLoadingMore.value = true;
    } else {
      isLoading.value = true;
    }
    error.value = "";

    const { data } = await getAuthService().getTelegramUsernameHistory(
      targetPage,
      limit
    );

    entries.value = append
      ? [...entries.value, ...(data.entries || [])]
      : data.entries || [];
    total.value = data.total || 0;
    page.value = data.page || targetPage;
  } catch (err: any) {
    error.value = err?.message || t("settings.telegram_username_history_error");
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
}

async function loadMore() {
  await fetchPage(page.value + 1, true);
}

onMounted(() => {
  fetchPage(1, false);
});
</script>
