<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            Ranking de Productos por Categoría
          </h2>
          <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
  
        <div class="mb-4">
          <p class="text-gray-600">
            Mostrando el ranking de productos más demandados basado en {{ pedidos.length }} pedidos seleccionados.
          </p>
        </div>
  
        <div v-if="categorias.length === 0" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-500">No hay datos suficientes para generar el ranking.</p>
        </div>
  
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="categoria in categorias" :key="categoria.id" class="bg-gray-50 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2 text-red-600">
                {{ categoria.id }}
              </span>
              {{ categoria.nombre }}
            </h3>
            
            <div class="space-y-3">
              <div v-for="(producto, index) in categoria.productos" :key="producto.id" class="bg-white p-3 rounded-md shadow-sm">
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-700 font-bold">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <div class="font-medium">{{ producto.nombre }}</div>
                      <div class="text-xs text-gray-500">ID: {{ producto.id }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-gray-800">{{ producto.cantidad }}</div>
                    <div class="text-xs text-gray-500">unidades</div>
                  </div>
                </div>
                
                <!-- Barra de progreso -->
                <div class="mt-2 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    class="bg-red-600 h-2.5 rounded-full" 
                    :style="{ width: `${(producto.cantidad / maxCantidad) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="flex justify-end mt-4">
          <button
            @click="$emit('cerrar')"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  
  interface Usuario {
    id: number;
    nombre: string;
  }
  
  interface Mesa {
    id: number;
    numero: number;
  }
  
  interface Producto {
    id: number;
    nombre: string;
    imagen_url?: string;
    maneja_stock?: boolean;
    categoria_id?: number;
  }
  
  interface DetallePedido {
    id: number;
    pedido_id: number;
    producto: Producto;
    cantidad: number;
    precio_unitario: string;
  }
  
  interface Pedido {
    id: number;
    num_pedido_dia: number;
    pedido_padre_id?: number;
    mesa?: Mesa;
    mesera: Usuario;
    cajero: Usuario;
    estado: string;
    fecha_creacion: string;
    fecha_concluido?: string;
    tipo_pago?: string;
    total: string;
    detalles?: DetallePedido[];
  }

  interface Categoria {
    id: number;
    nombre: string;
  }
  
  interface ProductoRanking {
    id: number;
    nombre: string;
    cantidad: number;
  }
  
  interface CategoriaConProductos {
    id: number;
    nombre: string;
    productos: ProductoRanking[];
  }
  
  const props = defineProps<{
    pedidos: Pedido[];
  }>();
  //@
  const emit = defineEmits<{
    (e: 'cerrar'): void;
  }>();
  
  // Estado
  const categoriasData = ref<Categoria[]>([]);
  const productosData = ref<Producto[]>([]);
  
  // Computed
  const categorias = computed<CategoriaConProductos[]>(() => {
    // Si no hay datos, retornar array vacío
    if (categoriasData.value.length === 0 || productosData.value.length === 0) {
      return [];
    }
    
    // Obtener todos los detalles de los pedidos
    const detalles: DetallePedido[] = props.pedidos.flatMap(pedido => pedido.detalles || []);
    
    // Contar la cantidad de cada producto
    const productosCount: { [key: number]: number } = {};
    detalles.forEach(detalle => {
      const productoId = detalle.producto.id;
      if (!productosCount[productoId]) {
        productosCount[productoId] = 0;
      }
      productosCount[productoId] += detalle.cantidad;
    });
    
    // Agrupar productos por categoría
    const categoriaMap: { [key: number]: ProductoRanking[] } = {};
    
    productosData.value.forEach(producto => {
      if (producto.categoria_id && productosCount[producto.id]) {
        if (!categoriaMap[producto.categoria_id]) {
          categoriaMap[producto.categoria_id] = [];
        }
        
        categoriaMap[producto.categoria_id].push({
          id: producto.id,
          nombre: producto.nombre,
          cantidad: productosCount[producto.id]
        });
      }
    });
    
    // Ordenar productos por cantidad (descendente) dentro de cada categoría
    Object.keys(categoriaMap).forEach(categoriaId => {
      categoriaMap[Number(categoriaId)].sort((a, b) => b.cantidad - a.cantidad);
    });
    
    // Crear array final de categorías con sus productos
    return categoriasData.value
      .filter(categoria => categoriaMap[categoria.id] && categoriaMap[categoria.id].length > 0)
      .map(categoria => ({
        id: categoria.id,
        nombre: categoria.nombre,
        productos: categoriaMap[categoria.id].slice(0, 5) // Mostrar solo los 5 más vendidos
      }));
  });
  
  const maxCantidad = computed(() => {
    let max = 0;
    categorias.value.forEach(categoria => {
      categoria.productos.forEach(producto => {
        if (producto.cantidad > max) {
          max = producto.cantidad;
        }
      });
    });
    return max;
  });
  
  // Métodos
  const cargarCategorias = async () => {
    try {
      const data = await window.api.getCategorias();
      categoriasData.value = data;
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };
  
  const cargarProductos = async () => {
    try {
      const data = await window.api.getProductos();
      productosData.value = data;
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };
  
  // Ciclo de vida
  onMounted(async () => {
    await Promise.all([cargarCategorias(), cargarProductos()]);
  });
  </script>