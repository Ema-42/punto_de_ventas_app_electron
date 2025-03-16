<template>
  <div class="h-full flex flex-col overflow-hidden">
    <CrearEditarProducto
      :mostrar="mostrarModalCrearEditar"
      :producto="productoEditar"
      @cerrar="mostrarModalCrearEditar = false"
      @guardar="guardarProducto"
    />

    <EliminarProducto
      :mostrar="mostrarModalEliminar"
      :producto="productoEliminar"
      @cerrar="mostrarModalEliminar = false"
      @confirmar="eliminarProducto"
    />

    <!-- Encabezado con título y buscador -->
    <div class="bg-gradient-to-r bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <h1 class="text-2xl font-bold text-gray-700 flex items-center">
          Productos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-2 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </h1>

        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <!-- Buscador con icono -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar producto..."
              class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none pl-10 bg-white"
              @input="buscarProductos"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Botón de agregar producto -->
          <button
            @click="abrirModalCrear"
            class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Agregar Producto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Contador de productos -->
    <div class="mb-2 text-gray-600">
      Total: {{ productosFiltrados.length }} productos encontrados
    </div>

    <!-- Tabla de productos con altura fija -->
    <div class="flex-1 overflow-hidden bg-white shadow-lg rounded-lg flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <th class="p-3 text-left rounded-tl-lg w-16">ID</th>
              <th class="p-3 text-left w-24">Imagen</th>
              <th class="p-3 text-left w-48">Nombre</th>
              <th class="p-3 text-left w-24">Precio</th>
              <th class="p-3 text-left w-32">Categoría</th>
              <th class="p-3 text-left w-24">Stock</th>
              <th class="p-3 text-left w-40">Fecha de creación</th>
              <th class="p-3 text-center rounded-tr-lg w-32">Acciones</th>
            </tr>
          </thead>
        </table>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <table class="w-full border-collapse">
          <thead class="hidden">
            <tr>
              <th class="p-3 w-16"></th>
              <th class="p-3 w-24"></th>
              <th class="p-3 w-48"></th>
              <th class="p-3 w-24"></th>
              <th class="p-3 w-32"></th>
              <th class="p-3 w-24"></th>
              <th class="p-3 w-40"></th>
              <th class="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="producto in paginatedProductos"
              :key="producto.id"
              class="border-b hover:bg-gray-100 transition"
            >
              <td class="p-3">
                <span
                  class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold"
                >
                  {{ producto.id }}
                </span>
              </td>
              <td class="px-3">
                <div class="w-16 h-16 flex items-center justify-center">
                  <img 
                    v-if="producto.imagen_url" 
                    :src="'local://' + producto.imagen_url" 
                    alt="Imagen del producto" 
                    class="max-h-16 max-w-16 object-contain rounded"
                  />
                  <div 
                    v-else 
                    class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="p-3 font-medium">{{ producto.nombre }}</td>
              <td class="p-3">${{ formatearPrecio(producto.precio) }}</td>
              <td class="p-3">
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {{ producto.categoria.nombre }}
                </span>
              </td>
              <td class="p-3">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-sm font-medium',
                    producto.maneja_stock 
                      ? (producto.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ producto.maneja_stock ? producto.stock : 'N/A' }}
                </span>
              </td>
              <td class="p-3 text-gray-600">
                {{ formatearFecha(producto.fecha_creacion) }}
              </td>
              <td class="p-3 flex justify-center space-x-3 ">
                <button
                  @click="editarProducto(producto)"
                  class="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition"
                  title="Editar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="confirmarEliminar(producto)"
                  class="bg-red-100 p-2 rounded-full hover:bg-red-200 transition"
                  title="Eliminar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedProductos.length === 0">
              <td colspan="8" class="p-6 text-center text-gray-500">
                No se encontraron productos
                <div class="mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-4 mb-2">
      <div class="text-sm text-gray-600">
        Mostrando {{ paginatedProductos.length }} de
        {{ productosFiltrados.length }} productos
      </div>
      <div class="flex space-x-2">
        <button
          @click="prevPage"
          :disabled="pagina === 1"
          class="px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span class="px-4 py-2 text-gray-700 bg-white border rounded-lg">
          {{ pagina }} / {{ totalPaginas || 1 }}
        </span>
        <button
          @click="nextPage"
          :disabled="pagina >= totalPaginas"
          class="px-4 py-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CrearEditarProducto from "../components/Producto/CrearEditarProducto.vue";
