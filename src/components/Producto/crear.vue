<template>
  <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Nuevo Producto</h2>
      <!-- Formulario -->
      <form>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del producto</label>
            <input type="text" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Precio</label>
            <input type="text" class="w-full border p-2 rounded" />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium mb-1">Imagen</label>
            <div class="flex flex-col items-center bg-red-500 rounded-lg shadow-md">
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="hidden"
                id="file-upload"
              />
              <label
                for="file-upload"
                class="w-full cursor-pointer text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
              >
                <img :src="image" alt="Icono de imagen" class="w-8 h-8 mr-2" /> <!-- Añadido mr-2 aquí -->
                Subir Imagen
              </label>

              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" class="w-32 h-32 object-cover rounded mt-2" alt="Vista previa de la imagen" />
              </div>
            </div>
          </div>


          <!-- Categoría con Combobox -->
          <div>
            <label class="block text-sm font-medium mb-1">Categoría</label>
            <Combobox v-model="selectedCategory">
              <div class="relative">
                <!-- Campo de búsqueda -->
                <ComboboxInput
                  class="w-full border p-2 rounded"
                  @input="(e: Event) => (query = (e.target as HTMLInputElement).value)"
                  @focus="isFocused = true"
                  @blur="cerrarLista"
                  :displayValue="(item) => (item as Categoria | null)?.nombre ?? ''"
                />

                <!-- Lista desplegable -->
                <ComboboxOptions
                  v-if="isFocused && filteredCategorias.length > 0"
                  class="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg"
                >
                  <ComboboxOption
                    v-for="categoria in filteredCategorias"
                    :key="categoria.id"
                    :value="categoria"
                    class="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {{ categoria.nombre }}
                  </ComboboxOption>
                </ComboboxOptions>

                <!-- Enlace para agregar categoría (solo si no hay coincidencias) -->
                <button
                  v-if="query && filteredCategorias.length === 0"
                  @click.prevent="abrirModal(query)" 
                  class="text-red-500 text-sm mt-2"
                >
                  Agregar nueva categoría
                </button>
              </div>
            </Combobox>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Maneja Stock</label>
            <select v-model="manejaStock" class="w-full border p-2 rounded">
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          <div v-if="manejaStock === 'si'">
            <label class="block text-sm font-medium mb-1">Stock</label>
            <input type="number" v-model="stock" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Fecha de Creación</label>
            <input type="text" class="w-full border p-2 rounded" />
          </div>  
        </div>
      </form>
      
      <div class="flex justify-end space-x-2 mt-4">
        <button @click="cerrarModal" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
        <button class="px-4 py-2 bg-red-500 text-white rounded">Guardar</button>
      </div>
    </div>
  </div>

  <!-- Modal para agregar categoría -->
  <div v-if="modalAbierto" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-5 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-semibold mb-3">Nueva Categoría</h2>
      <input v-model="nuevaCategoria" type="text" placeholder="Nombre de la categoría"
        class="w-full border p-2 rounded mb-3" />
      <div class="flex justify-end gap-2">
        <button @click="cerrarModalCategoria" class="px-3 py-1 bg-gray-300 rounded">Cancelar</button>
        <button @click="guardarCategoria" class="px-3 py-1 bg-red-500 text-white rounded">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue";
import image from "../../assets/iconos/image.svg";

defineProps({
  mostrarModal: Boolean
});

const emit = defineEmits(["cerrar"]);

// Interfaz para definir el tipo de categoría
interface Categoria {
  id: number;
  nombre: string;
}

// Lista de categorías (se traerá desde Electron más adelante)
const categorias = ref<Categoria[]>([
  { id: 1, nombre: "Electrónica" },
  { id: 2, nombre: "Ropa" },
  { id: 3, nombre: "Hogar" },
]);

const selectedCategory = ref<Categoria | null>(null);
const query = ref<string>("");
const modalAbierto = ref<boolean>(false);
const nuevaCategoria = ref<string>("");
const isFocused = ref(false);


const filteredCategorias = computed(() => {
  if (isFocused.value || query.value) {
    return categorias.value.filter((c) =>
      c.nombre.toLowerCase().includes(query.value.toLowerCase())
    );
  }
  return [];
});

// 📌 Cerrar lista cuando se pierde el foco
const cerrarLista = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 200); // Retraso para permitir la selección antes de cerrar
};

// Abre el modal con el nombre de la categoría que se intentó escribir
const abrirModal = (nombreCategoria: string) => {
  modalAbierto.value = true;
  nuevaCategoria.value = nombreCategoria;
};

// Cierra el modal de categoría
const cerrarModalCategoria = () => {
  modalAbierto.value = false;
  nuevaCategoria.value = "";
};

// Simula guardar la categoría (en el futuro, lo harás con Electron)
const guardarCategoria = () => {
  console.log("Nueva categoría a guardar:", nuevaCategoria.value);
  cerrarModalCategoria();
};

// Cierra el modal principal
const cerrarModal = () => {
  emit("cerrar");
};

const manejaStock = ref("no"); // Estado inicial en "No"
const stock = ref<number | null>(null);
  const imagePreview = ref<string | null>(null);

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string; // Asigna la URL de la imagen a la vista previa
    };
    reader.readAsDataURL(input.files[0]); // Lee la imagen como URL de datos
  }
};

</script>
