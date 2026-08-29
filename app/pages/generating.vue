<template>
  <div
    class="flex flex-col h-full items-center justify-center max-w-[440px] w-full mx-auto"
  >
    <h1 class="font-hector text-[32px] uppercase">
      {{ $t("generating.title") }}
    </h1>
    <div class="flex flex-col mt-[38px] gap-1 max-w-[440px] w-full">
      <Select
        :options="['1', '2', '3']"
        class="h-10"
        :placeholder="$t('generating.select_country')"
      />
      <Select
        :options="['1', '2', '3']"
        class="h-10"
        :placeholder="$t('generating.select_state')"
      />
      <Select
        :options="['1', '2', '3']"
        class="h-10"
        :placeholder="$t('generating.select_revision_date')"
      />
      <Select
        :options="['1', '2', '3']"
        class="h-10"
        :placeholder="$t('generating.select_generation_mode')"
      />
    </div>
    <Button class="mt-10 w-full" color="white" text-color="dark">
      {{ $t("continue") }}
    </Button>
    <NuxtLink :to="localePath('/tips')">
      <h3 class="text-text-alternative-secondary text-sm font-semibold mt-4">
        {{ $t("generating.tips") }}
      </h3>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import Select from "~/shared/ui/Select.vue";
import Button from "~/shared/ui/Button.vue";
const localePath = useLocalePath();
</script>
