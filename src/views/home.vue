<template>
  <div class="space-y-4">
    <!-- Header con Reloj y Filtros -->
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r bg-gray-100 p-4 rounded-lg shadow-md"
    >
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-gray-700">Dashboard</h1>
        <div class="text-xl font-semibold text-red-600">{{ currentTime }}</div>
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
          @click="abrirModalNuevoPedido"
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

    <!-- Grid de Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Pedidos de Hoy -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-gray-500 text-sm font-medium mb-3">Pedidos de Hoy</h3>
        <div class="flex justify-between items-start">
          <div class="text-2xl font-bold text-gray-700">
            {{ estadisticas.pedidosHoy.total }}
          </div>
          <div class="flex flex-col gap-2 w-32">
            <div class="bg-green-100 px-3 py-2 rounded-lg">
              <div class="text-green-600 text-sm font-medium">
                {{ estadisticas.pedidosHoy.entregados }} Entregados
              </div>
            </div>
            <div class="bg-yellow-100 px-3 py-2 rounded-lg">
              <div class="text-yellow-600 text-sm font-medium">
                {{ estadisticas.pedidosHoy.enPreparacion }} En Prep.
              </div>
            </div>
            <div class="bg-red-100 px-3 py-2 rounded-lg">
              <div class="text-red-600 text-sm font-medium">
                {{ estadisticas.pedidosHoy.pendientes }} Pendientes
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ingresos del Día -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-gray-500 text-sm font-medium mb-3">Ingresos del Día</h3>
        <div class="flex flex-col items-center">
          <div class="text-3xl font-bold text-gray-700 mb-2">
            ${{ estadisticas.ingresosDia.toFixed(2) }}
          </div>
          <div
            class="px-4 py-2 rounded-lg w-full text-center"
            :class="
              estadisticas.tendenciaDia >= 0 ? 'bg-green-100' : 'bg-red-100'
            "
          >
            <span
              class="text-base font-medium"
              :class="
                estadisticas.tendenciaDia >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              <span v-if="estadisticas.tendenciaDia >= 0">↑</span>
              <span v-else>↓</span>
              {{ Math.abs(estadisticas.tendenciaDia) }}% vs ayer
            </span>
          </div>
        </div>
      </div>

      <!-- Estado de Mesas -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-gray-500 text-sm font-medium mb-3">Estado de Mesas</h3>
        <div class="flex justify-between items-start">
          <div class="text-2xl font-bold text-gray-700">
            {{ estadisticas.mesas.ocupadas }}/{{ estadisticas.mesas.total }}
          </div>
          <div class="flex flex-col gap-2 w-32">
            <div class="bg-green-100 px-3 py-2 rounded-lg">
              <div class="text-green-600 text-sm font-medium">
                {{ estadisticas.mesas.disponibles }} Libres
              </div>
            </div>
            <div class="bg-red-100 px-3 py-2 rounded-lg">
              <div class="text-red-600 text-sm font-medium">
                {{ estadisticas.mesas.ocupadas }} Ocupadas
              </div>
            </div>
            <div class="bg-yellow-100 px-3 py-2 rounded-lg">
              <div class="text-yellow-600 text-sm font-medium">
                {{ estadisticas.mesas.reservadas }} Reservadas
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertas de Stock -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-gray-500 text-sm font-medium mb-3">Alertas de Stock</h3>
        <div class="flex flex-col gap-2">
          <div class="text-2xl font-bold text-red-600 mb-2">
            {{ productosStockBajo.length }} productos
          </div>
          <div class="overflow-y-auto max-h-[120px] pr-2">
            <div
              v-for="producto in productosStockBajo"
              :key="producto.id"
              class="flex justify-between items-center p-2 bg-red-50 rounded-lg mb-2"
            >
              <span class="text-sm text-gray-700">{{ producto.nombre }}</span>
              <span class="text-sm font-medium text-red-600"
                >{{ producto.stock }} uds.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos y Vista de Mesas -->
    <div class="grid grid-cols-1 lg:grid-cols-8 gap-4 ">
      <!-- Gráfico de Ventas Semanales -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-3">
        <h3 class="text-gray-700 font-semibold mb-4">Ventas de la Semana</h3>
        <canvas ref="ventasChart" class="w-full h-64"></canvas>
      </div>

      <!-- Gráfico de Ventas del Día -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-3">
        <h3 class="text-gray-700 font-semibold mb-4">Ventas del Día</h3>
        <canvas ref="ventasDiaChart" class="w-full h-64"></canvas>
      </div>

      <!-- Vista de Mesas -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-2">
        <h3 class="text-gray-700 font-semibold mb-4">Vista de Mesas</h3>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="mesa in mesas"
            :key="mesa.numero"
            :class="[
              'p-3 rounded-lg text-center cursor-pointer transition-colors',
              mesa.estado === 'LIBRE'
                ? 'bg-green-100 hover:bg-green-200'
                : mesa.estado === 'OCUPADA'
                ? 'bg-red-100 hover:bg-red-200'
                : 'bg-yellow-100 hover:bg-yellow-200',
            ]"
          >
            <div
              class="font-medium"
              :class="[
                mesa.estado === 'LIBRE'
                  ? 'text-green-700'
                  : mesa.estado === 'OCUPADA'
                  ? 'text-red-700'
                  : 'text-yellow-700',
              ]"
            >
              Mesa {{ mesa.numero }}
            </div>
            <div class="text-xs mt-1">{{ mesa.estado }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Chart from "chart.js/auto";

// Interfaces
interface Mesa {
  numero: number;
  estado: "LIBRE" | "OCUPADA" | "RESERVADA";
}

interface ProductoStock {
  id: number;
  nombre: string;
  stock: number;
}

// Estado
const currentTime = ref<string>(new Date().toLocaleTimeString());
const selectedDate = ref<string>(new Date().toISOString().split("T")[0]);
const ventasChart = ref<HTMLCanvasElement | null>(null);
const ventasDiaChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
let ventasDiaChartInstance: Chart | null = null;
let relojInterval: NodeJS.Timeout;

// Datos de ejemplo
const estadisticas = ref({
  pedidosHoy: {
    total: 45,
    entregados: 30,
    enPreparacion: 10,
    pendientes: 5,
  },
  ingresosDia: 2584.5,
  tendenciaDia: 12.5,
  mesas: {
    total: 20,
    ocupadas: 12,
    disponibles: 6,
    reservadas: 2,
  },
  alertasStock: 4,
});

const productosStockBajo = ref<ProductoStock[]>([
  { id: 1, nombre: "Papas fritas", stock: 5 },
  { id: 2, nombre: "Coca Cola 500ml", stock: 8 },
  { id: 3, nombre: "Pan de hamburguesa", stock: 10 },
  { id: 4, nombre: "Queso cheddar", stock: 7 },
  { id: 5, nombre: "Cerveza rubia", stock: 6 },
]);

const mesas = ref<Mesa[]>([
  { numero: 1, estado: "LIBRE" },
  { numero: 2, estado: "OCUPADA" },
  { numero: 3, estado: "RESERVADA" },
  { numero: 4, estado: "LIBRE" },
  { numero: 5, estado: "OCUPADA" },
  { numero: 6, estado: "LIBRE" },
  { numero: 7, estado: "OCUPADA" },
  { numero: 8, estado: "LIBRE" },
  { numero: 9, estado: "RESERVADA" },
]);

// Métodos
const actualizarReloj = (): void => {
  currentTime.value = new Date().toLocaleTimeString();
};

const abrirModalNuevoPedido = (): void => {
  console.log("Abrir modal de nuevo pedido");
};

// Inicializar gráficos
const inicializarGraficos = (): void => {
  // Gráfico de ventas semanales
  const inicializarGraficoSemanal = (): void => {
    const canvas = ventasChart.value;
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        datasets: [
          {
            label: "Ventas Semanales",
            data: [1500, 2300, 1800, 2800, 2100, 3200, 2700],
            backgroundColor: "#DC2626",
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
        labels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
        datasets: [
          {
            label: "Ventas del Día",
            data: [5, 8, 12, 15, 10, 7, 4],
            backgroundColor: "#4F46E5", // Color índigo para diferenciar
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

  inicializarGraficoSemanal();
  inicializarGraficoDiario();
};

// Ciclo de vida
onMounted(() => {
  relojInterval = setInterval(actualizarReloj, 1000);
  setTimeout(() => {
    inicializarGraficos();
  }, 100);
});

onUnmounted(() => {
  if (relojInterval) {
    clearInterval(relojInterval);
  }
  if (chartInstance) {
    chartInstance.destroy();
  }
  if (ventasDiaChartInstance) {
    ventasDiaChartInstance.destroy();
  }
});
</script>
