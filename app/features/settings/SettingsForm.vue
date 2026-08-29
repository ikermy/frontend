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
          @input="(value: string) => handleFieldChange('fullName', value)"
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
          @input="(value: string) => handleFieldChange('email', value)"
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
          @input="(value: string) => handleFieldChange('telegramLink', value)"
          @blur="handleFieldBlur('telegramLink')"
        />
      </div>
      <span v-if="getFieldError('telegramLink')" class="text-red-500 text-xs">
        {{ getFieldError("telegramLink") }}
      </span>
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
        color="secondary"
        text-color="negative"
        class="h-11 bg-[#2B2B2B] rounded-[12px]"
        @click="handleLogout"
      >
        {{ $t("settings.logout") }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "~/shared/ui/Input.vue";
import Button from "~/shared/ui/Button.vue";
import ChangePasswordModal from "./ChangePasswordModal/index.vue";
import ForgotPasswordModal from "./ForgotPasswordModal/index.vue";
import ConfirmPasswordModal from "./ConfirmPasswordModal/index.vue";
import { useFormState } from "~/shared/composables/useFormState";
import { useFormValidation } from "~/shared/composables/useFormValidation";
import { useFormSubmit } from "~/shared/composables/useFormSubmit";
import { useFileUpload } from "~/shared/composables/useFileUpload";
import { useAssets } from "~/shared/composables/useAssets";

const { t } = useI18n();
const { icons } = useAssets();

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
  ],
  email: [
    { required: true, message: t("validation.email_required") },
    { email: true, message: t("validation.email_invalid") },
  ],
  password: [
    { required: true, message: t("validation.password_required") },
    { minLength: 8, message: t("validation.password_min_length") },
  ],
  telegramLink: [{ url: true, message: t("validation.telegram_link_invalid") }],
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
  // Mock API call - replace with actual API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate for demo
        resolve({ success: true, data: formData });
      } else {
        reject(new Error("Failed to update settings"));
      }
    }, 1000);
  });
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
  onSuccess: data => {
    console.log("Settings updated successfully:", data);
  },
  onError: error => {
    console.error("Settings update failed:", error);
  },
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
const handleLogout = () => {
  // Implement logout logic
  console.log("Logout clicked");
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
