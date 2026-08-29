<template>
  <div class="flex gap-3">
    <button
      v-for="unit in units"
      :key="unit.id"
      @click="selectUnit(unit.id)"
      :class="[
        'px-6 py-2 text-sm font-semibold rounded-[12px] cursor-pointer transition-colors flex justify-center items-center',
        activeUnit === unit.id
          ? 'bg-white text-black hover:opacity-85'
          : 'bg-bg-secondary text-white hover:bg-bg-tertiary'
      ]"
      style="width: 126.67px; height: 44px;"
    >
      {{ unit.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Unit {
  id: string;
  label: string;
}

interface Props {
  units: Unit[];
  activeUnit?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeUnit: "cm",
});

const emit = defineEmits<{
  (e: "update:activeUnit", value: string): void;
}>();

const activeUnit = ref(props.activeUnit);

watch(() => props.activeUnit, (newValue) => {
  activeUnit.value = newValue;
});

const selectUnit = (unitId: string) => {
  activeUnit.value = unitId;
  emit("update:activeUnit", unitId);
};
</script>

