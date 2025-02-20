import { ipcMain } from "electron";
import { obtenerProductos } from "../modules/productos/productos";

export default () => {
    ipcMain.handle("get-productos", async () => {
        return await obtenerProductos();
    });
};