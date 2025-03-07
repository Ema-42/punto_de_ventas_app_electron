import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<{
      id: number;
      nombre: string;
      rol: string;
      auth: boolean;
    } | null>(null);

    const login = (id: number, nombre: string, rol: string) => {
      user.value = { id, nombre, rol, auth: true };
    };

    const logout = () => {
      user.value = null;
    };

    return { user, login, logout };
  },
  {
    persist: true, // Esto guarda el estado en localStorage automáticamente
  }
);
