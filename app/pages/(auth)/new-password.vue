<template>
  <div class="items-center justify-center flex flex-col h-full px-4">
    <h1 class="text-3xl font-medium font-hector tracking-wide">
      {{ $t("new_password.title") }}
    </h1>

    <NewPasswordForm class="mt-10" />
  </div>
</template>

<script setup lang="ts">
import NewPasswordForm from "~/features/auth/new-password/NewPasswordForm.vue";

// Устанавливаем мета-теги для страницы
useHead({
  title: "Новый пароль - Barcode AI",
  meta: [
    {
      name: "description",
      content: "Установите новый пароль в системе Barcode AI",
    },
  ],
});
</script>
