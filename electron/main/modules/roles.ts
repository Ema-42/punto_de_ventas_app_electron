import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRoles = async () => {
  try {
    const roles = await prisma.rol.findMany({
      where: { eliminado: false },
      select: { id: true, nombre: true },
    });
    return roles;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return error;
  }
};

export const getRolById = async (id: number) => {
  try {
    const rol = await prisma.rol.findUnique({
      where: { id, eliminado: false },
      select: { id: true, nombre: true },
    });

    if (!rol) {
      throw new Error("Rol no encontrado");
    }
    return rol;
  } catch (error) {
    console.error("Error al obtener un rol:", error);
    return error;
  }
};
