import { createRouter, createWebHistory } from "vue-router";

import Productos from "../views/producto.vue";
import Categorias from "../views/categorias.vue";
import Mesas from "../views/mesas.vue";
import Home from "../views/home.vue";

// Define the routes using the RouteRecordRaw type
const routes = [
  {
    path: "/productos",
    name: "productos",
    component: Productos, // Asegúrate de que esto apunte al componente correcto
  },
  {
    path: "/categorias",
    name: "categorias",
    component: Categorias,
  },
  {
    path: "/mesas",
    name: "mesas",
    component: Mesas,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
];

// Create the router instance with type safety
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

