<template>
  <div class="">
    <CrearIngreso
      :mostrar="mostrarModalCrear"
      @cerrar="mostrarModalCrear = false"
      @guardar="guardarIngreso"
    />

    <CambiarEstadoIngreso
      :mostrar="mostrarModalEstado"
      :ingreso="ingresoCambiarEstado"
      @cerrar="mostrarModalEstado = false"
      @confirmar="cambiarEstadoIngreso"
    />

    <!-- Encabezado con título y buscador -->
    <div class="bg-gradient-to-r bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <h1 class="text-2xl font-bold text-gray-700 flex items-center">
          Ingresos
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
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </h1>

        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <button
            @click="abrirModalCrear"
            class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Nuevo Ingreso
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

    <!-- Sección de búsqueda y exportación -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Buscador unificado -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Buscar</label
          >
          <input
            v-model="busquedaUnificada"
            type="text"
            placeholder="Buscar por ID, usuario o estado..."
            class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none pl-10 bg-white"
            @input="buscarIngresos"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 absolute left-3 top-9 text-red-600"
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

        <!-- Búsqueda por rango de fechas -->
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Desde</label
            >
            <input
              v-model="filtros.fechaDesde"
              type="date"
              class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none bg-white"
              @change="buscarIngresos"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Hasta</label
            >
            <input
              v-model="filtros.fechaHasta"
              type="date"
              class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none bg-white"
              @change="buscarIngresos"
            />
          </div>
        </div>
      </div>

      <!-- Sección de exportación -->
      <div class="mt-3 border-t pt-1">
        <div class="flex flex-wrap gap-2">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="seleccionarTodos"
              v-model="seleccionarTodos"
              @change="seleccionarTodosIngresos"
              class="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label for="seleccionarTodos" class="text-sm text-gray-700"
              >Seleccionar todos</label
            >
          </div>

          <div class="flex-grow"></div>

          <div class="flex gap-2">
            <button
              @click="exportarPDF"
              class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2 w-full sm:w-auto justify-center"
              :disabled="ingresosSeleccionados.length === 0"
              :class="{
                'opacity-50 cursor-not-allowed':
                  ingresosSeleccionados.length === 0,
              }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Exportar PDF
            </button>
          </div>
        </div>

        <div class="mt-2 text-sm text-gray-600">
          {{ ingresosSeleccionados.length }} registros seleccionados | Total:
          ${{ totalSeleccionado.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- Contador de ingresos -->
    <div class="mb-4 text-gray-600">
      Total: {{ ingresosFiltrados.length }} ingresos encontrados
    </div>

    <!-- Tabla de ingresos -->
    <div class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <th class="p-3 text-left w-12">
              <input
                type="checkbox"
                class="h-4 w-4 text-white border-white rounded"
                :checked="seleccionarTodos"
                @change="seleccionarTodosIngresos"
              />
            </th>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Fecha</th>
            <th class="p-3 text-left">Usuario</th>
            <th class="p-3 text-left">Estado</th>
            <th class="p-3 text-right">Total</th>
            <th class="p-3 text-center rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ingreso in paginatedIngresos"
            :key="ingreso.id"
            class="border-b hover:bg-gray-100 transition"
          >
            <td class="p-3">
              <input
                type="checkbox"
                :value="ingreso.id"
                v-model="ingresosSeleccionados"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
            </td>
            <td class="p-3">
              <span
                class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold"
              >
                {{ ingreso.id }}
              </span>
            </td>
            <td class="p-3 text-gray-600">
              {{ formatearFecha(ingreso.fecha_ingreso) }}
            </td>
            <td class="p-3">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2"
                >
                  <span class="text-sm font-medium text-red-600">{{
                    ingreso.usuario.nombre.charAt(0)
                  }}</span>
                </div>
                <span class="text-gray-700">{{ ingreso.usuario.nombre }}</span>
              </div>
            </td>
            <td class="p-3">
              <span :class="getEstadoClase(ingreso.estado)">
                {{ ingreso.estado }}
              </span>
            </td>
            <td class="p-3 text-right font-medium">
              <span class="text-gray-700"
                >${{ parseFloat(ingreso.total).toFixed(2) }}</span
              >
            </td>
            <td class="p-3 flex justify-center space-x-2">
              <button
                @click="verDetalles(ingreso)"
                class="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition"
                title="Ver detalles"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                @click="imprimirIngreso(ingreso)"
                class="bg-red-100 p-2 rounded-full hover:bg-red-200 transition"
                title="Imprimir"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
              </button>
              <!--               <button
                @click="abrirModalCambiarEstado(ingreso)"
                class="bg-yellow-100 p-2 rounded-full hover:bg-yellow-200 transition"
                title="Cambiar estado"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button> -->
            </td>
          </tr>
          <tr v-if="paginatedIngresos.length === 0">
            <td colspan="7" class="p-6 text-center text-gray-500">
              No se encontraron ingresos
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

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-600">
        Mostrando {{ paginatedIngresos.length }} de
        {{ ingresosFiltrados.length }} ingresos
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

    <!-- Modal de detalles -->
    <div
      v-if="mostrarModalDetalles && ingresoDetalle"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            Detalles del Ingreso #{{ ingresoDetalle.id }}
          </h2>
          <button
            @click="mostrarModalDetalles = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-sm text-gray-500">Fecha</div>
            <div class="font-medium">
              {{ formatearFecha(ingresoDetalle.fecha_ingreso) }}
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-sm text-gray-500">Usuario</div>
            <div class="font-medium">{{ ingresoDetalle.usuario.nombre }}</div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-sm text-gray-500">Estado</div>
            <div>
              <span :class="getEstadoClase(ingresoDetalle.estado)">
                {{ ingresoDetalle.estado }}
              </span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Productos</h3>
          <div class="overflow-x-auto bg-white border rounded-lg">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="p-3 text-left">Producto</th>
                  <th class="p-3 text-center">Cantidad</th>
                  <th class="p-3 text-right">Precio Unitario</th>
                  <th class="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="detalle in ingresoDetalle.detalles"
                  :key="detalle.id"
                  class="border-b"
                >
                  <td class="p-3">
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div class="font-medium">
                          {{ detalle.producto.nombre }}
                        </div>
                        <div class="text-xs text-gray-500">
                          ID: {{ detalle.producto.id }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-center">
                    <span
                      class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ detalle.cantidad }}
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    ${{ parseFloat(detalle.precio_unitario).toFixed(2) }}
                  </td>
                  <td class="p-3 text-right font-medium">
                    ${{
                      (
                        detalle.cantidad * parseFloat(detalle.precio_unitario)
                      ).toFixed(2)
                    }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-50">
                  <td colspan="3" class="p-3 text-right font-bold">Total:</td>
                  <td class="p-3 text-right font-bold">
                    ${{ parseFloat(ingresoDetalle.total).toFixed(2) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="mostrarModalDetalles = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CrearIngreso from "../components/Ingresos/CrearIngreso.vue";
import CambiarEstadoIngreso from "../components/Ingresos/CambiarEstadoIngreso.vue";
import jsPDF from "jspdf";
// Importar correctamente jspdf-autotable
import "jspdf-autotable";
// Definir una interfaz más completa para autoTable
interface AutoTableResult {
  previous: {
    finalY: number;
  };
}

// Extender jsPDF para incluir autoTable con su resultado
interface jsPDFWithAutoTableInterface extends jsPDF {
  autoTable: (options: any) => AutoTableResult;
}

// Para los mensajes
import { useToast } from "vue-toastification";
import { Ingreso } from "../../electron/main/modules/interfaces";
const toast = useToast();

// Estado
const ingresos = ref<Ingreso[]>([]);
const ingresosFiltrados = ref<Ingreso[]>([]);
const pagina = ref(1);
const porPagina = ref(6);
const mostrarModalCrear = ref(false);
const mostrarModalEstado = ref(false);
const mostrarModalDetalles = ref(false);
const ingresoCambiarEstado = ref<Ingreso | null>(null);
const ingresoDetalle = ref<Ingreso | null>(null);
const ingresosSeleccionados = ref<number[]>([]);
const seleccionarTodos = ref(false);
const busquedaUnificada = ref("");

// Filtros
const filtros = ref({
  fechaDesde: "",
  fechaHasta: "",
});

// Computed
const totalPaginas = computed(() =>
  Math.ceil(ingresosFiltrados.value.length / porPagina.value)
);

const paginatedIngresos = computed(() => {
  const inicio = (pagina.value - 1) * porPagina.value;
  const fin = inicio + porPagina.value;
  return ingresosFiltrados.value.slice(inicio, fin);
});

const totalSeleccionado = computed(() => {
  return ingresos.value
    .filter((ingreso) => ingresosSeleccionados.value.includes(ingreso.id))
    .reduce((total, ingreso) => total + parseFloat(ingreso.total), 0);
});

// Métodos
const cargarIngresos = async () => {
  try {
    const data = await window.api.getIngresos();
    ingresos.value = data;
    ingresosFiltrados.value = data;
  } catch (err) {
    console.error("Error al obtener los ingresos:", err);
    toast.error("Error al cargar los ingresos");
  }
};

const buscarIngresos = () => {
  let filtrados = [...ingresos.value];

  // Búsqueda unificada (ID, usuario, estado)
  if (busquedaUnificada.value) {
    const query = busquedaUnificada.value.toLowerCase();
    filtrados = filtrados.filter(
      (ingreso) =>
        ingreso.id.toString().includes(query) ||
        ingreso.usuario.nombre.toLowerCase().includes(query) ||
        ingreso.estado.toLowerCase().includes(query)
    );
  }

  // Filtrar por rango de fechas
  if (filtros.value.fechaDesde) {
    // Parsear la fecha correctamente por componentes para mantener la zona horaria local
    const [year, month, day] = filtros.value.fechaDesde
      .split("-")
      .map((num) => parseInt(num, 10));
    const fechaDesde = new Date(year, month - 1, day, 0, 0, 0);
    console.log("fechaDesde", fechaDesde);

    filtrados = filtrados.filter((ingreso) => {
      const fechaIngreso = new Date(ingreso.fecha_ingreso);
      return fechaIngreso >= fechaDesde;
    });
  }

  if (filtros.value.fechaHasta) {
    // Parsear la fecha correctamente por componentes para mantener la zona horaria local
    const [year, month, day] = filtros.value.fechaHasta
      .split("-")
      .map((num) => parseInt(num, 10));
    const fechaHasta = new Date(year, month - 1, day, 23, 59, 59, 999); // Ya está al final del día
    console.log("fechaHasta", fechaHasta);

    filtrados = filtrados.filter((ingreso) => {
      const fechaIngreso = new Date(ingreso.fecha_ingreso);
      return fechaIngreso <= fechaHasta;
    });
  }
  ingresosFiltrados.value = filtrados;
  pagina.value = 1;

  // Resetear selecciones
  if (seleccionarTodos.value) {
    seleccionarTodos.value = false;
  }
  ingresosSeleccionados.value = [];
};

const abrirModalCrear = () => {
  mostrarModalCrear.value = true;
};

const guardarIngreso = () => {
  cargarIngresos();
  mostrarModalCrear.value = false;
  toast.success("Ingreso creado con éxito");
};

const abrirModalCambiarEstado = (ingreso: Ingreso) => {
  ingresoCambiarEstado.value = ingreso;
  mostrarModalEstado.value = true;
};

const cambiarEstadoIngreso = () => {
  cargarIngresos();
  mostrarModalEstado.value = false;
  toast.info("Estado del ingreso actualizado");
};

const verDetalles = async (ingreso: Ingreso) => {
  try {
    // Si ya tenemos los detalles, no necesitamos hacer otra llamada
    if (ingreso.detalles) {
      ingresoDetalle.value = ingreso;
    } else {
      // Obtener los detalles del ingreso
      const detalles = await window.api.getOneIngresoById(ingreso.id);
      ingresoDetalle.value = detalles;
    }
    mostrarModalDetalles.value = true;
  } catch (err) {
    console.error("Error al obtener detalles:", err);
    toast.error("Error al cargar los detalles del ingreso");
  }
};

const formatearFecha = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEstadoClase = (estado: string) => {
  const clases: { [key: string]: string } = {
    CONSOLIDADO:
      "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium",
    ELIMINADO:
      "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium",
  };
  return (
    clases[estado] ||
    "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium"
  );
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

// Selección de ingresos para exportación
const seleccionarTodosIngresos = () => {
  if (seleccionarTodos.value) {
    ingresosSeleccionados.value = ingresosFiltrados.value.map(
      (ingreso) => ingreso.id
    );
  } else {
    ingresosSeleccionados.value = [];
  }
};

// Obtener detalles completos de los ingresos seleccionados
const obtenerDetallesIngresos = async (ids: number[]) => {
  const ingresosConDetalles: Ingreso[] = [];

  for (const id of ids) {
    try {
      const ingreso = await window.api.getOneIngresoById(id);
      ingresosConDetalles.push(ingreso);
    } catch (error) {
      console.error(`Error al obtener detalles del ingreso ${id}:`, error);
    }
  }

  return ingresosConDetalles;
};

// Función auxiliar para manejar autoTable y obtener finalY
const createPdfTable = (doc: jsPDF, options: any): number => {
  // @ts-ignore - Ignoramos el error de TypeScript
  doc.autoTable(options);
  // @ts-ignore - Accedemos a finalY de manera segura
  return doc.autoTable.previous?.finalY || 0;
};

// Exportación a PDF
const exportarPDF = async () => {
  if (ingresosSeleccionados.value.length === 0) return;

  try {
    // Obtener detalles completos de los ingresos seleccionados
    const ingresosCompletos = await obtenerDetallesIngresos(
      ingresosSeleccionados.value
    );
    const doc = new jsPDF() as jsPDFWithAutoTableInterface;

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Ingresos", 14, 20);

    doc.setFontSize(10);
    doc.text(
      `Generado: ${new Date().toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`,
      14,
      30
    );
    // Tabla de resumen
    const dataPrincipal = ingresosCompletos.map((ingreso) => [
      ingreso.id.toString(),
      formatearFecha(ingreso.fecha_ingreso),
      ingreso.usuario.nombre,
      ingreso.estado,
      `$${parseFloat(ingreso.total).toFixed(2)}`,
    ]);

    // Agregar fila de total
    const totalGeneral = ingresosCompletos.reduce(
      (sum, ingreso) => sum + parseFloat(ingreso.total),
      0
    );
    dataPrincipal.push(["", "", "", "TOTAL", `$${totalGeneral.toFixed(2)}`]);

    // Agregar tabla de resumen
    let y =
      createPdfTable(doc, {
        head: [["ID", "Fecha", "Usuario", "Estado", "Total"]],
        body: dataPrincipal,
        startY: 40,
        theme: "grid",
        headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
      }) + 20;

    // Agregar detalles de cada ingreso
    for (const ingreso of ingresosCompletos) {
      // Verificar si necesitamos una nueva página
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Título del ingreso
      doc.setFontSize(14);
      doc.text(
        `Ingreso #${ingreso.id} - ${formatearFecha(ingreso.fecha_ingreso)}`,
        14,
        y
      );
      y += 10;

      // Detalles del ingreso
      if (ingreso.detalles && ingreso.detalles.length > 0) {
        const detallesData = ingreso.detalles.map((detalle) => [
          detalle.producto.nombre,
          detalle.cantidad.toString(),
          `$${parseFloat(detalle.precio_unitario).toFixed(2)}`,
          `$${(detalle.cantidad * parseFloat(detalle.precio_unitario)).toFixed(
            2
          )}`,
        ]);

        doc.autoTable({
          head: [["Producto", "Cantidad", "Precio Unit.", "Subtotal"]],
          body: detallesData,
          startY: y,
          theme: "grid",
          headStyles: { fillColor: [100, 100, 100] },
        });
        // @ts-ignore
        y = doc.autoTable.previous.finalY + 15;
      } else {
        doc.setFontSize(10);
        doc.text("No hay detalles disponibles", 14, y);
        y += 15;
      }
    }

    // Guardar PDF
    doc.save(`ingresos_${new Date().toISOString().split("T")[0]}.pdf`);

    toast.success("Archivo PDF generado correctamente");
  } catch (error) {
    console.error("Error al generar PDF:", error);
    toast.error("Error al generar el archivo PDF");
  }
};

// Imprimir un solo ingreso
const imprimirIngreso = async (ingreso: Ingreso) => {
  try {
    // Obtener detalles completos si no los tiene
    let ingresoCompleto = ingreso;
    if (!ingreso.detalles) {
      ingresoCompleto = await window.api.getOneIngresoById(ingreso.id);
    }

    // Crear documento PDF en formato carta con autoTable
    const doc = new jsPDF({
      format: "letter",
      unit: "mm",
    }) as jsPDFWithAutoTableInterface;

    // Encabezado
    doc.setFontSize(18);
    doc.text("Reporte de Ingreso", 105, 20, { align: "center" });

    // Información del ingreso
    doc.setFontSize(12);
    doc.text(`N° de Ingreso: ${ingresoCompleto.id}`, 20, 40);
    doc.text(`Fecha: ${formatearFecha(ingresoCompleto.fecha_ingreso)}`, 20, 50);
    doc.text(`Usuario: ${ingresoCompleto.usuario.nombre}`, 20, 60);
    doc.text(`Estado: ${ingresoCompleto.estado}`, 20, 70);

    // Tabla de productos
    const detallesData =
      ingresoCompleto.detalles?.map((detalle) => [
        detalle.producto.nombre,
        detalle.cantidad.toString(),
        `$${parseFloat(detalle.precio_unitario).toFixed(2)}`,
        `$${(detalle.cantidad * parseFloat(detalle.precio_unitario)).toFixed(
          2
        )}`,
      ]) || [];

    doc.autoTable({
      head: [["Producto", "Cantidad", "Precio Unit.", "Subtotal"]],
      body: detallesData,
      startY: 80,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
    });
    // @ts-ignore
    const finalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(14);
    doc.text(
      `Total: $${parseFloat(ingresoCompleto.total).toFixed(2)}`,
      150,
      finalY,
      { align: "right" }
    );

    // Pie de página
    doc.setFontSize(10);
    doc.text(
      "Este documento es un comprobante de ingreso de productos.",
      105,
      270,
      { align: "center" }
    );

    // Guardar PDF
    doc.save(`ingreso_${ingresoCompleto.id}.pdf`);

    toast.success("PDF generado correctamente");
  } catch (error) {
    console.error("Error al generar PDF del ingreso:", error);
    toast.error("Error al generar el PDF");
  }
};

// Ciclo de vida
onMounted(() => {
  cargarIngresos();
});
</script>
