<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden"
  >
    <!-- Elementos decorativos de fondo -->
    <div
      class="absolute top-0 left-0 w-96 h-96 bg-red-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[bounce_7s_infinite]"
    ></div>
    <div
      class="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[bounce_7s_infinite_2s]"
    ></div>
    <div
      class="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[bounce_7s_infinite_4s]"
    ></div>

    <!-- Formas geométricas -->
    <div
      class="absolute top-1/4 right-1/4 w-12 h-12 bg-red-500/20 rounded-lg rotate-12"
    ></div>
    <div
      class="absolute bottom-1/4 left-1/4 w-12 h-12 bg-red-500/20 rounded-full"
    ></div>
    <div
      class="absolute top-1/3 left-1/3 w-8 h-8 bg-red-500/20 rounded-lg -rotate-12"
    ></div>

    <!-- Card de Login -->
    <div class="relative w-full max-w-md">
      <!-- Logo flotante -->
      <div
        class="absolute left-1/2 -top-12 -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-full overflow-hidden shadow-xl p-1 z-10 border-4 border-gray-900/50 hover:shadow-red-500/50 hover:shadow-lg transition-shadow duration-200"
      >
        <img
          src="/src/assets/iconos/logo.png"
          alt="Company Logo"
          class="w-full h-full object-cover rounded-full"
        />
      </div>

      <div
        class="bg-gray-200/20 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-200/20 backdrop-blur-lg mt-16"
      >
        <!-- Título -->
        <div class="text-center space-y-2 pt-4">
          <h1 class="text-2xl font-bold text-white">Sistema de Venta</h1>
          <p class="text-sm text-gray-300">
            Ingrese sus credenciales para continuar
          </p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Campo de usuario -->
          <div class="relative group">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200"
            >
              <i class="i-lucide-user h-5 w-5"></i>
            </span>
            <input
              v-model="usuario"
              type="text"
              placeholder="Usuario"
              :disabled="isLoading"
              class="w-full px-10 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
            />
          </div>

          <!-- Campo de contraseña -->
          <div class="relative group">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200"
            >
              <i class="i-lucide-lock h-5 w-5"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              :disabled="isLoading"
              class="w-full px-10 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 pr-20"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 rounded-lg hover:bg-gray-700/50"
            >
              <img
                :src="showPassword ? nomostrar : mostrar"
                class="h-5 w-5"
                alt="Toggle Password Visibility"
              />
            </button>
          </div>
          <!-- Mensaje de error -->
          <div
            v-if="errorMessage"
            class="text-white text-sm text-center bg-orange-600/10 border border-orange-400 rounded-lg py-2 px-4 mt-4"
          >
            {{ errorMessage }}
          </div>
          <div
            v-if="authMessage"
            :class="
              login
                ? 'border border-green-400 bg-green-600/10 '
                : 'border border-red-400 bg-red-600/10'
            "
            class="text-white text-sm text-center rounded-lg py-2 px-4 mt-4"
          >
            {{ authMessage }}
          </div>
          <!-- Botón de inicio de sesión -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-200 font-medium mt-4"
          >
            {{ isLoading ? "Cargando..." : "Iniciar Sesión" }}
          </button>
        </form>
      </div>

      <!-- Reflejo/Brillo -->
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-red-500/10 blur-2xl -z-10"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import mostrar from "../assets/iconos/ver.svg";
import nomostrar from "../assets/iconos/nover.svg";
import { useAuthStore } from "../stores/auth";
const showPassword = ref(false);
const errorMessage = ref();
const authMessage = ref();
const usuario = ref("");
const password = ref("");
const isLoading = ref(false);
const login = ref(false);
const authStore = useAuthStore();
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  login.value = false;
  isLoading.value = true; // Deshabilitar inputs mientras se procesa la solicitud
  if (!usuario.value.trim() || !password.value.trim()) {
    errorMessage.value = "Por favor, complete todos los campos";
    isLoading.value = false;
    authMessage.value = "";
    return;
  }
  errorMessage.value = "";
  try {
    const response = await window.api.authenticateUsuario(
      usuario.value,
      password.value
    );
    if (response instanceof Error) {
      authMessage.value = response.message;
      throw response;
    }
    authMessage.value = response;
    login.value = true;

    authStore.login(response.data.id, response.data.nombre, response.data.rol); // Establecer usuario
    //router.push('/');
    //console.log("home", authStore.user);
    //authStore.logout(); // Dejar user en null
  } catch (err) {
    console.error(err);
    login.value = false;
  } finally {
    isLoading.value = false; // Volver a habilitar inputs
  }
};
</script>

<style scoped></style>
