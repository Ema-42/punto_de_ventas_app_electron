import { PrismaClient } from "@prisma/client";
import {
  CrearIngresoConDetalles,
  EditarIngresoConDetalles,
  EstadoIngreso,
} from "./interfaces";

const prisma = new PrismaClient();

function validarDetallesUnicos(
  detalles: { producto_id: number; cantidad: number; precio_unitario: number }[]
): void {
  const productoIds = detalles.map((detalle) => detalle.producto_id);
  const tieneDuplicados = new Set(productoIds).size !== productoIds.length;

  if (tieneDuplicados) {
    throw new Error(
      "No se puede crear un ingreso con detalles duplicados (mismo producto)."
    );
  }
}

export const crearIngresoConDetalles = async (
  data: CrearIngresoConDetalles
) => {
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede crear un ingreso sin detalles.");
    }
    validarDetallesUnicos(data.detalles);

    return await prisma.$transaction(async (tx) => {
      // 1. Crear el ingreso
      const nuevoIngreso = await tx.ingreso.create({
        data: {
          usuario_id: data.usuario_id,
          estado: data.estado ?? EstadoIngreso.CONSOLIDADO,
          total: 0, // Se actualizará después
        },
      });

      // 2. Obtener los productos involucrados
      const productoIds = data.detalles.map((detalle) => detalle.producto_id);
      const productos = await tx.producto.findMany({
        where: { id: { in: productoIds } },
        select: { id: true, stock: true, nombre: true },
      });

      // 3. Procesar los detalles del ingreso y actualizar stock
      const detalles: {
        ingreso_id: number;
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
      }[] = [];

      for (const detalle of data.detalles) {
        const producto = productos.find((p) => p.id === detalle.producto_id);
        if (!producto) {
          throw new Error(
            `Producto con ID ${detalle.producto_id} no encontrado.`
          );
        }

        // Sumar al stock
        await tx.producto.update({
          where: { id: producto.id },
          data: { stock: { increment: detalle.cantidad } },
        });

        // Agregar detalle del ingreso
        detalles.push({
          ingreso_id: nuevoIngreso.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
        });
      }

      // 4. Insertar los detalles del ingreso
      await tx.detalleIngreso.createMany({ data: detalles });

      // 5. Calcular el total del ingreso
      const totalIngreso = detalles.reduce(
        (total, detalle) => total + detalle.cantidad * detalle.precio_unitario,
        0
      );

      // 6. Actualizar el total en el ingreso
      await tx.ingreso.update({
        where: { id: nuevoIngreso.id },
        data: { total: totalIngreso },
      });

      return {
        success: true,
        message: "Ingreso creado correctamente",
      };
    });
  } catch (error) {
    return error;
  }
};

