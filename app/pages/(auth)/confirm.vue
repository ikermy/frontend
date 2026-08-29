<template>
  <div class="items-center justify-center flex flex-col h-full px-4">
    <h1 class="text-3xl font-medium font-hector tracking-wide">
      {{ $t("confirm.title") }}
    </h1>
    <div class="flex gap-2 justify-center items-center max-w-xs">
      <p class="dark:text-text-tertiary font-medium text-center">
        {{ $t("confirm.desc") }}
        <span class="dark:text-white font-medium text-black">
          email@example.com
        </span>
      </p>
    </div>

    <ConfirmationForm class="mt-10" />
  </div>
</template>

<script setup lang="ts">
import ConfirmationForm from "~/features/auth/confirm/ConfirmationForm.vue";

// Устанавливаем мета-теги для страницы
useHead({
  title: "Подтверждение - Barcode AI",
  meta: [
    {
      name: "description",
      content: "Подтвердите ваш аккаунт в системе Barcode AI",
    },
  ],
});
</script>
