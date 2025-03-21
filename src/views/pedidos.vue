<template>
  <div class="h-full flex flex-col overflow-hidden dark:bg-gray-900">
    <CrearEditarPedido
      :mostrar="mostrarModalCrearEditar"
      :pedido="pedidoAgregar"
      @cerrar="mostrarModalCrearEditar = false"
      @guardar="guardarPedido"
    />

    <EliminarPedido
      :mostrar="mostrarModalEliminar"
      :pedido="pedidoEliminar"
      @cerrar="mostrarModalEliminar = false"
      @confirmar="eliminarPedido"
    />

    <DetallePedido
      :mostrar="mostrarModalDetalle"
      :pedido="pedidoDetalle"
      @cerrar="mostrarModalDetalle = false"
    />

    <!-- Encabezado con título y buscador -->
    <div class="bg-gradient-to-r bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-100 flex items-center">
          Pedidos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-2 text-red-500 dark:text-red-400"
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
        </h1>

        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <!-- Buscador con icono -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por mesero o # pedido..."
              class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none pl-10 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              @input="buscarPedidos"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 dark:text-red-400"
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

          <!-- Botón para crear nuevo pedido -->
          <button
            @click="crearNuevoPedido"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition flex items-center gap-2"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Nuevo Pedido</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor principal para pedidos activos y concluidos -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Pedidos Activos (3/4 del ancho) -->
      <div class="lg:w-3/4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold mb-4 dark:text-gray-100">Pedidos Activos</h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[calc(100vh-220px)] overflow-y-auto"
          >
            <div
              v-for="pedido in pedidosFiltrados"
              :key="pedido.id"
              class="rounded-lg shadow-md p-3 border-l-4 hover:shadow-lg transition text-sm flex flex-col h-full"
              :class="
                pedido.para_llevar
                  ? 'bg-sky-50 dark:bg-sky-900/30 border-sky-700 dark:border-sky-500'
                  : 'bg-white dark:bg-gray-700 border-red-600 dark:border-red-500 text-black dark:text-white'
              "
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-base font-semibold dark:text-gray-100">
                    Pedido #{{ pedido.num_pedido_dia || pedido.id }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <div
                      v-if="!pedido.para_llevar"
                      class="bg-red-600 text-white text-sm text-center py-1 px-2 rounded-md font-medium"
                    >
                      {{
                        pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Sin mesa"
                      }}
                    </div>
                    <div
                      v-if="pedido.para_llevar"
                      class="bg-sky-600 text-white text-sm text-center py-1 px-2 rounded-md font-medium"
                    >
                      {{ "Para Llevar" }}
                    </div>
                  </div>
                  <div
                    v-if="
                      pedidosHijos[pedido.id] &&
                      pedidosHijos[pedido.id].length > 0
                    "
                    class="mt-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                    {{ pedidosHijos[pedido.id].length }} pedido(s) agregado(s)
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <span
                    :class="
                      pedido.para_llevar
                        ? 'bg-sky-200 text-sky-800 dark:bg-sky-800 dark:text-sky-100'
                        : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'
                    "
                    class="px-2 py-1 rounded-md font-medium"
                  >
                    {{ getEstadoEtiqueta(pedido.estado) }}
                  </span>
                  <span class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {{ formatearFecha(pedido.fecha_creacion) }}
                  </span>
                </div>
              </div>

              <div class="flex justify-between mt-2">
                <span class="text-gray-600 dark:text-gray-300"
                  >Mesero: {{ pedido.mesera.nombre }}</span
                >
                <span class="font-medium text-gray-800 dark:text-gray-200"
                  >${{ pedido.total }}</span
                >
              </div>
              <div
                class="mt-auto flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600"
              >
                <button
                  v-if="!pedido.para_llevar"
                  @click="agregarAPedido(pedido)"
                  class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center text-xs font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
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
                  Agregar
                </button>
                <div class="flex gap-2">
                  <button
                    @click="confirmarCompletarPedido(pedido)"
                    class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center text-xs font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Completar
                  </button>
                  <button
                    @click="verDetalle(pedido)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-xs font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
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
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pedidos Concluidos (1/4 del ancho) -->
      <div class="lg:w-1/4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full">
          <h2 class="text-lg font-semibold mb-4 dark:text-gray-100">Pedidos Completados Hoy</h2>
          <div
            class="overflow-x-auto max-h-[calc(100vh-220px)] overflow-y-auto"
          >
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th
                    class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    N°
                  </th>
                  <th
                    class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Mesa
                  </th>
                  <th
                    class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="pedido in pedidosConcluidos" :key="pedido.id" class="dark:hover:bg-gray-700">
                  <td class="px-2 py-3 whitespace-nowrap">
                    <span
                      class="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-bold"
                    >
                      {{ pedido.num_pedido_dia || pedido.id }}
                    </span>
                  </td>
                  <td class="px-2 py-3 whitespace-nowrap text-xs dark:text-gray-300">
                    {{
                      pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Sin mesa"
                    }}
                  </td>
                  <td class="px-2 py-3 whitespace-nowrap font-medium text-xs dark:text-gray-300">
                    ${{ pedido.total }}
                  </td>
                  <td class="px-2 py-3 whitespace-nowrap text-center">
                    <div class="flex justify-center gap-1">
                      <button
                        @click="imprimirTicketIndividual(pedido)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="Imprimir ticket"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="verDetalle(pedido)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="Ver detalles"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
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
                    </div>
                  </td>
                </tr>
                <tr v-if="pedidosConcluidos.length === 0">
                  <td
                    colspan="4"
                    class="px-2 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No hay pedidos completados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal de confirmación para completar pedido -->
    <div
      v-if="mostrarModalConfirmacion && pedidoACompletar"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Confirmar acción</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas marcar como completado el pedido
            <span class="font-bold">
              #{{
                pedidoACompletar.num_pedido_dia || pedidoACompletar.id
              }} </span
            >?
            <br />
            <span class="text-sm">Esta acción no se puede deshacer.</span>
          </p>
          <div class="flex justify-center gap-3">
            <button
              @click="mostrarModalConfirmacion = false"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              @click="cambiarEstadoPedido"
              class="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CrearEditarPedido from "../components/Pedidos/CrearEditarPedido.vue";
