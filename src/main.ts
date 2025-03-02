import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "../src/router/index";
import Toast, { PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

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
app.mount("#app").$nextTick(() => {
  // Use contextBridge
  /*   window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  }); */
});

// Mueve esto después de crear la instancia de app

