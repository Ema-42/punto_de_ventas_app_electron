import { createRouter, createWebHistory } from "vue-router";

import Productos from "../views/producto.vue";
import Categorias from "../views/categorias.vue";
import Mesas from "../views/mesas.vue";
import Home from "../views/home.vue";
import Usuarios from "../views/usuarios.vue";
import Pedidos from "../views/pedidos.vue";
import Ingresos from "../views/ingresos.vue";
import Login from "../views/login.vue";
// Define the routes using the RouteRecordRaw type
const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/productos",
    name: "productos",
    component: Productos,
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
  {
    path: "/usuarios",
    name: "usuarios",
    component: Usuarios,
  },
  {
    path: "/pedidos",
    name: "pedidos",
    component: Pedidos,
  },
  {
    path: "/ingresos",
    name: "ingresos",
    component: Ingresos,
  },
];

 
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

