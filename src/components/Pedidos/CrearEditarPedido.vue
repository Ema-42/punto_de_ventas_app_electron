<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl transform transition-all my-8 mx-4"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          {{ pedido?.id && !pedido.pedido_padre_id ? "Editar" : "Nuevo" }}
          Pedido
          <span
            v-if="pedido?.pedido_padre_id"
            class="text-sm font-normal text-gray-500"
          >
            (Agregado a Pedido #{{ pedido.num_pedido_dia }})
          </span>
        </h2>
        <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="guardar">
        <!-- Información básica del pedido -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="mesa"
            >
              Mesa
            </label>
            <select
              v-model="formData.mesa_id"
              required
              id="mesa"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            >
              <option
                v-for="mesa in mesaStore.mesas"
                :key="mesa.id"
                :value="mesa.id"
              >
                Mesa {{ mesa.numero }} ({{ mesa.estado }})
              </option>
            </select>
          </div>

          <div>
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="mesera"
            >
              Mesero/a
            </label>
            <select
              v-model="formData.mesera_id"
              id="mesera"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            >
              <option value="" disabled>Seleccione un mesero/a</option>
              <option
                v-for="usuario in meseros"
                :key="usuario.id"
                :value="usuario.id"
              >
                {{ usuario.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="cajero"
            >
              Cajero/a
            </label>
            <select
              v-model="formData.cajero_id"
              id="cajero"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            >
              <option value="" disabled>Seleccione un cajero/a</option>
              <option
                v-for="usuario in cajeros"
                :key="usuario.id"
                :value="usuario.id"
              >
                {{ usuario.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Pago
            </label>
            <div class="flex gap-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="formData.tipo_pago"
                  value="EFECTIVO"
                  class="form-radio h-5 w-5 text-red-600"
                />
                <span class="ml-2 text-gray-700">Efectivo</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="formData.tipo_pago"
                  value="TRANSFERENCIA"
                  class="form-radio h-5 w-5 text-red-600"
                />
                <span class="ml-2 text-gray-700">Transferencia</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Estado (solo visible al editar) -->
        <div v-if="pedido?.id && !pedido.pedido_padre_id" class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Estado
          </label>
          <div class="flex gap-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="formData.estado"
                value="EN_ATENCION"
                class="form-radio h-5 w-5 text-yellow-600"
              />
              <span class="ml-2 text-gray-700">En Atención</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="formData.estado"
                value="CONCLUIDO"
                class="form-radio h-5 w-5 text-green-600"
              />
              <span class="ml-2 text-gray-700">Concluido</span>
            </label>
          </div>
        </div>

        <!-- Layout horizontal para productos y detalles -->
        <div class="flex flex-col md:flex-row gap-6 mb-4">
          <!-- Columna izquierda: Productos -->
          <div class="w-full md:w-1/2">
            <h3 class="text-lg font-semibold mb-2">Productos</h3>

            <!-- Categorías de productos -->
            <div class="mb-4">
              <div class="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  @click="categoriaSeleccionada = ''"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium transition',
                    categoriaSeleccionada === ''
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  Ver Todo
                </button>
                <button
                  v-for="categoria in categorias"
                  :key="categoria.id"
                  type="button"
                  @click="categoriaSeleccionada = categoria.id"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium transition',
                    categoriaSeleccionada === categoria.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  {{ categoria.nombre }}
                </button>
              </div>

              <div class="relative">
                <input
                  v-model="searchProducto"
                  type="text"
                  placeholder="Buscar producto..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 pl-10"
                  @input="filtrarProductos"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Grid de productos -->
            <div
              class="grid grid-cols-2 sm:grid-cols-3 gap-3 h-[calc(100vh-500px)] overflow-y-auto"
            >
              <div
                v-for="producto in productosFiltrados"
                :key="producto.id"
                class="border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition"
                @click="agregarProductoADetalle(producto)"
              >
                <div class="flex flex-col items-center">
                  <div class="w-16 h-16 mb-2">
                    <img
                      v-if="producto.imagen_url"
                      :src="'local://' + producto.imagen_url"
                      class="w-full h-full object-cover rounded-lg shadow-sm"
                      alt=""
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-gray-400"
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
                  <div class="text-center">
                    <p class="font-medium text-sm truncate w-full">
                      {{ producto.nombre }}
                    </p>
                    <p class="text-gray-600 text-xs">${{ producto.precio }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Detalles del pedido -->
          <div class="w-full md:w-1/2">
            <h3 class="text-lg font-semibold mb-2">Detalles del Pedido</h3>
            <div class="border rounded-lg h-[calc(100vh-500px)] flex flex-col">
              <div class="overflow-y-auto flex-grow">
                <table class="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th
                        class="w-2/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Producto
                      </th>
                      <th
                        class="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Precio
                      </th>
                      <th
                        class="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cant.
                      </th>
                      <th
                        class="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Subtotal
                      </th>
                      <th
                        class="w-1/10 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(detalle, index) in detallesActivos"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td class="px-3 py-2 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-8 w-8 mr-2">
                            <img
                              v-if="detalle.producto?.imagen_url"
                              :src="'local://' + detalle.producto.imagen_url"
                              class="h-8 w-8 rounded-full object-cover"
                              alt=""
                            />
                            <div
                              v-else
                              class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-gray-400"
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
                          <div class="truncate max-w-[120px]">
                            <div
                              class="text-xs font-medium text-gray-900 truncate"
                            >
                              {{ detalle.producto?.nombre }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-xs text-gray-500"
                      >
                        ${{ detalle.precio_unitario }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap">
                        <div class="flex items-center">
                          <button
                            type="button"
                            @click="decrementarCantidad(index)"
                            class="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            v-model.number="detalle.cantidad"
                            type="number"
                            min="1"
                            class="mx-1 w-10 text-center border rounded-md text-xs"
                          />
                          <button
                            type="button"
                            @click="incrementarCantidad(index)"
                            class="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium"
                      >
                        ${{
                          (
                            detalle.cantidad *
                            parseFloat(detalle.precio_unitario.toString())
                          ).toFixed(2)
                        }}
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-center text-xs font-medium"
                      >
                        <button
                          type="button"
                          @click="eliminarDetalle(index)"
                          class="text-red-600 hover:text-red-900"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="detallesActivos.length === 0">
                      <td
                        colspan="5"
                        class="px-3 py-4 text-center text-gray-500 text-sm"
                      >
                        No hay productos agregados
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="bg-gray-50 p-4 border-t">
                <div class="flex justify-between items-center">
                  <span class="font-bold">Total:</span>
                  <span class="text-xl font-bold text-red-600"
                    >${{ calcularTotal() }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="errorMensaje"
          class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg"
        >
          {{ errorMensaje }}
        </div>

        <!-- Vista previa del ticket -->
        <div
          v-if="mostrarVistaPrevia"
          class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        >
          <div
            class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold">Vista previa del ticket</h3>
              <button
                @click="mostrarVistaPrevia = false"
                class="text-gray-500 hover:text-gray-700"
              >
                <span class="text-2xl">&times;</span>
              </button>
            </div>
            <div class="bg-white p-4 font-mono text-sm" id="ticket-preview">
              <!-- Información del restaurante (solo visible cuando el pedido está guardado) -->
              <div v-if="pedidoGuardado" class="text-center mb-4">
                <p class="font-bold text-lg">RESTAURANTE EJEMPLO</p>
                <p>Dirección: Calle Principal #123</p>
                <p>Tel: (123) 456-7890</p>
              </div>

              <div class="mb-4">
                <div class="flex justify-between">
                  <p>TICKET #: {{ formData.id || "NUEVO" }}</p>
                  <p>Fecha: {{ new Date().toLocaleString() }}</p>
                </div>
                <div class="flex justify-between">
                  <p>
                    Mesero:
                    {{
                      meseros.find((m) => m.id === formData.mesera_id)
                        ?.nombre || ""
                    }}
                  </p>
                  <p>
                    Cajero:
                    {{
                      cajeros.find((c) => c.id === formData.cajero_id)
                        ?.nombre || ""
                    }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p v-if="formData.mesa_id">
                    Mesa:
                    {{
                      mesaStore.mesas.find((m) => m.id === formData.mesa_id)
                        ?.numero || ""
                    }}
                  </p>
                  <p>Tipo de pago: {{ formData.tipo_pago }}</p>
                </div>
              </div>

              <div class="border-t border-b border-gray-300 py-2 mb-4">
                <div class="grid grid-cols-12 font-bold">
                  <div class="col-span-6">Producto</div>
                  <div class="col-span-2 text-center">Cant</div>
                  <div class="col-span-4 text-right">Precio</div>
                </div>
              </div>

              <div class="mb-4">
                <div
                  v-for="(detalle, index) in detallesActivos"
                  :key="index"
                  class="grid grid-cols-12 mb-1"
                >
                  <div class="col-span-6 truncate">
                    {{ detalle.producto?.nombre }}
                  </div>
                  <div class="col-span-2 text-center">
                    {{ detalle.cantidad }}
                  </div>
                  <div class="col-span-4 text-right">
                    ${{
                      (
                        detalle.cantidad *
                        parseFloat(detalle.precio_unitario.toString())
                      ).toFixed(2)
                    }}
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-300 pt-2 mb-4">
                <div class="flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span>${{ calcularTotal() }}</span>
                </div>
              </div>

              <!-- Nuevo: Sección de pago (solo visible si el pedido no está guardado) -->
              <div
                v-if="!pedidoGuardado"
                class="border-t border-gray-300 pt-4 mb-4"
              >
                <div class="mb-3">
                  <label class="block text-sm font-bold mb-1"
                    >Monto Recibido:</label
                  >
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 transform -translate-y-1/2"
                      >$</span
                    >
                    <input
                      v-model="montoRecibido"
                      type="number"
                      step="0.01"
                      min="0"
                      class="w-full px-3 py-2 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="block text-sm font-bold mb-1">Cambio:</label>
                  <div class="text-xl font-bold text-green-600">
                    ${{ calcularCambio() }}
                  </div>
                </div>
              </div>

              <div class="text-center mt-6">
                <p>¡Gracias por su preferencia!</p>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <!-- Mostrar botón de confirmar solo si el pedido no está guardado -->
              <button
                v-if="!pedidoGuardado"
                type="button"
                @click="confirmarPedido"
                :disabled="guardando"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <span>Confirmar Pedido</span>
                <svg
                  v-if="!guardando"
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

              <!-- Mostrar botón de imprimir solo si el pedido está guardado -->
              <button
                v-if="pedidoGuardado"
                type="button"
                @click="imprimirTicket"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Imprimir
              </button>

              <button
                type="button"
                @click="mostrarVistaPrevia = false"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="cerrar"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="detallesActivos.length === 0 || guardando"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{{
              pedido?.id ? "Agregar Pedido" : "Registrar Pedido"
            }}</span>
            <svg
              v-if="!guardando"
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
              class="animate-spin h-5 w-5 text-white"
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
import { ref, watch, onMounted, computed, watchEffect } from "vue";
import {
  EstadosMesa,
  Roles,
  TipoPago,
} from "../../../electron/main/modules/enums";
import { useMesaStore } from "../../stores/useMesaStore";
import { EstadoPedido } from "../../../electron/main/modules/interfaces";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const toast = useToast();
const mesaStore = useMesaStore();

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

interface Usuario {
  id: number;
  nombre: string;
  rol: {
    id: number;
    nombre: string;
  };
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url?: string;
  categoria?: {
    id: number;
    nombre: string;
  };
  stock: number;
  maneja_stock: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
}

const props = defineProps<{
  mostrar: boolean;
  pedido?: Pedido | null;
}>();

const emit = defineEmits<{
  (e: "cerrar"): void;
  (e: "guardar"): void;
}>();

// Estado
const errorMensaje = ref("");
const guardando = ref(false);

const usuarios = ref<Usuario[]>([]);
const productos = ref<Producto[]>([]);
const categorias = ref<Categoria[]>([]);
const productosFiltrados = ref<Producto[]>([]);
const searchProducto = ref("");
const categoriaSeleccionada = ref<number | string>("");
const mostrarVistaPrevia = ref(false);
const pedidoGuardado = ref(false);
const montoRecibido = ref(0); // Nueva variable para el monto recibido
const meseroIdealId = ref(0);
// Formulario
const formData = ref({
  id: 0,
  pedido_padre_id: null as number | null,
  mesa_id: 0,
  mesera_id: 0,
  cajero_id: 0,
  tipo_pago: "EFECTIVO",
  estado: "EN_ATENCION",
  detalles: [] as DetallePedido[],
});

// Computed
const meseros = computed(() => {
  return usuarios.value.filter((u) => u.rol.nombre === Roles.MESERO);
});

const cajeros = computed(() => {
  return usuarios.value.filter((u) => u.rol.nombre === Roles.CAJERO);
});

const detallesActivos = computed(() => {
  return formData.value.detalles.filter((d) => !d.eliminado);
});

// Métodos
const cargarMesas = async () => {
  try {
    const data = await window.api.getMesasByEstado(EstadosMesa.LIBRE);
    mesaStore.setMesas(data);
  } catch (error) {
    console.error("Error al cargar mesas:", error);
    mesaStore.mesas = [];
  }
};

const cargarUsuarios = async () => {
  try {
    if (window.api && window.api.getUsuarios) {
      const data = await window.api.getUsuarios();
      usuarios.value = data || [];
    }
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    usuarios.value = [];
  }
};

const cargarProductos = async () => {
  try {
    if (window.api && window.api.getProductos) {
      const data = await window.api.getProductos();
      productos.value = data || [];
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
    productos.value = [];
  }
};

const cargarCategorias = async () => {
  try {
    if (window.api && window.api.getCategorias) {
      const data = await window.api.getCategorias();
      categorias.value = data || [];
    }
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    categorias.value = [];
  }
};

const filtrarProductos = () => {
  let resultado = [...productos.value];

  // Filtrar por categoría
  if (categoriaSeleccionada.value) {
    resultado = resultado.filter(
      (p) => p.categoria?.id === categoriaSeleccionada.value
    );
  }

  // Filtrar por búsqueda
  if (searchProducto.value) {
    const query = searchProducto.value.toLowerCase();
    resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(query));
  }

  productosFiltrados.value = resultado;
};

const agregarProductoADetalle = (producto: Producto) => {
  // Verificar si el producto ya está en los detalles
  const index = formData.value.detalles.findIndex(
    (d) => d.producto_id === producto.id && !d.eliminado
  );

  if (index !== -1) {
    // Si ya existe, incrementar la cantidad
    formData.value.detalles[index].cantidad++;
  } else {
    // Si no existe, agregar nuevo detalle
    formData.value.detalles.push({
      producto_id: producto.id,
      cantidad: 1,
      precio_unitario: parseFloat(producto.precio.toString()),
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        imagen_url: producto.imagen_url,
        maneja_stock: producto.maneja_stock,
      },
    });
  }
};

const incrementarCantidad = (index: number) => {
  detallesActivos.value[index].cantidad++;
};

const decrementarCantidad = (index: number) => {
  if (detallesActivos.value[index].cantidad > 1) {
    detallesActivos.value[index].cantidad--;
  }
};

const eliminarDetalle = (index: number) => {
  const detalleReal = formData.value.detalles.findIndex(
    (d) => d === detallesActivos.value[index]
  );

  // Si el detalle tiene ID (ya existe en la BD), marcarlo como eliminado
  if (formData.value.detalles[detalleReal].id) {
    formData.value.detalles[detalleReal].eliminado = true;
  } else {
    // Si no tiene ID, eliminarlo del array
    formData.value.detalles.splice(detalleReal, 1);
  }
};

const calcularTotal = () => {
  return detallesActivos.value
    .reduce((total, detalle) => {
      return (
        total +
        detalle.cantidad * parseFloat(detalle.precio_unitario.toString())
      );
    }, 0)
    .toFixed(2);
};

// Nuevo método para calcular el cambio
const calcularCambio = () => {
  const total = parseFloat(calcularTotal());
  const cambio = montoRecibido.value - total;
  return cambio > 0 ? cambio.toFixed(2) : "0.00";
};

const cerrar = () => {
  if (guardando.value) return;

  errorMensaje.value = "";
  mostrarVistaPrevia.value = false;
  pedidoGuardado.value = false;
  emit("cerrar");
};

// Modificado para solo mostrar la vista previa
const guardar = async () => {
  try {
    errorMensaje.value = "";

    // Validaciones
    if (detallesActivos.value.length === 0) {
      errorMensaje.value = "Debe agregar al menos un producto al pedido";
      return;
    }

    // Mostrar vista previa sin guardar
    mostrarVistaPrevia.value = true;

    // Establecer el monto recibido al total por defecto
    montoRecibido.value = parseFloat(calcularTotal());
  } catch (error: any) {
    errorMensaje.value =
      error.message || "Ocurrió un error al procesar el pedido";
  }
};

// Nuevo método para confirmar y guardar el pedido
const confirmarPedido = async () => {
  try {
    guardando.value = true;
    errorMensaje.value = "";

    const total = parseFloat(calcularTotal());
    if (montoRecibido.value < total) {
      errorMensaje.value = "El monto recibido es menor que el total";
      guardando.value = false;
      return;
    }

    const pedidoData = {
      ...(formData.value.id ? { id: formData.value.id } : {}),
      pedido_padre_id: formData.value.pedido_padre_id,
      mesa_id: formData.value.mesa_id,
      mesera_id: formData.value.mesera_id,
      cajero_id: formData.value.cajero_id,
      tipo_pago: formData.value.tipo_pago,
      estado: formData.value.estado,
      detalles: formData.value.detalles
        .filter((d) => !d.eliminado || d.id) // Incluir eliminados solo si tienen ID
        .map((d) => ({
          ...(d.id ? { id: d.id } : {}),
          producto_id: d.producto_id,
          cantidad: d.cantidad,
          precio_unitario: parseFloat(d.precio_unitario.toString()),
          ...(d.eliminado ? { eliminado: true } : {}),
        })),
    };

    const result = await window.api.crearPedidoConDetalles(pedidoData);

    if (result instanceof Error) {
      throw result;
    }

    if (result.success) {
      pedidoGuardado.value = true;
      toast.success("Pedido registrado con éxito!");
    } else {
      throw new Error(result.message || "Error al guardar el pedido");
    }
  } catch (error: any) {
    errorMensaje.value =
      error.message || "Ocurrió un error al guardar el pedido";
  } finally {
    guardando.value = false;
  }
};

const imprimirTicket = () => {
  try {
    // Obtener el contenido del ticket
    const ticketContent = document.getElementById("ticket-preview");

    // Crear un iframe para imprimir
    const printIframe = document.createElement("iframe");
    printIframe.style.position = "absolute";
    printIframe.style.top = "-9999px";
    document.body.appendChild(printIframe);

    // Escribir el contenido en el iframe
    const printDocument =
      printIframe.contentDocument || printIframe.contentWindow?.document;
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
            </style>
          </head>
          <body>
            ${ticketContent?.innerHTML || ""}
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
        if (pedidoGuardado.value) {
          emit("guardar");
        }
      }, 500);
    }
  } catch (error) {
    console.error("Error al imprimir ticket:", error);
    errorMensaje.value = "Error al imprimir el ticket";
  }
};

// Seleccionar valores aleatorios para nuevo pedido
const seleccionarValoresPorDefecto = async () => {
  // Solo si es un pedido nuevo y no es un pedido hijo
  if (!props.pedido?.id && !props.pedido?.pedido_padre_id) {
    if (mesaStore.mesas.length > 0) {
      formData.value.mesa_id = mesaStore.mesas[0].id;
    }
    //usuario logueado sera cajero
    formData.value.cajero_id = authStore.user?.id || 0;
    //mesero mas libre sera elegido por defecto
    const mesero = await window.api.getMeseroMasLibre();
    meseroIdealId.value = mesero[0].id;
    formData.value.mesera_id = meseroIdealId.value;
  }
};
// Inicializar formulario cuando cambia el pedido
watch(
  () => props.pedido,
  async (newPedido) => {
    if (newPedido && newPedido.id !== 0) {
      console.log("AGREGAR pedido", props.pedido);
      formData.value = {
        id: newPedido.id,
        pedido_padre_id: newPedido.pedido_padre_id || null,
        mesa_id: newPedido.mesa_id || 0,
        mesera_id: newPedido.mesera_id,
        cajero_id: newPedido.cajero_id,
        tipo_pago: newPedido.tipo_pago || TipoPago.EFECTIVO,
        estado: EstadoPedido.EN_PREPARACION,
        detalles: [],
      };
    } else if (props.pedido?.id === 0) {
      console.log("Nuevo pedido", props.pedido);
      formData.value = {
        id: 0,
        pedido_padre_id: null,
        mesa_id: 0,
        mesera_id: 0,
        cajero_id: 0,
        tipo_pago: TipoPago.EFECTIVO,
        estado: EstadoPedido.EN_PREPARACION,
        detalles: [],
      };
      seleccionarValoresPorDefecto();
    }

    errorMensaje.value = "";
    mostrarVistaPrevia.value = false;
    pedidoGuardado.value = false;
    montoRecibido.value = 0;
  },
  { immediate: true }
);
// Observar cambios en la categoría seleccionada
watch(categoriaSeleccionada, () => {
  filtrarProductos();
});
watchEffect(() => {
  if (mesaStore.mesas.length > 0 && !formData.value.mesa_id) {
    formData.value.mesa_id = mesaStore.mesas[0].id;
  }
});

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarMesas(),
    cargarUsuarios(),
    cargarProductos(),
    cargarCategorias(),
  ]);
  filtrarProductos();
});
</script>

