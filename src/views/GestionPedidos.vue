<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Encabezado con título -->
    <div class="bg-gradient-to-r bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-100 flex items-center">
          Gestión de Pedidos
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
      </div>
    </div>

    <!-- Componente de filtros -->
    <FiltroPedidos
      :filtros="filtros"
      @actualizar-filtros="actualizarFiltros"
      @exportar-pdf="exportarPedidosPDF"
      :pedidos-seleccionados="pedidosSeleccionados"
      :incluir-detalles="incluirDetalles"
      :incluir-ranking="incluirRanking"
      :total-seleccionados="totalPedidosSeleccionados"
      @toggle-incluir-detalles="incluirDetalles = !incluirDetalles"
      @toggle-incluir-ranking="incluirRanking = !incluirRanking"
      @seleccionar-todos-filtrados="seleccionarTodosFiltrados"
    />

    <!-- Contador de pedidos -->
    <div class="mb-2 text-gray-600 dark:text-gray-400 flex justify-between items-center">
      <div>Total: {{ pedidosFiltrados.length }} pedidos encontrados</div>
      <div class="font-medium text-red-600 dark:text-red-400">
        Total seleccionados: ${{ totalPedidosSeleccionados.toFixed(2) }}
      </div>
    </div>

    <!-- Tabla de pedidos con encabezados fijos -->
    <div
      class="flex-1 overflow-hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col"
    >
      <div class="flex-1 overflow-y-auto">
        <!-- Aquí irá el cuerpo de la tabla con scroll -->
        <TablaPedidos
          :pedidos="pedidosFiltrados"
          :pagina="pagina"
          :por-pagina="porPagina"
          :seleccionar-todos="seleccionarTodos"
          :pedidos-seleccionados="pedidosSeleccionados"
          @seleccionar-todos="seleccionarTodosPedidos"
          @seleccionar-pedido="toggleSeleccionPedido"
          @ver-detalle="verDetallePedido"
          @exportar-pedido="exportarPedidoIndividual"
          :solo-cuerpo="true"
        />
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-4 mb-2">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando
        {{ Math.min((pagina - 1) * porPagina + 1, pedidosFiltrados.length) }}
        -
        {{ Math.min(pagina * porPagina, pedidosFiltrados.length) }}
        de {{ pedidosFiltrados.length }} pedidos
      </div>
      <div class="flex space-x-2">
        <button
          @click="pagina > 1 ? pagina-- : null"
          :disabled="pagina <= 1"
          class="px-4 py-2 border dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition dark:text-gray-200"
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
        <span class="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg">
          {{ pagina }} /
          {{ Math.ceil(pedidosFiltrados.length / porPagina) || 1 }}
        </span>
        <button
          @click="
            pagina < Math.ceil(pedidosFiltrados.length / porPagina)
              ? pagina++
              : null
          "
          :disabled="pagina >= Math.ceil(pedidosFiltrados.length / porPagina)"
          class="px-4 py-2 border dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition dark:text-gray-200"
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
    <DetallePedido
      v-if="mostrarModalDetalles"
      :pedido="pedidoDetalle ?? {} as Pedido"
      @cerrar="mostrarModalDetalles = false"
    />
    <!-- Modal de ranking de productos -->
    <RankingProductos
      v-if="mostrarRanking"
      :pedidos="pedidosParaRanking"
      @cerrar="mostrarRanking = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import FiltroPedidos from "../components/GestionPedidos/FiltroPedidos.vue";
import TablaPedidos from "../components/GestionPedidos/TablaPedidos.vue";
import DetallePedido from "../components/GestionPedidos/DetallePedidos.vue";
import RankingProductos from "../components/GestionPedidos/RankingProductos.vue";
import { generarPDF } from "../components/GestionPedidos/ExportarPDF";
import { EstadoPedido } from "../../electron/main/modules/interfaces";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
}

interface Mesa {
  id: number;
  numero: number;
}

interface Producto {
  id: number;
  nombre: string;
  imagen_url?: string;
  maneja_stock?: boolean;
}

interface DetallePedido {
  id: number;
  pedido_id: number;
  producto: Producto;
  cantidad: number;
  precio_unitario: string;
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
  detalles?: DetallePedido[];
}

interface Filtros {
  busqueda: string;
  fechaDesde: string;
  fechaHasta: string;
  horaDesde: string;
  horaHasta: string;
  periodo: "dia" | "todo" | "personalizado";
}

// Toast para notificaciones
const toast = useToast();

