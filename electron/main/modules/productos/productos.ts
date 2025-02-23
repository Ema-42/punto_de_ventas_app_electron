import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los productos
const obtenerProductos = async () => {
  try {
    //const { PrismaClient } = await import("@prisma/client"); // 🔥 Importación dinámica evita problemas con prisma , la otra opcion esta en vite config
    //const prisma = new PrismaClient();
    const productos = await prisma.producto.findMany({
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
    console.log("productos", productos);

    return productos.map((p) => ({
      ...p,
      precio: p.precio.toFixed(2), // Convierte Decimal a string con 2 decimales
    }));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return error;
  }
};

export { obtenerProductos };
