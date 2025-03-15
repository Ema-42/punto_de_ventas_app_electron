<template>
  <div class="h-full flex flex-col">
    <!-- Header con Reloj y Filtros -->
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-2 bg-gradient-to-r bg-gray-100 p-3 rounded-lg shadow-md"
    >
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-gray-700">Pagina Inicial</h1>
        <div
          class="bg-gray-700 text-2xl md:text-2xl font-mono font-bold text-white px-2 rounded-lg shadow-lg inline-block border border-gray-700 tracking-widest tabular-nums backdrop-blur-sm"
        >
          {{ currentTime }}
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="relative">
          <input
            type="date"
            v-model="selectedDate"
            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
          />
        </div>
        <button
          @click="NuevoPedido"
          class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Nuevo Pedido
        </button>
      </div>
    </div>

    <!-- Contenedor principal con flex-1 para ocupar el espacio restante -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3 min-h-0">
      <!-- Columna izquierda: Estadísticas -->
      <div class="col-span-1 flex flex-col gap-3">
        <!-- Pedidos de Hoy -->
        <div
          class="bg-sky-100 p-3 rounded-lg shadow-md border-l-4 border-l-sky-500 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-gray-700 text-sm font-medium mb-2">Pedidos de Hoy</h3>
          <div class="flex justify-between flex-col items-center">
            <div class="text-3xl font-bold text-sky-700 mb-2">
              {{ totalPedidos }}
            </div>
            <div class="flex gap-3">
              <div class="bg-sky-200 px-3 py-1 rounded-lg">
                <div class="text-gray-600 text-sm font-medium">
                  {{ cantidadPedidosCompletados }} Completados
                </div>
              </div>
              <div class="bg-yellow-100 px-3 py-1 rounded-lg">
                <div class="text-gray-600 text-sm font-medium">
                  {{ cantidadPedidosEnPreparacion }} En Preparación.
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Ingresos del Día -->
        <div
          class="bg-emerald-100 p-3 rounded-lg shadow-md border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-gray-700 text-sm font-medium mb-2">
            Ingresos del Día
          </h3>
          <div class="flex flex-col items-center">
            <div class="text-3xl font-bold text-green-800 mb-2">
              {{ totalIngresosDelDia }} Bs.
            </div>
          </div>
        </div>

        <!-- Meseros -->
        <div
          class="bg-amber-50 p-3 rounded-lg shadow-md border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-gray-700 text-sm font-medium mb-2">
            Meseras, En orden de disponibilidad
          </h3>
          <div class="space-y-2 overflow-y-auto">
            <div
              v-for="mesero in meseros"
              :key="mesero.id"
              class="flex justify-between items-center p-2 bg-amber-100 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-700">
                  👩🏻 {{ mesero.nombre }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                <span class="font-medium text-gray-700">{{
                  mesero.mesasAsignadas
                }}</span>
                mesas /
                <span class="font-medium text-gray-700">{{
                  mesero.mesasAtendidas
                }}</span>
                atendidas
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna central y derecha: Gráficos, Productos y Mesas -->
      <div class="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3">
        <!-- Gráfico de Ventas del Día -->
        <div
          class="lg:col-span-2 bg-white p-3 rounded-lg shadow-md flex flex-col lg:mr-4"
        >
          <h3 class="text-gray-700 font-semibold mb-2">Ventas del Día</h3>
          <div class="flex-1 min-h-0">
            <canvas ref="ventasDiaChart" class="min-h-96"></canvas>
          </div>
        </div>

        <!-- Vista de Mesas -->
        <div
          class="mt-4 lg:mt-0 lg:col-span-1 bg-gray-50 p-3 rounded-lg shadow-md border-l-4 border-l-gray-400 hover:shadow-lg transition-shadow flex flex-col overflow-y-auto"
        >
          <h3 class="text-gray-700 font-semibold mb-2">Vista de Mesas</h3>

          <!-- Resumen de estado de mesas -->
          <div class="flex justify-between mb-3 text-sm">
            <div class="px-2 py-1 bg-green-100 rounded text-green-700">
              {{ mesasEstados.libres.length }} Libres
            </div>
            <div class="px-2 py-1 bg-red-100 rounded text-red-700">
              {{ mesasEstados.ocupadas.length }} Ocupadas
            </div>
            <div class="px-2 py-1 bg-yellow-100 rounded text-yellow-700">
              {{ mesasEstados.reservadas.length }} Reservadas
            </div>
            <div class="px-2 py-1 bg-gray-200 rounded text-gray-700">
              {{ mesasEstados.mantenimiento.length }} Mantenimiento
            </div>
          </div>

          <div class="grid grid-cols-6 gap-2 overflow-y-auto flex-1">
            <div
              v-for="mesa in mesas"
              :key="mesa.numero"
              :class="[
                'p-2 rounded-lg text-center cursor-pointer transition-colors',
                mesa.estado === EstadosMesa.LIBRE
                  ? 'border border-green-300 bg-green-100 hover:bg-green-200'
                  : mesa.estado === EstadosMesa.OCUPADA
                  ? 'border border-red-300 bg-red-100 hover:bg-red-200'
                  : mesa.estado === EstadosMesa.MANTENIMIENTO
                  ? 'border border-gray-300 bg-gray-200 hover:bg-gray-300'
                  : 'border border-yellow-300 bg-yellow-100 hover:bg-yellow-200',
              ]"
            >
              <div
                class="font-medium text-lg"
                :class="[
                  mesa.estado === EstadosMesa.LIBRE
                    ? 'text-green-700'
                    : mesa.estado === EstadosMesa.OCUPADA
                    ? 'text-red-700'
                    : mesa.estado === EstadosMesa.MANTENIMIENTO
                    ? 'text-gray-700'
                    : 'text-yellow-700',
                ]"
              >
                {{ mesa.numero }}
              </div>
            </div>
          </div>
        </div>

        <!-- Productos Más Vendidos -->
        <div
          class="col-span-1 lg:col-span-6 grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4"
        >
          <div class="col-span-1">
            <div class="bg-violet-100 p-3 rounded-lg shadow-md border-l-4 border-l-violet-400 hover:shadow-lg transition-shadow">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-gray-700 font-semibold">
                  Productos Más Vendidos Hoy
                </h3>
                <div class="flex space-x-1">
                  <button
                    v-for="categoria in categorias"
                    :key="categoria.id"
                    @click="categoriaSeleccionada = categoria.id"
                    :class="[
                      'px-3 py-1 text-xs rounded-md transition-colors',
                      categoriaSeleccionada === categoria.id
                        ? 'bg-violet-900 bg-opacity-70 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200',
                    ]"
                  >
                    {{ categoria.nombre }}
                  </button>
                  <button
                    @click="categoriaSeleccionada = null"
                    :class="[
                      'px-3 py-1 text-xs rounded-md transition-colors',
                      categoriaSeleccionada === null
                        ? 'bg-violet-900 bg-opacity-70 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200',
                    ]"
                  >
                    Todos
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                <div
                  v-for="producto in productosFiltrados"
                  :key="producto.id"
                  class="flex items-center p-2 h-14 bg-violet-950 bg-opacity-10 rounded-lg"
                >
                  <div
                    class="w-10 h-10 bg-violet-950 bg-opacity-40 rounded-lg flex items-center justify-center mr-3"
                  >
                    <span class="text-white font-semibold">{{
                      producto.ranking
                    }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-700 truncate">
                      {{ producto.nombre }}
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500"
                        >{{ producto.cantidad }} uds.</span
                      >
                      <span class="text-gray-500">{{
                        getCategoriaName(producto.categoriaId)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-1 mt-2 lg:mt-0  mb-5 lg:mb-0">
            <div class="p-3 rounded-lg shadow-md bg-red-100 border-l-4 border-l-red-400 hover:shadow-lg transition-shadow">
              <h3 class="text-gray-700 text-sm font-medium mb-2">
                Alertas de Productos con Stock
              </h3>
              <div class="flex flex-col gap-2 overflow-y-auto lg:h-56">
                <div class="text-2xl font-bold text- mb-1 text-gray-700">
                  {{ productosStockBajo.length }} productos
                </div>
                <div class="overflow-y-auto pr-2">
                  <div
                    v-for="producto in productosStockBajo"
                    :key="producto.id"
                    class="flex justify-between items-center p-2 bg-red-200 bg-opacity-60 rounded-lg mb-1"
                  >
                    <span class="text-sm text-gray-700">{{
                      producto.nombre
                    }}</span>
                    <span class="text-sm font-medium text-red-600"
                      >{{ producto.stock }} uds.</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from "vue";
import Chart from "chart.js/auto";
import { EstadosMesa } from "../../electron/main/modules/enums";
import { format } from "date-fns";
import { EstadoPedido } from "../../electron/main/modules/interfaces";
import router from "../router";

const mesas = ref<Mesa[]>([]);
const meseros = ref<MeseroAtencion[]>([]);
const pedidos = ref<Pedido[]>([]);
const pedidosHoy = ref<Pedido[]>([]);
const cantidadPedidosEnPreparacion = ref(0);
const cantidadPedidosCompletados = ref(0);
const totalPedidos = ref(0);
const CantidadPedidosPorHora = ref([0]);
const productosStockBajo = ref<ProductoStock[]>([]);

// Interfaces
interface Mesa {
  numero: number;
  estado: EstadosMesa;
}

interface ProductoStock {
  id: number;
  nombre: string;
  stock: number;
  maneja_stock: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface ProductoVendido {
  id: number;
  nombre: string;
  cantidad: number;
  ranking: number;
  categoriaId: number;
}

interface Pedido {
  id: number;
  estado: string;
  eliminado: boolean;
  fecha_creacion: string;
  total: string;
  mesera?: { id: number };
}

interface MeseroAtencion {
  id: number;
  nombre: string;
  mesasAsignadas: number;
  mesasAtendidas: number;
}

// Estado
const currentTime = ref<string>(new Date().toLocaleTimeString());
const selectedDate = ref<string>(new Date().toISOString().split("T")[0]);
const ventasDiaChart = ref<HTMLCanvasElement | null>(null);
let ventasDiaChartInstance: Chart | null = null;
let relojInterval: NodeJS.Timeout;
const categoriaSeleccionada = ref<number | null>(null);

const getProductosStockBajo = async () => {
  const data = await window.api.getProductos();

  // Filtrar solo los productos que tienen maneja_stock igual a true
  const productosFiltrados = data.filter(
    (producto: ProductoStock) => producto.maneja_stock === true
  );
  // Ordenar los productos filtrados de menor a mayor según la propiedad stock
  productosStockBajo.value = productosFiltrados.sort(
    (a: ProductoStock, b: ProductoStock) => a.stock - b.stock
  );

  console.log(productosStockBajo.value);
};

// Datos para categorías
const categorias = ref<Categoria[]>([
  { id: 1, nombre: "Hamburguesas" },
  { id: 2, nombre: "Bebidas" },
]);

// Datos para productos más vendidos
const productosVendidos = ref<ProductoVendido[]>([
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    cantidad: 45,
    ranking: 1,
    categoriaId: 1,
  },
  { id: 2, nombre: "Refresco Cola", cantidad: 38, ranking: 2, categoriaId: 2 },
  {
    id: 4,
    nombre: "Hamburguesa Doble",
    cantidad: 32,
    ranking: 4,
    categoriaId: 1,
  },
  { id: 8, nombre: "Agua Mineral", cantidad: 20, ranking: 8, categoriaId: 2 },
]);

// Productos filtrados por categoría
const productosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === null) {
    return productosVendidos.value;
  }
  return productosVendidos.value.filter(
    (producto) => producto.categoriaId === categoriaSeleccionada.value
  );
});

