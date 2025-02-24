<template>
  <nav class=" top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-3 z-40">
    <!-- Logo -->
    <div class="flex items-center space-x-3">
      <img src="" alt="Logo" class="h-10" />
      <span class="text-red-600 font-bold text-lg">Mi Tienda</span>
    </div>

    <!-- Título dinámico -->
    <h1 class="text-lg font-semibold text-gray-700">{{ currentPage }}</h1>

    <!-- Menú de usuario -->
    <div class="relative">
      <button @click="toggleMenu" class="flex items-center space-x-2">
        <span class="text-gray-700">{{ userName }}</span>
        <img src="" alt="Usuario" class="h-8 w-8 rounded-full" />
      </button>

      <!-- Menú desplegable -->
      <div v-if="menuOpen" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
        <ul class="py-2 text-gray-700">
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Ir a mi sitio web</li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cerrar Sesión</li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const userName = ref("Judith Robles"); // Nombre de usuario
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>


