<template>
  <div class="flex flex-col gap-12 w-full">
    <div class="flex justify-between items-center w-full">
      <div class="flex gap-1 items-center">
        <h3 class="font-medium text-[24px]">
          {{ $t("settings.change_password.title") }}
        </h3>
      </div>
      <img
        src="assets/svg/dark/Frame 1041.svg"
        alt="close"
        class="cursor-pointer"
        @click="emit('update:isOpen', false)"
      />
    </div>
    <div class="flex flex-col gap-2">
      <input
        v-model="currentPassword"
        type="password"
        :placeholder="$t('settings.change_password.old_password')"
        class="bg-bg-tertiary rounded-[12px] h-11 font-semibold placeholder:font-semibold placeholder:text-text-tertiary p-3 border-none focus:outline-none focus:ring-0"
      />
      <input
        v-model="newPassword"
        type="password"
        :placeholder="$t('settings.change_password.new_password')"
        class="bg-bg-tertiary rounded-[12px] h-11 font-semibold placeholder:font-semibold placeholder:text-text-tertiary p-3 border-none focus:outline-none focus:ring-0"
      />
      <input
        v-model="confirmPassword"
        type="password"
        :placeholder="$t('settings.change_password.confirm_password')"
        class="bg-bg-tertiary rounded-[12px] h-11 font-semibold placeholder:font-semibold placeholder:text-text-tertiary p-3 border-none focus:outline-none focus:ring-0"
      />
      <p v-if="errorMessage" class="text-negative text-xs">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="text-green-500 text-xs text-center">
        {{ successMessage }}
      </p>
    </div>
    <div class="flex flex-col gap-2">
      <Button
        color="white"
        text-color="dark"
        class="h-11"
        :loading="loading"
        :on-click="handleSubmit"
      >
        {{ $t("settings.change_password.change") }}
      </Button>
      <p
        class="text-center mt-2 cursor-pointer font-semibold"
        @click="emit('setIsForgotPasswordModalOpen')"
      >
        {{ $t("settings.change_password.forgot_password") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import { getAuthService } from "~/shared/api/services";

const { t } = useI18n();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "setIsForgotPasswordModalOpen"): void;
}>();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = t("settings.change_password.error_required");
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = t("settings.change_password.error_mismatch");
    return;
  }

  loading.value = true;
  try {
    await getAuthService().changePassword(currentPassword.value, newPassword.value);
    successMessage.value = t("settings.change_password.success");
    setTimeout(() => emit("update:isOpen", false), 1200);
  } catch (err: any) {
    const message: string = err?.message || "";
    if (/invalid current password/i.test(message)) {
      errorMessage.value = t("settings.change_password.error_invalid_current");
    } else if (/new password must be different/i.test(message)) {
      errorMessage.value = t("settings.change_password.error_same");
    } else if (/password validation failed/i.test(message)) {
      errorMessage.value = t("settings.change_password.error_weak");
    } else {
      // Фактическое сообщение сервера (например, если Auth/BFF не пересобраны).
      errorMessage.value = message || t("settings.change_password.error");
    }
  } finally {
    loading.value = false;
  }
};
</script>
