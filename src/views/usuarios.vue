<template>
  <div class="h-full flex flex-col overflow-hidden">
    <CrearEditarUsuario
      :mostrar="mostrarModalCrearEditar"
      :usuario="usuarioEditar"
      @cerrar="mostrarModalCrearEditar = false"
      @guardar="guardarUsuario"
    />

    <EliminarUsuario
      :mostrar="mostrarModalEliminar"
      :usuario="usuarioEliminar"
      @cerrar="mostrarModalEliminar = false"
      @confirmar="eliminarUsuario"
    />

    <!-- Encabezado con título y buscador -->
    <div class="bg-gradient-to-r bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-100 flex items-center">
          Usuarios
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-2 text-red-500 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </h1>

        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <!-- Buscador con icono -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar usuario..."
              class="border dark:border-gray-600 p-2 rounded-lg shadow-sm w-full focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 outline-none pl-10 bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              @input="buscarUsuarios"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 dark:text-red-400"
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

          <!-- Botón de agregar usuario -->
          <button
            @click="abrirModalCrear"
            class="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 dark:hover:bg-red-600 transition flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Agregar Usuario
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Contador de usuarios -->
    <div class="mb-2 text-gray-600 dark:text-gray-300">
      Total: {{ usuariosFiltrados.length }} usuarios encontrados
    </div>

    <!-- Tabla de usuarios con altura fija -->
    <div
      class="flex-1 overflow-hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col"
    >
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 text-white">
              <th class="p-3 text-left rounded-tl-lg w-12">ID</th>
              <th class="p-3 text-left w-1/4">Nombre</th>
              <th class="p-3 text-left w-1/4">Rol</th>
              <th class="p-3 text-left w-1/4">Fecha de creación</th>
              <th class="p-3 text-center rounded-tr-lg w-32">Acciones</th>
            </tr>
          </thead>
        </table>
      </div>

      <div class="flex-1 overflow-y-auto">
        <table class="w-full border-collapse">
          <thead class="hidden">
            <tr>
              <th class="p-3 w-16"></th>
              <th class="p-3 w-1/3"></th>
              <th class="p-3 w-1/4"></th>
              <th class="p-3 w-1/4"></th>
              <th class="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="usuario in paginatedUsuarios"
              :key="usuario.id"
              class="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <td class="p-3 h-16">
                <span
                  class="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-bold"
                >
                  {{ usuario.id }}
                </span>
              </td>
              <td class="p-3 font-medium dark:text-gray-200">{{ usuario.nombre }}</td>
              <td class="p-3">
                <span
                  class="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-sm font-medium"
                >
                  {{ usuario.rol.nombre }}
                </span>
              </td>
              <td class="p-3 text-gray-600 dark:text-gray-400">
                {{ formatearFecha(usuario.fecha_creacion) }}
              </td>
              <td class="p-3 flex justify-center space-x-3">
                <button
                  @click="editarUsuario(usuario)"
                  class="bg-blue-100 dark:bg-blue-900 p-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  title="Editar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-600 dark:text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="confirmarEliminar(usuario)"
                  class="bg-red-100 dark:bg-red-900 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition"
                  title="Eliminar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-600 dark:text-red-300"
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
            <tr v-if="paginatedUsuarios.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500 dark:text-gray-400">
                No se encontraron usuarios
                <div class="mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-4 mb-2">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ paginatedUsuarios.length }} de
        {{ usuariosFiltrados.length }} usuarios
      </div>
      <div class="flex space-x-2">
        <button
          @click="prevPage"
          :disabled="pagina === 1"
          class="px-4 py-2 border dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition dark:text-gray-200"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span class="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg">
          {{ pagina }} / {{ totalPaginas || 1 }}
        </span>
        <button
          @click="nextPage"
          :disabled="pagina >= totalPaginas"
          class="px-4 py-2 border dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition dark:text-gray-200"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import CrearEditarUsuario from "../components/Usuarios/CrearEditarUsuario.vue";
import EliminarUsuario from "../components/Usuarios/EliminarUsuario.vue";

//para los mensajes https://vue-toastification.maronato.dev/
import { useToast } from "vue-toastification";
const toast = useToast();

interface Usuario {
  id: number;
  nombre: string;
  password: string;
  rol: { id: number; nombre: string; eliminado: boolean };
  rol_id: number;
  eliminado?: boolean;
  fecha_creacion?: string;
}

interface Rol {
  id: number;
  nombre: string;
}

// Estado
const usuarios = ref<Usuario[]>([]);
const usuariosFiltrados = ref<Usuario[]>([]);
const roles = ref<Rol[]>([]);
const searchQuery = ref("");
const pagina = ref(1);
const porPagina = ref(7);
const mostrarModalCrearEditar = ref(false);
const mostrarModalEliminar = ref(false);
const usuarioEditar = ref<Usuario | null>(null);
const usuarioEliminar = ref<Usuario | null>(null);

// Computed
const totalPaginas = computed(() =>
  Math.ceil(usuariosFiltrados.value.length / porPagina.value)
);

const paginatedUsuarios = computed(() => {
  const inicio = (pagina.value - 1) * porPagina.value;
  const fin = inicio + porPagina.value;
  return usuariosFiltrados.value.slice(inicio, fin);
});

// Métodos
const cargarUsuarios = async () => {
  // Aquí normalmente harías una llamada a tu API
  const data = await window.api.getUsuarios();
  usuarios.value = data;
  usuariosFiltrados.value = data;
};

const cargarRoles = async () => {
  // Aquí normalmente harías una llamada a tu API para obtener los roles
  const data = await window.api.getRoles();
  roles.value = data;
};

const buscarUsuarios = () => {
  if (!searchQuery.value) {
    usuariosFiltrados.value = [...usuarios.value];
  } else {
    const query = searchQuery.value.toLowerCase();
    usuariosFiltrados.value = usuarios.value.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(query) ||
        usuario.rol.nombre.toLowerCase().includes(query)
    );
  }
  pagina.value = 1;
};

const abrirModalCrear = () => {
  usuarioEditar.value = null;
  mostrarModalCrearEditar.value = true;
};

const editarUsuario = (usuario: Usuario) => {
  usuarioEditar.value = usuario;
  mostrarModalCrearEditar.value = true;
};

const guardarUsuario = () => {
  cargarUsuarios();
  buscarUsuarios();
  mostrarModalCrearEditar.value = false;
  usuarioEditar.value
    ? toast.info("Usuario editado con éxito!")
    : toast.success("Usuario guardado con éxito!");
};

const confirmarEliminar = (usuario: Usuario) => {
  usuarioEliminar.value = usuario;
  mostrarModalEliminar.value = true;
};

const eliminarUsuario = () => {
  toast.error("Usuario eliminado con éxito!");
  cargarUsuarios();
  buscarUsuarios();
  mostrarModalEliminar.value = false;
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
    second: "2-digit",
  });
};

const prevPage = () => {
  if (pagina.value > 1) {
    pagina.value--;
  }
};

const nextPage = () => {
  if (pagina.value < totalPaginas.value) {
    pagina.value++;
  }
};

// Ciclo de vida
onMounted(() => {
  cargarUsuarios();
  cargarRoles();
});
</script>
