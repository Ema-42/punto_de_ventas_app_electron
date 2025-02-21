<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Lista de Productos</h2>
    <!-- Aquí puedes añadir tu tabla o cualquier otro contenido -->
    <table class="w-full border-collapse border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 p-2">Producto</th>
          <th class="border border-gray-300 p-2">Precio</th>
          <!-- Otras cabeceras -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="producto in productos"
          :key="producto.id"
          class="text-center"
        >
          <td class="border border-gray-300 p-2">{{ producto.nombre }}</td>
          <td class="border border-gray-300 p-2">${{ producto.precio }}</td>
          <!-- Otras celdas -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";

const productos = ref([
  { id: 1, nombre: "Producto 1", precio: 10 },
  { id: 2, nombre: "Producto 2", precio: 20 },
  // Otros productos
]);
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
