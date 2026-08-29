<template>
  <div class="bg-bg-primary w-screen h-screen text-white">
    <Header />
    <div class="relative">
      <BurgerMenu />
    </div>
    <slot />
    <Footer class="mt-[140px]" />
  </div>
</template>

<script setup lang="ts">
import BurgerMenu from "~/widgets/burger-menu.vue";
import Header from "~/widgets/header.vue";
import Footer from "~/widgets/footer.vue";
</script>
