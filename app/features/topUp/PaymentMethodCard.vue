<template>
  <div
    @click="$emit('select')"
    :class="[
      'bg-bg-secondary rounded-[12px] p-4 cursor-pointer border-2 transition-all hover:border-primary',
      selected
        ? 'border-primary bg-primary/10'
        : 'border-transparent hover:border-primary/50',
    ]"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center"
      >
        <img :src="method.icon" :alt="method.name" class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <h3 class="font-semibold text-white">{{ method.name }}</h3>
        <p class="text-text-tertiary text-sm">{{ method.description }}</p>
      </div>
      <div
        v-if="selected"
        class="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
      >
        <div class="w-2 h-2 bg-black rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PaymentMethod {
  id: number;
  name: string;
  icon: string;
  description: string;
}

interface Props {
  method: PaymentMethod;
  selected: boolean;
}

defineProps<Props>();
defineEmits<{
  select: [];
}>();
</script>
