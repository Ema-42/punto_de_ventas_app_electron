<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl h-[80vh] flex flex-col"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Nuevo Ingreso</h2>
        <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <!-- Mensaje de error -->
      <div
        v-if="errorMensaje"
        class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
      >
        {{ errorMensaje }}
      </div>

      <form @submit.prevent="guardar" class="flex flex-col h-full">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="usuario"
          >
            Usuario
          </label>
          <select
            v-model="formData.usuario_id"
            id="usuario"
            required
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-100"
          >
            <option value="" disabled>Seleccione un usuario</option>
            <option
              v-for="usuario in usuarios"
              :key="usuario.id"
              :value="usuario.id"
            >
              {{ usuario.nombre }}
            </option>
          </select>
        </div>

        <!-- Formulario para agregar producto -->
        <div class="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">
            Agregar Producto
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div class="col-span-5">
              <label class="block text-gray-700 text-xs font-medium mb-1">
                Producto <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="nuevoDetalle.busqueda"
                  type="text"
                  placeholder="Buscar producto..."
                  class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                  :class="{
                    'border-red-300': !nuevoDetalle.producto_id,
                    'border-gray-300': nuevoDetalle.producto_id,
                  }"
                  @input="filtrarProductosNuevo"
                  @focus="nuevoDetalle.mostrarLista = true"
                />
                <div
                  v-if="
                    nuevoDetalle.mostrarLista &&
                    nuevoDetalle.productosFiltrados.length > 0
                  "
                  class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                >
                  <div
                    v-for="producto in nuevoDetalle.productosFiltrados"
                    :key="producto.id"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    :class="{
                      'opacity-50 cursor-not-allowed': productoYaSeleccionado(
                        producto.id,
                        -1
                      ),
                    }"
                    @click="
                      !productoYaSeleccionado(producto.id, -1) &&
                        seleccionarProductoNuevo(producto)
                    "
                  >
                    {{ producto.nombre }}
                    <span
                      v-if="productoYaSeleccionado(producto.id, -1)"
                      class="text-red-500 text-xs ml-2"
                    >
                      (Ya seleccionado)
                    </span>
                  </div>
                </div>
                <div
                  v-if="!nuevoDetalle.producto_id && nuevoDetalle.mostrarError"
                  class="text-red-500 text-xs mt-1"
                >
                  Debe seleccionar un producto
                </div>
              </div>
            </div>

            <div class="col-span-2">
              <label class="block text-gray-700 text-xs font-medium mb-1">
                Cantidad <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="nuevoDetalle.cantidad"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-gray-700 text-xs font-medium mb-1">
                Precio Unitario <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="nuevoDetalle.precio_unitario"
                type="number"
                min="1"
                step="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              />
            </div>

            <div class="col-span-3 flex items-end">
              <div class="flex justify-between w-full">
                <div class="text-md font-medium text-gray-700 mb-2">
                  Subtotal: ${{ calcularSubtotalNuevo.toFixed(2) }}
                </div>
                <button
                  type="button"
                  @click="agregarDetalleALista"
                  class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 text-sm"
                  :disabled="!nuevoDetalleValido"
                  :class="{
                    'opacity-50 cursor-not-allowed': !nuevoDetalleValido,
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de detalles agregados -->
        <div class="flex-grow flex flex-col overflow-hidden">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            Productos Agregados
          </h3>
          <div
            class="bg-gray-200 p-2 rounded-lg h-52 overflow-y-auto flex-grow border border-gray-300"
          >
            <div
              v-if="formData.detalles.length === 0"
              class="text-center py-4 text-gray-500"
            >
              No hay productos agregados. Complete el formulario superior y haga
              clic en "Agregar".
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(detalle, index) in formData.detalles"
                :key="index"
                class="bg-white px-4 p-2 rounded-lg shadow-sm border border-gray-200"
              >
                <div class="flex items-center justify-between">
                  <div class="grid grid-cols-12 gap-3 w-full">
                    <div class="col-span-5 flex items-center">
                      <span class="font-medium text-gray-700">
                        {{ obtenerNombreProducto(detalle.producto_id) }}
                      </span>
                    </div>

                    <div class="col-span-2">
                      <div class="flex flex-col">
                        <label class="text-xs text-gray-500">Cantidad</label>
                        <input
                          v-model.number="detalle.cantidad"
                          type="number"
                          min="1"
                          required
                          class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 text-sm"
                        />
                      </div>
                    </div>

                    <div class="col-span-2">
                      <div class="flex flex-col">
                        <label class="text-xs text-gray-500">Precio</label>
                        <input
                          v-model.number="detalle.precio_unitario"
                          type="number"
                          min="1"
                          step="1"
                          required
                          class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 text-sm"
                        />
                      </div>
                    </div>

                    <div class="col-span-2 flex items-center justify-between">
                      <div class="text-sm font-medium text-gray-700">
                        ${{
                          (detalle.cantidad * detalle.precio_unitario).toFixed(
                            2
                          )
                        }}
                      </div>
                      <button
                        type="button"
                        @click="eliminarDetalle(index)"
                        class="text-red-500 hover:text-red-700 ml-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pb-0 sm:pb-4 mb-4 sm:mb-4 md:mb-0 pt-2">
          <div class="flex gap-2 justify-end">
            <div
              v-if="formData.detalles.length > 0"
              class="text-2xl font-bold text-gray-800"
            >
              Total: ${{ calcularTotal().toFixed(2) }}
            </div>
            <button
              type="button"
              @click="cerrar"
              class="flex px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              :disabled="!formularioValido"
              :class="{ 'opacity-50 cursor-not-allowed': !formularioValido }"
            >
              <span>Registrar Ingreso</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { Roles } from "../../../electron/main/modules/enums";

