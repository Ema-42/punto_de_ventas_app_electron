<template>
  <div class="bg-white p-4 pt-2 rounded-lg shadow-md mb-4">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <!-- Buscador más compacto -->
      <div class="relative md:col-span-3">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Buscar por ID</label
        >
        <input
          v-model="filtrosLocales.busqueda"
          type="text"
          placeholder="Buscar por ID..."
          class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none pl-10 bg-white"
          @input="emitirCambios"
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

      <!-- Selector de periodo -->
      <div class="md:col-span-3">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Periodo</label
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="periodo in periodos"
            :key="periodo.valor"
            @click="seleccionarPeriodo(periodo.valor)"
            class="px-3 py-1 rounded-md text-sm"
            :class="
              filtrosLocales.periodo === periodo.valor
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            "
          >
            {{ periodo.etiqueta }}
          </button>
        </div>
      </div>

      <!-- Rango de fechas (ahora donde estaban las opciones de exportación) -->
      <div class="md:col-span-6" v-if="filtrosLocales.periodo === 'personalizado'">
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Desde</label
            >
            <input
              v-model="filtrosLocales.fechaDesde"
              type="date"
              class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none bg-white"
              @change="emitirCambios"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Hasta</label
            >
            <input
              v-model="filtrosLocales.fechaHasta"
              type="date"
              class="border p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 outline-none bg-white"
              @change="emitirCambios"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Opciones de exportación (ahora más compactas y en la parte inferior) -->
    <div class="mt-3 pt-1 border-t">
      <div class="flex flex-wrap items-center gap-3">
        <h3 class="text-sm font-medium text-gray-700">
          Opciones de exportación:
        </h3>
        
        <div class="flex items-center">
          <input
            type="checkbox"
            id="incluirDetalles"
            :checked="incluirDetalles"
            @change="$emit('toggle-incluir-detalles')"
            class="mr-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            for="incluirDetalles"
            class="text-sm font-medium text-gray-700"
            >Detalles</label
          >
        </div>
        
        <div class="flex items-center">
          <input
            type="checkbox"
            id="incluirRanking"
            :checked="incluirRanking"
            @change="$emit('toggle-incluir-ranking')"
            class="mr-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            for="incluirRanking"
            class="text-sm font-medium text-gray-700"
            >Top Productos</label
          >
        </div>
        
        <div class="flex-grow"></div>
        
        <div class="text-sm text-gray-600">
          {{ pedidosSeleccionados.length }} pedidos - ${{ totalSeleccionados.toFixed(2) }}
        </div>
        
        <button
          @click="$emit('seleccionar-todos-filtrados')"
          class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition"
        >
          Seleccionar todos
        </button>
        
        <button
          @click="$emit('exportar-pdf')"
          class="text-sm font-medium bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-1"
          :disabled="pedidosSeleccionados.length === 0"
          :class="{
            'opacity-50 cursor-not-allowed':
              pedidosSeleccionados.length === 0,
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
          Exportar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

interface Filtros {
  busqueda: string;
  fechaDesde: string;
  fechaHasta: string;
  periodo: "dia" | "todo" | "personalizado";
}

const props = defineProps<{
  filtros: Filtros;
  pedidosSeleccionados: number[];
  incluirDetalles: boolean;
  incluirRanking: boolean;
  totalSeleccionados: number;
}>();

const emit = defineEmits<{
  (e: "actualizar-filtros", filtros: Filtros): void;
  (e: "exportar-pdf"): void;
  (e: "toggle-incluir-detalles"): void;
  (e: "toggle-incluir-ranking"): void;
  (e: "seleccionar-todos-filtrados"): void;
}>();

// Estado local
const filtrosLocales = ref<Filtros>({
  busqueda: "",
  fechaDesde: "",
  fechaHasta: "",
  periodo: "dia",
});

// Opciones de periodos
const periodos = [
  { valor: "dia", etiqueta: "Hoy" },
  { valor: "todo", etiqueta: "Todo" },
  { valor: "personalizado", etiqueta: "Personalizado" },
];

// Métodos
const emitirCambios = () => {
  emit("actualizar-filtros", { ...filtrosLocales.value });
};

const seleccionarPeriodo = (periodo: any) => {
  filtrosLocales.value.periodo = periodo;
  emitirCambios();
};

// Observar cambios en los props
watch(
  () => props.filtros,
  (nuevosFiltros) => {
    filtrosLocales.value = { ...nuevosFiltros };
  },
  { deep: true, immediate: true }
);

// Ciclo de vida
onMounted(() => {
  // Inicializar filtros locales con los props
  filtrosLocales.value = { ...props.filtros };
});
</script>