import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
const prisma$3 = new PrismaClient();
const obtenerProductos = async () => {
  try {
    const productos = await prisma$3.producto.findMany({
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
      },
      orderBy: {
        fecha_creacion: "desc"
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
    const existingProducto = await prisma$3.producto.findFirst({
      where: { nombre: data.nombre, eliminado: false }
    });
    if (existingProducto) {
      throw new Error("Ya existe un producto con ese nombre");
    }
    const nuevoProducto = await prisma$3.producto.create({
      data: {
        nombre: data.nombre,
        precio: data.precio,
        imagen_url: data.imagen_url,
        categoria_id: data.categoria_id,
        maneja_stock: data.maneja_stock ?? false,
        stock: data.maneja_stock ? data.stock ?? 0 : void 0
      }
    });
    return JSON.parse(JSON.stringify(nuevoProducto));
  } catch (error) {
    console.error("Error al crear producto:", error);
    return error;
  }
};
const editarProducto = async (id, productoData) => {
  try {
    const existing = await prisma$3.producto.findMany({
      where: { nombre: productoData.nombre, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe un producto con ese nombre");
    }
    const productoActualizado = await prisma$3.producto.update({
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
    return JSON.parse(JSON.stringify(productoActualizado));
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return error;
  }
};
const obtenerOneProducto = async (id) => {
  try {
    const producto = await prisma$3.producto.findUnique({
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
    const productoEliminado = await prisma$3.producto.update({
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
const prisma$2 = new PrismaClient();
const getCategoriasProductos = async () => {
  console.log("getCategoriasProductos");
  try {
    const categorias = await prisma$2.categoriaProducto.findMany({
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
    const categoria = await prisma$2.categoriaProducto.findUnique({
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
    const existingCategoria = await prisma$2.categoriaProducto.findFirst({
      where: { nombre: data.nombre, eliminado: false }
    });
    if (existingCategoria) {
      throw new Error("Ya existe una categoria con ese nombre");
    }
    const newCategoria = await prisma$2.categoriaProducto.create({
      data
    });
    return newCategoria;
  } catch (error) {
    console.error("Error al crear una categoria:", error);
    return error;
  }
};
const updateCategoriaProducto = async (id, categoriaData) => {
  try {
    const existing = await prisma$2.categoriaProducto.findMany({
      where: { nombre: categoriaData.nombre, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe un producto con ese nombre");
    }
    const updatedCategoria = await prisma$2.categoriaProducto.update({
      where: { id },
      data: categoriaData
    });
    return updatedCategoria;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return error;
  }
};
const deleteCategoriaProducto = async (id) => {
  try {
    const deletedCategoria = await prisma$2.categoriaProducto.update({
      where: { id },
      data: { eliminado: true }
    });
    return deletedCategoria;
  } catch (error) {
    console.error("Error al eliminar una ategoria:", error);
    return error;
  }
};
const prisma$1 = new PrismaClient();
const getMesas = async () => {
  try {
    const mesas = await prisma$1.mesa.findMany({
      where: { eliminado: false }
    });
    return mesas;
  } catch (error) {
    console.error("Error al obtener mesas:", error);
    return error;
  }
};
const getMesaById = async (id) => {
  try {
    const mesa = await prisma$1.mesa.findUnique({
      where: { id }
    });
    if (!mesa) {
      throw new Error("Mesa no encontrada");
    }
    return mesa;
  } catch (error) {
    console.error("Error al obtener una mesa:", error);
    return error;
  }
};
const createMesa = async (data) => {
  try {
    const existingMesa = await prisma$1.mesa.findFirst({
      where: { numero: data.numero }
    });
    if (existingMesa) {
      throw new Error("Ya existe una mesa con ese numero");
    }
    const newMesa = await prisma$1.mesa.create({
      data
    });
    return newMesa;
  } catch (error) {
    console.error("Error al crear una mesa:", error);
    return error;
  }
};
const updateMesa = async (id, mesaData) => {
  try {
    const existing = await prisma$1.mesa.findMany({
      where: { numero: mesaData.numero, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe una mesa con ese numero");
    }
    const updatedMesa = await prisma$1.mesa.update({
      where: { id },
      data: mesaData
    });
    return updatedMesa;
  } catch (error) {
    console.error("Error al actualizar una mesa:", error);
    return error;
  }
};
const deleteMesa = async (id) => {
  try {
    const deletedMesa = await prisma$1.mesa.update({
      where: { id },
      data: { eliminado: true }
    });
    return deletedMesa;
  } catch (error) {
    console.error("Error al eliminar una mesa:", error);
    return error;
  }
};
const prisma = new PrismaClient();
const getUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { eliminado: false },
      select: { nombre: true, rol: true }
    });
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return error;
  }
};
const getUsuarioById = async (id) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id, eliminado: false },
      select: { nombre: true, rol: true }
    });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  } catch (error) {
    console.error("Error al obtener un usuario:", error);
    return error;
  }
};
const createUsuario = async (data) => {
  try {
    const existingUsuario = await prisma.usuario.findFirst({
      where: { nombre: data.nombre }
    });
    if (existingUsuario) {
      throw new Error("Ya existe un usuario con ese nombre");
    }
    const newUsuario = await prisma.usuario.create({
      data
    });
    return newUsuario;
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return error;
  }
};
const updateUsuario = async (id, usuarioData) => {
  try {
    const existing = await prisma.usuario.findMany({
      where: { nombre: usuarioData.nombre, eliminado: false }
    });
    if (existing.length > 1 || existing.length === 1 && existing[0].id !== id) {
      throw new Error("Ya existe un usuario con ese nombre");
    }
    const updatedUsuario = await prisma.usuario.update({
      where: { id },
      data: usuarioData
    });
    return updatedUsuario;
  } catch (error) {
    console.error("Error al actualizar un usuario:", error);
    return error;
  }
};
const deleteUsuario = async (id) => {
  try {
    const deletedUsuario = await prisma.usuario.update({
      where: { id },
      data: { eliminado: true }
    });
    return deletedUsuario;
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return error;
  }
};
const ipcMainModules = () => {
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
app.whenReady().then(() => {
  createWindow();
  ipcMainModules();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
