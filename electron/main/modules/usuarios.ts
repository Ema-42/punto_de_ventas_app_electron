import { PrismaClient } from "@prisma/client";
import { EstadoPedido, Usuario, UsuarioAuth } from "./interfaces";
import bcrypt from "bcryptjs";
import { Roles } from "./enums";

const prisma = new PrismaClient();

export const getUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { eliminado: false },
      select: { id: true, nombre: true, rol: true, fecha_creacion: true },
    });
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return error;
  }
};

export const getUsuarioById = async (id: number) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id, eliminado: false },
      select: { id: true, nombre: true, rol: true, fecha_creacion: true },
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

export const createUsuario = async (data: UsuarioAuth) => {
  try {
    const existingUsuario = await prisma.usuario.findFirst({
      where: { nombre: data.nombre },
    });

    if (existingUsuario) {
      throw new Error("Ya existe un usuario con ese nombre");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const newUsuario = await prisma.usuario.create({
      data: data,
    });
    return newUsuario;
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return error;
  }
};

export const updateUsuario = async (
  id: number,
  usuarioData: Partial<UsuarioAuth>
) => {
  try {
    if (usuarioData.password) {
      usuarioData.password = await bcrypt.hash(usuarioData.password, 10);
    }

    const existing = await prisma.usuario.findMany({
      where: { nombre: usuarioData.nombre, eliminado: false },
    });
    if (
      existing.length > 1 ||
      (existing.length === 1 && existing[0].id !== id)
    ) {
      throw new Error("Ya existe un usuario con ese nombre");
    }

    const updatedUsuario = await prisma.usuario.update({
      where: { id },
      data: usuarioData,
    });
    return updatedUsuario;
  } catch (error) {
    console.error("Error al actualizar un usuario:", error);
    return error;
  }
};

export const deleteUsuario = async (id: number) => {
  try {
    const deletedUsuario = await prisma.usuario.update({
      where: { id },
      data: { eliminado: true },
    });
    return deletedUsuario;
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return error;
  }
};

export const getMeseroMasLibre = async () => {
  try {
    const hoy = new Date();
    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
    const finDia = new Date(hoy.setHours(23, 59, 59, 999));

    // Obtener meseros disponibles
    const meseros = await prisma.usuario.findMany({
      where: { rol: { nombre: Roles.MESERO }, eliminado: false },
      select: { id: true, nombre: true },
    });

    if (!meseros.length) return [];

    // Obtener conteo de pedidos asignados y atendidos en una sola consulta
    const pedidos = await prisma.pedido.groupBy({
      by: ["mesera_id", "estado"],
      _count: { _all: true },
      where: {
        mesera_id: { in: meseros.map((m) => m.id) },
        eliminado: false,
        pedido_padre: null,
        fecha_creacion: { gte: inicioDia, lte: finDia },
      },
    });

    // Mapear conteos por mesero
    const resultado = meseros.map((mesero) => {
      const asignados =
        pedidos.find(
          (p) =>
            p.mesera_id === mesero.id &&
            p.estado === EstadoPedido.EN_PREPARACION
        )?._count._all || 0;
      const atendidos =
        pedidos.find(
          (p) =>
            p.mesera_id === mesero.id && p.estado === EstadoPedido.COMPLETADO
        )?._count._all || 0;

      return {
        id: mesero.id,
        nombre: mesero.nombre,
        mesasAsignadas: asignados,
        mesasAtendidas: atendidos,
      };
    });

    // Ordenar según criterios
    resultado.sort((a, b) => {
      const totalA = a.mesasAsignadas + a.mesasAtendidas;
      const totalB = b.mesasAsignadas + b.mesasAtendidas;

      if (totalA !== totalB) {
        return totalA - totalB; // Primero, ordena por la suma total (menor a mayor)
      }
      return a.mesasAsignadas - b.mesasAsignadas; // Si empatan, el que tenga menos asignadas va primero
    });

    return resultado;
  } catch (error) {
    console.error("Error al obtener meseros disponibles:", error);
    throw error;
  }
};

export const authenticateUsuario = async (
  usuario: string,
  password: string
) => {
  try {
    const usuarioEncontrado = await prisma.usuario.findFirst({
      where: { nombre: usuario, eliminado: false },
      select: { nombre: true, rol: true, id: true, password: true },
    });
    if (!usuarioEncontrado) {
      throw new Error("Usuario no encontrado");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      usuarioEncontrado.password
    );

    if (!isPasswordValid) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    return {
      message: "Acceso correcto",
      data: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol.nombre,
      },
    };
  } catch (error) {
    console.error("Error en la autenticación del usuario:", error);
    return error;
  }
};
