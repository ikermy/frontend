import { defineStore } from "pinia";
import type { Notification } from "~/shared/api/types";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as Notification[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    unreadCount: (state) => {
      // Assuming notifications have a read property, adjust based on your API
      return state.notifications.length;
    },
  },

  actions: {
    setNotifications(notifications: Notification[]) {
      this.notifications = notifications;
    },

    addNotification(notification: Notification) {
      this.notifications.unshift(notification);
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },

    markAsRead(id: string) {
      const notification = this.notifications.find((n) => n.id === id);
      if (notification) {
        // Add read property if your API supports it
        // notification.read = true;
      }
    },

    markAllAsRead() {
      // Mark all as read if your API supports it
      // this.notifications.forEach(n => n.read = true);
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },
  },
});