import EliminarPedido from "../components/Pedidos/EliminarPedido.vue";
import DetallePedido from "../components/Pedidos/DetallePedido.vue";
import { EstadoPedido } from "../../electron/main/modules/interfaces";
import { useRoute } from "vue-router";
import { cargarMesasLibresApi, useMesaStore } from "../stores/useMesaStore";
import { TipoPago } from "../../electron/main/modules/enums";
import { useToast } from "vue-toastification";
const toast = useToast();
const mesaStore = useMesaStore();

const route = useRoute();
// Interfaces
interface DetallePedido {
  id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  eliminado?: boolean;
  producto?: {
    id: number;
    nombre: string;
    imagen_url?: string;
    maneja_stock: boolean;
  };
}

interface Pedido {
  id: number;
  pedido_padre_id?: number | null;
  tipo_pago?: TipoPago;
  para_llevar: boolean;
  mesa_id?: number | null;
  mesera_id: number;
  cajero_id: number;
  num_pedido_dia?: number | null;
  estado?: string;
  fecha_creacion: string;
  fecha_concluido?: string | null;
  total?: number | string;
  eliminado?: boolean;
  mesa?: {
    id: number;
    numero: number;
  };
  mesera: {
    id: number;
    nombre: string;
  };
  cajero: {
    id: number;
    nombre: string;
  };
  detalles: DetallePedido[];
}

interface Mesa {
  id: number;
  numero: number;
  estado?: string;
}

// Estado
const pedidos = ref<Pedido[]>([]);
const mesas = ref<Mesa[]>([]);
const searchQuery = ref("");
const mostrarModalCrearEditar = ref(false);
const mostrarModalEliminar = ref(false);
const mostrarModalDetalle = ref(false);
const pedidoAgregar = ref<Pedido | null>(null);
const pedidoEliminar = ref<Pedido | null>(null);
const pedidoDetalle = ref<Pedido | null>(null);
const pedidosHijos = ref<{ [key: number]: Pedido[] }>({});
// Estado para el modal de confirmación
const mostrarModalConfirmacion = ref(false);
const pedidoACompletar = ref<Pedido | null>(null);

// Método para mostrar el modal de confirmación
const confirmarCompletarPedido = (pedido: Pedido) => {
  pedidoACompletar.value = pedido;
  mostrarModalConfirmacion.value = true;
};

const pedidosConcluidos = computed(() => {
  // Obtener la fecha de hoy (inicio del día)
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
  // Obtener fin del día de hoy
  const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
  return pedidos.value
    .filter((p) => {
      // Verificar que el pedido esté completado y tenga fecha de conclusión
      if (p.estado !== EstadoPedido.COMPLETADO || !p.fecha_concluido) {
        return false;
      }
      // Crear fecha de conclusión respetando la zona horaria
      const fechaConcluido = new Date(p.fecha_concluido);     
      // Verificar si la fecha de conclusión está dentro del día de hoy
      return fechaConcluido >= inicioHoy && fechaConcluido <= finHoy;
    })
    .sort(
      (a, b) =>
        new Date(b.fecha_concluido!).getTime() -
        new Date(a.fecha_concluido!).getTime()
    );
});

