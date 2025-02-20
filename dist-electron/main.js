import { app, ipcMain, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const obtenerProductos = async () => {
  try {
    const productos = await prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen_url: true,
        categoria: true
      }
    });
    return productos.map((p) => ({
      ...p,
      precio: p.precio.toFixed(2)
      // Convierte Decimal a string con 2 decimales
    }));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return error;
  }
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
ipcMain.handle("get-productos", async () => {
  return await obtenerProductos();
});
app.whenReady().then(() => {
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
