<template>
  <div class="flex">
    <!-- Sidebar -->
    <div
      :class="[
        'h-screen bg-red-600 text-white',
        isOpen ? 'w-64' : 'w-16'
      ]"
    >
      <div class="p-4 flex justify-between items-center">
        <button @click="toggleSidebar">
          <img :src="menuicon" alt="Menú" class="w-6 h-6" />
        </button>
      </div>

      <nav class="mt-4">
        <ul>
          <li
            v-for="item in menuItems"
            :key="item.text"
            class="p-2 flex items-center space-x-4"
          >
            <router-link
              :to="item.route"
              class="flex items-center space-x-4 w-full p-2"
            >
              <img :src="item.icon" :alt="item.text" class="w-6 h-6" />
              <span v-if="isOpen" class="transition-opacity duration-300">
                {{ item.text }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    
  </div>
</template>

<script setup>
import { ref } from "vue";
import menuicon from '../assets/iconos/menu.svg'
import inicio from '../assets/iconos/inicio.svg'
import vender from '../assets/iconos/vender.svg'
import producto from '../assets/iconos/productos.svg'
import categoria from '../assets/iconos/categoria.svg'
import mesa from '../assets/iconos/mesa.svg'
import home from '../assets/iconos/home.svg'
import usuario from '../assets/iconos/usuario.svg'
import ingreso from '../assets/iconos/ingreso.svg'
import gestionpedidos from '../assets/iconos/cash.svg'

const isOpen = ref(false);

const menuItems = [
  { text: "Inicio", icon: home , route:"/home"},
  { text: "Vender", icon: vender ,route:"/pedidos" },
  { text: "Productos", icon: producto, route:"/productos" },
  { text: "Categorias de Productos", icon: categoria, route:"/categorias" },
  { text: "Mesas", icon: mesa, route:"/mesas" },
  { text: "Usuarios", icon: usuario, route:"/usuarios" },
  { text: "Ingresos", icon: ingreso, route:"/ingresos" },
  { text: "Gestion de Pedidos", icon: gestionpedidos, route:"/gestion-pedidos" },
];

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si lo necesitas */
</style>