const pedidosActivos = computed(() =>
  pedidos.value.filter(
    (p) => p.estado === EstadoPedido.EN_PREPARACION && !p.pedido_padre_id
  )
);

const pedidosFiltrados = computed(() => {
  if (!searchQuery.value) return pedidosActivos.value;
  const query = searchQuery.value.toLowerCase();
  return pedidosActivos.value.filter(
    (p) =>
      p.mesera.nombre.toLowerCase().includes(query) ||
      p.num_pedido_dia?.toString().includes(query) ||
      p.id.toString().includes(query) ||
      p.mesa?.numero.toString().includes(query) // Filtrar por número de mesa
  );
});

// Métodos
const cargarPedidos = async () => {
  try {
    // Carga desde API
    if (window.api && window.api.getPedidos) {
      const data = await window.api.getPedidos();      
      pedidos.value = data || [];
      cargarPedidosHijos();
    }
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    pedidos.value = [];
  }
};

const cargarPedidosHijos = () => {
  // Agrupar pedidos hijos por pedido padre
  const hijos: { [key: number]: Pedido[] } = {};

  pedidos.value.forEach((pedido) => {
    if (pedido.pedido_padre_id) {
      if (!hijos[pedido.pedido_padre_id]) {
        hijos[pedido.pedido_padre_id] = [];
      }
      hijos[pedido.pedido_padre_id].push(pedido);
    }
  });
  pedidosHijos.value = hijos;
};

const cargarMesas = async () => {
  try {
    if (window.api && window.api.getMesas) {
      const data = await window.api.getMesas();
      mesas.value = data || [];
    }
  } catch (error) {
    console.error("Error al cargar mesas:", error);
    mesas.value = [];
  }
};

const buscarPedidos = () => {
  // La búsqueda se realiza automáticamente a través del computed pedidosFiltrados
};

const crearNuevoPedido = async () => {
  const data = await cargarMesasLibresApi();
  mesaStore.setMesas(data);
  pedidoAgregar.value = {
    id: 0,
    mesa_id: null,
    mesera_id: 0,
    cajero_id: 0,
    para_llevar: false,
    estado: EstadoPedido.EN_PREPARACION,
    fecha_creacion: new Date().toISOString(),
    mesera: { id: 0, nombre: "" },
    cajero: { id: 0, nombre: "" },
    detalles: [],
    total: 0,
  };
  mostrarModalCrearEditar.value = true;
};

const agregarAPedido = async (pedido: Pedido) => {
  const data = await cargarMesasLibresApi();
  mesaStore.setMesas(data);
  pedidoAgregar.value = {
    id: pedido.id,
    pedido_padre_id: pedido.id,
    mesa_id: pedido.mesa?.id,
    mesera_id: pedido.mesera.id,
    cajero_id: pedido.cajero.id,
    tipo_pago: pedido.tipo_pago,
    num_pedido_dia: pedido.num_pedido_dia,
    para_llevar: pedido.para_llevar,
    estado: EstadoPedido.EN_PREPARACION,
    fecha_creacion: new Date().toISOString(),
    mesera: { ...pedido.mesera },
    cajero: { ...pedido.cajero },
    mesa: pedido.mesa ? { ...pedido.mesa } : undefined,
    detalles: [],
    total: 0,
  };
  mostrarModalCrearEditar.value = true;
};

const verDetalle = (pedido: Pedido) => {
  pedidoDetalle.value = pedido;
  mostrarModalDetalle.value = true;
};

const mostrarToastMensaje = (mensaje: string) => {
  toast.success(mensaje);
};

const guardarPedido = () => {
  cargarPedidos();
  //mostrarModalCrearEditar.value = false;
  mostrarToastMensaje(
    pedidoAgregar.value?.id
      ? "Pedido agregado con éxito!"
      : "Pedido creado con éxito!"
  );
};

const eliminarPedido = () => {
  mostrarToastMensaje("Pedido eliminado con éxito!");
  cargarPedidos();
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
  });
};

const getEstadoEtiqueta = (estado?: string) => {
  const estados: { [key: string]: string } = {
    "EN PREPARACION": "En Preparación",
    COMPLETADO: "Completado",
  };
  return estados[estado || ""] || estado || "";
};


const cambiarEstadoPedido = async () => {
  try {
    if (!pedidoACompletar.value) return;

    const result = await window.api.cambiarEstadoPedido(
      pedidoACompletar.value.id,
      EstadoPedido.COMPLETADO
    );

    if (result.success) {
      mostrarToastMensaje("Pedido completado con éxito!");
      cargarPedidos();
      // Cerrar el modal después de completar
      mostrarModalConfirmacion.value = false;
      pedidoACompletar.value = null;
    } else {
      throw new Error(result.message || "Error al completar el pedido");
    }
  } catch (error: any) {
    console.error("Error al completar pedido:", error);
    mostrarToastMensaje("Error al completar el pedido: " + error.message);
    // Cerrar el modal en caso de error
    mostrarModalConfirmacion.value = false;
    pedidoACompletar.value = null;
  }
};

