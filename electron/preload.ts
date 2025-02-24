import { ipcRenderer, contextBridge } from "electron";
import { Producto } from "./main/modules/interfaces";
import { CategoriaProducto } from "@prisma/client";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("api", {
  //PRODUCTOS
  getProductos: () => ipcRenderer.invoke("get-productos"),
  createProducto: (productoData: Producto) =>
    ipcRenderer.invoke("create-producto", productoData),
  getOneProductoById: (id: number) =>
    ipcRenderer.invoke("get-one-producto", id),
  deleteProductoById: (id: number) => ipcRenderer.invoke("delete-producto", id),
  editProductoById: (id: number, productoData: Producto) =>
    ipcRenderer.invoke("edit-producto", { id, productoData }),
  //CATEGORIAS
  getCategorias: () => ipcRenderer.invoke("get-categorias"),
  createCategoria: (categoriaData: CategoriaProducto) =>
    ipcRenderer.invoke("create-categoria", categoriaData),
  editCategoriaById: (id: number, categoriaData: any) =>
    ipcRenderer.invoke("edit-categoria", { id, categoriaData }),
  getOneCategoriaById: (id: number) =>
    ipcRenderer.invoke("get-one-categoria", id),
  deleteCategoriaById: (id: number) =>
    ipcRenderer.invoke("delete-categoria", id),
});
