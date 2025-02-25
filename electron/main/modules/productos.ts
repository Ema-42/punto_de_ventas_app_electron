import { PrismaClient } from "@prisma/client";
import { Producto } from "./interfaces";

const prisma = new PrismaClient();

// Obtener todos los productos
const obtenerProductos = async () => {
  try {
    const productos = await prisma.producto.findMany({
      where: { eliminado: false },
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen_url: true,
        categoria: true,
        stock: true,
        fecha_creacion: true,
        maneja_stock: true,
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });
    return productos.map((p) => ({
      ...p,
      precio: p.precio.toFixed(2), // Convierte Decimal a string con 2 decimales
    }));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return error;
  }
};
const crearProducto = async (data: Producto) => {
  try {
    const existingProducto = await prisma.producto.findFirst({
      where: { nombre: data.nombre, eliminado: false },
    });

    if (existingProducto) {
      throw new Error("Ya existe un producto con ese nombre");
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre: data.nombre,
        precio: data.precio,
        imagen_url: data.imagen_url,
        categoria_id: data.categoria_id,
        maneja_stock: data.maneja_stock ?? false,
        stock: data.maneja_stock ? data.stock ?? 0 : undefined,
      },
    });
    return JSON.parse(JSON.stringify(nuevoProducto));
  } catch (error) {
    console.error("Error al crear producto:", error);
    return error;
  }
};

const editarProducto = async (id: number, productoData: Partial<Producto>) => {
  try {
    const existing = await prisma.producto.findMany({
      where: { nombre: productoData.nombre, eliminado: false },
    });

    if (
      existing.length > 1 ||
      (existing.length === 1 && existing[0].id !== id)
    ) {
      throw new Error("Ya existe un producto con ese nombre");
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: id },
      data: {
        nombre: productoData.nombre,
        precio: productoData.precio,
        imagen_url: productoData.imagen_url,
        categoria_id: productoData.categoria_id,
        maneja_stock: productoData.maneja_stock ?? false,
        stock: productoData.maneja_stock ? productoData.stock ?? 0 : undefined,
      },
    });

    return JSON.parse(JSON.stringify(productoActualizado));
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return error;
  }
};

const obtenerOneProducto = async (id: number) => {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen_url: true,
        categoria: true,
        stock: true,
        fecha_creacion: true,
        maneja_stock: true,
      },
    });
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return producto
      ? { ...producto, precio: producto.precio.toFixed(2) }
      : null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return error;
  }
};

const eliminarProducto = async (id: number) => {
  try {
    const productoEliminado = await prisma.producto.update({
      where: { id },
      data: { eliminado: true },
    });
    console.log("Producto eliminado:", productoEliminado);
    return JSON.parse(JSON.stringify(productoEliminado));
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return error;
  }
};

export {
  obtenerProductos,
  crearProducto,
  editarProducto,
  obtenerOneProducto,
  eliminarProducto,
};
