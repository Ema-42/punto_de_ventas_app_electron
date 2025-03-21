<template>
  <div class="relative">
    <!-- Tabla con encabezados fijos -->
    <table class="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <!-- Encabezados fijos con fondo degradado rojo -->
      <thead class="bg-red-500 dark:bg-red-700 text-white sticky top-0 z-10">
        <tr>
          <th class="p-3 text-left w-12 rounded-tl-lg">
            <input
              type="checkbox"
              :checked="seleccionarTodos"
              @change="$emit('seleccionar-todos')"
              class="h-4 w-4 text-white border-white rounded"
            />
          </th>
          <th class="p-3 text-left">ID</th>
          <th class="p-3 text-left"># Pedido</th>
          <th class="p-3 text-left">Fecha Creacion</th>
          <th class="p-3 text-left">Mesa</th>
          <th class="p-3 text-left">Mesero</th>
          <th class="p-3 text-left">Cajero</th>
          <th class="p-3 text-left">Tipo Pago</th>
          <th class="p-3 text-left">Para llevar</th>
          <th class="p-3 text-right">Total</th>
          <th class="p-3 text-center rounded-tr-lg">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="pedidosPaginados.length === 0">
          <td colspan="10" class="p-4 text-center text-gray-500 dark:text-gray-400">
            No se encontraron pedidos con los filtros seleccionados.
            <div class="mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500"
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

        <template v-for="(grupo, index) in pedidosAgrupados" :key="index">
          <!-- Separador de fecha -->
          <tr class="bg-amber-100 dark:bg-amber-900">
            <td colspan="11" class="p text-md font-medium text-gray-700 dark:text-gray-200">
              {{ formatearFechaSeparador(grupo.fecha) }}
            </td>
          </tr>

          <!-- Pedidos del día -->
          <tr
            v-for="pedido in grupo.pedidos"
            :key="pedido.id"
            class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="p-3">
              <input
                type="checkbox"
                :checked="pedidosSeleccionados.includes(pedido.id)"
                @change="$emit('seleccionar-pedido', pedido.id)"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded"
              />
            </td>
            <td class="p-3">
              <span
                class="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-bold"
              >
                {{ pedido.id }}
              </span>
            </td>
            <td class="p-3 font-medium dark:text-gray-200">{{ pedido.num_pedido_dia }}</td>
            <td class="p-3 dark:text-gray-400">{{ formatearHora(pedido.fecha_creacion) }}</td>
            <td class="p-3 dark:text-gray-400">
              {{ pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "-" }}
            </td>
            <td class="p-3 dark:text-gray-400">{{ pedido.mesera.nombre }}</td>
            <td class="p-3 dark:text-gray-400">{{ pedido.cajero.nombre }}</td>
            <td class="p-3">
              <span
                v-if="pedido.tipo_pago"
                :class="getTipoPagoClase(pedido.tipo_pago)"
              >
                {{ pedido.tipo_pago }}
              </span>
              <span v-else class="dark:text-gray-400">-</span>
            </td>
            <td class="p-3 text-left font-medium dark:text-gray-200">
              {{ pedido.para_llevar ? "SI" : "NO" }}
            </td>
            <td class="p-3 text-right font-medium dark:text-gray-200">
              ${{ parseFloat(pedido.total).toFixed(2) }}
            </td>
            <td class="p-3 text-center">
              <div class="flex justify-center gap-2">
                <button
                  @click="$emit('ver-detalle', pedido)"
                  class="bg-blue-100 dark:bg-blue-900 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  title="Ver detalles"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-600 dark:text-blue-300"
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
                  @click="$emit('exportar-pedido', pedido)"
                  class="bg-red-100 dark:bg-red-900 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition"
                  title="Exportar a PDF"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-600 dark:text-red-300"
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
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Usuario {
  id: number;
  nombre: string;
}

interface Mesa {
  id: number;
  numero: number;
}

interface Pedido {
  id: number;
  num_pedido_dia: number;
  pedido_padre_id?: number;
  mesa?: Mesa;
  mesera: Usuario;
  cajero: Usuario;
  estado: string;
  fecha_creacion: string;
  fecha_concluido?: string;
  tipo_pago?: string;
  para_llevar?: boolean;
  total: string;
}

interface GrupoPedidos {
  fecha: string;
  pedidos: Pedido[];
}

const props = defineProps<{
  pedidos: Pedido[];
  pagina: number;
  porPagina: number;
  seleccionarTodos: boolean;
  pedidosSeleccionados: number[];
}>();

const emit = defineEmits<{
  (e: "seleccionar-todos"): void;
  (e: "seleccionar-pedido", id: number): void;
  (e: "ver-detalle", pedido: Pedido): void;
  (e: "exportar-pedido", pedido: Pedido): void;
  (e: "cambiar-pagina", pagina: number): void;
}>();

// Computed
const pedidosPaginados = computed(() => {
  const inicio = (props.pagina - 1) * props.porPagina;
  const fin = inicio + props.porPagina;
  return props.pedidos.slice(inicio, fin);
});

// Agrupar pedidos por fecha
const pedidosAgrupados = computed(() => {
  const grupos: GrupoPedidos[] = [];
  const pedidosPag = pedidosPaginados.value;

  pedidosPag.forEach((pedido) => {
    // Convertir timestamp a fecha local
    const fecha = new Intl.DateTimeFormat("es-BO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/La_Paz",
    })
      .format(new Date(pedido.fecha_creacion))
      .split("/")
      .reverse()
      .join("-");
    let grupo = grupos.find((g) => g.fecha === fecha);
    if (!grupo) {
      grupo = { fecha, pedidos: [] };
      grupos.push(grupo);
    }

    grupo.pedidos.push(pedido);
  });

  return grupos;
});

const formatearHora = (fechaStr: string): string => {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatearFechaSeparador = (fechaStr: string): string => {
  const [year, month, day] = fechaStr
    .split("-")
    .map((num) => parseInt(num, 10));
  const fecha = new Date(year, month - 1, day);
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);

  const formatearFechaLocal = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const fechaFormateada = formatearFechaLocal(fecha);
  const hoyFormateada = formatearFechaLocal(hoy);
  const ayerFormateada = formatearFechaLocal(ayer);

  if (fechaFormateada === hoyFormateada) {
    return (
      "Hoy - " +
      fecha.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "America/La_Paz",
      })
    );
  } else if (fechaFormateada === ayerFormateada) {
    return (
      "Ayer - " +
      fecha.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "America/La_Paz",
      })
    );
  } else {
    return fecha.toLocaleDateString("es-BO", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/La_Paz",
    });
  }
};

const getTipoPagoClase = (tipoPago: string): string => {
  const clases: { [key: string]: string } = {
    EFECTIVO:
      "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium",

    TRANSFERENCIA:
      "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium",
  };

  return (
    clases[tipoPago] ||
    "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
  );
};
</script>
