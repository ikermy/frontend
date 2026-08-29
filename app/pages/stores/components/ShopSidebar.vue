<template>
  <div class="max-w-[315px] flex flex-col border-r border-[#292929] pr-4">
    <div class="flex flex-col gap-6 flex-grow">
      <div>
      <p class="mb-3 font-semibold">Placeholder</p>
      <ul class="flex flex-wrap gap-x-1 gap-y-2">
        <li v-for="item in 5" :key="item">
          <Button text-color="white" color="secondary" class="text-xs">Placeholder</Button>
        </li>
      </ul>
      </div>
      <div>
        <p class="mb-3 font-semibold">Placeholder</p>
        <ul>
          <li v-for="item in 5" :key="item" class="py-2.5 border-b border-[#292929]">
            <Checkbox id="checkbox" value="checkbox" label="Placeholder" />
          </li>
        </ul>
      </div>
      <div>
        <p class="mb-3 font-semibold">Placeholder</p>
        <div class="flex gap-2">
          <div class="relative">
            <span class="absolute top-1/2 -translate-y-1/2 left-3">от</span>
            <Input placeholder="Placeholder" class=" pl-10 w-full text-sm"/>
          </div>
          <div class="relative">
            <span class="absolute top-1/2 -translate-y-1/2 left-3">до</span>
            <Input placeholder="Placeholder" class=" pl-10 w-full text-sm"/>
          </div>
        </div>
      </div>
      <div>
        <p class="mb-3 font-semibold">Placeholder</p>
        <div class="flex gap-2">
          <div class="relative">
            <span class="absolute top-1/2 -translate-y-1/2 left-3">от</span>
            <Input placeholder="Placeholder" class=" pl-10 w-full text-sm"/>
          </div>
          <div class="relative">
            <span class="absolute top-1/2 -translate-y-1/2 left-3">до</span>
            <Input placeholder="Placeholder" class=" pl-10 w-full text-sm"/>
          </div>
        </div>
      </div>
    </div>
    <div>
      <Button text-color="dark" color="white" class="w-full">Save</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/shared/ui/Button.vue';
import Checkbox from '~/components/ui/Checkbox.vue';
import Input from '~/shared/ui/Input.vue';
</script>

<style scoped>

</style>