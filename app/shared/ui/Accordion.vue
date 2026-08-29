<template>
 <div class="space-y-0.5 lg:max-w-[589px] mx-auto rounded-[20px] overflow-hidden">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="bg-gray-dark flex flex-col gap-4 lg:p-6 md:p-6 p-4"
      >
        <button
          @click="toggleItem(index)"
          class="w-full text-left flex justify-between items-center hover:bg-gray-750 transition-colors cursor-pointer"
        >
          <span class="text-white font-semibold text-lg">{{ item.question }}</span>
          <svg 
            class="w-5 h-5 text-white transition-transform duration-200"
            :class="{ 'rotate-45': openItems.includes(index) }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
        
        <div 
          v-if="openItems.includes(index)"
          class=""
        >
          <p class="text-gray-300 text-sm leading-relaxed">
            {{ item.answer }}
          </p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
interface AccordionItem {
  question: string
  answer: string
}

interface Props {
  items: AccordionItem[],
  firstItemOpen: boolean
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

const openItems = ref<number[]>(props.firstItemOpen ? [0] : [])

const toggleItem = (index: number) => {
  if (openItems.value.includes(index)) {
    openItems.value = openItems.value.filter(item => item !== index)
  } else {
    openItems.value.push(index)
  }
}
</script>
