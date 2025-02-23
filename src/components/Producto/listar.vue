<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Productos</h1>

    <div class="flex justify-between items-center my-4">
      <span class="text-gray-500">Inventarios / <b>Productos</b></span>
      <!--      <div class="flex space-x-16">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar producto..."
          class="border p-2 rounded"
        />
        <button
          @click="mostrarModal = true"
          class="bg-red-600 text-white px-4 py-2 rounded"
        >
          Agregar Producto
        </button>
        <productos-crear
          :mostrarModal="mostrarModal"
          @cerrar="mostrarModal = false"
        />
      </div> -->
    </div>

    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">ID</th>
          <th class="border p-2">Nombre</th>
          <th class="border p-2">Precio</th>
          <th class="border p-2">Imagen</th>
          <th class="border p-2">Categoría</th>
          <th class="border p-2">Stock</th>
          <th class="border p-2">Fecha Creación</th>
          <th class="border p-2">Accciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="producto in productos"
          :key="producto.id"
          class="text-center"
        >
          <td class="border p-2">{{ producto.id }}</td>
          <td class="border p-2">{{ producto.nombre }}</td>
          <td class="border p-2">${{ producto.precio }}</td>
          <td class="border p-2">
            <img
              v-if="producto.imagen_url"
              :src="producto.imagen_url"
              class="w-10 h-10 mx-auto"
            />
            <span v-else>Sin imagen</span>
          </td>
          <td class="border p-2">
            {{ producto.categoria?.nombre || "Sin categoría" }}
          </td>
          <td class="border p-2">
            {{
              producto.maneja_stock ? `${producto.stock} unidades` : "No aplica"
            }}
          </td>
          <td class="border p-2">
            {{ new Date(producto.fecha_creacion).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Producto {
  id: number;
  nombre: string;
  stock: string;
  fecha_creacion: string;
  precio: string;
  imagen_url: string;
  categoria: { nombre: string };
  maneja_stock: string;
}

const productos = ref<Producto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // Usamos la API expuesta desde el preload
    productos.value = await (window as any)["api"].getProductos();
    console.log("prod desde listar", productos);
  } catch (err) {
    error.value = "Error al cargar los productos";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