// Estado
const pedidos = ref<Pedido[]>([]);
const pedidosFiltrados = ref<Pedido[]>([]);
const pedidosSeleccionados = ref<number[]>([]);
const seleccionarTodos = ref(false);
const pagina = ref(1);
const porPagina = ref(6);
const mostrarModalDetalles = ref(false);
const mostrarRanking = ref(false);
const pedidoDetalle = ref<Pedido | null>(null);
const incluirDetalles = ref(true);
const incluirRanking = ref(true);

// Filtros
const filtros = ref<Filtros>({
  busqueda: "",
  fechaDesde: "",
  fechaHasta: "",
  horaDesde: "",
  horaHasta: "",
  periodo: "dia",
});

// Computed
const pedidosParaRanking = computed(() => {
  if (pedidosSeleccionados.value.length === 0) {
    return pedidosFiltrados.value;
  }
  return pedidosFiltrados.value.filter((pedido) =>
    pedidosSeleccionados.value.includes(pedido.id)
  );
});

const totalPedidosSeleccionados = computed(() => {
  return pedidosFiltrados.value
    .filter((pedido) => pedidosSeleccionados.value.includes(pedido.id))
    .reduce((total, pedido) => total + parseFloat(pedido.total || "0"), 0);
});

// Métodos
const cargarPedidos = async () => {
  try {
    const data = await window.api.getPedidos();
    pedidos.value = data.filter(
      (pedido: any) =>
        pedido.estado === EstadoPedido.COMPLETADO ||
        pedido.estado === EstadoPedido.EN_PREPARACION
    );
    aplicarFiltros();
  } catch (err) {
    console.error("Error al obtener los pedidos:", err);
    toast.error("Error al cargar los pedidos");
  }
};

const aplicarFiltros = () => {
  let resultado = [...pedidos.value];

  // Filtrar por búsqueda (solo por ID) - Con verificación para evitar errores
  if (filtros.value.busqueda && filtros.value.busqueda.trim() !== "") {
    const busqueda = filtros.value.busqueda.toLowerCase();
    resultado = resultado.filter((pedido) => {
      // Verificar que las propiedades no sean null o undefined y realizar la búsqueda
      const idMatch =
        pedido.id !== null &&
        pedido.id !== undefined &&
        pedido.id.toString().includes(busqueda);
      const numPedidoMatch =
        pedido.num_pedido_dia !== null &&
        pedido.num_pedido_dia !== undefined &&
        pedido.num_pedido_dia.toString().includes(busqueda);
      const tipoPagoMatch =
        pedido.tipo_pago !== null &&
        pedido.tipo_pago !== undefined &&
        pedido.tipo_pago.toLowerCase().includes(busqueda);
      const meseraNombreMatch =
        pedido.mesera?.nombre !== null &&
        pedido.mesera?.nombre !== undefined &&
        pedido.mesera.nombre.toLowerCase().includes(busqueda);

      return idMatch || numPedidoMatch || tipoPagoMatch || meseraNombreMatch;
    });
  }

  // Aplicar filtro por periodo
  if (
    filtros.value.periodo !== "personalizado" &&
    filtros.value.periodo !== "todo"
  ) {
    const hoy = new Date();
    let fechaInicio = new Date();

    switch (filtros.value.periodo) {
      case "dia":
        // Ajustar al inicio del día en la zona horaria local
        fechaInicio = new Date(
          hoy.getFullYear(),
          hoy.getMonth(),
          hoy.getDate(),
          0,
          0,
          0
        );
        break;
    }

    resultado = resultado.filter(
      (pedido) => new Date(pedido.fecha_creacion) >= fechaInicio
    );
  } else if (filtros.value.periodo === "personalizado") {
    // Filtrar por rango de fechas personalizado
    if (filtros.value.fechaDesde) {
      // Parsear la fecha correctamente
      const [year, month, day] = filtros.value.fechaDesde
        .split("-")
        .map((num) => parseInt(num, 10));
      const fechaDesde = new Date(year, month - 1, day, 0, 0, 0);

      resultado = resultado.filter((pedido) => {
        const fechaPedido = new Date(pedido.fecha_creacion);
        return fechaPedido >= fechaDesde;
      });
    }

    if (filtros.value.fechaHasta) {
      // Parsear la fecha correctamente
      const [year, month, day] = filtros.value.fechaHasta
        .split("-")
        .map((num) => parseInt(num, 10));
      const fechaHasta = new Date(year, month - 1, day, 23, 59, 59, 999);

      resultado = resultado.filter((pedido) => {
        const fechaPedido = new Date(pedido.fecha_creacion);
        return fechaPedido <= fechaHasta;
      });
    }
  }
  // Si es 'todo', no aplicamos filtro de fecha

  // Filtrar por rango de horas
  if (filtros.value.horaDesde || filtros.value.horaHasta) {
    resultado = resultado.filter((pedido) => {
      const fechaPedido = new Date(pedido.fecha_creacion);
      const hora = fechaPedido.getHours();
      const minutos = fechaPedido.getMinutes();
      const horaCompleta = hora + minutos / 60;

      let cumpleFiltro = true;

      if (filtros.value.horaDesde) {
        const [horaDesde, minutosDesde] = filtros.value.horaDesde
          .split(":")
          .map(Number);
        const horaDesdeCompleta = horaDesde + minutosDesde / 60;
        cumpleFiltro = cumpleFiltro && horaCompleta >= horaDesdeCompleta;
      }

      if (filtros.value.horaHasta) {
        const [horaHasta, minutosHasta] = filtros.value.horaHasta
          .split(":")
          .map(Number);
        const horaHastaCompleta = horaHasta + minutosHasta / 60;
        cumpleFiltro = cumpleFiltro && horaCompleta <= horaHastaCompleta;
      }

      return cumpleFiltro;
    });
  }

  // Ordenar por fecha de creación (más reciente primero)
  resultado.sort(
    (a, b) =>
      new Date(b.fecha_creacion).getTime() -
      new Date(a.fecha_creacion).getTime()
  );

  pedidosFiltrados.value = resultado;
  pagina.value = 1;

  // Resetear selecciones
  if (seleccionarTodos.value) {
    seleccionarTodos.value = false;
  }
  pedidosSeleccionados.value = [];
};

