<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          Nuevo Ingreso
        </h2>
        <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMensaje" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
        {{ errorMensaje }}
      </div>

      <form @submit.prevent="guardar">
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="usuario">
            Usuario
          </label>
          <select
            v-model="formData.usuario_id"
            id="usuario"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
              {{ usuario.nombre }}
            </option>
          </select>
        </div>

        <!-- Detalles del ingreso -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold text-gray-700">Detalles del Ingreso</h3>
            <button
              type="button"
              @click="agregarDetalle"
              class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Agregar Producto
            </button>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
            <div v-if="formData.detalles.length === 0" class="text-center py-4 text-gray-500">
              No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="(detalle, index) in formData.detalles" 
                :key="index" 
                class="bg-white p-3 rounded-lg shadow-sm border"
                :class="{'border-red-300 bg-red-50': !detalle.producto_id, 'border-gray-200': detalle.producto_id}"
              >
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-medium text-gray-700">Producto {{ index + 1 }}</h4>
                  <button
                    type="button"
                    @click="eliminarDetalle(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-gray-700 text-xs font-medium mb-1">
                      Producto <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="productoBusqueda[index]"
                        type="text"
                        placeholder="Buscar producto..."
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                        :class="{'border-red-300': !detalle.producto_id, 'border-gray-300': detalle.producto_id}"
                        @input="filtrarProductos(index)"
                        @focus="mostrarListaProductos[index] = true"
                      />
                      <div 
                        v-if="mostrarListaProductos[index] && productosFiltrados[index].length > 0" 
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                      >
                        <div 
                          v-for="producto in productosFiltrados[index]" 
                          :key="producto.id" 
                          class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          :class="{'opacity-50 cursor-not-allowed': productoYaSeleccionado(producto.id, index)}"
                          @click="!productoYaSeleccionado(producto.id, index) && seleccionarProducto(index, producto)"
                        >
                          {{ producto.nombre }}
                          <span v-if="productoYaSeleccionado(producto.id, index)" class="text-red-500 text-xs ml-2">
                            (Ya seleccionado)
                          </span>
                        </div>
                      </div>
                      <div v-if="!detalle.producto_id" class="text-red-500 text-xs mt-1">
                        Debe seleccionar un producto
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-gray-700 text-xs font-medium mb-1">
                      Cantidad <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="detalle.cantidad"
                      type="number"
                      min="1"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                    />
                  </div>

                  <div>
                    <label class="block text-gray-700 text-xs font-medium mb-1">
                      Precio Unitario <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="detalle.precio_unitario"
                      type="number"
                      min="1"
                      step="1"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                    />
                  </div>
                </div>

                <div class="mt-2 text-right text-sm font-medium text-gray-700">
                  Subtotal: ${{ (detalle.cantidad * detalle.precio_unitario).toFixed(2) }}
                </div>
              </div>
            </div>

            <div v-if="formData.detalles.length > 0" class="mt-4 text-right">
              <div class="text-lg font-bold text-gray-800">
                Total: ${{ calcularTotal().toFixed(2) }}
              </div>
            </div>
          </div>
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
            :disabled="!formularioValido"
            :class="{ 'opacity-50 cursor-not-allowed': !formularioValido }"
          >
            <span>Guardar</span>
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
import { ref, onMounted, computed } from "vue";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
  rol?: {
    id: number;
    nombre: string;
  };
}

interface Producto {
  id: number;
  nombre: string;
  imagen_url?: string;
  maneja_stock?: boolean;
}

