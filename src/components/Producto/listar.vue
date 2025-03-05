<template>
  <div>
    <!-- Aquí llamamos al componente EditarCrear y le pasamos las props -->
    <EditarCrear
      v-if="productoEditar"
      :producto="productoEditar"
      :mostrarModal="mostrarModalEditar"
      @cerrar="mostrarModalEditar = false"
      @productoCreado="cargarProductos()"
      @productoEditado="actualizarLista"
    />
    <div class="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-700 flex items-center">
          Productos
          <img
            :src="cubiertos"
            alt="Cubierto"
            class="w-5 h-5 ml-2 filter brightness-0 dark:brightness-80"
          />
        </h1>

        <div>
          <div class="flex gap-2 items-center">
            <!-- Contenedor del input con icono -->
            <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar productos..."
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

            <!-- Botón de agregar producto con icono -->
            <button
              @click="abrirModal"
              @productoCreado="cargarProductos()"
              class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2"
            >
              Agregar Producto
              <img :src="agregar" class="w-5 h-5 opacity-80" />
            </button>

            <ProductosCrear
              :mostrarModal="mostrarModal"
              @cerrar="mostrarModal = false"
              @productoCreado="cargarProductos()"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla estilizada -->
    <div class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Nombre</th>
            <th class="p-3 text-left">Precio</th>
            <th class="p-3 text-left">Imagen</th>
            <th class="p-3 text-left">Categoría</th>
            <th class="p-3 text-left">Stock</th>
            <th class="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="producto in paginatedProductos"
            :key="producto.id"
            class="border-b hover:bg-gray-100 transition"
          >
            <td class="p-3">{{ producto.id }}</td>
            <td class="p-3">{{ producto.nombre }}</td>
            <td class="p-3 font-semibold text-green-600">
              ${{ producto.precio }}
            </td>
            <td class="p-3">
              <img
                v-if="producto.imagen_url"
                :src="'local://' + producto.imagen_url"
                class="w-12 h-12 rounded-full mx-auto shadow-md"
              />
              <span v-else class="text-gray-500">Sin imagen</span>
            </td>
            <td class="p-3">
              {{ producto.categoria?.nombre || "Sin categoría" }}
            </td>
            <td class="p-3">
              <span :class="getStockClass(producto)">
                {{
                  producto.maneja_stock
                    ? `${producto.stock} unidades`
                    : "No aplica"
                }}
              </span>
            </td>
            <td class="p-3 flex justify-center space-x-3">
              <button @click="obtenerProducto(producto.id)">✏️</button>
              <button
                @click="eliminarProducto(props.producto.id)"
                class="text-red-500 hover:text-red-400 transition"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación mejorada -->
    <div class="flex justify-center mt-6 space-x-2">
      <button
        @click="prevPage"
        :disabled="pagina === 1"
        class="px-4 py-2 border rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        ◀
      </button>
      <span class="px-4 py-2 text-gray-700"
        >{{ pagina }} / {{ totalPaginas }}</span
      >
      <button
        @click="nextPage"
        :disabled="pagina >= totalPaginas"
        class="px-4 py-2 border rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductosCrear from "./crear.vue";
import EditarCrear from "./editar.vue";
import agregar from "../../assets/iconos/agregar.svg";
import cubiertos from "../../assets/iconos/cubiertos.svg";
import { useToast } from "vue-toastification";

interface Categoria {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url?: string;
  categoria?: Categoria;
  stock: number;
  maneja_stock: boolean;
}

const props = defineProps<{
  producto: Producto;
}>();

const productoEditar = ref<Producto | null>(null); // Variable reactiva para el producto que se va a editar
const mostrarModalEditar = ref(false); // Variable reactiva para controlar la visibilidad del modal

const obtenerProducto = async (id: number) => {
  productoEditar.value = null;
  const producto = await window.api.getOneProductoById(id); // Obtenemos el producto
  if (producto) {
    productoEditar.value = { ...producto };
    mostrarModalEditar.value = true;
  } else {
    console.error("No se encontró el producto");
  }
};

const actualizarLista = async () => {
  productos.value = await window.api.getProductos(); // Llamar la API para obtener productos actualizados
};

// Función para manejar la eliminación del producto
const eliminarProducto = (id: number) => {
  console.log(`Eliminando producto con ID: ${id}`);
  // Aquí puedes agregar lógica para eliminar el producto de la base de datos
};

const productos = ref<Producto[]>([]);
const productosFiltradas = ref<Producto[]>([]);
const searchQuery = ref("");
const pagina = ref(1);
const itemsPorPagina = 5;

// Variables reactivas
const nombreProducto = ref("");
const precio = ref<number>(0); // Correcto
const stock = ref<number>(0);
const manejaStock = ref<"si" | "no">("no"); // Cambié 'no' a un tipo más restrictivo
const imagen_url = ref("");
const selectedCategory = ref<Categoria | null>(null);
const error = ref<string | null>(null);
const mostrarModal = ref(false);

onMounted(async () => {
  try {
    productos.value = await window.api.getProductos();
  } catch (err) {
    console.error("Error al cargar los productos", err);
  }
});

const cargarProductos = async () => {
  const data = await window.api.getProductos(); // Recarga la lista
  productos.value = data;
  productosFiltradas.value = data;
};


const buscarProductos = () => {
  if (!searchQuery.value) {
    productosFiltradas.value = [...productos.value];
  } else {
    const query = searchQuery.value.toLowerCase();
    productosFiltradas.value = productos.value.filter((producto) =>
      producto.nombre.toLowerCase().includes(query)
    );
  }
  pagina.value = 1; // Resetear a la primera página cuando se busca
};


const paginatedProductos = computed(() => {
  const inicio = (pagina.value - 1) * itemsPorPagina;
  return productos.value.slice(inicio, inicio + itemsPorPagina);
});

const totalPaginas = computed(() =>
  Math.ceil(productos.value.length / itemsPorPagina)
);
const nextPage = () => {
  if (pagina.value < totalPaginas.value) pagina.value++;
};
const prevPage = () => {
  if (pagina.value > 1) pagina.value--;
};

// Método abrirModal
const abrirModal = () => {
  // Resetea los valores del formulario antes de abrir el modal
  nombreProducto.value = "";
  precio.value = 0;
  stock.value = 0;
  manejaStock.value = "no";
  imagen_url.value = "";
  selectedCategory.value = null; // Resetea la categoría seleccionada
  error.value = null; // Resetea el mensaje de error

  mostrarModal.value = true; // Abre el modal
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const getStockClass = (producto: Producto) => {
  if (!producto.maneja_stock)
    return "bg-gray-300 text-gray-700 px-2 py-1 rounded";
  if (producto.stock <= 0) return "bg-red-500 text-white px-2 py-1 rounded";
  return "bg-green-500 text-white px-2 py-1 rounded";
};



</script>
