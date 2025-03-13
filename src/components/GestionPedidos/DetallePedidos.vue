<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          Pedido #{{ pedido.num_pedido_dia }}
        </h2>
        <button
          @click="$emit('cerrar')"
          class="text-gray-500 hover:text-gray-700"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-sm text-gray-500">Fecha</div>
          <div class="font-medium">
            {{ formatearFecha(pedido.fecha_creacion) }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-sm text-gray-500">Mesa</div>
          <div class="font-medium">
            {{ pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "No especificada" }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-sm text-gray-500">Tipo de Pago</div>
          <div>
            <span :class="getTipoPagoClase(pedido.tipo_pago)">
              {{ pedido.tipo_pago || "No especificado" }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-sm text-gray-500">Mesero</div>
          <div class="font-medium flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2"
            >
              <span class="text-sm font-medium text-red-600">{{
                pedido.mesera.nombre.charAt(0)
              }}</span>
            </div>
            {{ pedido.mesera.nombre }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-sm text-gray-500">Cajero</div>
          <div class="font-medium flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2"
            >
              <span class="text-sm font-medium text-green-600">{{
                pedido.cajero.nombre.charAt(0)
              }}</span>
            </div>
            {{ pedido.cajero.nombre }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-sm text-gray-500">Para llevar</div>
          <div class="font-medium flex items-center">
            {{ pedido.para_llevar ? "SI" : "NO" }}
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
                v-for="detalle in pedido.detalles"
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
                  ${{ parseFloat(pedido.total).toFixed(2) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <button
          @click="$emit('cerrar')"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cerrar
        </button>
        <button
          @click="exportarPedido"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
  </div>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";
import { generarPDF } from "./ExportarPDF";

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

const props = defineProps<{
  pedido: Pedido;
}>();

const emit = defineEmits<{
  (e: "cerrar"): void;
}>();

const toast = useToast();

// Métodos
const formatearFecha = (fechaStr: string): string => {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTipoPagoClase = (tipoPago?: string): string => {
  const clases: { [key: string]: string } = {
    EFECTIVO:
      "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium",
    TRANSFERENCIA:
      "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium",
  };

  return tipoPago
    ? clases[tipoPago] ||
        "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
    : "text-gray-500";
};

const exportarPedido = async () => {
  try {
    toast.info("Generando PDF del pedido...");

    // 
    await generarPDF([props.pedido], true, true);

    toast.success("PDF generado correctamente");
  } catch (error) {
    console.error("Error al generar PDF del pedido:", error);
    toast.error("Error al generar el PDF");
  }
};
</script>
