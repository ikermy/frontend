<template>
  <div class="page lg:py-32 py-20">
    <div class="container">
    <p class="lg:text-5xl md:text-[32px] text-[28px] mb-10 text-center">Help via questions/answers</p>
      <Accordion
        :items="faqItems"
        :firstItemOpen="true"
        @close="handleClose"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Accordion from '~/shared/ui/Accordion.vue'

const faqItems = ref([
  {
    question: "Fames imperdiet quam fermentum?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    question: "Fames imperdiet quam fermentum?",
    answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  },
  {
    question: "Fames imperdiet quam fermentum?",
    answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    question: "Fames imperdiet quam fermentum?",
    answer: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
])

const handleClose = () => {
  // Handle close action - could navigate back or close modal
  console.log('Accordion closed')
}
</script>
