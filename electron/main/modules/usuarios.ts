import { PrismaClient } from "@prisma/client";
import { Usuario } from "./interfaces";

const prisma = new PrismaClient();

export const getUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { eliminado: false },
      select: { nombre: true, rol: true },
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
      select: { nombre: true, rol: true },
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

export const createUsuario = async (data: Usuario) => {
  try {
    const existingUsuario = await prisma.usuario.findFirst({
      where: { nombre: data.nombre },
    });

    if (existingUsuario) {
      throw new Error("Ya existe un usuario con ese nombre");
    }

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
  usuarioData: Partial<Usuario>
) => {
  try {
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
