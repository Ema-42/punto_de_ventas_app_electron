<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-60 flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ props.producto ? "Editar" : "Nuevo" }} Producto
        </h2>
        <button @click="cerrar" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="guardar">
        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            for="nombre"
          >
            Nombre
          </label>
          <input
            v-model="formData.nombre"
            id="nombre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Ingrese el nombre del producto"
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            for="precio"
          >
            Precio
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
            <input
              v-model="formData.precio"
              id="precio"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            for="imagen"
          >
            Imagen del Producto
          </label>
          <div 
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            :class="{ 'border-red-400 dark:border-red-500': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDropImage"
            @click="$refs.fileInput.click()"
          >
            <input 
              ref="fileInput" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleFileUpload"
            />
            
            <div v-if="imagePreview" class="mb-3">
              <img 
                :src="imagePreview" 
                alt="Vista previa" 
                class="mx-auto h-40 object-contain rounded-lg"
              />
            </div>
            
            <div v-else class="py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p class="text-gray-500 dark:text-gray-400">Arrastra una imagen aquí o haz clic para seleccionar</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG o JPEG (máx. 5MB)</p>
            </div>
            
            <div v-if="formData.imagen_url && !imageFile" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Imagen actual: (Click aquí para cambiar la imagen)
            </div>
          </div>
        </div>


        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            for="categoria"
          >
            Categoría
          </label>
          <select
            v-model="formData.categoria_id"
            id="categoria"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="" disabled>Seleccione una categoría</option>
            <option
              v-for="categoria in categorias"
              :key="categoria.id"
              :value="categoria.id"
            >
              {{ categoria.nombre }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <div class="flex items-center">
            <input
              v-model="formData.maneja_stock"
              id="maneja_stock"
              type="checkbox"
              class="h-4 w-4 text-red-600 dark:text-red-500 focus:ring-red-400 dark:focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              for="maneja_stock"
              class="ml-2 block text-gray-700 dark:text-gray-200 text-sm font-bold"
            >
              Controlar stock
            </label>
          </div>
        </div>

        <div v-if="formData.maneja_stock" class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            for="stock"
          >
            Stock
          </label>
          <input
            v-model="formData.stock"
            id="stock"
            type="number"
            min="0"
            :required="formData.maneja_stock"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="0"
          />
        </div>

        <div v-if="errorMensaje" class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
          {{ errorMensaje }}
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="cerrar"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition flex items-center gap-2"
            :disabled="isUploading"
          >
            <span>{{ props.producto ? "Actualizar" : "Guardar" }}</span>
            <svg
              v-if="!isUploading"
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
            <svg 
              v-else
              class="animate-spin h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                class="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                stroke-width="4"
              ></circle>
              <path 
                class="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  
  interface Categoria {
    id: number;
    nombre: string;
    eliminado?: boolean;
  }
  
  interface Producto {
    id: number;
    nombre: string;
    precio: number;
    imagen_url?: string;
    categoria_id: number;
    categoria:  {id: number, nombre:string, eliminado:boolean, fecha_creacion?:string};
    maneja_stock: boolean;
    stock: number;
    eliminado?: boolean;
    fecha_creacion?: string;
  }
  
  interface FileData {
    name: string;
    type: string;
    size: number;
    buffer: number[]; // Array de bytes
  }
  
  const errorMensaje = ref("");
  const categorias = ref<Categoria[]>([]);
  const isUploading = ref(false);
  
  const props = defineProps<{
    mostrar: boolean;
    producto?: Producto | null;
  }>();
  
  const emit = defineEmits<{
    (e: "cerrar"): void;
    (e: "guardar"): void;
  }>();
  
  const formData = ref({
    nombre: "",
    precio: 0,
    imagen_url: "",
    categoria_id: 0,
    maneja_stock: false,
    stock: 0,
  });
  
  const fileInput = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const imageFile = ref<File | null>(null);
  const imagePreview = ref<string | null>(null);
  
  watch(
    () => props.producto,
    (newProducto) => {
      if (newProducto) {
        formData.value = {
          nombre: newProducto.nombre,
          precio: newProducto.precio,
          imagen_url: newProducto.imagen_url || "",
          categoria_id: newProducto.categoria.id,
          maneja_stock: newProducto.maneja_stock,
          stock: newProducto.stock,
        };
        
        // Si hay una imagen, mostrar la vista previa
        if (newProducto.imagen_url) {
          imagePreview.value = `local://${newProducto.imagen_url}`;
        } else {
          imagePreview.value = null;
        }
        
        imageFile.value = null;
      } else {
        formData.value = {
          nombre: "",
          precio: 0,
          imagen_url: "",
          categoria_id: categorias.value.length > 0 ? categorias.value[0].id : 0,
          maneja_stock: false,
          stock: 0,
        };
        imagePreview.value = null;
        imageFile.value = null;
      }
    },
    { immediate: true }
  );
  
  const cerrar = () => {
    emit("cerrar");
  };
  
  const cargarCategorias = async () => {
    try {
      // Aquí normalmente harías una llamada a tu API para obtener las categorías
      const data = await window.api.getCategorias();
      categorias.value = data;
      
      // Si no hay producto seleccionado, establecer la primera categoría como predeterminada
      if (!props.producto && categorias.value.length > 0) {
        formData.value.categoria_id = categorias.value[0].id;
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };
  
  // Método para manejar cuando se arrastra y suelta una imagen
  const onDropImage = async (e: DragEvent) => {
    isDragging.value = false;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validar que sea una imagen y no exceda el tamaño máximo (5MB)
      if (!file.type.match('image.*')) {
        errorMensaje.value = "El archivo debe ser una imagen (PNG, JPG, JPEG)";
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        errorMensaje.value = "La imagen no debe exceder los 5MB";
        return;
      }
      
      imageFile.value = file;
      
      // Crear una URL para la vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Guardar la imagen usando la función proporcionada
      try {
        isUploading.value = true;
        const imagenGuardada = await saveFile(file);
        if (imagenGuardada && imagenGuardada.path) {
          formData.value.imagen_url = imagenGuardada.path;
        }
      } catch (error) {
        console.error("Error al guardar la imagen:", error);
        errorMensaje.value = "Error al guardar la imagen. Inténtelo de nuevo.";
      } finally {
        isUploading.value = false;
      }
    }
  };
  
  // Método para manejar cuando se selecciona una imagen con el selector de archivos
  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      
      // Validar que sea una imagen y no exceda el tamaño máximo (5MB)
      if (!file.type.match('image.*')) {
        errorMensaje.value = "El archivo debe ser una imagen (PNG, JPG, JPEG)";
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        errorMensaje.value = "La imagen no debe exceder los 5MB";
        return;
      }
      
      imageFile.value = file;
      
      // Crear una URL para la vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Guardar la imagen usando la función proporcionada
      try {
        isUploading.value = true;
        const imagenGuardada = await saveFile(file);
        if (imagenGuardada && imagenGuardada.path) {
          formData.value.imagen_url = imagenGuardada.path;
        }
      } catch (error) {
        console.error("Error al guardar la imagen:", error);
        errorMensaje.value = "Error al guardar la imagen. Inténtelo de nuevo.";
      } finally {
        isUploading.value = false;
      }
    }
  };
  
  const saveFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer(); // Convertir a ArrayBuffer
      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        buffer: Array.from(new Uint8Array(arrayBuffer)), // Convertir a array de bytes
      };
  
      const dataImage = await window.api.uploadFile(fileData);
  
      if (dataImage instanceof Error) {
        throw dataImage;
      }
      //AQUI SE DEVUELVE LOS DATOS DE LA IMAGEN GUARDAD EN UPLOADS
      return dataImage;
    } catch (err) {
      console.error("Error uploading file", err);
      throw err;
    }
  };
  
  const guardar = async () => {
    try {
      errorMensaje.value = ""; // Limpiar errores previos
  
      // Validaciones básicas
      if (!formData.value.nombre.trim()) {
        errorMensaje.value = "El nombre es obligatorio";
        return;
      }
  
      if (formData.value.precio <= 0) {
        errorMensaje.value = "El precio debe ser mayor que cero";
        return;
      }
  
      if (!formData.value.categoria_id) {
        errorMensaje.value = "Debe seleccionar una categoría";
        return;
      }
  
      if (formData.value.maneja_stock && formData.value.stock < 0) {
        errorMensaje.value = "El stock no puede ser negativo";
        return;
      }
  
      const productoData = {
        nombre: formData.value.nombre,
        precio: formData.value.precio,
        imagen_url: formData.value.imagen_url || null,
        categoria_id: formData.value.categoria_id,
        maneja_stock: formData.value.maneja_stock,
        stock: formData.value.maneja_stock ? formData.value.stock : 0,
      };
  
      const accion = props.producto
        ? window.api.editProductoById(props.producto.id, productoData)
        : window.api.createProducto(productoData);
  
      const result = await accion;
      if (result instanceof Error) throw result;
  
      // Resetear formulario
      formData.value = {
        nombre: "",
        precio: 0,
        imagen_url: "",
        categoria_id: categorias.value.length > 0 ? categorias.value[0].id : 0,
        maneja_stock: false,
        stock: 0,
      };
      imageFile.value = null;
      imagePreview.value = null;
      
      emit("guardar");
    } catch (error: any) {
      errorMensaje.value = error.message || "Ocurrió un error al guardar el producto.";
    }
  };
  
  onMounted(() => {
    cargarCategorias();
  });
  </script>