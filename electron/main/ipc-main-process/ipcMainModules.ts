import { ipcMain, protocol } from "electron";
import {
  crearProducto,
  editarProducto,
  eliminarProducto,
  obtenerOneProducto,
  obtenerProductos,
  uploadFile,
} from "../modules/productos";
import {
  createCategoriaProducto,
  deleteCategoriaProducto,
  getCategoriaProductoById,
  getCategoriasProductos,
  updateCategoriaProducto,
} from "../modules/catgorias-productos";
import {
  createMesa,
  deleteMesa,
  getMesaById,
  getMesas,
  updateMesa,
} from "../modules/mesas";
import {
  authenticateUsuario,
  createUsuario,
  deleteUsuario,
  getUsuarioById,
  getUsuarios,
  updateUsuario,
} from "../modules/usuarios";
import { readFile } from "node:fs/promises";
import path from "node:path";

export default () => {
  //productos
  ipcMain.handle("get-productos", async () => {
    return await obtenerProductos();
  });
  ipcMain.handle("create-producto", async (_, producto) => {
    return await crearProducto(producto);
  });
  ipcMain.handle("edit-producto", async (_, { id, productoData }) => {
    return await editarProducto(id, productoData);
  });
  ipcMain.handle("get-one-producto", async (_, id) => {
    return await obtenerOneProducto(id);
  });
  ipcMain.handle("delete-producto", async (_, id) => {
    return await eliminarProducto(id);
  });
  //categorias
  ipcMain.handle("get-categorias", async () => {
    return await getCategoriasProductos();
  });
  ipcMain.handle("create-categoria", async (_, producto) => {
    return await createCategoriaProducto(producto);
  });
  ipcMain.handle("edit-categoria", async (_, { id, categoriaData }) => {
    return await updateCategoriaProducto(id, categoriaData);
  });
  ipcMain.handle("get-one-categoria", async (_, id) => {
    return await getCategoriaProductoById(id);
  });
  ipcMain.handle("delete-categoria", async (_, id) => {
    return await deleteCategoriaProducto(id);
  });
  //mesas

  ipcMain.handle("get-mesas", async () => {
    return await getMesas();
  });
  ipcMain.handle("create-mesa", async (_, mesa) => {
    return await createMesa(mesa);
  });
  ipcMain.handle("edit-mesa", async (_, { id, mesaData }) => {
    return await updateMesa(id, mesaData);
  });
  ipcMain.handle("get-one-mesa", async (_, id) => {
    return await getMesaById(id);
  });
  ipcMain.handle("delete-mesa", async (_, id) => {
    return await deleteMesa(id);
  });
  //usuarios
  ipcMain.handle("get-usuarios", async () => {
    return await getUsuarios();
  });
  ipcMain.handle("create-usuario", async (_, usuario) => {
    return await createUsuario(usuario);
  });
  ipcMain.handle("edit-usuario", async (_, { id, usuarioData }) => {
    return await updateUsuario(id, usuarioData);
  });
  ipcMain.handle("get-one-usuario", async (_, id) => {
    return await getUsuarioById(id);
  });
  ipcMain.handle("delete-usuario", async (_, id) => {
    return await deleteUsuario(id);
  });
  ipcMain.handle("authenticate-usuario", async (_, { usuario, password }) => {
    return await authenticateUsuario(usuario, password);
  });
  ipcMain.handle("upload-file", async (_, fileData) => {
    return await uploadFile(fileData);
  });


  //leer imagenes locales
  protocol.handle("local", async (request) => {
    const url = new URL(request.url);
    const filePath = url.pathname;

    try {
      const fileBuffer = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "application/octet-stream";

      if (ext === ".png") {
        contentType = "image/png";
      } else if (ext === ".jpeg" || ext === ".jpg") {
        contentType = "image/jpeg";
      }

      return new Response(fileBuffer, {
        headers: { "Content-Type": contentType },
      });
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
      return new Response("Archivo no encontrado", { status: 404 });
    }
  });
};
