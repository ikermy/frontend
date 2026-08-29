<template>
  <div class="items-center justify-center flex flex-col h-full px-4">
    <h1 class="text-3xl font-medium font-hector tracking-wide">
      {{ $t("registration.title") }}
    </h1>
    <div
      class="flex flex-col gap-2 font-inter text-text-tertiary mt-2 justify-center"
    >
      <p class="font-normal mx-auto">
        {{ $t("registration.first_desc") }}
      </p>
      <div class="flex gap-2">
        <p class="dark:text-white font-medium">
          {{ $t("registration.second_desc") }}
        </p>
        <p class="dark:text-primary font-medium text-black">
          {{ $t("registration.pdf_project") }}
        </p>
      </div>
    </div>
    <Button
      leading-icon="mingcute:telegram-fill"
      class="mt-4"
      color="tertiary"
      size="md"
      text-color="primary"
    >
      {{ $t("registration.login_tg") }}
    </Button>

    <RegistrationForm class="mt-10" />
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import RegistrationForm from "~/features/auth/registration/RegistrationForm.vue";

// Устанавливаем мета-теги для страницы
useHead({
  title: "Регистрация - Barcode AI",
  meta: [
    {
      name: "description",
      content: "Создайте новый аккаунт в системе Barcode AI",
    },
  ],
});
</script>
