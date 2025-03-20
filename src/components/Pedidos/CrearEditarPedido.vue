<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-y-auto"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl transform transition-all my-8 mx-4"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          {{ pedido?.pedido_padre_id ? "Agregar" : "Nuevo" }}
          Pedido Nº {{ numeroPedidoDia }}
          <span
            v-if="pedido?.pedido_padre_id"
            class="px-3 py-1 bg-green-600 text-white text-lg font-semibold rounded-lg"
          >
            En la mesa: {{ pedido.mesa?.numero }}
          </span>
        </h2>
        <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <form @submit.prevent="guardar">
        <!-- Información básica del pedido -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="mesa"
            >
              Mesa
            </label>
            <select
              v-model="formData.mesa_id"
              id="mesa"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              :class="{
                'bg-green-300 cursor-not-allowed': pedido?.pedido_padre_id,
                'bg-white cursor-pointer': !pedido?.pedido_padre_id,
              }"
              :disabled="!!pedido?.pedido_padre_id || formData.para_llevar"
            >
              <option v-if="pedido?.pedido_padre_id" :value="pedido.mesa?.id">
                Misma Mesa
              </option>
              <option
                v-if="formData.para_llevar"
                :selected="formData.para_llevar"
                value="0.1"
              >
                Sin Mesa
              </option>
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
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              :class="{
                'bg-green-200': pedido?.pedido_padre_id,
                'bg-white': !pedido?.pedido_padre_id,
              }"
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

          <div class="ml-auto mr-auto">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Pago 💵
            </label>
            <div class="flex">
              <button
                type="button"
                @click="formData.tipo_pago = TipoPago.EFECTIVO"
                :class="[
                  'px-4 py-2 rounded-l-lg text-sm font-medium transition ',
                  formData.tipo_pago === 'EFECTIVO'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                ]"
              >
                Efectivo
              </button>
              <button
                type="button"
                @click="formData.tipo_pago = TipoPago.TRANSFERENCIA"
                :class="[
                  'px-4 py-2 rounded-r-lg text-sm font-medium transition ',
                  formData.tipo_pago === 'TRANSFERENCIA'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                ]"
              >
                QR
              </button>
            </div>
          </div>

          <div v-if="props.pedido?.id == 0" class="ml-auto mr-auto">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Para llevar 🛵
            </label>
            <div class="flex">
              <button
                type="button"
                @click="formData.para_llevar = true"
                :class="[
                  'px-4 py-2 rounded-l-lg text-sm font-medium transition ',
                  formData.para_llevar === true
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                ]"
              >
                SI
              </button>
              <button
                type="button"
                @click="formData.para_llevar = false"
                :class="[
                  'px-4 py-2 rounded-r-lg text-sm font-medium transition ',
                  formData.para_llevar === false
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                ]"
              >
                NO
              </button>
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
              <div class="flex flex-wrap mb-2">
                <button
                  type="button"
                  @click="categoriaSeleccionada = ''"
                  :class="[
                    'px-3 py-1 rounded-l-lg text-sm font-medium transition',
                    categoriaSeleccionada === ''
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                >
                  Ver Todos
                </button>
                <button
                  v-for="(categoria, index) in categorias"
                  :key="categoria.id"
                  type="button"
                  @click="categoriaSeleccionada = categoria.id"
                  :class="[
                    'px-3 py-1 text-sm font-medium transition',
                    categoriaSeleccionada === categoria.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                    index === categorias.length - 1 ? 'rounded-r-lg' : '',
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
              class="grid grid-cols-2 sm:grid-cols-4 gap-2 h-[calc(100vh-500px)] overflow-y-auto"
            >
              <div
                v-for="producto in productosFiltrados"
                :key="producto.id"
                class="border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition"
                @click="
                  () => {
                    agregarProductoADetalle(producto);
                    playAddSound();
                  }
                "
                @mouseenter="playHoverSound"
              >
                <div class="flex flex-col items-center">
                  <div class="w-full h-24 mb-2">
                    <img
                      v-if="producto.imagen_url"
                      :src="'local://' + producto.imagen_url"
                      class="w-full h-full object-cover rounded-t-lg shadow-sm"
                      alt=""
                      @error="producto.imagen_url = ''"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M2 3a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm16 14l-4-5-3 4-2-3-5 6h14z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="w-full">
                    <p
                      class="font-medium text-sm truncate w-full text-center pb-2"
                    >
                      {{ producto.nombre }}
                    </p>
                    <div class="border-t border-gray-300 pb-1"></div>

                    <span
                      class="text-red-600 text-sm px-2 rounded-lg font-bold"
                    >
                      {{ producto.precio }}Bs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Detalles del pedido -->
          <div class="w-full md:w-1/2">
            <h3 class="text-lg font-semibold mb-2">Detalles del Pedido</h3>
            <div class="border rounded-lg h-[calc(100vh-400px)] flex flex-col">
              <div class="overflow-y-auto flex-grow rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead class="bg-red-600 sticky top-0">
                    <tr>
                      <th
                        class="w-2/5 px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                      >
                        Producto
                      </th>
                      <th
                        class="w-1/5 px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                      >
                        Precio
                      </th>
                      <th
                        class="w-1/5 px-3 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
                      >
                        Cant.
                      </th>
                      <th
                        class="w-1/5 px-3 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                      >
                        Subtotal
                      </th>
                      <th
                        class="w-1/10 px-3 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
                      >
                        Quitar
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
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path
                                  d="M2 3a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm16 14l-4-5-3 4-2-3-5 6h14z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div class="truncate max-w-[120px]">
                            <div
                              class="text-sm font-medium text-gray-900 truncate"
                            >
                              {{ detalle.producto?.nombre }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-700"
                      >
                        ${{ detalle.precio_unitario }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap">
                        <div class="flex items-center">
                          <button
                            type="button"
                            @click="decrementarCantidad(index)"
                            class="p-1 rounded-full bg-red-600 hover:bg-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white"
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
                            class="mx-1 w-10 text-center border rounded-md text-sm"
                          />
                          <button
                            type="button"
                            @click="incrementarCantidad(index)"
                            class="p-1 rounded-full bg-red-600 hover:bg-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white"
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
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium text-center"
                      >
                        {{
                          (
                            detalle.cantidad *
                            parseFloat(detalle.precio_unitario.toString())
                          ).toFixed(2)
                        }}
                        Bs.
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-center text-xs font-medium"
                      >
                        <button
                          type="button"
                          @click="
                            () => {
                              eliminarDetalle(index);
                              playRemoveSound();
                            }
                          "
                          class="text-red-600 hover:text-red-900"
                        >
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
                    >{{ calcularTotal() }} Bs.</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="errorMensaje"
          class="mt-4 p-3 bg-red-600 text-white font-bold rounded-lg z-50"
        >
          {{ errorMensaje }}
        </div>

        <!-- Vista previa del ticket -->
        <div
          v-if="mostrarVistaPrevia"
          class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 rounded-lg"
        >
          <div
            class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-4"></div>
            <div class="bg-white font-mono text-sm" id="ticket-preview">
              <!-- Información del restaurante (solo visible cuando el pedido está guardado) -->
              <div v-if="pedidoGuardado" class="text-center mb-4">
                <p class="font-bold text-lg">CHICHARRONERIA 6 DE AGOSTO</p>
                <p>
                  <span class="font-bold">Dirección: </span>Avenida 6 de Agosto
                  Nº 200
                </p>
                <p><span class="font-bold">Cel: </span>73424254 - 73461249</p>
                <p><span class="font-bold">Sucre</span></p>
              </div>

              <div class="mb-4">
                <div class="flex justify-between">
                  <p>
                    <span class="font-bold">TICKET #:</span
                    >{{ numeroPedidoDia }}
                  </p>
                  <p>
                    <span class="font-bold">Fecha:</span>
                    {{ new Date().toLocaleString() }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p>
                    <span class="font-bold">Mesero:</span>
                    {{
                      meseros.find((m) => m.id === formData.mesera_id)
                        ?.nombre || ""
                    }}
                  </p>
                  <p v-if="formData.mesa_id">
                    <span class="font-bold">Mesa:</span>
                    {{
                      mesaStore.mesas.find((m) => m.id === formData.mesa_id)
                        ?.numero || ""
                    }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p>
                    <span class="font-bold">Pago:</span>
                    {{ formData.tipo_pago }}
                  </p>
                  <p>
                    <span class="font-bold">Llevar:</span>
                    {{ formData.para_llevar ? "SI" : "NO" }}
                  </p>
                </div>
              </div>

              <div class="border-t border-b border-gray-300 py-2 mb-4">
                <div class="grid grid-cols-12 font-bold">
                  <div class="col-span-6">Producto</div>
                  <div class="col-span-2 text-center">Cant</div>
                  <div class="col-span-4 text-right">Precio Unitario</div>
                </div>
              </div>

              <div class="mb-4">
                <div
                  v-for="(detalle, index) in detallesActivos"
                  :key="index"
                  class="grid grid-cols-12 mb-1"
                >
                  <div class="col-span-6 truncate font-semibold uppercase">
                    {{ detalle.producto?.nombre }}
                  </div>
                  <div class="col-span-2 text-center">
                    {{ detalle.cantidad }}
                  </div>
                  <div class="col-span-4 text-right">
                    {{
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
                  <span>Bs. {{ calcularTotal() }}</span>
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
                    {{ calcularCambio() }} Bs.
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
                @click="cerrarFormulario"
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
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
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
  tipo_pago?: TipoPago;
  para_llevar?: boolean;
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
    nombre: Roles;
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
const numeroPedidoDia = ref(0);
// Formulario
const formData = ref({
  id: 0,
  pedido_padre_id: null as number | null,
  mesa_id: 0,
  num_pedido_dia: numeroPedidoDia.value,
  mesera_id: 0,
  cajero_id: 0,
  para_llevar: false,
  tipo_pago: TipoPago.EFECTIVO,
  estado: EstadoPedido.EN_PREPARACION,
  detalles: [] as DetallePedido[],
});

const cerrarFormulario = () => {
  if (pedidoGuardado.value) {
    errorMensaje.value = "";
    mostrarVistaPrevia.value = false;
    emit("cerrar");
  } else {
    mostrarVistaPrevia.value = false;
  }
};

//efectos de sonido
// Audio elements
let hoverSound: HTMLAudioElement | null = null;
let addSound: HTMLAudioElement | null = null;
let removeSound: HTMLAudioElement | null = null;

// Play hover sound
const playHoverSound = (): void => {
  if (hoverSound) {
    hoverSound.currentTime = 0;
    hoverSound.play().catch((e: Error) => console.log("Audio play error:", e));
  }
};

// Play add sound
const playAddSound = (): void => {
  if (addSound) {
    addSound.currentTime = 0;
    addSound.play().catch((e: Error) => console.log("Audio play error:", e));
    console.log("Playing add sound");
  }
};

// Play remove sound
const playRemoveSound = (): void => {
  if (removeSound) {
    removeSound.currentTime = 0;
    removeSound.play().catch((e: Error) => console.log("Audio play error:", e));
    console.log("Playing remove sound");
  }
};

// Computed
const meseros = computed(() => {
  return usuarios.value.filter((u) => u.rol.nombre === Roles.MESERO);
});

const cajeros = computed(() => {
  return usuarios.value.filter((u: Usuario) => u.id === authStore.user?.id);
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
      mesa_id: formData.value.para_llevar ? null : formData.value.mesa_id,
      num_pedido_dia: formData.value.num_pedido_dia,
      mesera_id: formData.value.mesera_id,
      cajero_id: formData.value.cajero_id,
      tipo_pago: formData.value.tipo_pago,
      para_llevar: formData.value.para_llevar || false,
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
      //toast.success("Pedido registrado con éxito!");
      emit("guardar");
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
    const ticketContent =
      document.getElementById("ticket-preview")?.innerHTML || "";

    // Crear un iframe para imprimir
    const printIframe = document.createElement("iframe");
    printIframe.style.position = "absolute";
    printIframe.style.top = "-9999px";
    document.body.appendChild(printIframe);

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
                font-family: Tahoma, Verdana, Arial, sans-serif;
                font-size: 14px;
                width: 80mm;
                margin: 0px;
              }
              .ticket {
                page-break-after: always; /* Cada ticket en una hoja nueva */
              }
              .text-center { text-align: center; }
              .mb-4 { margin-bottom: 16px; }
              .font-bold { font-weight: bold; }
              .text-lg { font-size: 16px; }
              .border-t { border-top: 1px solid #000000}
              .border-b {border-bottom: 1px solid #000000;}
              .py-2 { padding-top: 8px; padding-bottom: 8px; }
              .grid { display: grid; }
              .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
              .col-span-6 { grid-column: span 6 / span 6; }
              .col-span-2 { grid-column: span 2 / span 2; }
              .col-span-4 { grid-column: span 4 / span 4; }
              .text-right { text-align: right; }
              .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
              .mb-1 { margin-bottom: 4px; }
              .pt-2 { padding-top: 8px; }
              .pt-3 { padding-top: 12px; }
              .mt-6 { margin-top: 24px; }
              .flex { display: flex; }
              .text-center p {
                margin-top: 0;
                margin-bottom: 0;
                padding-top: 5px;
                padding-bottom: 0;
                line-height: 1.2;
              }
              .justify-between {
                justify-content: space-between;
                p {
                  padding-top: 5px;
                  padding-bottom: 0;
                  margin-top: 0;
                  margin-bottom: 0;
                }
              }
              .pl-2 { padding-left: 8px; }
              .mt-1 { margin-top: 4px; }
              .mt-2 { margin-top: 8px; }
              .font-semibold { font-weight: 600; }
              .uppercase { text-transform: uppercase; }
            </style>
          </head>
          <body>
            <div class="ticket">${ticketContent}</div>
            <div class="ticket">${ticketContent}</div>
          </body>
        </html>
      `);
      printDocument.close();

      // Esperar a que el contenido se cargue antes de imprimir
      setTimeout(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();

        // Eliminar el iframe después de imprimir
        setTimeout(() => {
          document.body.removeChild(printIframe);
        }, 500);
      }, 500);
    }
  } catch (error) {
    console.error("Error al imprimir ticket:", error);
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
    //numero de pedido del dia
    const numPedido = await window.api.getNumeroPedidoDia();
    numeroPedidoDia.value = numPedido;
    formData.value.num_pedido_dia = numeroPedidoDia.value;
    //mesero mas libre sera elegido por defecto
    const mesero = await window.api.getMeseroMasLibre();
    meseroIdealId.value = mesero[0].id;
    formData.value.mesera_id = meseroIdealId.value;
  }
};
const esteblecerNumPedidoDia = async () => {
  const numPedido = await window.api.getNumeroPedidoDia();
  numeroPedidoDia.value = numPedido;
  formData.value.num_pedido_dia = numeroPedidoDia.value;
};
const establecerCajeroLogueado = async () => {
  //usuario logueado sera cajero
  formData.value.cajero_id = authStore.user?.id || 0;
};
// Inicializar formulario cuando cambia el pedido
watch(
  () => props.pedido,
  async (newPedido) => {
    if (newPedido && newPedido.id !== 0) {
      console.log("AGREGAR pedido", props.pedido);
      await esteblecerNumPedidoDia();
      formData.value = {
        id: newPedido.id,
        num_pedido_dia: numeroPedidoDia.value,
        pedido_padre_id: newPedido.pedido_padre_id || null,
        mesa_id: newPedido.mesa_id || 0,
        mesera_id: newPedido.mesera_id,
        cajero_id: 0,
        tipo_pago: newPedido.tipo_pago || TipoPago.EFECTIVO,
        para_llevar: newPedido.para_llevar || false,
        estado: EstadoPedido.EN_PREPARACION,
        detalles: [],
      };
      await establecerCajeroLogueado();
    } else if (props.pedido?.id === 0) {
      console.log("Nuevo pedido", props.pedido);
      formData.value = {
        id: 0,
        num_pedido_dia: numeroPedidoDia.value,
        pedido_padre_id: null,
        mesa_id: 0,
        mesera_id: 0,
        cajero_id: 0,
        tipo_pago: TipoPago.EFECTIVO,
        para_llevar: false,
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
watch(
  () => formData.value.para_llevar,
  (nuevoValor) => {
    if (nuevoValor) {
      formData.value.mesa_id = 0.1; // Selecciona "Sin Mesa"
    } else {
      formData.value.mesa_id =
        mesaStore.mesas.length > 0 ? mesaStore.mesas[0].id : 10; // Selecciona la primera mesa disponible
    }
  }
);
// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarMesas(),
    cargarUsuarios(),
    cargarProductos(),
    cargarCategorias(),
  ]);
  filtrarProductos();
  // Create audio elements once on component mount
  hoverSound = new Audio();
  addSound = new Audio();
  removeSound = new Audio();
  hoverSound.src =
    "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";
  addSound.src =
    "https://assets.mixkit.co/active_storage/sfx/1113/1113-preview.mp3";
  removeSound.src =
    "https://assets.mixkit.co/active_storage/sfx/1113/1113-preview.mp3";
  hoverSound.load();
  addSound.load();
  removeSound.load();
});
</script>
