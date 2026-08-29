<template>
  <div class="flex flex-col gap-3 mb-6">
    <!-- Date Header -->
    <h3 class="font-medium text-lg text-white mb-3">
      {{ formattedDate }}
    </h3>

    <!-- Notifications List -->
    <div class="flex flex-col">
      <NotificationItem
        v-for="(notification, index) in notifications"
        :key="index"
        :title="notification.title"
        :time="notification.time"
        :icon="notification.icon"
        :on-click="notification.onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NotificationItem from "./NotificationItem.vue";

interface Notification {
  title: string;
  time: string;
  icon?: string;
  onClick?: () => void;
}

interface Props {
  date: string;
  notifications: Notification[];
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
  try {
    const dateObj = new Date(props.date);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return props.date;
  }
});
</script>

