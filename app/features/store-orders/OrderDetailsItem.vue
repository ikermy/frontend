<template>
  <div class="flex flex-col border-b border-gray-700 last:border-b-0">
    <!-- Header -->
    <div
      class="flex items-start md:items-center gap-3 p-4 cursor-pointer hover:bg-bg-tertiary transition-colors mb-2"
      @click="toggleExpand"
    >
      <!-- Chevron Icon - hidden on mobile -->
      <UIcon
        :name="isExpandedState ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        class="hidden md:block w-5 h-5 text-text-tertiary flex-shrink-0"
      />
      
      <!-- Product Image -->
      <div
        v-if="order.productImage"
        class="w-12 h-12 bg-bg-tertiary rounded-[4px] overflow-hidden flex-shrink-0"
      >
        <img
          :src="order.productImage"
          :alt="order.title"
          class="w-full h-full object-cover"
        />
      </div>
      
      <!-- Mobile Layout: Price, Description and Icons -->
      <div class="flex flex-col gap-1 flex-1 min-w-0 md:hidden">
        <div class="flex items-center justify-between w-full">
          <p class="text-white font-semibold text-sm">{{ order.price || "1 420P" }}</p>
          <!-- Chevron Icon - visible on mobile, right side -->
          <UIcon
            :name="isExpandedState ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-text-tertiary flex-shrink-0"
          />
        </div>
        <p class="text-text-tertiary text-sm">{{ order.description }}</p>
        <!-- Shopping Bag Icon - below description on mobile, left side -->
        <img
          :src="icons.minus"
          alt="Shopping Bag"
          class="w-5 h-5 text-text-tertiary flex-shrink-0 self-start"
        />
      </div>
      
      <!-- Desktop: Title and Description -->
      <div class="hidden md:flex flex-col gap-1 flex-1 min-w-0">
        <p class="text-white font-semibold text-base">{{ order.title }}</p>
        <p class="text-text-tertiary text-sm truncate">{{ order.description }}</p>
      </div>
      
      <!-- Desktop: Shopping Bag Icon -->
      <img
        :src="icons.minus"
        alt="Shopping Bag"
        class="hidden md:block w-5 h-5 text-text-tertiary flex-shrink-0"
      />
    </div>

    <!-- Expanded Content -->
    <div v-if="isExpandedState" class="px-4 md:mx-4 mb-4 md:px-8 flex flex-col gap-4">
      <!-- Info Section -->
      <div class="flex flex-col gap-2">
        <p class="text-white font-semibold text-sm">Info</p>
        <div class="flex flex-col gap-1">
          <p class="text-text-tertiary text-sm">
            <span class="text-white">Login:</span> {{ order.login }}
          </p>
          <p class="text-text-tertiary text-sm">
            <span class="text-white">Password:</span> {{ order.password }}
          </p>
        </div>
      </div>

      <!-- Lorem Ipsum Section -->
      <div class="flex flex-col gap-2">
        <p class="text-white font-semibold text-sm">Lorem ispum</p>
        <p class="text-text-tertiary text-sm leading-relaxed">
          {{ order.loremText }}
        </p>
      </div>

      <!-- Chat with Support Button -->
       <div class="flex justify-start items-center mt-2">
         <Button
           color="tertiary"
           text-color="white"
           class="h-12 text-base font-semibold px-5"
           leading-icon="i-heroicons-chat-bubble-left-right"
           :on-click="handleChatWithSupport"
         >
           Chat with support
         </Button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import { useAssets } from "~/shared/composables/useAssets";

const { icons } = useAssets();

interface Order {
  id: string;
  productImage?: string;
  title: string;
  description: string;
  price?: string;
  login: string;
  password: string;
  loremText: string;
}

interface Props {
  order: Order;
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isExpanded: false,
});

const isExpandedState = ref(props.isExpanded);

watch(() => props.isExpanded, (newValue) => {
  isExpandedState.value = newValue;
});

const toggleExpand = () => {
  isExpandedState.value = !isExpandedState.value;
};

const handleChatWithSupport = () => {
  console.log("Chat with support for order:", props.order.id);
  // Handle chat with support action
};
</script>

