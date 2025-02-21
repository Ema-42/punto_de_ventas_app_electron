<!-- <script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted, ref } from "vue";

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  imagen_url: string;
  categoria: string;
}

const productos = ref<Producto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // Usamos la API expuesta desde el preload
    productos.value = await (window as any)["api"].getProductos();
  } catch (err) {
    error.value = "Error al cargar los productos";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-blue-600">¡Hola, Tailwind CSS!</h1>
  </div>
  <HelloWorld msg="Hola judith" />

  <div class="bg-white rounded-lg shadow-md p-6">
    
    <div v-if="loading" class="text-gray-500">Cargando productos...</div>

    
    <div v-if="error" class="text-red-500">{{ error }}</div>

 
    <div v-if="!loading && !error">
      <div class="flex items-center space-x-4 mb-6">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Click aquí
        </button>
        <span id="count" class="text-lg font-semibold">0</span>
      </div>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Productos</h2>
      <table id="productos-table" class="w-full text-left">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-3">ID</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">Precio</th>
            <th class="p-3">Imagen</th>
            <th class="p-3">Categoría</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="producto in productos" :key="producto.id">
            <td class="p-3">{{ producto.id }}</td>
            <td class="p-3">{{ producto.nombre }}</td>
            <td class="p-3">{{ producto.precio }}</td>
            <td class="p-3">{{ producto.imagen_url }}</td>
            <td class="p-3">{{ producto.categoria }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
 -->

 <template>
  <div>
    <Navbar />
    <router-view/>
    <!-- <Sidebar /> -->
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
//import Sidebar from "./components/Sidebar.vue";
</script>