const imprimirTicketIndividual = (pedido: Pedido) => {
  try {
    // Crear contenido del ticket
    const ticketContent = document.createElement("div");
    ticketContent.innerHTML = `
        <div class="text-center mb-4">
          <p class="font-bold text-lg">RESTAURANTE EJEMPLO</p>
          <p>Dirección: Calle Principal #123</p>
          <p>Tel: (123) 456-7890</p>
        </div>
        
        <div class="mb-4">
          <p>TICKET #: ${pedido.num_pedido_dia || pedido.id}</p>
          <p>Fecha: ${formatearFecha(pedido.fecha_creacion)}</p>
          <p>Mesero: ${pedido.mesera.nombre}</p>
          <p>Cajero: ${pedido.cajero.nombre}</p>
          ${pedido.mesa ? `<p>Mesa: ${pedido.mesa.numero}</p>` : ""}
          <p>Tipo de pago: ${pedido.tipo_pago || "No especificado"}</p>
          <p>Estado: ${getEstadoEtiqueta(pedido.estado)}</p>
        </div>
        
        <div class="border-t border-b border-gray-300 py-2 mb-4">
          <div class="grid grid-cols-12 font-bold">
            <div class="col-span-6">Producto</div>
            <div class="col-span-2 text-center">Cant</div>
            <div class="col-span-4 text-right">Precio</div>
          </div>
        </div>
        
        <div class="mb-4">
          ${pedido.detalles
            .map(
              (detalle) => `
            <div class="grid grid-cols-12 mb-1">
              <div class="col-span-6 truncate">${detalle.producto?.nombre}</div>
              <div class="col-span-2 text-center">${detalle.cantidad}</div>
              <div class="col-span-4 text-right">$${(
                detalle.cantidad *
                parseFloat(detalle.precio_unitario.toString())
              ).toFixed(2)}</div>
            </div>
          `
            )
            .join("")}
        </div>
        
        <div class="border-t border-gray-300 pt-2 mb-4">
          <div class="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>$${pedido.total}</span>
          </div>
        </div>
        
        <div class="text-center mt-6">
          <p>¡Gracias por su preferencia!</p>
        </div>
      `;

    // Crear un iframe para imprimir
    const printIframe = document.createElement("iframe");
    printIframe.style.position = "absolute";
    printIframe.style.top = "-9999px";
    document.body.appendChild(printIframe);

    // Escribir el contenido en el iframe
    const printDocument =
      printIframe.contentDocument || printIframe.contentWindow?.document;
    if (printDocument) {
      printDocument.open();
      printDocument.write(`
          <html>
            <head>
              <title>Ticket de Pedido</title>
              <style>
                body {
                  font-family: monospace;
                  font-size: 12px;
                  width: 80mm;
                  margin: 0;
                  padding: 10px;
                }
                .text-center { text-align: center; }
                .mb-4 { margin-bottom: 16px; }
                .font-bold { font-weight: bold; }
                .text-lg { font-size: 16px; }
                .border-t, .border-b { border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; }
                .py-2 { padding-top: 8px; padding-bottom: 8px; }
                .grid { display: grid; }
                .grid-cols-12 { grid-template-columns:
                .grid { display: grid; }
                .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
                .col-span-6 { grid-column: span 6 / span 6; }
                .col-span-2 { grid-column: span 2 / span 2; }
                .col-span-4 { grid-column: span 4 / span 4; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .mb-1 { margin-bottom: 4px; }
                .pt-2 { padding-top: 8px; }
                .mt-6 { margin-top: 24px; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
              </style>
            </head>
            <body>
              ${ticketContent.innerHTML}
            </body>
          </html>
        `);
      printDocument.close();

      // Imprimir y eliminar el iframe
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();

      // Eliminar el iframe después de imprimir
      setTimeout(() => {
        document.body.removeChild(printIframe);
      }, 500);
    }
  } catch (error) {
    console.error("Error al imprimir ticket:", error);
    mostrarToastMensaje("Error al imprimir el ticket");
  }
};

// Ciclo de vida
onMounted(() => {
  cargarPedidos();
  cargarMesas();
  if (route.query.ejecutarMetodo === "true") {
    crearNuevoPedido();
  }
});

// Estilos para la animación del toast
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
  .animate-fade-in-out {
    animation: fadeInOut 3s ease-in-out;
  }
  `;
document.head.appendChild(style);
</script>