interface DetalleIngreso {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

interface FormData {
  usuario_id: number;
  estado: string;
  detalles: DetalleIngreso[];
}

// Props y Emits
const props = defineProps<{
  mostrar: boolean;
}>();

const emit = defineEmits<{
  (e: "cerrar"): void;
  (e: "guardar"): void;
}>();

// Estado
const formData = ref<FormData>({
  usuario_id: 0,
  estado: "CONSOLIDADO", // Por defecto
  detalles: []
});

const errorMensaje = ref("");
const usuarios = ref<Usuario[]>([]);
const productos = ref<Producto[]>([]);
const productoBusqueda = ref<string[]>([]);
const mostrarListaProductos = ref<boolean[]>([]);
const productosFiltrados = ref<Producto[][]>([]);

// Computed
const formularioValido = computed(() => {
  // Verificar que haya al menos un detalle
  if (formData.value.detalles.length === 0) return false;
  
  // Verificar que todos los detalles tengan un producto seleccionado
  const todosProductosSeleccionados = formData.value.detalles.every(detalle => detalle.producto_id > 0);
  
  return todosProductosSeleccionados;
});

// Métodos
const cargarUsuarios = async () => {
  try {
    const data = await window.api.getUsuarios();
    // Filtrar usuarios con rol ADMIN
    usuarios.value = data.filter((usuario: Usuario) => 
      usuario.rol && usuario.rol.nombre === "ADMIN"
    );
    
    // Establecer el primer usuario como predeterminado si hay alguno
    if (usuarios.value.length > 0) {
      formData.value.usuario_id = usuarios.value[0].id;
    }
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    errorMensaje.value = "Error al cargar la lista de usuarios";
  }
};

const cargarProductos = async () => {
  try {
    const data = await window.api.getProductos();
    // Filtrar productos que manejan stock
    productos.value = data.filter((producto: Producto) => producto.maneja_stock === true);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    errorMensaje.value = "Error al cargar la lista de productos";
  }
};

const agregarDetalle = () => {
  formData.value.detalles.push({
    producto_id: 0,
    cantidad: 1,
    precio_unitario: 1
  });
  
  // Inicializar arrays para búsqueda
  const index = formData.value.detalles.length - 1;
  productoBusqueda.value[index] = '';
  mostrarListaProductos.value[index] = false;
  productosFiltrados.value[index] = [...productos.value];
};

const eliminarDetalle = (index: number) => {
  formData.value.detalles.splice(index, 1);
  productoBusqueda.value.splice(index, 1);
  mostrarListaProductos.value.splice(index, 1);
  productosFiltrados.value.splice(index, 1);
};

const filtrarProductos = (index: number) => {
  const busqueda = productoBusqueda.value[index].toLowerCase();
  productosFiltrados.value[index] = productos.value.filter(producto => 
    producto.nombre.toLowerCase().includes(busqueda)
  );
  mostrarListaProductos.value[index] = true;
};

// Verificar si un producto ya está seleccionado en otro detalle
const productoYaSeleccionado = (productoId: number, currentIndex: number): boolean => {
  return formData.value.detalles.some((detalle, index) => 
    index !== currentIndex && detalle.producto_id === productoId
  );
};

const seleccionarProducto = (index: number, producto: Producto) => {
  // Verificar si el producto ya está seleccionado en otro detalle
  if (productoYaSeleccionado(producto.id, index)) {
    return; // No permitir seleccionar el mismo producto dos veces
  }
  
  formData.value.detalles[index].producto_id = producto.id;
  productoBusqueda.value[index] = producto.nombre;
  mostrarListaProductos.value[index] = false;
};

const calcularTotal = () => {
  return formData.value.detalles.reduce((total, detalle) => 
    total + (detalle.cantidad * detalle.precio_unitario), 0
  );
};

const cerrar = () => {
  emit("cerrar");
};

const guardar = async () => {
  try {
    errorMensaje.value = ""; // Limpiar errores previos
    
    if (formData.value.detalles.length === 0) {
      errorMensaje.value = "Debe agregar al menos un producto";
      return;
    }

    // Verificar que todos los productos tengan un ID válido
    const detallesInvalidos = formData.value.detalles.filter(detalle => !detalle.producto_id);
    if (detallesInvalidos.length > 0) {
      errorMensaje.value = "Todos los productos deben ser seleccionados correctamente";
      return;
    }

    // Verificar productos duplicados
    const productosIds = formData.value.detalles.map(detalle => detalle.producto_id);
    const productosUnicos = new Set(productosIds);
    if (productosIds.length !== productosUnicos.size) {
      errorMensaje.value = "No se pueden agregar productos duplicados";
      return;
    }

    // Asegurarse de que los detalles tengan el formato correcto
    const detallesFormateados = formData.value.detalles.map(detalle => ({
      producto_id: detalle.producto_id,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario
    }));

    console.log("Detalles formateados:", detallesFormateados);

    // Crear nuevo ingreso con los detalles formateados
    const resultado = await window.api.crearIngresoConDetalles({
      usuario_id: formData.value.usuario_id,
      estado: formData.value.estado,
      detalles: detallesFormateados
    });

    console.log('Resultado:', resultado);

    if (resultado.success) {
      emit("guardar");
    } else {
      throw new Error(resultado.message || "Error al guardar el ingreso");
    }
  } catch (error: any) {
    console.error("Error al guardar:", error);
    errorMensaje.value = error.message || "Ocurrió un error al guardar el ingreso";
  }
};

// Ciclo de vida
onMounted(() => {
  cargarUsuarios();
  cargarProductos();
});

// Cerrar lista de productos al hacer clic fuera
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative')) {
    mostrarListaProductos.value = mostrarListaProductos.value.map(() => false);
  }
});
</script>