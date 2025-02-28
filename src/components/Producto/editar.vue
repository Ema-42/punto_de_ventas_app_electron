<template>
    <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Editar Producto</h2>
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
            <div class="flex flex-col items-center bg-red-500 rounded-lg shadow-md p-4">
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
                <img :src=" 'local://'+ imagen_url" alt="Icono de imagen" class="w-8 h-8 mr-2" />
                Subir Imagen
              </label>
              <input
                id="file-upload"
                type="file"
                class="hidden"
                @change=""
              />
              <div v-if="imagePreview" class="mt-2">
                <img :src="'local://'+ imagen_url" class="w-32 h-32 object-cover rounded mt-2" alt="Vista previa de la imagen" />
              </div>
            </div>
          </div>

            <div>
              <label class="block text-sm font-medium mb-1">Categoría</label>
              <select v-model="selectedCategory" class="w-full border p-2 rounded">
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.nombre }}
                </option>
              </select>
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
          <button @click="editarProducto" class="px-4 py-2 bg-red-500 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, ref, onMounted } from "vue";
  import { Producto, CategoriaProducto } from "../../../electron/main/modules/interfaces";
  
  import { watch } from "vue";

  const props = defineProps({
    mostrarModal: Boolean,
    producto: Object
  });
  
  const emit = defineEmits(["cerrar", "productoEditado"]);
  
  const nombreProducto = ref(props.producto?.nombre || "");
  const precio = ref<number>(props.producto?.precio ?? 0);
  const stock = ref<number>(props.producto?.stock ?? 0);
  const manejaStock = ref<string>(props.producto?.maneja_stock ? "si" : "no");
  const imagePreview = ref<string>(props.producto?.imagen_url);
  const imagen_url = ref<string>(props.producto?.imagen_url ?? "");
  const selectedCategory = ref<number | null>(props.producto?.categoria_id ?? null);
  const categorias = ref<CategoriaProducto[]>([]);
  const error = ref<string | null>(null);
  
  const getCategoriasProductos = async () => {
    try {
      categorias.value = await window.api.getCategorias();
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };
  
  onMounted(() => {
    getCategoriasProductos().then(() => {
    selectedCategory.value = props.producto?.categoria?.id ?? null;
  });
  });
  
  // ✅ Función para manejar la carga de imágenes
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];

  // 🖼️ Mostrar vista previa antes de subir
  imagePreview.value = URL.createObjectURL(file);

  // 🚀 Subir imagen y actualizar URL
  const imagenGuardada = await saveFile(file);
  if (imagenGuardada) {
    console.log("Imagen guardada:", imagenGuardada.path);
    imagen_url.value = imagenGuardada.path; // Guardar la ruta de la imagen
  } else {
    console.error("Error al subir la imagen");
  }
};

// ✅ Función para guardar archivos
const saveFile = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      buffer: Array.from(new Uint8Array(arrayBuffer)),
    };

    const dataImage = await window.api.uploadFile(fileData);
    if (dataImage instanceof Error) throw dataImage;

    return dataImage;
  } catch (err) {
    console.error("Error al subir el archivo:", err);
  }
};

// ✅ Función para guardar cambios en el producto
const editarProducto = async () => {
  try {
    if (!nombreProducto.value || precio.value <= 0) {
      error.value = "Completa todos los campos obligatorios.";
      return;
    }

    if (!selectedCategory.value) {
      console.error("Error: No se ha seleccionado una categoría válida.");
      return;
    }

    if (props.producto?.id === undefined) {
      error.value = "Error: El ID del producto es indefinido.";
      console.error(error.value);
      return;
    }

    const productoEditado: Producto = {
      id: props.producto.id!,
      nombre: nombreProducto.value,
      precio: precio.value,
      imagen_url: imagen_url.value, // 🖼️ Guardar la nueva URL si se cambia la imagen
      maneja_stock: manejaStock.value === "si",
      stock: manejaStock.value === "si" ? stock.value : undefined,
      categoria_id: selectedCategory.value,
      fecha_creacion: props.producto.fecha_creacion
    };

    await window.api.editProductoById(props.producto.id, productoEditado);
    emit("productoEditado");
    cerrarModal();
  } catch (err) {
    error.value = "Error al editar el producto.";
    console.error(err);
  }
};

watch(() => props.producto, (nuevoProducto) => {
  if (nuevoProducto) {
    imagePreview.value = nuevoProducto.imagen_url ?? null;
    imagen_url.value = nuevoProducto.imagen_url ?? "";
  }
}, { deep: true });

  
  const cerrarModal = () => {
    emit("cerrar");
  };

  </script>
  