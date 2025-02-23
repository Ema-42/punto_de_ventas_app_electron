<template>
    <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Nuevo Producto</h2>
        <!-- Formulario -->
         <form action="">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Nombre del producto</label>
                    <input type="text" class="w-full border p-2 rounded"/>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Nombre del producto</label>
                    <input type="text" class="w-full border p-2 rounded"/>
                </div>
                <div class="col-span-2">
                    <label class="block text-sm font-medium mb-1">Nombre del producto</label>
                    <input type="text" class="w-full border p-2 rounded"/>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Nombre del producto</label>
                    <input type="text" class="w-full border p-2 rounded"/>
                </div>
            <input type="text" placeholder="Nombre del producto" class="w-full border p-2 rounded mb-4" required>
            <input type="text" placeholder="Nombre del producto" class="w-full border p-2 rounded mb-4" required>
            <input type="text" placeholder="Nombre del producto" class="w-full border p-2 rounded mb-4" required>
            <input type="text" placeholder="Nombre del producto" class="w-full border p-2 rounded mb-4" required>
            <input type="text" placeholder="Nombre del producto" class="w-full border p-2 rounded mb-4" required>
            <input type="text" placeholder="Nombre del producto" class="w-full border p-2 rounded mb-4" required>
            <input type="text" placeholder="Nombre del producto" class="w-full border p-2 rounded mb-4" required>

            </div>
         </form>
        
        <div class="flex justify-end space-x-2">
          <button @click="cerrarModal" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button class="px-4 py-2 bg-red-500 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  defineProps({
    mostrarModal: Boolean
  });
  
  const emit = defineEmits(['cerrar']);
  
  const cerrarModal = () => {
    emit('cerrar');
  };
  </script>
  