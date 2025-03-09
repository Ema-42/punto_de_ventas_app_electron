import { PrismaClient } from "@prisma/client";
import {
  CrearPedidoConDetalles,
  EditarPedidoConDetalles,
  EstadoPedido,
} from "./interfaces";
import { cambiarEstadoMesa } from "./mesas";
import { EstadosMesa } from "./enums";

const prisma = new PrismaClient();

export const getPedidos = async () => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { eliminado: false },
      select: {
        id: true,
        num_pedido_dia: true,
        pedido_padre_id: true,
        mesa: {
          select: {
            id: true,
            numero: true,
          },
        },
        mesera: {
          select: {
            id: true,
            nombre: true,
          },
        },
        cajero: {
          select: {
            id: true,
            nombre: true,
          },
        },
        estado: true,
        fecha_creacion: true,
        fecha_concluido: true,
        tipo_pago:true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            pedido_id: true,
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
      orderBy: { fecha_creacion: "desc" },
    });

    return pedidos.map((p) => ({
      ...p,
      total: p.total?.toFixed(2), // Convierte Decimal a string con 2 decimales
      detalles: p.detalles.map((d) => ({
        ...d,
        precio_unitario: d.precio_unitario?.toFixed(2), // Convierte Decimal a string con 2 decimales
      })),
    }));
  } catch (error) {
    console.error("Error en pedidos:", error);
    return error;
  }
};

export const gePedidoById = async (id: number) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id, eliminado: false },
      select: {
        id: true,
        num_pedido_dia: true,
        pedido_padre_id: true,
        mesa: {
          select: {
            id: true,
            numero: true,
          },
        },
        mesera: {
          select: {
            id: true,
            nombre: true,
          },
        },
        cajero: {
          select: {
            id: true,
            nombre: true,
          },
        },
        estado: true,
        fecha_creacion: true,
        fecha_concluido: true,
        tipo_pago:true,
        total: true,
        detalles: {
          where: { eliminado: false },
          select: {
            id: true,
            pedido_id: true,
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

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }
    return {
      ...pedido,
      total: pedido.total?.toFixed(2), // Convierte Decimal a string con 2 decimales
      detalles: pedido.detalles.map((d) => ({
        ...d,
        precio_unitario: d.precio_unitario?.toFixed(2), // Convierte Decimal a string con 2 decimales
      })),
    };
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    return error;
  }
};

export const getNumeroPedidoDia = async (): Promise<number> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.pedido.count({
      where: {
        fecha_creacion: {
          gte: today,
        },
        eliminado: false,
      },
    });

    return count + 1;
  } catch (error) {
    console.error("Error al obtener número de pedido del día:", error);
    return 0;
  }
};

export const cambiarEstadoPedido = async (id: number, estado: EstadoPedido) => {
  try {
    const data: any = { estado };
    if (estado === EstadoPedido.COMPLETADO) {
      data.fecha_concluido = new Date();
    }
    const pedido = await prisma.pedido.update({
      where: { id },
      data,
    });
    //cambiar estado de la mesa a libre si se esta completando el pedido
    estado === EstadoPedido.COMPLETADO && pedido.mesa_id
      ? cambiarEstadoMesa(pedido.mesa_id, EstadosMesa.LIBRE)
      : "";

    return {
      success: true,
      message: `Pedido con ID ${id} ha sido actualizado al estado ${estado}`,
    };
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    return {
      success: false,
      message: "Error al actualizar el estado del pedido",
    };
  }
};

function validarDetallesUnicos(
  detalles: { producto_id: number; cantidad: number; precio_unitario: number }[]
): void {
  const productoIds = detalles.map((detalle) => detalle.producto_id);
  const tieneDuplicados = new Set(productoIds).size !== productoIds.length;

  if (tieneDuplicados) {
    throw new Error(
      "No se puede crear un pedido con detalles duplicados (mismo producto)."
    );
  }
}

export const crearPedidoConDetalles = async (data: CrearPedidoConDetalles) => {
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede crear un pedido sin detalles.");
    }
    validarDetallesUnicos(data.detalles);

    return await prisma.$transaction(async (tx) => {
      const num_pedido_dia = await getNumeroPedidoDia();
      // 1 Crear el pedido
      const nuevoPedido = await tx.pedido.create({
        data: {
          pedido_padre_id: data.pedido_padre_id,
          mesa_id: data.mesa_id,
          mesera_id: data.mesera_id,
          cajero_id: data.cajero_id,
          estado: data.estado ?? EstadoPedido.EN_PREPARACION,
          fecha_concluido: data.fecha_concluido,
          num_pedido_dia,
          total: 0, // Inicialmente 0, se actualizará después
          tipo_pago: data.tipo_pago,
        },
      });

      // Obtener productos para verificar stock
      const productoIds = data.detalles.map((detalle) => detalle.producto_id);
      const productos = await tx.producto.findMany({
        where: { id: { in: productoIds } },
        select: { id: true, maneja_stock: true, stock: true, nombre: true },
      });

      //Crear los detalles del pedido y actualizar stock si es necesario
      const detalles: {
        pedido_id: number;
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
      }[] = [];
      for (const detalle of data.detalles) {
        //verificar que el producto que llega , existe en la BD
        const producto = productos.find((p) => p.id === detalle.producto_id);
        if (!producto) {
          throw new Error(
            `Producto con ID ${detalle.producto_id} no encontrado.`
          );
        }

        // Si el producto maneja stock, verificar y actualizar
        if (producto.maneja_stock) {
          if (producto.stock < detalle.cantidad) {
            throw new Error(
              `Stock insuficiente para el producto ID ${producto.id} , ${producto.nombre}.`
            );
          }
          // Restar del stock
          await tx.producto.update({
            where: { id: producto.id },
            data: { stock: { decrement: detalle.cantidad } },
          });
        }

        // Agregar detalle del pedido
        detalles.push({
          pedido_id: nuevoPedido.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
        });
      }

      //Insertar los detalles del pedido
      await tx.detallePedido.createMany({ data: detalles });

      //Calcular el total del pedido
      const totalPedido = detalles.reduce(
        (total, detalle) => total + detalle.cantidad * detalle.precio_unitario,
        0
      );

      //Actualizar el total en el pedido
      await tx.pedido.update({
        where: { id: nuevoPedido.id },
        data: { total: totalPedido },
      });
      //cambiar estado de la mesa a ocupada
      cambiarEstadoMesa(data.mesa_id, EstadosMesa.OCUPADA);
      return {
        success: true,
        message: "Pedido creado correctamente",
      };
    });
  } catch (error) {
    return error;
  }
};

