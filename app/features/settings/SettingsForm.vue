<template>
  <div class="flex flex-col gap-[24px]">
    <div class="flex">
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        @change="handleFileChange"
      />
      <div
        class="flex flex-col bg-bg-secondary px-4 py-3 rounded-[12px] cursor-pointer gap-[10px]"
        @click="fileInput?.click()"
      >
        <div class="flex items-center gap-[10px]">
          <img
            src="assets/svg/dark/download-minimalistic-svgrepo-com-2 1.svg"
            class="w-[24px] h-[24px]"
            alt="upload"
          />
          <h3 class="text-sm font-inter font-medium">
            {{ $t("settings.upload_account_photo") }}
          </h3>
        </div>
        <p class="text-xs font-inter font-medium text-text-secondary">
          {{ $t("settings.upload_account_photo_desc") }}
        </p>
        <!-- Превью загруженного/существующего фото -->
        <div v-if="avatarPreview" class="mt-2 flex justify-center">
          <img
            :src="avatarPreview"
            class="w-20 h-20 rounded-full object-cover"
            alt="Avatar"
          />
        </div>
        <!-- File upload status -->
        <div
          v-if="hasFiles"
          class="mt-2 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs"
        >
          <div class="flex items-center justify-between">
            <span
              >{{ files[0]?.name }} ({{
                formatFileSize(files[0]?.size || 0)
              }})</span
            >
            <button
              @click.stop="removeFile(files[0]?.id || '')"
              class="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
        <div v-if="isUploading" class="mt-2 text-xs text-blue-500">
          {{ $t("settings.uploading") }}...
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <!-- Full Name Input -->
      <div class="flex flex-col gap-1">
        <Input
          :value="getFieldValue('fullName')"
          :placeholder="$t('settings.full_name')"
          :error="getFieldError('fullName')"
          :disabled="isTelegramAccount"
          @input="(e: any) => handleFieldChange('fullName', e.target.value)"
          @blur="handleFieldBlur('fullName')"
        />
        <span v-if="getFieldError('fullName')" class="text-red-500 text-xs">
          {{ getFieldError("fullName") }}
        </span>
      </div>

      <!-- Email Input -->
      <div class="flex flex-col gap-1">
        <Input
          :value="getFieldValue('email')"
          :placeholder="$t('settings.email')"
          type="email"
          :error="getFieldError('email')"
          @input="(e: any) => handleFieldChange('email', e.target.value)"
          @blur="handleFieldBlur('email')"
        />
        <span v-if="getFieldError('email')" class="text-red-500 text-xs">
          {{ getFieldError("email") }}
        </span>
      </div>

      <!-- Password Input with Change Button -->
      <div
        class="flex items-center gap-3 bg-black border border-bg-tertiary rounded-[12px] h-11"
        :class="{ 'border-red-500': getFieldError('password') }"
      >
        <input
          type="password"
          :value="getFieldValue('password')"
          :placeholder="$t('settings.password_placeholder')"
          class="flex-1 bg-transparent text-text-tertiary outline-none p-3"
          :disabled="isTelegramAccount"
          @input="
            (e: Event) =>
              handleFieldChange(
                'password',
                (e.target as HTMLInputElement).value
              )
          "
          @blur="handleFieldBlur('password')"
        />
        <Button
          color="secondary"
          text-color="white"
          class="h-9 my-1 mr-1"
          :disabled="isTelegramAccount"
          @click="isChangePasswordModalOpen = true"
        >
          {{ $t("settings.change") }}
        </Button>
        <ClientOnly>
          <div>
            <ChangePasswordModal
              v-model:is-open="isChangePasswordModalOpen"
              :set-is-forgot-password-modal-open="
                () => {
                  isChangePasswordModalOpen = false;
                  isForgotPasswordModalOpen = true;
                }
              "
            />
            <ForgotPasswordModal
              v-model:is-open="isForgotPasswordModalOpen"
              :set-is-change-password-modal-open="
                () => {
                  isChangePasswordModalOpen = true;
                  isForgotPasswordModalOpen = false;
                }
              "
            />
            <ConfirmPasswordModal
              v-model:is-open="isConfirmPasswordModalOpen"
              :set-is-forgot-password-modal-open="
                () => {
                  isConfirmPasswordModalOpen = false;
                  isForgotPasswordModalOpen = true;
                }
              "
            />
          </div>
        </ClientOnly>
      </div>
      <div
        class="flex bg-bg-secondary rounded-[12px] h-11 items-center px-3 py-2"
        :class="{ 'border border-red-500': getFieldError('telegramLink') }"
      >
        <img
          :src="icons.telegram"
          :alt="$t('settings.telegram_alt')"
          class="w-[18px] h-[18px]"
        />
        <Input
          :value="getFieldValue('telegramLink')"
          type="text"
          class="bg-transparent text-text-tertiary outline-none"
          :placeholder="$t('settings.telegram_link')"
          disabled
          @input="(e: any) => handleFieldChange('telegramLink', e.target.value)"
          @blur="handleFieldBlur('telegramLink')"
        />
      </div>
      <span v-if="getFieldError('telegramLink')" class="text-red-500 text-xs">
        {{ getFieldError("telegramLink") }}
      </span>

      <!-- Привязка/смена Telegram через виджет.
           Telegram-аккаунт: обновляет identity (приоритет у данных виджета).
           Email-аккаунт: сохраняет только telegram username (ник), убирая дубль. -->
      <div class="mt-1">
        <TelegramAuthButton
          mode="change"
          :label="isTelegramAccount ? $t('settings.change_telegram') : $t('settings.connect_telegram')"
          @success="handleTelegramChanged"
        />
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="isSuccess"
      class="p-3 bg-green-100 border border-green-400 text-green-700 rounded"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="isError"
      class="p-3 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ getErrorMessage() }}
    </div>
    <div
      v-if="uploadError"
      class="p-3 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ uploadError }}
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-3 mt-6">
      <Button
        color="white"
        text-color="dark"
        class="h-11"
        :loading="isSubmitting"
        :on-click="handleSubmit"
      >
        {{ $t("settings.save_changes") }}
      </Button>
      <Button
        color="secondary"
        text-color="negative"
        class="h-11 bg-bg-tertiary rounded-[12px]"
        :on-click="handleLogout"
      >
        {{ $t("settings.logout") }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "~/shared/ui/Input.vue";
import Button from "~/shared/ui/Button.vue";
import TelegramAuthButton from "~/features/auth/TelegramAuthButton.vue";
import ChangePasswordModal from "./ChangePasswordModal/index.vue";
import ForgotPasswordModal from "./ForgotPasswordModal/index.vue";
import ConfirmPasswordModal from "./ConfirmPasswordModal/index.vue";
import { useFormState } from "~/shared/composables/useFormState";
import { useFormValidation } from "~/shared/composables/useFormValidation";
import { useFormSubmit } from "~/shared/composables/useFormSubmit";
import { useFileUpload } from "~/shared/composables/useFileUpload";
import { useAssets } from "~/shared/composables/useAssets";
import { getApiClient } from "~/shared/api/client";
import { apiConfig } from "~/shared/config/api.config";
import { getAuthService } from "~/shared/api/services";
import { useAuthStore } from "~/shared/store/useAuth";
import { onMounted } from "vue";

// Сжатие изображения в base64 data URL (чтобы не раздувать БД).
function resizeImageToDataUrl(
  file: File,
  maxSize = 300,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

const { t } = useI18n();
const { icons } = useAssets();
const localePath = useLocalePath();
const authStore = useAuthStore();

// Form state management
interface SettingsFormData {
  fullName: string;
  email: string;
  password: string;
  telegramLink: string;
  profilePhoto: File | null;
}

const initialValues: SettingsFormData = {
  fullName: "",
  email: "",
  password: "",
  telegramLink: "",
  profilePhoto: null,
};

const {
  values,
  errors,
  isDirty,
  isValid,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  getFieldValue,
  getFieldError,
  isFieldTouched,
  isFieldDirty,
  setValues,
  setErrors,
  reset,
  clearErrors,
} = useFormState<SettingsFormData>(initialValues);

// Form validation
const validationRules = {
  fullName: [
    { required: true, message: t("validation.full_name_required") },
    { minLength: 2, message: t("validation.full_name_min_length") },
    { maxLength: 50, message: t("validation.full_name_max_length") },
    {
      // Совпадает с серверной валидацией nickname (auth.changeNickname):
      // только буквы, цифры, пробелы, подчёркивания и дефисы.
      pattern: /^[a-zA-Z0-9\s_-]+$/,
      message: t("validation.nickname_invalid"),
    },
  ],
  email: [
    // Email опционален: telegram-аккаунты могут сохранить профиль без email.
    // Проверка формата срабатывает только если поле не пустое.
    { email: true, message: t("validation.email_invalid") },
  ],
  password: [],
  telegramLink: [
    {
      pattern: /^(?:@[a-zA-Z0-9_]{3,32}|https?:\/\/(?:t\.me|telegram\.me)\/[a-zA-Z0-9_]{3,32})$/,
      message: t("validation.telegram_link_invalid"),
    },
  ],
};

const { validationErrors, isFormValid, hasErrors, validateField, validateAll } =
  useFormValidation(values, validationRules);

// File upload management
const {
  files,
  isUploading,
  error: uploadError,
  hasFiles,
  uploadFile,
  removeFile,
  clearFiles,
  formatFileSize,
} = useFileUpload({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/*"],
  multiple: false,
  onUpload: (file: File) => {
    setFieldValue("profilePhoto", file);
  },
  onError: error => {
    console.error("File upload error:", error);
  },
});

// Form submission
const submitSettings = async (formData: SettingsFormData) => {
  const client = getApiClient();
  const authService = getAuthService();

  // Для аккаунта, созданного через Telegram, смена full name/пароля/telegram недоступна.
  const telegramAccount = authStore.isTelegramAccount;

  // Если выбран новый файл — отправляем его (base64 data URL) в BFF → Auth.
  // Существующее фото приходит как base64-строка и повторно не загружается.
  if (formData.profilePhoto instanceof File) {
    const photoBase64 = await resizeImageToDataUrl(formData.profilePhoto, 300, 0.8);
    await client.post(apiConfig.endpoints.settings.uploadAvatar, {
      photo: photoBase64,
    });
  }

  // Telegram-аккаунт: привязываем email (email-only, без смены пароля).
  // Валидация формата — на клиенте; занятость email проверяет Auth (ALREADY_EXISTS).
  if (telegramAccount) {
    const email = (formData.email || "").trim();
    if (email) {
      try {
        await authService.linkEmail(email);
      } catch (err: any) {
        const message: string = err?.message || "";
        // Извлекаем человекочитаемое сообщение об ошибке из BFF/grpc-обёртки.
        const friendly = /already in use/i.test(message)
          ? t("settings.email_already_in_use")
          : /already has a real email/i.test(message)
            ? t("settings.email_already_linked")
            : null;
        const e = new Error(friendly || t("settings.email_link_failed"));
        (e as any).code = err?.code || "EMAIL_LINK_ERROR";
        throw e;
      }
    }
  }

  if (!telegramAccount) {
    // Сохраняем Telegram username (без @) в BFF → Auth.
    const tg = (formData.telegramLink || "").trim().replace(/^@/, "").replace(/^https?:\/\/(t\.me|telegram\.me)\//, "");
    if (tg) {
      await authService.updateTelegramUsername(tg);
    }

    // Сохраняем отображаемое имя (nickname) в BFF → Auth.
    const fullName = (formData.fullName || "").trim();
    if (fullName) {
      await authService.updateNickname(fullName);
    }
  }

  return { success: true, data: formData };
};

const {
  isSubmitting,
  isSuccess,
  isError,
  error: submitError,
  successMessage,
  submit,
  setError,
  clearError,
  hasError,
  getErrorMessage,
} = useFormSubmit(submitSettings, {
  validateBeforeSubmit: true,
  resetAfterSubmit: false,
  showSuccessMessage: true,
  successMessage: t("settingsForm.update_success"),
  onSuccess: async data => {
    console.log("Settings updated successfully:", data);
    // Обновляем профиль в store, чтобы аватар/telegram сразу отобразились в шапке.
    await authStore.loadProfile();
    // Перезагружаем локальную форму (актуальное фото/telegram после сохранения).
    await loadProfile();
  },
  onError: error => {
    console.error("Settings update failed:", error);
  },
});

// Загрузка профиля пользователя при открытии настроек (email, имя, telegram, фото)
const loadProfile = async () => {
  try {
    const { data } = await getAuthService().getProfile();
    // Для аккаунта, созданного через Telegram, full name и telegram берутся из Telegram-данных.
    setFieldValue("fullName", data.nickname || data.username || "");
    setFieldValue("email", data.email || "");
    setFieldValue("telegramLink", data.telegramUsername ? `@${data.telegramUsername}` : "");
    if (data.photoBase64) {
      // Существующее фото — это base64-строка для отображения (не File).
      // Не кладём её в profilePhoto, чтобы не загружать повторно при сохранении.
      uploadedPhotoBase64.value = data.photoBase64;
    } else if (data.origin === "telegram" && data.telegramPhotoUrl) {
      // Аватар из Telegram подгружается автоматически (URL из TG).
      uploadedPhotoBase64.value = data.telegramPhotoUrl;
    }
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
};

// Хранит base64 загруженной/существующей фотографии для отображения
const uploadedPhotoBase64 = ref("");

// Аккаунт, созданный через Telegram — смена full name/пароля/telegram недоступна.
const isTelegramAccount = computed(() => authStore.isTelegramAccount);

// Превью аватара: свежезагруженный файл > существующее фото (base64) > фото из Telegram
const avatarPreview = computed(() => {
  if (files.value[0]?.preview) return files.value[0].preview;
  if (uploadedPhotoBase64.value) return uploadedPhotoBase64.value;
  return authStore.profile.telegramPhotoUrl || "";
});

onMounted(() => {
  loadProfile();
});

// Modal state management
const isChangePasswordModalOpen = ref(false);
const isForgotPasswordModalOpen = ref(false);
const isConfirmPasswordModalOpen = ref(false);

// File input ref
const fileInput = ref<HTMLInputElement | null>(null);

// Handle file change
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    try {
      const file = input.files[0];
      if (file) {
        await uploadFile(file);
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  }
};

// Handle form submission
const handleSubmit = async () => {
  try {
    await submit(values.value, validationErrors.value);
  } catch (error) {
    console.error("Form submission failed:", error);
  }
};

// Handle field blur for validation
const handleFieldBlur = (fieldName: keyof SettingsFormData) => {
  setFieldTouched(fieldName, true);

  // Only validate string fields, skip profilePhoto
  if (fieldName !== "profilePhoto") {
    const error = validateField(
      fieldName as keyof typeof validationRules,
      values.value[fieldName]
    );
    if (error) {
      setFieldError(fieldName, error);
    }
  }
};

// Handle field change
const handleFieldChange = (
  fieldName: keyof SettingsFormData,
  value: string
) => {
  setFieldValue(fieldName, value);
  clearError();
};

// Handle logout
const handleLogout = async () => {
  authStore.logout();
  await navigateTo(localePath("/"));
};

// Telegram identity успешно изменён через виджет — перезагружаем профиль и форму.
const handleTelegramChanged = async () => {
  await authStore.loadProfile();
  await loadProfile();
};

// Watch for validation errors and update form errors
watch(
  validationErrors,
  newErrors => {
    setErrors(newErrors);
  },
  { deep: true }
);
</script>