import EliminarProducto from "../components/Producto/EliminarProducto.vue";

//para los mensajes https://vue-toastification.maronato.dev/
import { useToast } from "vue-toastification";
const toast = useToast();

interface Categoria {
  id: number;
  nombre: string;
  eliminado?: boolean;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url?: string;
  categoria_id: number;
  categoria:  {id: number, nombre:string, eliminado:boolean, fecha_creacion:string}
  maneja_stock: boolean;
  stock: number;
  eliminado?: boolean;
  fecha_creacion?: string;
}

// Estado
const productos = ref<Producto[]>([]);
const productosFiltrados = ref<Producto[]>([]);
const categorias = ref<Categoria[]>([]);
const searchQuery = ref("");
const pagina = ref(1);
const porPagina = ref(7); // Exactamente 8 productos por página
const mostrarModalCrearEditar = ref(false);
const mostrarModalEliminar = ref(false);
const productoEditar = ref<Producto | null>(null);
const productoEliminar = ref<Producto | null>(null);

// Computed
const totalPaginas = computed(() =>
  Math.ceil(productosFiltrados.value.length / porPagina.value)
);

const paginatedProductos = computed(() => {
  const inicio = (pagina.value - 1) * porPagina.value;
  const fin = inicio + porPagina.value;
  return productosFiltrados.value.slice(inicio, fin);
});

// Métodos
const cargarProductos = async () => {
  // Aquí normalmente harías una llamada a tu API
  const data = await window.api.getProductos();
  productos.value = data;
  productosFiltrados.value = data;
};

const cargarCategorias = async () => {
  // Aquí normalmente harías una llamada a tu API para obtener las categorías
  const data = await window.api.getCategorias();
  categorias.value = data;
};

const buscarProductos = () => {
  if (!searchQuery.value) {
    productosFiltrados.value = [...productos.value];
  } else {
    const query = searchQuery.value.toLowerCase();
    productosFiltrados.value = productos.value.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(query) ||
        producto.categoria.nombre.toLowerCase().includes(query) ||
        producto.precio.toString().includes(query)
    );
  }
  pagina.value = 1;
};

const abrirModalCrear = () => {
  productoEditar.value = null;
  mostrarModalCrearEditar.value = true;
};

const editarProducto = (producto: Producto) => {
  productoEditar.value = producto;
  mostrarModalCrearEditar.value = true;
};

const guardarProducto = () => {
  cargarProductos();
  buscarProductos();
  mostrarModalCrearEditar.value = false;
  productoEditar.value
    ? toast.info("Producto editado con éxito!")
    : toast.success("Producto guardado con éxito!");
};

const confirmarEliminar = (producto: Producto) => {
  productoEliminar.value = producto;
  mostrarModalEliminar.value = true;
};

const eliminarProducto = () => {
  toast.error("Producto eliminado con éxito!");
  cargarProductos();
  buscarProductos();
  mostrarModalEliminar.value = false;
};

const formatearFecha = (fecha?: string) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatearPrecio = (precio: any) => {
  const numero = Number(precio); // Convierte a número
  
  if (isNaN(numero)) {
    return "0.00"; // Maneja valores no válidos
  }
  
  return numero.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const prevPage = () => {
  if (pagina.value > 1) {
    pagina.value--;
  }
};

const nextPage = () => {
  if (pagina.value < totalPaginas.value) {
    pagina.value++;
  }
};

// Ciclo de vida
onMounted(() => {
  cargarProductos();
  cargarCategorias();
});
</script>