<template>
  <div
    v-if="mostrar && pedido"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl transform transition-all my-8 mx-4"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          Detalles del Pedido N° {{ pedido.num_pedido_dia || pedido.id }}
        </h2>
        <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
  
      <!-- Información del pedido -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-red-50 p-4 rounded-lg border border-red-600">
        <div>
          <p class="font-medium text-sm text-red-600">Mesa</p>
          <p>
            {{ pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Sin mesa" }}
          </p>
        </div>
        <div>
          <p class="font-medium text-sm text-red-600">Mesero/a</p>
          <p>{{ pedido.mesera.nombre }}</p>
        </div>
        <div>
          <p class="font-medium text-sm text-red-600">Cajero/a</p>
          <p>{{ pedido.cajero.nombre }}</p>
        </div>
        <div>
          <p class="font-medium text-sm text-red-600">Estado</p>
          <p>
            <span :class="getEstadoClase(pedido.estado)">
              {{ getEstadoEtiqueta(pedido.estado) }}
            </span>
          </p>
        </div>
        <div>
          <p class="font-medium text-sm text-red-600">Fecha de creación</p>
          <p>{{ formatearFecha(pedido.fecha_creacion) }}</p>
        </div>
        <div v-if="pedido.fecha_concluido">
          <p class=" font-medium text-sm text-red-600">Fecha de conclusión</p>
          <p>{{ formatearFecha(pedido.fecha_concluido) }}</p>
        </div>
        <div>
          <p class="font-medium text-sm text-red-600">Tipo de pago</p>
          <p>{{ pedido.tipo_pago || "No especificado" }}</p>
        </div>
      </div>
  
      <div class="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
        <!-- Detalles del pedido principal -->
        <div class="mb-6">
          
          <h3 class="text-lg font-semibold mb-2 text-red-600 flex items-center">Productos 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-2 text-red-500"
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
          </h3>
          <div class="overflow-x-auto border rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-red-600 sticky top-0">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Producto
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Precio Unitario
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="detalle in pedido.detalles" :key="detalle.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 mr-3">
                        <img
                          v-if="detalle.producto?.imagen_url"
                          :src="'local://' + detalle.producto.imagen_url"
                          class="h-10 w-10 rounded-full object-cover"
                          alt=""
                        />
                        <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ detalle.producto?.nombre }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ detalle.precio_unitario }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ detalle.cantidad }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${{ (detalle.cantidad * parseFloat(detalle.precio_unitario.toString())).toFixed(2) }}
                  </td>
                </tr>
                <tr v-if="pedido.detalles.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    No hay productos en este pedido
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-red-50">
                  <td colspan="4" class="px-6 py-3">
                    <div class="flex justify-between items-center">
                      <span class="font-medium">Tipo de pago: {{ pedido.tipo_pago || "No especificado" }}</span>
                      <span class="font-bold">Subtotal: ${{ calcularTotalPedido(pedido) }}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <!-- Botón de imprimir para el pedido principal -->
          <div class="bg-white-50 px-4 py-2 flex justify-end mt-2 rounded-lg">
            <button
              type="button"
              @click="mostrarTicketIndividual"
              class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 text-sm"
            >
              <span>Imprimir</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Pedidos agregados (hijos) -->
        <div v-if="pedidosHijos.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-red-600 flex items-center">
             Pedidos Agregados
             <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6 ml-2 text-red-500" 
              fill="currentColor" 
              viewBox="0 -960 960 960" 
              stroke="currentColor"
              >
              <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" 
              />
              </svg>
            </h3>


          <div v-for="(hijo, index) in pedidosHijos" :key="hijo.id" class="mb-4 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 flex justify-between items-center border">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <h4>Pedido adicional N° {{ index + 1 }}</h4>
              </div>
              <div class="text-sm font-medium">
                <span class="text-gray-600 text-sm">{{ formatearFecha(hijo.fecha_creacion) }}</span>
              </div>
            </div>
            <div class="overflow-x-auto border rounded-b-lg ">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-red-600">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Producto
                    </th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Precio Unitario
                    </th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="detalle in hijo.detalles" :key="detalle.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 mr-3">
                          <img
                            v-if="detalle.producto?.imagen_url"
                            :src="'local://' + detalle.producto.imagen_url"
                            class="h-10 w-10 rounded-full object-cover"
                            alt=""
                          />
                          <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ detalle.producto?.nombre }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${{ detalle.precio_unitario }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ detalle.cantidad }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${{ (detalle.cantidad * parseFloat(detalle.precio_unitario.toString())).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-red-50">
                    <td colspan="4" class="px-6 py-3">
                      <div class="flex justify-between items-center">
                        <span class="">Tipo de pago: {{ hijo.tipo_pago || "No especificado" }}</span>
                        <span class="font-bold">Subtotal: ${{ calcularTotalPedido(hijo) }}</span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <!-- Botón de imprimir para cada pedido adicional -->
            <div class="bg-white px-4 py-2 flex justify-end">
              <button
                type="button"
                @click="mostrarTicketHijo(hijo)"
                class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 text-sm"
              >
                <span>Imprimir</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Total global -->
      <div class="bg-gray-100 p-4 rounded-lg mb-6">
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-red-600">Total Global:</span>
          <span class="text-xl font-bold text-red-600">${{ calcularTotalGlobal() }}</span>
        </div>
      </div>
  
      <!-- Vista previa del ticket -->
      <div v-if="mostrarVistaPrevia" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">Vista previa del ticket</h3>
            <button @click="mostrarVistaPrevia = false" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="bg-white p-4 font-mono text-sm" id="ticket-preview">
            <div class="text-center mb-4">
              <p class="font-bold text-lg">RESTAURANTE EJEMPLO</p>
              <p>Dirección: Calle Principal #123</p>
              <p>Tel: (123) 456-7890</p>
            </div>
            
            <div class="mb-4">
              <p>TICKET #: {{ pedidoParaImprimir?.num_pedido_dia || pedidoParaImprimir?.id }}</p>
              <p>Fecha: {{ formatearFecha(pedidoParaImprimir?.fecha_creacion) }}</p>
              <p>Mesero: {{ pedidoParaImprimir?.mesera.nombre }}</p>
              <p>Cajero: {{ pedidoParaImprimir?.cajero.nombre }}</p>
              <p v-if="pedidoParaImprimir?.mesa_id">
                Mesa: {{ pedidoParaImprimir?.mesa?.numero || "" }}
              </p>
              <p>Tipo de pago: {{ pedidoParaImprimir?.tipo_pago || "No especificado" }}</p>
              <p>Estado: {{ getEstadoEtiqueta(pedidoParaImprimir?.estado) }}</p>
            </div>
            
            <div class="border-t border-b border-gray-300 py-2 mb-4">
              <div class="grid grid-cols-12 font-bold">
                <div class="col-span-6">Producto</div>
                <div class="col-span-2 text-center">Cant</div>
                <div class="col-span-4 text-right">Precio</div>
              </div>
            </div>
            
            <div class="mb-4">
              <div v-for="(detalle, index) in pedidoParaImprimir?.detalles" :key="index" class="grid grid-cols-12 mb-1">
                <div class="col-span-6 truncate">{{ detalle.producto?.nombre }}</div>
                <div class="col-span-2 text-center">{{ detalle.cantidad }}</div>
                <div class="col-span-4 text-right">${{ (detalle.cantidad * parseFloat(detalle.precio_unitario.toString())).toFixed(2) }}</div>
              </div>
            </div>
            
            <div class="border-t border-gray-300 pt-2 mb-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Tipo de pago: {{ pedidoParaImprimir?.tipo_pago || "No especificado" }}</span>
                <span class="font-medium">Subtotal: ${{ pedidoParaImprimir ? calcularTotalPedido(pedidoParaImprimir) : '0.00' }}</span>
              </div>
            </div>
            
            <!-- Pedidos agregados -->
            <div v-if="imprimirConAgregados && pedidosHijos.length > 0" class="mb-4">
              <p class="font-bold">AGREGADOS:</p>
              <div v-for="(hijo, index) in pedidosHijos" :key="index" class="mt-2">
                <p>Pedido adicional #{{ index + 1 }}:</p>
                <div v-for="(detalle, i) in hijo.detalles" :key="i" class="grid grid-cols-12 mb-1 pl-2">
                  <div class="col-span-6 truncate">{{ detalle.producto?.nombre }}</div>
                  <div class="col-span-2 text-center">{{ detalle.cantidad }}</div>
                  <div class="col-span-4 text-right">${{ (detalle.cantidad * parseFloat(detalle.precio_unitario.toString())).toFixed(2) }}</div>
                </div>
                <div class="flex justify-between pl-2 mt-1">
                  <span>Tipo de pago: {{ hijo.tipo_pago || "No especificado" }}</span>
                  <span>Subtotal: ${{ calcularTotalPedido(hijo) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Total global -->
            <div class="border-t border-gray-300 pt-2 mb-4">
              <div class="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>${{ imprimirConAgregados ? calcularTotalGlobal() : (pedidoParaImprimir ? calcularTotalPedido(pedidoParaImprimir) : '0.00') }}</span>
              </div>
            </div>
            
            <div class="text-center mt-6">
              <p>¡Gracias por su preferencia!</p>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              @click="imprimirTicket"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Imprimir
            </button>
          </div>
        </div>
      </div>
  
      <div class="flex justify-end gap-2">
        
        <button
          v-if="pedidosHijos.length > 0"
          type="button"
          @click="mostrarTicketCompleto"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>Imprimir Completo</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </button>
        <button
          type="button"
          @click="cerrar"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

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
}>();

// Estado
const pedidosHijos = ref<Pedido[]>([]);
const mostrarVistaPrevia = ref(false);
const imprimirConAgregados = ref(false);
const pedidoParaImprimir = ref<Pedido | null>(null);

// Métodos
const cargarPedidosHijos = async () => {
  if (!props.pedido) return;

  try {
    if (window.api && window.api.getPedidos) {
      const pedidos = await window.api.getPedidos();
      pedidosHijos.value = pedidos.filter(
        (p: Pedido) => p.pedido_padre_id === props.pedido?.id
      );
    } else {
      // Simulación si no hay API
      pedidosHijos.value = [];
    }
  } catch (error) {
    console.error("Error al cargar pedidos hijos:", error);
    pedidosHijos.value = [];
  }
};

const formatearFecha = (fecha?: string) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEstadoEtiqueta = (estado?: string) => {
  const estados: { [key: string]: string } = {
    EN_ATENCION: "En Atención",
    CONCLUIDO: "Concluido",
  };
  return estados[estado || ""] || estado || "";
};

const getEstadoClase = (estado?: string) => {
  const clases: { [key: string]: string } = {
    EN_ATENCION:
      "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium",
    CONCLUIDO:
      "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium",
  };
  return clases[estado || ""] || "";
};

const calcularTotalPedido = (pedido: Pedido) => {
  return pedido.detalles
    .reduce((total, detalle) => {
      return total + detalle.cantidad * parseFloat(detalle.precio_unitario.toString());
    }, 0)
    .toFixed(2);
};

const calcularTotalGlobal = () => {
  let total = 0;

  // Sumar el total del pedido principal
  if (props.pedido) {
    total += props.pedido.detalles.reduce(
      (sum, detalle) => sum + detalle.cantidad * parseFloat(detalle.precio_unitario.toString()),
      0
    );
  }

  // Sumar los totales de los pedidos hijos
  pedidosHijos.value.forEach(hijo => {
    total += hijo.detalles.reduce(
      (sum, detalle) => sum + detalle.cantidad * parseFloat(detalle.precio_unitario.toString()),
      0
    );
  });

  return total.toFixed(2);
};

const cerrar = () => {
  mostrarVistaPrevia.value = false;
  emit("cerrar");
};

const mostrarTicketIndividual = () => {
  pedidoParaImprimir.value = props.pedido;
  imprimirConAgregados.value = false;
  mostrarVistaPrevia.value = true;
};

const mostrarTicketCompleto = () => {
  pedidoParaImprimir.value = props.pedido;
  imprimirConAgregados.value = true;
  mostrarVistaPrevia.value = true;
};

// Nuevo método para mostrar el ticket de un pedido hijo específico
const mostrarTicketHijo = (hijo: Pedido) => {
  pedidoParaImprimir.value = hijo;
  imprimirConAgregados.value = false;
  mostrarVistaPrevia.value = true;
};

const imprimirTicket = () => {
  try {
    // Obtener el contenido del ticket
    const ticketContent = document.getElementById('ticket-preview');
    
    // Crear un iframe para imprimir
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'absolute';
    print.style.position = 'absolute';
    printIframe.style.top = '-9999px';
    document.body.appendChild(printIframe);
    
    // Escribir el contenido en el iframe
    const printDocument = printIframe.contentDocument || printIframe.contentWindow?.document;
    if (printDocument) {
      printDocument.open();
      printDocument.write(`
        <html>
          <head>
            <title>Ticket de Pedido</title>
            <style>
              body {
                font-family: monospace;
                font-size: 12px;
                width: 80mm;
                margin: 0;
                padding: 10px;
              }
              .text-center { text-align: center; }
              .mb-4 { margin-bottom: 16px; }
              .font-bold { font-weight: bold; }
              .text-lg { font-size: 16px; }
              .border-t, .border-b { border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; }
              .py-2 { padding-top: 8px; padding-bottom: 8px; }
              .grid { display: grid; }
              .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
              .col-span-6 { grid-column: span 6 / span 6; }
              .col-span-2 { grid-column: span 2 / span 2; }
              .col-span-4 { grid-column: span 4 / span 4; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
              .mb-1 { margin-bottom: 4px; }
              .pt-2 { padding-top: 8px; }
              .mt-6 { margin-top: 24px; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .pl-2 { padding-left: 8px; }
              .mt-1 { margin-top: 4px; }
              .mt-2 { margin-top: 8px; }
            </style>
          </head>
          <body>
            ${ticketContent?.innerHTML || ''}
          </body>
        </html>
      `);
      printDocument.close();
      
      // Imprimir y eliminar el iframe
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();
      
      // Eliminar el iframe después de imprimir
      setTimeout(() => {
        document.body.removeChild(printIframe);
      }, 500);
    }
  } catch (error) {
    console.error("Error al imprimir ticket:", error);
  }
};

// Observar cambios en el pedido
watch(
  () => props.pedido,
  () => {
    if (props.pedido && props.mostrar) {
      cargarPedidosHijos();
    }
  }
);

// Observar cambios en mostrar
watch(
  () => props.mostrar,
  (newValue) => {
    if (newValue && props.pedido) {
      cargarPedidosHijos();
    }
  }
);

// Cargar datos al montar el componente
onMounted(() => {
  if (props.mostrar && props.pedido) {
    cargarPedidosHijos();
  }
});
</script>