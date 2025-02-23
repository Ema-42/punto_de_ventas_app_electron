"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  //PRODUCTOS
  getProductos: () => electron.ipcRenderer.invoke("get-productos"),
  createProducto: (productoData) => electron.ipcRenderer.invoke("create-producto", productoData),
  getOneProductoById: (id) => electron.ipcRenderer.invoke("get-one-producto", id),
  deleteProductoById: (id) => electron.ipcRenderer.invoke("delete-producto", id),
  editProductoById: (id, productoData) => electron.ipcRenderer.invoke("edit-producto", { id, productoData }),
  //CATEGORIAS
  getCategorias: () => electron.ipcRenderer.invoke("get-categorias"),
  createCategoria: (categoriaData) => electron.ipcRenderer.invoke("create-categoria", categoriaData),
  editCategoriaById: (id, categoriaData) => electron.ipcRenderer.invoke("edit-categoria", { id, categoriaData }),
  getOneCategoriaById: (id) => electron.ipcRenderer.invoke("get-one-categoria", id),
  deleteCategoriaById: (id) => electron.ipcRenderer.invoke("delete-categoria", id)
});
