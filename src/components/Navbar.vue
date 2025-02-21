<template>
  <nav class="bg-blue-600 p-4 text-white flex justify-between">
    <h1 class="text-lg font-bold">Mi Tienda</h1>
    <ul class="flex gap-4">
      <li>
        <router-link
          to="/productos"
          class="hover:underline cursor-pointer"
          @click="handleLinkClick"
          >Productos</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const handleLinkClick = () => {
  console.log("Hola desde navbar");
};
</script>
