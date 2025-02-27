import { PrismaClient } from "@prisma/client";
import { CrearPedidoConDetalles, EditarPedidoConDetalles } from "./interfaces";

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
              },
            },
            cantidad: true,
            precio_unitario: true,
          },
        },
      },
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

export const crearPedido = async (data: any) => {
  try {
    const num_pedido_dia = await getNumeroPedidoDia();
    const nuevoPedido = await prisma.pedido.create({
      data: {
        pedido_padre_id: data.pedido_padre_id,
        mesa_id: data.mesa_id,
        mesera_id: data.mesera_id,
        cajero_id: data.cajero_id,
        estado: data.estado ?? "EN ATENCION",
        fecha_concluido: data.fecha_concluido,
        total: data.total ?? 0,
        num_pedido_dia,
      },
    });
    return JSON.parse(JSON.stringify(nuevoPedido));
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return error;
  }
};

export const editarPedido = async (id: number, pedidoData: Partial<any>) => {
  try {
    const pedidoActualizado = await prisma.pedido.update({
      where: { id: id },
      data: {
        pedido_padre_id: pedidoData.pedido_padre_id,
        mesa_id: pedidoData.mesa_id,
        mesera_id: pedidoData.mesera_id,
        cajero_id: pedidoData.cajero_id,
        estado: pedidoData.estado,
        fecha_concluido: pedidoData.fecha_concluido,
        total: pedidoData.total,
      },
    });

    return JSON.parse(JSON.stringify(pedidoActualizado));
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    return error;
  }
};

export const crearPedidoConDetalles = async (data: CrearPedidoConDetalles) => {
  if (!data.detalles || data.detalles.length === 0) {
    throw new Error("No se puede crear un pedido sin detalles.");
  }

  return await prisma.$transaction(async (tx) => {
    const num_pedido_dia = await getNumeroPedidoDia();
    // 1 Crear el pedido
    const nuevoPedido = await tx.pedido.create({
      data: {
        pedido_padre_id: data.pedido_padre_id,
        mesa_id: data.mesa_id,
        mesera_id: data.mesera_id,
        cajero_id: data.cajero_id,
        estado: data.estado ?? "EN_ATENCION",
        fecha_concluido: data.fecha_concluido,
        num_pedido_dia,
        total: 0, // Inicialmente 0, se actualizará después
      },
    });

    // 2️ Crear los detalles del pedido
    const detalles: {
      pedido_id: number;
      producto_id: number;
      cantidad: number;
      precio_unitario: number;
    }[] = data.detalles.map((detalle: any) => ({
      pedido_id: nuevoPedido.id,
      producto_id: detalle.producto_id,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
    }));

    await tx.detallePedido.createMany({ data: detalles });

    // 3️ Calcular el total del pedido
    const totalPedido: number = detalles.reduce(
      (total: number, detalle) =>
        total + detalle.cantidad * detalle.precio_unitario,
      0
    );

    // 4️ Actualizar el total en el pedido
    await tx.pedido.update({
      where: { id: nuevoPedido.id },
      data: { total: totalPedido },
    });

    /* return { ...nuevoPedido, total: totalPedido, detalles }; */
    return {
      success: true,
      message: "Pedido creado correctamente",
    };
  });
};

export const editarPedidoConDetalles = async (
  data: EditarPedidoConDetalles
) => {
  if (!data.detalles || data.detalles.length === 0) {
    throw new Error("No se puede guardar un pedido sin detalles.");
  }

  return await prisma.$transaction(async (tx) => {
    // 1️ Obtener el pedido actual
    const pedidoExistente = await tx.pedido.findUnique({
      where: { id: data.id },
      include: { detalles: true }, // Obtener detalles actuales
    });

    if (!pedidoExistente) {
      throw new Error("Pedido no encontrado.");
    }

    // 2️ Actualizar el pedido si hay cambios
    await tx.pedido.update({
      where: { id: data.id },
      data: {
        pedido_padre_id: data.pedido_padre_id,
        mesa_id: data.mesa_id,
        mesera_id: data.mesera_id,
        cajero_id: data.cajero_id,
        estado: data.estado ?? "EN_ATENCION",
        fecha_concluido: data.fecha_concluido,
      },
    });

    // 3️ Procesar los detalles del pedido
    for (const detalle of data.detalles) {
      if (detalle.eliminado && detalle.id) {
        // Si el detalle está marcado como eliminado, lo eliminamos
        await tx.detallePedido.delete({
          where: { id: detalle.id },
        });
      } else if (detalle.id) {
        // Si el detalle ya existe, lo actualizamos
        await tx.detallePedido.update({
          where: { id: detalle.id },
          data: {
            producto_id: detalle.producto_id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
          },
        });
      } else {
        // Si el detalle no tiene ID, es nuevo y lo creamos
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
    });

    const totalPedido: number = detallesActualizados.reduce(
      (total: number, detalle) =>
        total + Number(detalle.cantidad) * Number(detalle.precio_unitario),
      0
    );

    // 5️ Actualizar el total en el pedido
    await tx.pedido.update({
      where: { id: data.id },
      data: { total: totalPedido },
    });
    /*     return {
      id: data.id,
      total: JSON.parse(JSON.stringify(totalPedido)),
      detalles: JSON.parse(JSON.stringify(detallesActualizados)),
    }; */
    return {
      success: true,
      message: "Pedido actualizado correctamente",
    };
  });
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