export const editarPedidoConDetalles = async (
  data: EditarPedidoConDetalles
) => {
  try {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("No se puede guardar un pedido sin detalles.");
    }
    validarDetallesUnicos(data.detalles);
    console.log(data.detalles);

    return await prisma.$transaction(async (tx) => {
      // 1️ Obtener el pedido actual con detalles y productos
      const pedidoExistente = await tx.pedido.findUnique({
        where: { id: data.id },
        include: {
          detalles: {
            include: {
              producto: {
                select: {
                  id: true,
                  maneja_stock: true,
                  stock: true,
                  nombre: true,
                },
              },
            },
          },
        },
      });

      if (!pedidoExistente) {
        throw new Error("Pedido no encontrado.");
      }

      // 2️ Actualizar datos básicos del pedido
      await tx.pedido.update({
        where: { id: data.id },
        data: {
          pedido_padre_id: data.pedido_padre_id,
          mesa_id: data.mesa_id,
          mesera_id: data.mesera_id,
          cajero_id: data.cajero_id,
          estado: data.estado ?? EstadoPedido.EN_PREPARACION,
          fecha_concluido: data.fecha_concluido,
        },
      });

      // 3️ Procesar los detalles del pedido
      for (const detalle of data.detalles) {
        if (detalle.eliminado && detalle.id) {
          // Eliminar detalle y restaurar stock
          const detalleExistente = pedidoExistente.detalles.find(
            (d) => d.id === detalle.id
          );

          if (detalleExistente?.producto.maneja_stock) {
            await tx.producto.update({
              where: { id: detalleExistente.producto.id },
              data: { stock: { increment: detalleExistente.cantidad } },
            });
          }

          await tx.detallePedido.delete({ where: { id: detalle.id } });
        } else if (detalle.id) {
          // Actualizar detalle existente (solo cantidad y precio)
          const detalleExistente = pedidoExistente.detalles.find(
            (d) => d.id === detalle.id
          );

          if (!detalleExistente) {
            throw new Error(`Detalle con ID ${detalle.id} no encontrado`);
          }

          // Validar que no se cambie el producto
          if (detalleExistente.producto.id !== detalle.producto_id) {
            throw new Error(
              "No se puede modificar el producto en un detalle existente"
            );
          }

          // Calcular diferencia de stock
          const diferencia = detalle.cantidad - detalleExistente.cantidad;

          if (detalleExistente.producto.maneja_stock) {
            if (detalleExistente.producto.stock < diferencia) {
              throw new Error(
                `Stock insuficiente para ${detalleExistente.producto.nombre}`
              );
            }

            await tx.producto.update({
              where: { id: detalleExistente.producto.id },
              data: { stock: { decrement: diferencia } },
            });
          }

          // Actualizar detalle
          await tx.detallePedido.update({
            where: { id: detalle.id },
            data: {
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
            },
          });
        } else {
          // Crear nuevo detalle
          const producto = await tx.producto.findUnique({
            where: { id: detalle.producto_id },
            select: { maneja_stock: true, stock: true, nombre: true },
          });

          if (!producto) {
            throw new Error(
              `Producto con ID ${detalle.producto_id} no encontrado`
            );
          }

          if (producto.maneja_stock && producto.stock < detalle.cantidad) {
            throw new Error(`Stock insuficiente para ${producto.nombre}`);
          }

          if (producto.maneja_stock) {
            await tx.producto.update({
              where: { id: detalle.producto_id },
              data: { stock: { decrement: detalle.cantidad } },
            });
          }

          await tx.detallePedido.create({
            data: {
              pedido_id: data.id,
              producto_id: detalle.producto_id,
              cantidad: detalle.cantidad,
              precio_unitario: detalle.precio_unitario,
            },
          });
        }
      }

      // 4️ Recalcular el total del pedido
      const detallesActualizados = await tx.detallePedido.findMany({
        where: { pedido_id: data.id },
        include: { producto: true },
      });

      const totalPedido = detallesActualizados.reduce(
        (total, detalle) =>
          total + detalle.cantidad * Number(detalle.precio_unitario),
        0
      );
      await tx.pedido.update({
        where: { id: data.id },
        data: { total: totalPedido },
      });

      return {
        success: true,
        message: "Pedido actualizado correctamente",
      };
    });
  } catch (error) {
    return error;
  }
};

export const eliminarPedido = async (id: number) => {
  try {
    const pedidoEliminado = await prisma.pedido.update({
      where: { id },
      data: { eliminado: true },
    });
    console.log("Pedido eliminado:", pedidoEliminado);
    return JSON.parse(JSON.stringify(pedidoEliminado));
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    return error;
  }
};
