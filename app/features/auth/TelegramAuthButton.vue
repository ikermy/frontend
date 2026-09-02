<template>
  <!-- Real-режим: встраиваем настоящий Telegram-виджет (без @ у data-telegram-login). -->
  <div v-if="isReal" ref="widgetContainer" class="mt-4 telegram-widget-container" />
  <!-- Mock-режим: эмулируем вход/смену Telegram локально. -->
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
    {{ label }}
  </Button>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import { getAuthService } from "~/shared/api/services";
import { useAuthStore } from "~/shared/store/useAuth";
import { mockTelegramAuth } from "~/shared/api/mocks";

// mode="login" — вход/регистрация; mode="change" — смена Telegram identity в настройках.
const props = withDefaults(
  defineProps<{
    mode?: "login" | "change";
    label?: string;
  }>(),
  { mode: "login" }
);

const emit = defineEmits<{ (e: "success"): void }>();

const localePath = useLocalePath();
const authStore = useAuthStore();
const loading = ref(false);
const errorMessage = ref("");

const { t } = useI18n();
const label = computed(() =>
  props.label || (props.mode === "change" ? t("settings.change_telegram") : t("registration.login_tg"))
);

const config = useRuntimeConfig();
const apiMode = (config.public.apiMode as string) || "mock";
const isReal = apiMode !== "mock";

const widgetContainer = ref<HTMLElement | null>(null);

// Реальный Telegram-виджет перенаправляет браузер на data-auth-url с GET-параметрами.
// Для mode="change" добавляем ?mode=change, чтобы callback понял, что это смена identity.
function buildAuthUrl(base: string): string {
  if (props.mode !== "change") return base;
  return base + (base.includes("?") ? "&" : "?") + "mode=change";
}

onMounted(() => {
  if (!isReal) return;

  const botUsername = config.public.telegramBotUsername as string;
  const authUrl = config.public.telegramAuthUrl as string;
  if (!botUsername || !authUrl) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.dataset.telegramLogin = botUsername.replace(/^@/, "");
  script.dataset.size = "large";
  script.dataset.authUrl = buildAuthUrl(authUrl);
  script.dataset.requestAccess = "write";
  widgetContainer.value?.appendChild(script);
});

async function handleMockClick() {
  if (loading.value) return;
  loading.value = true;
  errorMessage.value = "";

  try {
    if (props.mode === "change") {
      const data = await mockTelegramAuth();
      await getAuthService().changeTelegramAccount(data);
      await authStore.loadProfile();
      emit("success");
      await navigateTo(localePath("/settings"));
      return;
    }

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
