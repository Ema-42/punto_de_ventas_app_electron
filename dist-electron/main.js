import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
const prisma$1 = new PrismaClient();
const obtenerProductos = async () => {
  try {
    const productos = await prisma$1.producto.findMany({
      where: { eliminado: false },
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen_url: true,
        categoria: true,
        stock: true,
        fecha_creacion: true,
        maneja_stock: true
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
const crearProducto = async (data) => {
  try {
    console.log("Producto data:", data);
    const nuevoProducto = await prisma$1.producto.create({
      data: {
        nombre: data.nombre,
        precio: data.precio,
        imagen_url: data.imagen_url,
        categoria_id: data.categoria_id,
        maneja_stock: data.maneja_stock ?? false,
        stock: data.maneja_stock ? data.stock ?? 0 : void 0
      }
    });
    console.log("Producto creado:", nuevoProducto);
    return JSON.parse(JSON.stringify(nuevoProducto));
  } catch (error) {
    console.error("Error al crear producto:", error);
    return error;
  }
};
const editarProducto = async (id, productoData) => {
  try {
    const productoActualizado = await prisma$1.producto.update({
      where: { id },
      data: {
        nombre: productoData.nombre,
        precio: productoData.precio,
        imagen_url: productoData.imagen_url,
        categoria_id: productoData.categoria_id,
        maneja_stock: productoData.maneja_stock ?? false,
        stock: productoData.maneja_stock ? productoData.stock ?? 0 : void 0
      }
    });
    console.log("Producto actualizado:", productoActualizado);
    return JSON.parse(JSON.stringify(productoActualizado));
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return error;
  }
};
const obtenerOneProducto = async (id) => {
  try {
    const producto = await prisma$1.producto.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen_url: true,
        categoria: true,
        stock: true,
        fecha_creacion: true,
        maneja_stock: true
      }
    });
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return producto ? { ...producto, precio: producto.precio.toFixed(2) } : null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return error;
  }
};
const eliminarProducto = async (id) => {
  try {
    const productoEliminado = await prisma$1.producto.update({
      where: { id },
      data: { eliminado: true }
    });
    console.log("Producto eliminado:", productoEliminado);
    return JSON.parse(JSON.stringify(productoEliminado));
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return error;
  }
};
const ipcProductos = () => {
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
const prisma = new PrismaClient();
const getCategoriasProductos = async () => {
  console.log("getCategoriasProductos");
  try {
    const categorias = await prisma.categoriaProducto.findMany({
      where: { eliminado: false }
    });
    return categorias;
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    return error;
  }
};
const getCategoriaProductoById = async (id) => {
  try {
    const categoria = await prisma.categoriaProducto.findUnique({
      where: { id }
    });
    console.log("Categoria encontrada:", categoria);
    if (!categoria) {
      throw new Error("Categoria no encontrada");
    }
    return categoria;
  } catch (error) {
    console.error("Error al obtener una categoria:", error);
    return error;
  }
};
const createCategoriaProducto = async (data) => {
  try {
    const newCategoria = await prisma.categoriaProducto.create({
      data
    });
    return newCategoria;
  } catch (error) {
    console.error("Error al crear una ategorias:", error);
    return error;
  }
};
const updateCategoriaProducto = async (id, categoriaData) => {
  try {
    const updatedCategoria = await prisma.categoriaProducto.update({
      where: { id },
      data: categoriaData
    });
    return updatedCategoria;
  } catch (error) {
    console.error("Error al actualizar una ategoria:", error);
    return error;
  }
};
const deleteCategoriaProducto = async (id) => {
  try {
    const deletedCategoria = await prisma.categoriaProducto.update({
      where: { id },
      data: { eliminado: true }
    });
    return deletedCategoria;
  } catch (error) {
    console.error("Error al eliminar una ategoria:", error);
    return error;
  }
};
const ipcCategoriaProductos = () => {
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
  win.maximize();
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
app.whenReady().then(() => {
  createWindow();
  ipcProductos();
  ipcCategoriaProductos();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
