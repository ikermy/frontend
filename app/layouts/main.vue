<template>
  <div class="pt-7 px-9 flex gap-[24px] mobile:flex-col tablet:flex-col">
    <Sidebar />
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/widgets/sidebar.vue";
</script>
