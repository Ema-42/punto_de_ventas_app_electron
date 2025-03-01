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
          {{ props.categoria ? "Editar" : "Nueva" }} Categoría
        </h2>
        <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="guardar">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="nombre"
          >
            Nombre de la categoría
          </label>
          <input
            v-model="nombreCategoria"
            id="nombre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Ingrese el nombre de la categoría"
          />
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
            <span>{{ props.categoria ? "Actualizar" : "Guardar" }}</span>
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

const errorMensaje = ref("");
interface Categoria {
  id: number;
  nombre: string;
  fecha_creacion: string;
}

const props = defineProps<{
  mostrar: boolean;
  categoria?: Categoria | null;
}>();

const emit = defineEmits<{
  (e: "cerrar"): void;
  (e: "guardar"): void;
}>();

const nombreCategoria = ref("");

watch(
  () => props.categoria,
  (newCategoria) => {
    nombreCategoria.value = newCategoria?.nombre || "";
    errorMensaje.value = "";
  },
  { immediate: true }
);

const cerrar = () => {
  emit("cerrar");
};

const guardar = async () => {
  try {
    errorMensaje.value = ""; // Limpiar errores previos
    nombreCategoria.value = nombreCategoria.value.trim();

    const accion = props.categoria
      ? window.api.editCategoriaById(props.categoria.id, {
          nombre: nombreCategoria.value,
        })
      : window.api.createCategoria({ nombre: nombreCategoria.value });

    const result = await accion;
    if (result instanceof Error) throw result;

    nombreCategoria.value = "";
    emit("guardar");
  } catch (error: any) {
    errorMensaje.value = error.message || "Ocurrió un error al guardar.";
  }
};
</script>