const actualizarFiltros = (nuevosFiltros: any) => {
  filtros.value = { ...nuevosFiltros };
  aplicarFiltros();
};

const seleccionarTodosPedidos = () => {
  if (seleccionarTodos.value) {
    pedidosSeleccionados.value = pedidosFiltrados.value.map(
      (pedido) => pedido.id
    );
  } else {
    pedidosSeleccionados.value = [];
  }
};

const seleccionarTodosFiltrados = () => {
  // Seleccionar todos los pedidos filtrados
  pedidosSeleccionados.value = pedidosFiltrados.value.map(
    (pedido) => pedido.id
  );
  seleccionarTodos.value = true;
};

const toggleSeleccionPedido = (id: number) => {
  const index = pedidosSeleccionados.value.indexOf(id);
  if (index === -1) {
    pedidosSeleccionados.value.push(id);
  } else {
    pedidosSeleccionados.value.splice(index, 1);
  }

  // Actualizar estado de "seleccionar todos"
  seleccionarTodos.value =
    pedidosSeleccionados.value.length === pedidosFiltrados.value.length &&
    pedidosFiltrados.value.length > 0;
};

const verDetallePedido = (pedido: Pedido) => {
  pedidoDetalle.value = pedido;
  mostrarModalDetalles.value = true;
};

const exportarPedidoIndividual = async (pedido: Pedido) => {
  try {
    toast.info("Generando PDF del pedido...");

    // Usar la función de exportación con un solo pedido
    await generarPDF([pedido], true, true);

    toast.success("PDF generado correctamente");
  } catch (error) {
    console.error("Error al generar PDF del pedido:", error);
    toast.error("Error al generar el PDF");
  }
};

const exportarPedidosPDF = async () => {
  if (pedidosSeleccionados.value.length === 0) {
    toast.warning("Seleccione al menos un pedido para exportar");
    return;
  }

  try {
    toast.info("Generando archivo PDF...");

    // Obtener los pedidos seleccionados
    const pedidosParaExportar = pedidosFiltrados.value.filter((pedido) =>
      pedidosSeleccionados.value.includes(pedido.id)
    );

    // Exportar a PDF
    await generarPDF(
      pedidosParaExportar,
      incluirDetalles.value,
      incluirRanking.value
    );

    toast.success("Archivo PDF generado correctamente");
  } catch (error) {
    console.error("Error al generar PDF:", error);
    toast.error("Error al generar el archivo PDF");
  }
};

// Observar cambios en los filtros
watch(
  filtros,
  () => {
    aplicarFiltros();
  },
  { deep: true }
);

// Ciclo de vida
onMounted(() => {
  cargarPedidos();
});
</script>
