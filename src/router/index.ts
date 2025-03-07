import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth"; // Asegúrate de importar el store

import Productos from "../views/producto.vue";
import Categorias from "../views/categorias.vue";
import Mesas from "../views/mesas.vue";
import Home from "../views/home.vue";
import Usuarios from "../views/usuarios.vue";
import Pedidos from "../views/pedidos.vue";
import Ingresos from "../views/ingresos.vue";
import Login from "../views/login.vue";

const routes = [
  {
    path: "/",
    redirect: "/home" // Redirigir la ruta raíz a home
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: "/productos",
    name: "productos",
    component: Productos,
    meta: { requiresAuth: true }
  },
  {
    path: "/categorias",
    name: "categorias",
    component: Categorias,
    meta: { requiresAuth: true }
  },
  {
    path: "/mesas",
    name: "mesas",
    component: Mesas,
    meta: { requiresAuth: true }
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/usuarios",
    name: "usuarios",
    component: Usuarios,
    meta: { requiresAuth: true }
  },
  {
    path: "/pedidos",
    name: "pedidos",
    component: Pedidos,
    meta: { requiresAuth: true }
  },
  {
    path: "/ingresos",
    name: "ingresos",
    component: Ingresos,
    meta: { requiresAuth: true }
  },
];
 
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login'); // Redirigir a login
  } else if (to.path === '/login' && authStore.user) {
    next('/home'); // Si ya está autenticado e intenta ir a login, redirigir a home
  } else {
    next(); // Continuar navegación normalmente
  }
});

export default router;