import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("api", {
  getProductos: () => ipcRenderer.invoke("get-productos"),
});
