import { PrismaClient } from "@prisma/client";
import { CategoriaProducto } from "./interfaces";

const prisma = new PrismaClient();

export const getCategoriasProductos = async () => {
  console.log("getCategoriasProductos");

  try {
    const categorias = await prisma.categoriaProducto.findMany({
      where: { eliminado: false },
    });
    return categorias;
  } catch (error) {
    console.error("Error al obtener categorias:", error);
    return error;
  }
};

export const getCategoriaProductoById = async (id: number) => {
  try {
    const categoria = await prisma.categoriaProducto.findUnique({
      where: { id },
    });
    console.log("Categoria encontrada:", categoria);
    if (!categoria) {
      throw new Error("Categoria no encontrada");
    }
    return categoria;
  } catch (error) {
    console.error("Error al obtener una categoria:", error);
    return error;
  }
};

export const createCategoriaProducto = async (data: CategoriaProducto) => {
  try {
    const newCategoria = await prisma.categoriaProducto.create({
      data: data,
    });
    return newCategoria;
  } catch (error) {
    console.error("Error al crear una ategorias:", error);
    return error;
  }
};

export const updateCategoriaProducto = async (
  id: number,
  categoriaData: Partial<CategoriaProducto>
) => {
  try {
    const updatedCategoria = await prisma.categoriaProducto.update({
      where: { id },
      data: categoriaData,
    });
    return updatedCategoria;
  } catch (error) {
    console.error("Error al actualizar una ategoria:", error);
    return error;
  }
};

export const deleteCategoriaProducto = async (id: number) => {
  try {
    const deletedCategoria = await prisma.categoriaProducto.update({
      where: { id },
      data: { eliminado: true },
    });
    return deletedCategoria;
  } catch (error) {
    console.error("Error al eliminar una ategoria:", error);
    return error;
  }
};
