<template>
  <div>
    <template v-if="authStore.user">
      <div class="flex h-screen overflow-hidden">
        <Sidebar />
        <div class="flex flex-col w-full transition-all duration-300">
          <Navbar />
          <main class="flex-1 overflow-auto p-6">
            <router-view />
          </main>
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
const authStore = useAuthStore();
</script>
