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
  getMesasByEstado,
  updateMesa,
} from "../modules/mesas";
import {
  authenticateUsuario,
  createUsuario,
  deleteUsuario,
  getMeseroMasLibre,
  getUsuarioById,
  getUsuarios,
  updateUsuario,
} from "../modules/usuarios";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getRolById, getRoles } from "../modules/roles";
import {
  cambiarEstadoPedido,
  crearPedidoConDetalles,
  editarPedidoConDetalles,
  eliminarPedido,
  gePedidoById,
  getNumeroPedidoDia,
  getPedidos,
  getPedidosHoy,
} from "../modules/pedido";
import {
  crearIngresoConDetalles,
  editarIngresoConDetalles,
  getIngresoById,
  getIngresos,
} from "../modules/ingresos";
import { EstadosMesa } from "../modules/enums";

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
  ipcMain.handle("get-mesas-by-estado", async (_, estado: EstadosMesa) => {
    return await getMesasByEstado(estado);
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
  ipcMain.handle("get-mesero-libre", async () => {
    return await getMeseroMasLibre();
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
  //roles
  ipcMain.handle("get-roles", async () => {
    return await getRoles();
  });
  ipcMain.handle("get-one-role", async (_, id) => {
    return await getRolById(id);
  });
  //pedidos

  ipcMain.handle("get-pedidos", async () => {
    return await getPedidos();
  });

  ipcMain.handle("get-pedidos-hoy", async () => {
    return await getPedidosHoy();
  });

  ipcMain.handle("get-numero-pedido-dia", async () => {
    return await getNumeroPedidoDia();
  });

  ipcMain.handle("get-one-pedido", async (_, id) => {
    return await gePedidoById(id);
  });

  ipcMain.handle("cambiar-estado-pedido", async (_, { id, estado }) => {
    return await cambiarEstadoPedido(id, estado);
  });
  ipcMain.handle("delete-pedido", async (_, id) => {
    return await eliminarPedido(id);
  });
  ipcMain.handle("crear-pedido-con-detalles", async (_, data) => {
    return await crearPedidoConDetalles(data);
  });
  ipcMain.handle("editar-pedido-con-detalles", async (_, data) => {
    return await editarPedidoConDetalles(data);
  });
  //INgresos
  ipcMain.handle("crear-ingreso-con-detalles", async (_, data) => {
    return await crearIngresoConDetalles(data);
  });
  ipcMain.handle("editar-ingreso-con-detalles", async (_, data) => {
    return await editarIngresoConDetalles(data);
  });
  ipcMain.handle("get-ingresos", async () => {
    return await getIngresos();
  });
  ipcMain.handle("get-one-ingreso", async (_, id) => {
    return await getIngresoById(id);
  });

  if (process.platform === "win32") {
    protocol.registerFileProtocol("local", (request, callback) => {
      const url = request.url.replace(/^local:\//, "");
      const filePath = path.normalize(decodeURIComponent(url));
      callback({ path: filePath });
    });
  }
  else{
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
  }

};
