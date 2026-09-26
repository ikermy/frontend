<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex justify-between items-center w-full">
      <h3 class="font-medium text-[24px]">
        {{ $t("settings.change_telegram_title") }}
      </h3>
      <img
        src="assets/svg/dark/Frame 1041.svg"
        alt="close"
        class="cursor-pointer"
        @click="emit('update:isOpen', false)"
      />
    </div>

    <p class="text-sm font-medium text-text-secondary">
      {{ $t("settings.change_telegram_warning") }}
    </p>

    <div class="flex flex-col gap-1 rounded-[12px] bg-bg-tertiary px-3 py-2">
      <span class="text-xs font-medium text-text-tertiary">
        {{ $t("settings.telegram_current_account") }}
      </span>
      <span class="text-sm font-medium text-text-primary">
        {{ authStore.telegramHandle || $t("settings.telegram_connected") }}
      </span>
    </div>

    <TelegramAuthButton
      mode="change"
      :label="$t('settings.change_telegram')"
      @success="handleSuccess"
    />

    <Button
      color="secondary"
      text-color="white"
      :on-click="() => emit('update:isOpen', false)"
    >
      {{ $t("settings.change_telegram_cancel") }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import TelegramAuthButton from "~/features/auth/TelegramAuthButton.vue";
import { useAuthStore } from "~/shared/store/useAuth";

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "success"): void;
}>();

const authStore = useAuthStore();

const handleSuccess = () => {
  emit("success");
  emit("update:isOpen", false);
};
</script>