export const editarIngresoConDetalles = async (
  data: EditarIngresoConDetalles
) => {
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede guardar un ingreso sin detalles.");
    }

    return await prisma.$transaction(async (tx) => {
      // Obtener el ingreso actual con detalles y productos
      const ingresoExistente = await tx.ingreso.findUnique({
        where: { id: data.id },
        include: {
          detalles: true,
        },
      });

      if (!ingresoExistente) {
        throw new Error("Ingreso no encontrado.");
      }

      // Actualizar datos básicos del ingreso
      await tx.ingreso.update({
        where: { id: data.id },
        data: {
          usuario_id: data.usuario_id,
          estado: data.estado,
        },
      });

      // Procesar los detalles del ingreso
      for (const detalle of data.detalles) {
        if (detalle.eliminado && detalle.id) {
          // Eliminar detalle y restar del stock
          const detalleExistente = ingresoExistente.detalles.find(
            (d) => d.id === detalle.id
          );

          if (detalleExistente) {
            await tx.producto.update({
              where: { id: detalleExistente.producto_id },
              data: { stock: { decrement: detalleExistente.cantidad } },
            });

            await tx.detalleIngreso.delete({ where: { id: detalle.id } });
          }
        } else if (detalle.id) {
          // Actualizar detalle existente y ajustar stock
          const detalleExistente = ingresoExistente.detalles.find(
            (d) => d.id === detalle.id
          );

          if (!detalleExistente) {
            throw new Error(`Detalle con ID ${detalle.id} no encontrado`);
          }

          // Validar que no se cambie el producto
          if (detalleExistente.producto_id !== detalle.producto_id) {
            throw new Error(
              "No se puede modificar el producto en un detalle existente"
            );
          }

          // Calcular diferencia de stock
          const diferencia = detalle.cantidad - detalleExistente.cantidad;

          await tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock: { increment: diferencia } },
          });

          // Actualizar detalle
          await tx.detalleIngreso.update({
            where: { id: detalle.id },
            data: {
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
            },
          });
        } else {
          // Crear nuevo detalle y aumentar stock
          await tx.producto.update({
            where: { id: detalle.producto_id },
            data: { stock: { increment: detalle.cantidad } },
          });

          await tx.detalleIngreso.create({
            data: {
              ingreso_id: data.id,
              producto_id: detalle.producto_id,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
            },
          });
        }
      }

      // Recalcular el total del ingreso
      const detallesActualizados = await tx.detalleIngreso.findMany({
        where: { ingreso_id: data.id },
      });

      const totalIngreso = detallesActualizados.reduce(
        (total, detalle) =>
          total + detalle.cantidad * Number(detalle.precio_unitario),
        0
      );

      await tx.ingreso.update({
        where: { id: data.id },
        data: { total: totalIngreso },
      });

      return {
        success: true,
        message: "Ingreso actualizado correctamente",
      };
    });
  } catch (error) {
    return error;
  }
};

export const cambiarEstadoIngreso = async (
  id: number,
  estado: EstadoIngreso
) => {
  try {
    await prisma.ingreso.update({
      where: { id: id },
      data: { estado: estado },
    });

    return {
      success: true,
      message: `Ingreso con ID ${id} ha sido actualizado al estado ${estado}`,
    };
  } catch (error) {
    console.error("Error al actualizar el estado del ingreso:", error);
    return {
      success: false,
      message: "Error al actualizar el estado del ingreso",
    };
  }
};

export const getIngresos = async () => {
  try {
    const ingresos = await prisma.ingreso.findMany({
      where: { eliminado: false },
      orderBy: {fecha_ingreso:'desc'},
      select: {
        id: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
          },
        },
        estado: true,
        fecha_ingreso: true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            ingreso_id: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
                maneja_stock: true,
              },
            },
            cantidad: true,
            precio_unitario: true,
          },
        },
      },
    });

    return ingresos.map((i) => ({
      ...i,
      total: i.total?.toFixed(2), // Convertir a string con 2 decimales
      detalles: i.detalles.map((d) => ({
        ...d,
        precio_unitario: d.precio_unitario?.toFixed(2), // Convertir a string con 2 decimales
      })),
    }));
  } catch (error) {
    console.error("Error en ingresos:", error);
    return error;
  }
};

export const getIngresoById = async (id: number) => {
  try {
    const ingreso = await prisma.ingreso.findUnique({
      where: { id, eliminado: false },
      select: {
        id: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
          },
        },
        estado: true,
        fecha_ingreso: true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            ingreso_id: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
                maneja_stock: true,
              },
            },
            cantidad: true,
            precio_unitario: true,
          },
        },
      },
    });

    if (!ingreso) {
      throw new Error("Ingreso no encontrado");
    }
    return {
      ...ingreso,
      total: ingreso.total?.toFixed(2), // Convertir a string con 2 decimales
      detalles: ingreso.detalles.map((d) => ({
        ...d,
        precio_unitario: d.precio_unitario?.toFixed(2), // Convertir a string con 2 decimales
      })),
    };
  } catch (error) {
    console.error("Error al obtener ingreso:", error);
    return error;
  }
};
