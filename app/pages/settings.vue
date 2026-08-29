<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto">
      <h1 class="font-hector text-3xl font-semibold">
        {{ $t("settings.title") }}
      </h1>
      <div class="flex justify-center items-center h-full">
        <SettingsForm />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import SettingsForm from "~/features/settings/SettingsForm.vue";
</script>
