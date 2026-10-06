<template>
  <input
    v-bind="attrs"
    :value="props.modelValue ?? ''"
    :placeholder="props.placeholder"
    :class="inputClass"
    :type="props.type || 'text'"
    @input="onInput"
  />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  placeholder: string;
  class?: string;
  type?: string;
  modelValue?: string | number | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const attrs = useAttrs();

const inputClass = computed(() => {
  return (
    "rounded-[12px] h-10 font-semibold placeholder:font-semibold placeholder:text-text-tertiary bg-bg-secondary p-3 border-none focus:outline-none focus:ring-0" +
    " " + props.class
  );
});

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>
