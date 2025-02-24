<!-- <script setup lang="ts">
import {
  CategoriaProducto,
  Producto,
} from "../electron/main/modules/interfaces";
import { onMounted, ref } from "vue";

const productos = ref<Producto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const prod_test = ref({});

onMounted(async () => {
  try {
    productos.value = await window.api.getProductos();
  } catch (err) {
    error.value = "Error al cargar los productos";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const crearProducto = async () => {
  try {
    const nuevoProducto: Producto = {
      nombre: "Producto de prueba",
      precio: 199.99,
      imagen_url: "https://via.placeholder.com/150",
      maneja_stock: true,
      stock: 50,
      categoria_id: 1,
      fecha_creacion: new Date(),
    };
    prod_test.value = await window.api.createProducto(nuevoProducto);
    console.log("Producto creado: ", prod_test.value);
  } catch (err) {
    error.value = "Error al crear el producto";
    console.error(err);
  }
};
const obtenerProductoPorId = async (id: number) => {
  try {
    prod_test.value = await window.api.getOneProductoById(id);
    console.log("Producto obtenido: ", prod_test.value);
    return prod_test.value;
  } catch (err) {
    error.value = "Error al obtener el producto";
    console.error(err);
    return null;
  }
};

const editarProducto = async (id: number, newData: Partial<Producto>) => {
  try {
    prod_test.value = await window.api.editProductoById(id, newData);
    console.log("Producto editado: ", prod_test.value);
    return prod_test.value;
  } catch (err) {
    error.value = "Error al editar el producto";
    console.error(err);
    return null;
  }
};

const deleteProductoById = async (id: number) => {
  try {
    prod_test.value = await window.api.deleteProductoById(id);
    console.log(`Producto con ID ${id} eliminado`);
  } catch (err) {
    error.value = "Error al eliminar el producto";
    console.error(err);
  }
};

//categorias
const categorias = ref([]);

const getAllCategorias = async () => {
  try {
    categorias.value = await window.api.getCategorias();
    return categorias.value;
  } catch (err) {
    error.value = "Error al obtener las categorías";
    console.error(err);
  }
};

const createCategoria = async (data: CategoriaProducto) => {
  try {
    categorias.value = await window.api.createCategoria(data);
    console.log("Categoría creada: ", categorias.value);
    return categorias.value;
  } catch (err) {
    error.value = "Error al crear la categoría";
    console.error(err);
    return null;
  }
};

const getOneCategoriaById = async (id: number) => {
  try {
    categorias.value = await window.api.getOneCategoriaById(id);
    console.log("Categoría obtenida: ", categorias.value);
    return categorias.value;
  } catch (err) {
    error.value = "Error al obtener la categoría";
    console.error(err);
    return null;
  }
};

const editCategoriaById = async (
  id: number,
  newData: Partial<CategoriaProducto>
) => {
  try {
    categorias.value = await window.api.editCategoriaById(id, newData);
    console.log("Categoría editada: ", categorias.value);
    return categorias.value;
  } catch (err) {
    error.value = "Error al editar la categoría";
    console.error(err);
    return null;
  }
};

const deleteCategoriaById = async (id: number) => {
  try {
    categorias.value = await window.api.deleteCategoriaById(id);
    console.log(`Categoría con ID ${id} eliminada`);
  } catch (err) {
    error.value = "Error al eliminar la categoría";
    console.error(err);
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div v-if="loading" class="text-gray-500">Cargando productos...</div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="!loading && !error">
      <div class="flex items-center space-x-4 mb-6">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="crearProducto"
        >
          crear
        </button>
        <span id="count" class="text-lg font-semibold">{{ prod_test }}</span>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="obtenerProductoPorId(1)"
        >
          get one
        </button>
        <span id="count" class="text-lg font-semibold">{{ prod_test }}</span>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="
            editarProducto(1, {
              nombre: 'Producto 22',
              precio: 299.99,
              categoria_id: 1,
              imagen_url: 'https://hola',
              maneja_stock: true,
              stock: 100,
            })
          "
        >
          Editar
        </button>
        <span id="count" class="text-lg font-semibold">{{ prod_test }}</span>
        <button
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="deleteProductoById(1)"
        >
          Delete
        </button>
        <span id="count" class="text-lg font-semibold">{{ prod_test }}</span>
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="getAllCategorias"
        >
          get all categoria
        </button>
        <span id="count" class="text-lg font-semibold">{{ categorias }}</span>

        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="createCategoria({ nombre: 'Categoria 1' })"
        >
          crear categoria
        </button>
        <span id="count" class="text-lg font-semibold">{{ categorias }}</span>

        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="getOneCategoriaById(1)"
        >
          get one categoria
        </button>
        <span id="count" class="text-lg font-semibold">{{ categorias }}</span>
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="editCategoriaById(1, { nombre: 'EDITADO 2' })"
        >
          editar categoria
        </button>
        <span id="count" class="text-lg font-semibold">{{ categorias }}</span>
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          @click="deleteCategoriaById(1)"
        >
          eliminar categoria
        </button>
        <span id="count" class="text-lg font-semibold">{{ categorias }}</span>
      </div>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Productos</h2>
      <table id="productos-table" class="w-full text-left">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-3">ID</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">Precio</th>
            <th class="p-3">Imagen</th>
            <th class="p-3">Maneja Stock</th>
            <th class="p-3">Stock</th>
            <th class="p-3">Categoría</th>
            <th class="p-3">Fecha creacion</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="producto in productos" :key="producto.id">
            <td class="p-3">{{ producto.id }}</td>
            <td class="p-3">{{ producto.nombre }}</td>
            <td class="p-3">{{ producto.precio }}</td>
            <td class="p-3">{{ producto.imagen_url }}</td>
            <td class="p-3">{{ producto.maneja_stock }}</td>
            <td class="p-3">{{ producto.stock }}</td>
            <td class="p-3">{{ producto.categoria?.nombre }}</td>
            <td class="p-3">{{ producto.fecha_creacion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> -->

 <template>
  <div class="flex h-screen ">
 
    <Sidebar />

   
    <div class="flex flex-col w-full transition-all duration-300">
     
      <Navbar />

      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
</script>
