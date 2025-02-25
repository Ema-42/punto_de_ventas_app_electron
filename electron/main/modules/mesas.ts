import { PrismaClient } from "@prisma/client";
import { Mesa } from "./interfaces";

const prisma = new PrismaClient();

export const getMesas = async () => {
  try {
    const mesas = await prisma.mesa.findMany({
      where: { eliminado: false },
    });
    return mesas;
  } catch (error) {
    console.error("Error al obtener mesas:", error);
    return error;
  }
};

export const getMesaById = async (id: number) => {
  try {
    const mesa = await prisma.mesa.findUnique({
      where: { id },
    });

    if (!mesa) {
      throw new Error("Mesa no encontrada");
    }
    return mesa;
  } catch (error) {
    console.error("Error al obtener una mesa:", error);
    return error;
  }
};

export const createMesa = async (data: Mesa) => {
  try {
    const existingMesa = await prisma.mesa.findFirst({
      where: { numero: data.numero },
    });

    if (existingMesa) {
      throw new Error("Ya existe una mesa con ese numero");
    }

    const newMesa = await prisma.mesa.create({
      data: data,
    });
    return newMesa;
  } catch (error) {
    console.error("Error al crear una mesa:", error);
    return error;
  }
};

export const updateMesa = async (id: number, mesaData: Partial<Mesa>) => {
    try {
        const existing = await prisma.mesa.findMany({
            where: { numero: mesaData.numero, eliminado: false },
        });
        if (
            existing.length > 1 ||
            (existing.length === 1 && existing[0].id !== id)
        ) {
            throw new Error("Ya existe una mesa con ese numero");
        }
        const updatedMesa = await prisma.mesa.update({
            where: { id },
            data: mesaData,
        });
        return updatedMesa;
    } catch (error) {
        console.error("Error al actualizar una mesa:", error);
        return error;
    }
};

export const deleteMesa = async (id: number) => {
  try {
    const deletedMesa = await prisma.mesa.update({
      where: { id },
      data: { eliminado: true },
    });
    return deletedMesa;
  } catch (error) {
    console.error("Error al eliminar una mesa:", error);
    return error;
  }
};
