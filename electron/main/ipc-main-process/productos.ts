import { ipcMain } from "electron";
import {
  crearProducto,
  editarProducto,
  eliminarProducto,
  obtenerOneProducto,
  obtenerProductos,
} from "../modules/productos";

export default () => {
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
};
