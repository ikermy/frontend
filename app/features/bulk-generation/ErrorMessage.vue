<template>
  <div v-if="message"
    class="error-message-container flex flex-col py-3 px-4 bg-bg-primary rounded-[12px] border-t border-x border-negative w-full relative">
    <p class="text-white text-sm leading-relaxed text-left">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: undefined,
});
</script>

<style scoped>
.error-message-container {
  border-radius: 12px 12px 12px 12px;
  border-image: linear-gradient(to top, transparent, var(--color-negative)) 1 round(12px);
}
</style>