const authStore = useAuthStore();
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

interface NuevoDetalle {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  busqueda: string;
  mostrarLista: boolean;
  mostrarError: boolean;
  productosFiltrados: Producto[];
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
  detalles: [],
});

// Estado para el nuevo detalle (formulario superior)
const nuevoDetalle = ref<NuevoDetalle>({
  producto_id: 0,
  cantidad: 1,
  precio_unitario: 1,
  busqueda: "",
  mostrarLista: false,
  mostrarError: false,
  productosFiltrados: [],
});

const errorMensaje = ref("");
const usuarios = ref<Usuario[]>([]);
const productos = ref<Producto[]>([]);

// Computed
const formularioValido = computed(() => {
  // Verificar que haya al menos un detalle
  return formData.value.detalles.length > 0;
});

const nuevoDetalleValido = computed(() => {
  return (
    nuevoDetalle.value.producto_id > 0 &&
    nuevoDetalle.value.cantidad > 0 &&
    nuevoDetalle.value.precio_unitario > 0
  );
});

const calcularSubtotalNuevo = computed(() => {
  return nuevoDetalle.value.cantidad * nuevoDetalle.value.precio_unitario;
});

// Métodos
const cargarUsuarios = async () => {
  try {
    const data = await window.api.getUsuarios();
    // Filtrar usuarios con rol ADMIN
    usuarios.value = data.filter(
      (usuario: Usuario) => usuario.rol && usuario.rol.nombre === Roles.ADMIN
    );
    if (usuarios.value.length > 0) {
      //formData.value.usuario_id = usuarios.value[0].id;
      formData.value.usuario_id = authStore.user?.id || 0;
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
    productos.value = data.filter(
      (producto: Producto) => producto.maneja_stock === true
    );
    // Inicializar los productos filtrados
    nuevoDetalle.value.productosFiltrados = [...productos.value];
  } catch (error) {
    console.error("Error al cargar productos:", error);
    errorMensaje.value = "Error al cargar la lista de productos";
  }
};

// Método para filtrar productos en el nuevo detalle
const filtrarProductosNuevo = () => {
  const busqueda = nuevoDetalle.value.busqueda.toLowerCase();
  nuevoDetalle.value.productosFiltrados = productos.value.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda)
  );
  nuevoDetalle.value.mostrarLista = true;
};

// Método para seleccionar un producto en el nuevo detalle
const seleccionarProductoNuevo = (producto: Producto) => {
  // Verificar si el producto ya está seleccionado en otro detalle
  if (productoYaSeleccionado(producto.id, -1)) {
    return; // No permitir seleccionar el mismo producto dos veces
  }

  nuevoDetalle.value.producto_id = producto.id;
  nuevoDetalle.value.busqueda = producto.nombre;
  nuevoDetalle.value.mostrarLista = false;
  nuevoDetalle.value.mostrarError = false;
};

// Método para agregar el detalle actual a la lista
const agregarDetalleALista = () => {
  if (!nuevoDetalleValido.value) {
    nuevoDetalle.value.mostrarError = true;
    return;
  }

  // Agregar el detalle a la lista
  formData.value.detalles.push({
    producto_id: nuevoDetalle.value.producto_id,
    cantidad: nuevoDetalle.value.cantidad,
    precio_unitario: nuevoDetalle.value.precio_unitario,
  });

  // Limpiar el formulario para un nuevo detalle
  nuevoDetalle.value = {
    producto_id: 0,
    cantidad: 1,
    precio_unitario: 1,
    busqueda: "",
    mostrarLista: false,
    mostrarError: false,
    productosFiltrados: [...productos.value],
  };
};

const eliminarDetalle = (index: number) => {
  formData.value.detalles.splice(index, 1);
};

// Verificar si un producto ya está seleccionado en otro detalle
const productoYaSeleccionado = (
  productoId: number,
  currentIndex: number
): boolean => {
  return formData.value.detalles.some(
    (detalle) => detalle.producto_id === productoId
  );
};

// Obtener el nombre de un producto por su ID
const obtenerNombreProducto = (productoId: number): string => {
  const producto = productos.value.find((p) => p.id === productoId);
  return producto ? producto.nombre : `Producto #${productoId}`;
};

const calcularTotal = () => {
  return formData.value.detalles.reduce(
    (total, detalle) => total + detalle.cantidad * detalle.precio_unitario,
    0
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

    // Asegurarse de que los detalles tengan el formato correcto
    const detallesFormateados = formData.value.detalles.map((detalle) => ({
      producto_id: detalle.producto_id,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
    }));

    console.log("Detalles formateados:", detallesFormateados);

    // Crear nuevo ingreso con los detalles formateados
    const resultado = await window.api.crearIngresoConDetalles({
      usuario_id: formData.value.usuario_id,
      estado: formData.value.estado,
      detalles: detallesFormateados,
    });

    console.log("Resultado:", resultado);

    if (resultado.success) {
      formData.value.detalles = [];
      emit("guardar");
    } else {
      throw new Error(resultado.message || "Error al guardar el ingreso");
    }
  } catch (error: any) {
    console.error("Error al guardar:", error);
    errorMensaje.value =
      error.message || "Ocurrió un error al guardar el ingreso";
  }
};

// Cerrar lista de productos al hacer clic fuera
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".relative")) {
    nuevoDetalle.value.mostrarLista = false;
  }
});

// Ciclo de vida
onMounted(() => {
  cargarUsuarios();
  cargarProductos();
});
</script>
