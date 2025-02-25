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
  deleteCategoriaById: (id) => electron.ipcRenderer.invoke("delete-categoria", id),
  //MESAS
  getMesas: () => electron.ipcRenderer.invoke("get-mesas"),
  createMesa: (mesaData) => electron.ipcRenderer.invoke("create-mesa", mesaData),
  editMesaById: (id, mesaData) => electron.ipcRenderer.invoke("edit-mesa", { id, mesaData }),
  getOneMesaById: (id) => electron.ipcRenderer.invoke("get-one-mesa", id),
  deleteMesaById: (id) => electron.ipcRenderer.invoke("delete-mesa", id),
  //USUARIOS
  getUsuarios: () => electron.ipcRenderer.invoke("get-usuarios"),
  createUsuario: (usuarioData) => electron.ipcRenderer.invoke("create-usuario", usuarioData),
  editUsuarioById: (id, usuarioData) => electron.ipcRenderer.invoke("edit-usuario", { id, usuarioData }),
  getOneUsuarioById: (id) => electron.ipcRenderer.invoke("get-one-usuario", id),
  deleteUsuarioById: (id) => electron.ipcRenderer.invoke("delete-usuario", id)
});
