<template>
  <div
    v-if="mostrar && pedido"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 class="text-xl font-bold text-gray-800 mb-2">¿Eliminar pedido?</h3>
        <p class="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar el pedido
          <span class="font-bold">N° {{ pedido.num_pedido_dia || pedido.id }}</span
          >? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-center gap-3">
          <button
            @click="$emit('cerrar')"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            @click="eliminarPedido"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script setup lang="ts">
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
    tipo_pago?: string;
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
  
  const props = defineProps<{
    mostrar: boolean;
    pedido: Pedido | null;
  }>();
  
  const emit = defineEmits<{
    (e: "cerrar"): void;
    (e: "confirmar"): void;
  }>();
  
  const eliminarPedido = async () => {
    if (props.pedido?.id) {
      const id = props.pedido.id;
      try {
        if (window.api && window.api.deletePedidoById) {
          await window.api.deletePedidoById(id);
        } else {
          // Simulación si no hay API
          console.log("Eliminando pedido:", id);
        }
      } catch (error) {
        console.error("Error al eliminar pedido:", error);
      }
    }
    emit("confirmar");
  };
  </script>