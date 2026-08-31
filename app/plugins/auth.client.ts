/**
 * Auth plugin — инициализирует состояние авторизации при старте приложения,
 * чтобы middleware и компоненты знали о текущем токене (из cookie).
 * Читаем cookie через useCookie (доступен в плагине) и передаём в стор.
 */
import { useAuthStore } from "~/shared/store/useAuth";

export default defineNuxtPlugin(async () => {
  const token = useCookie<string | null>("auth_token").value || "";
  const authStore = useAuthStore();
  authStore.setToken(token);
  authStore.initialized = true;
  if (token) {
    await authStore.loadProfile();
  }
});
