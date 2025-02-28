<template>
  <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Nuevo Producto</h2>
      <!-- Formulario -->
      <form>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del producto</label>
            <input type="text" class="w-full border p-2 rounded" v-model="nombreProducto"/>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Precio</label>
            <input type="number" class="w-full border p-2 rounded" v-model.number="precio" />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium mb-1">Imagen</label>
            <div class="flex flex-col items-center bg-red-500 rounded-lg shadow-md">
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden"
                id="file-upload"
              />
              <label
                for="file-upload"
                class="w-full cursor-pointer text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
              >
                <img :src="image" alt="Icono de imagen" class="w-8 h-8 mr-2" />
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
                  :displayValue="(item) => (item as CategoriaProducto | null)?.nombre ?? ''"
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
        </div>
      </form>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      
      <div class="flex justify-end space-x-2 mt-4">
        <button @click="cerrarModal" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
        <button @click="crearProducto" class="px-4 py-2 bg-red-500 text-white rounded">Guardar</button>
      </div>
    </div>
  </div>
  <!-- Modal de Éxito -->
  <div v-if="mostrarModalExito" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h2 class="text-green-600 text-xl font-bold mb-2">¡Éxito!</h2>
      <p class="text-gray-700">El producto se ha registrado correctamente.</p>
      <button @click="cerrarModalExito" class="mt-4 px-4 py-2 bg-green-500 text-white rounded">Aceptar</button>
    </div>
  </div>

  <!-- Modal para agregar categoría -->
<div v-if="modalAbierto" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div class="bg-white p-5 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-semibold mb-3">Nueva Categoría</h2>
    <input v-model="nombreCategoria" type="text" placeholder="Nombre de la categoría"
      class="w-full border p-2 rounded mb-3" />
    <div class="flex justify-end gap-2">
      <button @click="cerrarModalCategoria" class="px-3 py-1 bg-gray-300 rounded">Cancelar</button>
      <button @click="guardarCategoria" class="px-3 py-1 bg-red-500 text-white rounded">Guardar</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, computed } from "vue";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue";
import image from "../../assets/iconos/image.svg";
import { CategoriaProducto, Producto,} from "../../../electron/main/modules/interfaces";

defineProps({
  mostrarModal: Boolean
});

const emit = defineEmits(["cerrar", "productoCreado"]);


const query = ref<string>('');   
const modalAbierto = ref<boolean>(false);
const nuevaCategoria = ref<string>("");
const isFocused = ref(false);
const nombreProducto = ref("");
const precio = ref<number>(0);
const stock = ref<number>(0);
const manejaStock = ref("no");
const imagePreview = ref<string | null>(null);
const imagen_url = ref<string>("");
const error = ref<string | null>(null);
const mostrarModalExito = ref(false);



const crearProducto = async () => {
  try {
    if (!nombreProducto.value || precio.value <= 0) {
      error.value = "Completa todos los campos obligatorios.";
      return;
    }
    if (!selectedCategory.value || !selectedCategory.value.id) {
      console.error("Error: No se ha seleccionado una categoría válida.");
      return;
    }
    if (!imagen_url.value) {
      error.value = "Debes subir una imagen.";
      return;
    }

    const nuevoProducto: Producto = {
      nombre: nombreProducto.value,
      precio: precio.value,
      imagen_url: imagen_url.value, // Aquí se guarda la URL de la imagen
      maneja_stock: manejaStock.value === "si",
      stock: manejaStock.value === "si" ? stock.value : undefined,
      categoria_id: selectedCategory.value.id,
      fecha_creacion: new Date(),
    };

    const respuesta = await window.api.createProducto(nuevoProducto);

    if (respuesta) {
      mostrarModalExito.value = true;
      emit("productoCreado");

      setTimeout(() => {
        cerrarModalExito();
        cerrarModal();
      }, 1000);

      // Resetear formulario
      nombreProducto.value = '';
      precio.value = 0;
      stock.value = 0;
      manejaStock.value = 'no';
      selectedCategory.value = null;
      imagen_url.value = '';
      imagePreview.value = null;
    } else {
      throw new Error("No se recibió una respuesta válida.");
    }
  } catch (err) {
    error.value = "Error al crear el producto.";
    console.error(err);
  }
};






// Cierra el modal de éxito
const cerrarModalExito = () => {
  mostrarModalExito.value = false;
};


const selectedCategory = ref<{ id: number} | null>(null);

const categorias = ref<CategoriaProducto[]>([]); 

const getCategoriasProductos = async () => {
  try {
    const datos = await window.api.getCategorias(); // Llama a la función de Electron
    categorias.value = datos; 
    console.log("Categorías obtenidas:", datos); // Asigna las categorías obtenidas
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
};

onMounted(() => {
  getCategoriasProductos(); // Se ejecuta cuando el componente se monta
});

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

const nombreCategoria = ref<string>('');

// Abre el modal con el nombre de la categoría que se intentó escribir
const abrirModal = (nombreCategoriaInput: string) => {
  modalAbierto.value = true;
  nombreCategoria.value = nombreCategoriaInput; // Usar .value porque nombreCategoria es un ref
  nuevaCategoria.value = nombreCategoriaInput;   // Usar el valor directamente aquí
};

// Cierra el modal de categoría
const cerrarModalCategoria = () => {
  modalAbierto.value = false;
  nuevaCategoria.value = ""; // Limpiar el valor al cerrar el modal
};

// Simula guardar la categoría (en el futuro, lo harás con Electron)
const guardarCategoria = async () => {
  try {
    if (!nombreCategoria.value) {
      error.value = "El nombre de la categoría es obligatorio.";
      return;
    }

    const nuevoCategoria: CategoriaProducto = {
      nombre: nombreCategoria.value,
    };

    const respuesta = await window.api.createCategoria(nuevoCategoria);

    if (respuesta) {
      // Agregar la nueva categoría al array de categorías
      const nuevaCategoriaAgregada = {
        id: respuesta.id,
        nombre: nuevoCategoria.nombre,
      };

      // Actualizamos el arreglo de categorías
      categorias.value = [...categorias.value, nuevaCategoriaAgregada];

      // Seleccionamos automáticamente la nueva categoría
      selectedCategory.value = nuevaCategoriaAgregada;

      cerrarModalCategoria(); // Cerrar el modal después de guardar
    } else {
      throw new Error("No se pudo guardar la categoría.");
    }
  } catch (err) {
    error.value = "Error al crear la categoría.";
    console.error(err);
  }
};


// Cierra el modal principal
const cerrarModal = () => {
  emit("cerrar");
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];

  // Mostrar vista previa en la UI
  imagePreview.value = URL.createObjectURL(file);

  // Guardar la imagen y obtener la ruta
  const imagenGuardada = await saveFile(file);
  if (imagenGuardada) {
    console.log(imagenGuardada.path);
    console.log(imagenGuardada.name);
    imagen_url.value = imagenGuardada.path; // Guardar la ruta devuelta
  } else {
    console.error("Error al subir la imagen");
  }
};

const saveFile = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer(); // Convertir a ArrayBuffer
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      buffer: Array.from(new Uint8Array(arrayBuffer)), // Convertir a array de bytes
    };

    const dataImage = await window.api.uploadFile(fileData);
    if (dataImage instanceof Error) throw dataImage;

    return dataImage; // Devuelve los datos de la imagen guardada
  } catch (err) {
    console.error("Error al subir el archivo", err);
  }
};




</script>
