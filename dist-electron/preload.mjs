"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  getProductos: () => electron.ipcRenderer.invoke("get-productos")
});
