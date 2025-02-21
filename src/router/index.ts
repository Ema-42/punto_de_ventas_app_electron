import { createRouter, createWebHistory } from "vue-router";

import Productos from "../views/producto.vue";

// Define the routes using the RouteRecordRaw type
const routes = [
  {
    path: "/productos",
    name: "productos",
    component: Productos, // Asegúrate de que esto apunte al componente correcto
  },
];

// Create the router instance with type safety
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
