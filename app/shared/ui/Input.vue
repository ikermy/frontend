<template>
  <input
    v-bind="$attrs"
    :placeholder="props.placeholder"
    :class="inputClass"
    :type="props.type"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  placeholder: string;
  class?: string;
  type?: string;
}>();

const inputClass = computed(() => {
  return (
    "rounded-[12px] h-10 font-semibold placeholder:font-semibold placeholder:text-text-tertiary bg-bg-secondary p-3 border-none focus:outline-none focus:ring-0" +
    " " + props.class
  );
});
</script>
