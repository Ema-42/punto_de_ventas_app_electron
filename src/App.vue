<template>
  <div class="h-screen overflow-hidden dark:bg-gray-900">
    <template v-if="authStore.user">
      <div class="flex h-full">
        <Sidebar />
        <div class="flex flex-col w-full">
          <Navbar />
          <!-- Contenido principal -->
          <main class="flex-1 overflow-hidden p-4 bg-white dark:bg-gray-900 transition-colors duration-200">
            <router-view class="h-full overflow-auto" />
          </main>
        </div>
      </div>
    </template>
    <template v-else>
      <router-view class="h-full dark:bg-gray-900" />
    </template>
  </div>
</template>



<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
const authStore = useAuthStore();
</script>
