/**
 * Auth middleware — защита маршрутов.
 * Перенаправляет неавторизованных пользователей на /sign-in.
 * Применяется к защищённым страницам через definePageMeta({ middleware: "auth" }).
 */
import { useAuthStore } from "~/shared/store/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Если не инициализирован — читаем токен из cookie
  if (!authStore.initialized) {
    authStore.init();
  }

  if (!authStore.isAuthenticated) {
    const localePath = useLocalePath();
    return navigateTo(localePath("/sign-in"));
  }

  return;
});