// Métodos
const actualizarReloj = (): void => {
  currentTime.value = new Date().toLocaleTimeString();
};

const NuevoPedido = (): void => {
  router.push({ path: "/pedidos", query: { ejecutarMetodo: "true" } });
};

const getCategoriaName = (categoriaId: number): string => {
  const categoria = categorias.value.find((cat) => cat.id === categoriaId);
  return categoria ? categoria.nombre : "";
};

// Inicializar gráficos
const inicializarGraficos = (): void => {
  // Gráfico de ventas del día
  const inicializarGraficoDiario = (): void => {
    const canvas = ventasDiaChart.value;
    if (!canvas) return;

    if (ventasDiaChartInstance) {
      ventasDiaChartInstance.destroy();
    }

    ventasDiaChartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels: [
          "8am",
          "9am",
          "10am",
          "11am",
          "12pm",
          "1pm",
          "2pm",
          "3pm",
          "4pm",
          "5pm",
          "6pm",
          "7pm",
          "8pm",
          "9pm",
        ],
        datasets: [
          {
            label: "Ventas del Día",
            data: CantidadPedidosPorHora.value,
            backgroundColor: "#DC2626", // Cambiado a rojo para mantener consistencia
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  inicializarGraficoDiario();
};

const setCantidadPedidosPorHora = async () => {
  const pedidosHoy = await getPedidosHoy();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  CantidadPedidosPorHora.value = Array(14).fill(0);

  // Filtrar pedidos con estado válido y que sean de hoy
  const pedidosFiltrados = pedidosHoy.filter((pedido: any) => {
    const fechaPedido = new Date(pedido.fecha_creacion);
    fechaPedido.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha

    return (
      (pedido.estado === EstadoPedido.EN_PREPARACION ||
        pedido.estado === EstadoPedido.COMPLETADO) &&
      fechaPedido.getTime() === hoy.getTime()
    );
  });

  pedidosFiltrados.forEach((pedido) => {
    const horaPedido = new Date(pedido.fecha_creacion).getHours(); // Obtener la hora (0-23)
    const index = horaPedido - 8; // Ajustar al índice del array (8 AM es índice 0)

    if (index >= 0 && index < 14) {
      CantidadPedidosPorHora.value[index]++;
    }
  });
};

const mesasEstados = reactive({
  libres: [] as Mesa[],
  ocupadas: [] as Mesa[],
  reservadas: [] as Mesa[],
  mantenimiento: [] as Mesa[],
});

const getMesas = async () => {
  try {
    const data = await window.api.getMesas();
    mesas.value = data;
    // Resetear estados
    Object.keys(mesasEstados).forEach((key) => {
      mesasEstados[key as keyof typeof mesasEstados] = [];
    });
    data.forEach((mesa: Mesa) => {
      switch (mesa.estado) {
        case EstadosMesa.LIBRE:
          mesasEstados.libres.push(mesa);
          break;
        case EstadosMesa.OCUPADA:
          mesasEstados.ocupadas.push(mesa);
          break;
        case EstadosMesa.RESERVADA:
          mesasEstados.reservadas.push(mesa);
          break;
        case EstadosMesa.MANTENIMIENTO:
          mesasEstados.mantenimiento.push(mesa);
          break;
      }
    });
  } catch (error) {
    console.error("Error obteniendo mesas:", error);
  }
};

const getPedidosHoy = async () => {
  const data: Pedido[] = await window.api.getPedidos();
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = format(new Date(), "yyyy-MM-dd");
  // Filtrar los pedidos que sean del día de hoy y no estén eliminados
  pedidos.value = data.filter(
    (pedido) =>
      format(new Date(pedido.fecha_creacion), "yyyy-MM-dd") === today &&
      !pedido.eliminado
  );
  return pedidos.value;
};

const getMeserosConPedidos = async () => {
  meseros.value = await window.api.getMeseroMasLibre();
};

const totalIngresosDelDia = ref("0.00");

const getPedidos = async () => {
  pedidosHoy.value = await getPedidosHoy();

  // Total de pedidos del día
  totalPedidos.value = pedidosHoy.value.length;

  // Cantidad de pedidos en preparación
  cantidadPedidosEnPreparacion.value = pedidosHoy.value.filter(
    (pedido) => pedido.estado === EstadoPedido.EN_PREPARACION
  ).length;

  cantidadPedidosCompletados.value = pedidosHoy.value.filter(
    (pedido) => pedido.estado === EstadoPedido.COMPLETADO
  ).length;

  // Calcular el total de ingresos del día sumando 'total' de cada pedido
  const totalIngresos = pedidosHoy.value.reduce(
    (sum, pedido) => sum + (Number(pedido.total) || 0),
    0
  );
  totalIngresosDelDia.value = totalIngresos.toFixed(2);
};

onMounted(async () => {
  setCantidadPedidosPorHora();
  getMeserosConPedidos();
  getMesas();
  getPedidos();
  getProductosStockBajo();
  relojInterval = setInterval(actualizarReloj, 1000);
  setTimeout(() => {
    inicializarGraficos();
  }, 100);
});

onUnmounted(() => {
  if (relojInterval) {
    clearInterval(relojInterval);
  }
  if (ventasDiaChartInstance) {
    ventasDiaChartInstance.destroy();
  }
});
</script>
