import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "../src/router/index";
import Toast, { PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createPinia } from 'pinia';

const app = createApp(App); // Almacena la instancia de la app en la variable app
const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

app.use(Toast, options);
app.use(router);
app.use(createPinia());
app.mount("#app").$nextTick(() => {
});

