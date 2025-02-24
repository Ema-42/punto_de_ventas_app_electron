import { ipcMain } from "electron";
import {
  createCategoriaProducto,
  deleteCategoriaProducto,
  getCategoriaProductoById,
  getCategoriasProductos,
  updateCategoriaProducto,
} from "../modules/catgorias-productos";

export default () => {
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
};
