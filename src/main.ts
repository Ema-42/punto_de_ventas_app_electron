import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '../src/router/index';


const app = createApp(App); // Almacena la instancia de la app en la variable app
app.use(router);
app.mount('#app').$nextTick(() => {
  // Use contextBridge
/*   window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  }); */
});

 // Mueve esto después de crear la instancia de app
