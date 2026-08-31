<template>
  <!-- Real-режим: встраиваем настоящий Telegram-виджет (без @ у data-telegram-login). -->
  <div v-if="isReal" ref="widgetContainer" class="mt-4 telegram-widget-container" />
  <!-- Mock-режим: эмулируем вход через Telegram локально. -->
  <Button
    v-else
    leading-icon="mingcute:telegram-fill"
    color="tertiary"
    size="md"
    text-color="primary"
    :loading="loading"
    :disabled="loading"
    class="mt-4"
    :on-click="handleMockClick"
  >
    {{ $t("registration.login_tg") }}
  </Button>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import { getAuthService } from "~/shared/api/services";
import { useAuthStore } from "~/shared/store/useAuth";

const emit = defineEmits<{ (e: "success"): void }>();

const localePath = useLocalePath();
const authStore = useAuthStore();
const loading = ref(false);
const errorMessage = ref("");

const config = useRuntimeConfig();
const apiMode = (config.public.apiMode as string) || "mock";
const isReal = apiMode !== "mock";

const widgetContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!isReal) return;

  const botUsername = config.public.telegramBotUsername as string;
  const authUrl = config.public.telegramAuthUrl as string;
  if (!botUsername || !authUrl) return;

  // Официальный виджет Telegram: создаёт кнопку и после входа
  // перенаправляет браузер на data-auth-url с GET-параметрами.
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.dataset.telegramLogin = botUsername.replace(/^@/, "");
  script.dataset.size = "large";
  script.dataset.authUrl = authUrl;
  script.dataset.requestAccess = "write";
  widgetContainer.value?.appendChild(script);
});

async function handleMockClick() {
  if (loading.value) return;
  loading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await getAuthService().telegramAuth();
    authStore.setToken(data.accessToken);
    await authStore.loadProfile();
    emit("success");
    await navigateTo(localePath("/"));
  } catch (error: any) {
    errorMessage.value = error?.message || "Telegram sign in failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.telegram-widget-container {
  min-height: 64px;
}
.telegram-widget-container :deep(.telegram-login-button) {
  width: 100%;
}
</style>
