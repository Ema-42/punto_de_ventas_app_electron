<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          {{ props.mesa ? "Editar" : "Nueva" }} Mesa
        </h2>
        <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="guardar">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="numero"
          >
            Número de Mesa
          </label>
          <input
            v-model="formData.numero"
            id="numero"
            type="number"
            required
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Ingrese el número de mesa"
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="estado"
          >
            Estado
          </label>
          <select
            v-model="formData.estado"
            id="estado"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            <option value="" disabled>Seleccione un estado</option>
            <option
              v-for="estado in estadosMesa"
              :key="estado.valor"
              :value="estado.valor"
            >
              {{ estado.etiqueta }}
            </option>
          </select>
          <span v-if="errorMensaje" style="color: red">{{ errorMensaje }}</span>
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="cerrar"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <span>{{ props.mesa ? "Actualizar" : "Guardar" }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  ESTADOS_MESA_ARRAY,
  EstadosMesa,
} from "../../../electron/main/modules/enums";
const errorMensaje = ref("");

interface Mesa {
  id: number;
  numero: number;
  estado: string;
  fecha_creacion: string;
}

// Estados disponibles para las mesas
const estadosMesa = ESTADOS_MESA_ARRAY;

const props = defineProps<{
  mostrar: boolean;
  mesa?: Mesa | null;
}>();

const emit = defineEmits<{
  (e: "cerrar"): void;
  (e: "guardar"): void;
}>();

const formData = ref({
  numero: 1,
  estado: "",
});

watch(
  () => props.mesa,
  (newMesa) => {
    if (newMesa) {
      formData.value = {
        numero: newMesa.numero,
        estado: newMesa.estado,
      };
    } else {
      formData.value = {
        numero: 1,
        estado: EstadosMesa.LIBRE,
      };
    }
  },
  { immediate: true }
);

const cerrar = () => {
  emit("cerrar");
};

const guardar = async () => {
  try {
    errorMensaje.value = ""; // Limpiar errores previos

    const accion = props.mesa
      ? window.api.editMesaById(props.mesa.id, {
          numero: formData.value.numero,
          estado: formData.value.estado,
        })
      : window.api.createMesa({
          numero: formData.value.numero,
          estado: formData.value?.estado,
        });

    const result = await accion;
    if (result instanceof Error) throw result;

    formData.value.numero = 1;
    formData.value.estado = estadosMesa[0].valor;
    emit("guardar");
  } catch (error: any) {
    errorMensaje.value = error.message || "Ocurrió un error al guardar.";
  }
};
</script>
