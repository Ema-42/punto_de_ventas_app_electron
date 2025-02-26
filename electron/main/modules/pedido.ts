import { PrismaClient } from "@prisma/client";
import { CrearPedidoConDetalles } from "./interfaces";

const prisma = new PrismaClient();

export const getPedidos = async () => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { eliminado: false },
      select: {
        id: true,
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

export const crearPedido = async (data: any) => {
  try {
    const nuevoPedido = await prisma.pedido.create({
      data: {
        pedido_padre_id: data.pedido_padre_id,
        mesa_id: data.mesa_id,
        mesera_id: data.mesera_id,
        cajero_id: data.cajero_id,
        estado: data.estado ?? "EN ATENCION",
        fecha_concluido: data.fecha_concluido,
        total: data.total ?? 0,
      },
    });
    return JSON.parse(JSON.stringify(nuevoPedido));
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return error;
  }
};

export const crearPedidoConDetalles = async (data: CrearPedidoConDetalles) => {
  if (!data.detalles || data.detalles.length === 0) {
    throw new Error("No se puede crear un pedido sin detalles.");
  }

  return await prisma.$transaction(async (tx) => {
    // 1 Crear el pedido
    const nuevoPedido = await tx.pedido.create({
      data: {
        pedido_padre_id: data.pedido_padre_id,
        mesa_id: data.mesa_id,
        mesera_id: data.mesera_id,
        cajero_id: data.cajero_id,
        estado: data.estado ?? "EN_ATENCION",
        fecha_concluido: data.fecha_concluido,
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

    return { ...nuevoPedido, total: totalPedido, detalles };
  });
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
