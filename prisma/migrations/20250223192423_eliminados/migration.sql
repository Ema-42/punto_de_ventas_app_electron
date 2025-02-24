-- AlterTable
ALTER TABLE "CategoriaProducto" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "DetallePedido" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Ingreso" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Mesa" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Rol" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "eliminado" BOOLEAN DEFAULT false;
