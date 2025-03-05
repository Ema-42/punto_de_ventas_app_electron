<template>
    <div
      v-if="mostrar && ingreso"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div class="text-center">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-yellow-500"
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
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Cambiar Estado del Ingreso</h3>
          <p class="text-gray-600 mb-6">
            Ingreso #{{ ingreso.id }} - {{ formatearFecha(ingreso.fecha_ingreso) }}
          </p>
  
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2 text-left" for="estado">
              Nuevo Estado
            </label>
            <select
              v-model="nuevoEstado"
              id="estado"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="" disabled>Seleccione un estado</option>
              <option v-for="estado in estados" :key="estado.valor" :value="estado.valor">
                {{ estado.etiqueta }}
              </option>
            </select>
            <div class="mt-2 text-left">
              <span class="text-sm text-gray-500">Estado actual: </span>
              <span :class="getEstadoClase(ingreso.estado)">
                {{ ingreso.estado }}
              </span>
            </div>
          </div>
  
          <div class="flex justify-center gap-3">
            <button
              @click="$emit('cerrar')"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              @click="cambiarEstado"
              class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              :disabled="!nuevoEstado || nuevoEstado === ingreso.estado"
              :class="{ 'opacity-50 cursor-not-allowed': !nuevoEstado || nuevoEstado === ingreso.estado }"
            >
              Actualizar Estado
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from "vue";
import { Usuario } from "../../../electron/main/modules/interfaces";
  
  interface Ingreso {
    id: number;
    fecha_ingreso: string;
    usuario: Usuario;
    estado: string;
    total: string;
  }
  
  const props = defineProps<{
    mostrar: boolean;
    ingreso: Ingreso | null;
  }>();
  
  const emit = defineEmits<{
    (e: "cerrar"): void;
    (e: "confirmar"): void;
  }>();
  
  const nuevoEstado = ref("");
  
  // Estados disponibles
  const estados = ref([
    { valor: "CONSOLIDADO", etiqueta: "Consolidado" },
    { valor: "PENDIENTE", etiqueta: "Pendiente" },
    { valor: "ANULADO", etiqueta: "Anulado" }
  ]);
  
  // Observar cambios en el ingreso seleccionado
  watch(
    () => props.ingreso,
    (newIngreso) => {
      if (newIngreso) {
        nuevoEstado.value = newIngreso.estado;
      } else {
        nuevoEstado.value = "";
      }
    },
    { immediate: true }
  );
  
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  const getEstadoClase = (estado: string) => {
    const clases: { [key: string]: string } = {
      "CONSOLIDADO": "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium",
      "PENDIENTE": "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium",
      "ANULADO": "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium"
    };
    return clases[estado] || "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium";
  };
  
  const cambiarEstado = async () => {
    if (!props.ingreso || !nuevoEstado.value || nuevoEstado.value === props.ingreso.estado) return;
    
    try {
      // En una aplicación real, aquí se haría una llamada a la API
      // Simulamos la actualización del estado
      await window.api.editarIngresoConDetalles({
        id: props.ingreso.id,
        usuario_id: props.ingreso.usuario.id,
        estado: nuevoEstado.value,
        detalles: [] // No modificamos los detalles
      });
      
      emit("confirmar");
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };
  </script>