import { ipcRenderer, contextBridge } from "electron";
import {
  CrearPedidoConDetalles,
  EditarPedidoConDetalles,
  EstadoPedido,
  FileData,
  Producto,
} from "./main/modules/interfaces";
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
  //MESAS
  getMesas: () => ipcRenderer.invoke("get-mesas"),
  createMesa: (mesaData: any) => ipcRenderer.invoke("create-mesa", mesaData),
  editMesaById: (id: number, mesaData: any) =>
    ipcRenderer.invoke("edit-mesa", { id, mesaData }),
  getOneMesaById: (id: number) => ipcRenderer.invoke("get-one-mesa", id),
  deleteMesaById: (id: number) => ipcRenderer.invoke("delete-mesa", id),
  //USUARIOS
  getUsuarios: () => ipcRenderer.invoke("get-usuarios"),
  createUsuario: (usuarioData: any) =>
    ipcRenderer.invoke("create-usuario", usuarioData),
  editUsuarioById: (id: number, usuarioData: any) =>
    ipcRenderer.invoke("edit-usuario", { id, usuarioData }),
  getOneUsuarioById: (id: number) => ipcRenderer.invoke("get-one-usuario", id),
  deleteUsuarioById: (id: number) => ipcRenderer.invoke("delete-usuario", id),
  authenticateUsuario: (usuario: string, password: string) =>
    ipcRenderer.invoke("authenticate-usuario", { usuario, password }),
  uploadFile: (fileData: FileData) =>
    ipcRenderer.invoke("upload-file", fileData),
  //roles
  getRoles: () => ipcRenderer.invoke("get-roles"),
  getOneRoleById: (id: number) => ipcRenderer.invoke("get-one-role", id),
  //pedidos
  getPedidos: () => ipcRenderer.invoke("get-pedidos"),
  editEstadoPedidoById: (id: number, estado: EstadoPedido) =>
    ipcRenderer.invoke("edit-estado-pedido", { id, estado }),
  getOnePedidoById: (id: number) => ipcRenderer.invoke("get-one-pedido", id),
  deletePedidoById: (id: number) => ipcRenderer.invoke("delete-pedido", id),
  crearPedidoConDetalles: (data: CrearPedidoConDetalles) =>
    ipcRenderer.invoke("crear-pedido-con-detalles", data),
  editarPedidoConDetalles: (data: EditarPedidoConDetalles) =>
    ipcRenderer.invoke("editar-pedido-con-detalles", data),
});
