<template>
    <div
      v-if="mostrar"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            {{ props.usuario ? "Editar" : "Nuevo" }} Usuario
          </h2>
          <button @click="cerrar" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
  
        <form @submit.prevent="guardar">
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="nombre"
            >
              Nombre
            </label>
            <input
              v-model="formData.nombre"
              id="nombre"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Ingrese el nombre del usuario"
            />
          </div>
  
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Contraseña
            </label>
            <div class="relative">
              <input
                v-model="formData.password"
                id="password"
                :type="mostrarPassword ? 'text' : 'password'"
                :required="!props.usuario"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                :placeholder="props.usuario ? 'Dejar en blanco para mantener la actual' : 'Ingrese la contraseña'"
              />
              <button 
                type="button" 
                @click="mostrarPassword = !mostrarPassword"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="mostrarPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
  
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="rol"
            >
              Rol
            </label>
            <select
              v-model="formData.rol_id"
              id="rol"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            >
              <option value="" disabled>Seleccione un rol</option>
              <option
                v-for="rol in roles"
                :key="rol.id"
                :value="rol.id"
              >
                {{ rol.nombre }}
              </option>
            </select>
          </div>
  
          <div v-if="errorMensaje" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {{ errorMensaje }}
          </div>
  
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="cerrar"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <span>{{ props.usuario ? "Actualizar" : "Guardar" }}</span>
              <svg
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
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  
  interface Usuario {
    id: number;
    nombre: string;
    password: string;
    rol: {id: number, nombre:string,eliminado:boolean}
    rol_id: number;
    eliminado?: boolean;
    fecha_creacion?: string;
  }
  
  interface Rol {
    id: number;
    nombre: string;
  }
  
  const errorMensaje = ref("");
  const mostrarPassword = ref(false);
  const roles = ref<Rol[]>([]);
  
  const props = defineProps<{
    mostrar: boolean;
    usuario?: Usuario | null;
  }>();
  
  const emit = defineEmits<{
    (e: "cerrar"): void;
    (e: "guardar"): void;
  }>();
  
  const formData = ref({
    nombre: "",
    password: "",
    rol_id: 0,
  });
  
  watch(
    () => props.usuario,
    (newUsuario) => {
      if (newUsuario) {
        formData.value = {
          nombre: newUsuario.nombre,
          password: "", // No mostramos la contraseña actual por seguridad
          rol_id: newUsuario.rol.id,
        };
      } else {
        formData.value = {
          nombre: "",
          password: "",
          rol_id: roles.value.length > 0 ? roles.value[0].id : 0,
        };
      }
    },
    { immediate: true }
  );
  
  const cerrar = () => {
    emit("cerrar");
  };
  
  const cargarRoles = async () => {
    try {
      // Aquí normalmente harías una llamada a tu API para obtener los roles
      const data = await window.api.getRoles();
      roles.value = data;
      
      // Si no hay usuario seleccionado, establecer el primer rol como predeterminado
      if (!props.usuario && roles.value.length > 0) {
        formData.value.rol_id = roles.value[0].id;
      }
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };
  
  const guardar = async () => {
    try {
      errorMensaje.value = ""; // Limpiar errores previos
  
      // Validaciones básicas
      if (!formData.value.nombre.trim()) {
        errorMensaje.value = "El nombre es obligatorio";
        return;
      }
  
      if (!props.usuario && !formData.value.password) {
        errorMensaje.value = "La contraseña es obligatoria para nuevos usuarios";
        return;
      }
  
      if (!formData.value.rol_id) {
        errorMensaje.value = "Debe seleccionar un rol";
        return;
      }
  
      const userData = {
        nombre: formData.value.nombre,
        rol_id: formData.value.rol_id,
        ...(formData.value.password ? { password: formData.value.password } : {})
      };
  
      const accion = props.usuario
        ? window.api.editUsuarioById(props.usuario.id, userData)
        : window.api.createUsuario(userData);
  
      const result = await accion;
      if (result instanceof Error) throw result;
  
      // Resetear formulario
      formData.value = {
        nombre: "",
        password: "",
        rol_id: roles.value.length > 0 ? roles.value[0].id : 0,
      };
      
      emit("guardar");
    } catch (error: any) {
      errorMensaje.value = error.message || "Ocurrió un error al guardar el usuario.";
    }
  };
  
  onMounted(() => {
    cargarRoles();
  });
  </script>