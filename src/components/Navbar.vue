<template>
  <nav
    class="top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 z-40"
  >
    <!-- Logo -->
    <div class="flex items-center space-x-3">
      <div class="bg-red-600 p-2 rounded-lg shadow-md">
        <!-- <img src="/placeholder.svg" alt="Logo" class="h-8 w-8 object-contain" /> -->
      </div>
      <span class="text-red-600 text-xl tracking-tight font-black">CHICHARRONERIA 6 DE AGOSTO</span>
    </div>

    <!-- Título dinámico -->
    <div class="hidden md:block">
      <h1 class="text-xl font-semibold text-gray-800 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
        {{ currentPage }}
      </h1>
    </div>

    <!-- Menú de usuario -->
    <div class="relative">
      <button 
        @click="toggleMenu" 
        class="flex items-center space-x-3 py-2 px-3 rounded-full transition-all duration-200 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
      >
        <div class="flex flex-col items-end">
          <span class="text-gray-800 font-medium">{{ userName }}</span>
          <span class="text-xs text-gray-500">{{ authStore.user.rol }}</span>
        </div>
        <div class="h-10 w-10 rounded-full border-2 border-green-600 overflow-hidden flex items-center justify-center">
          <img 
            :src="user" 
            alt="Usuario" 
            class="h-full w-full object-cover"
          />
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': menuOpen }"
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Menú desplegable -->
      <div
        v-if="menuOpen"
        class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-in-out z-50"
      >
        <div class="py-2 border-b border-gray-100">
          <div class="px-4 py-2">
            <p class="text-sm font-medium text-gray-900">Nombre: {{ userName }}</p>
          </div>
        </div>
        <ul class="py-1">
 
 
          <li class="px-1">
            <div class="flex items-center px-3 py-2 text-sm text-gray-500 mx-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Rol: <span class="font-medium text-green-600">{{ authStore.user.rol }}</span></span>
            </div>
          </li>
        </ul>
        <div class="py-1 border-t border-gray-100">
          <button 
            @click="cerrarSesion" 
            class="flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-red-50 transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "../stores/auth";
import user from "/user4.png";
import router from "../router";

const authStore = useAuthStore();

const userName = ref(authStore.user.nombre); // Nombre de usuario
const menuOpen = ref(false);

const cerrarSesion = () => {
  authStore.logout();
  router.push("/login");
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

// Cerrar el menú al hacer clic fuera
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.relative');
  if (userMenu && !userMenu.contains(event.target) && menuOpen.value) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Animación para el menú desplegable */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

[v-if="menuOpen"] {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>