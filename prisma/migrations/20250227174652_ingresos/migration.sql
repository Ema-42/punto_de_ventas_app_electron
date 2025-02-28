/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Ingreso` table. All the data in the column will be lost.
  - You are about to drop the column `producto_id` on the `Ingreso` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "DetalleIngreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ingreso_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL NOT NULL,
    "eliminado" BOOLEAN DEFAULT false,
    CONSTRAINT "DetalleIngreso_ingreso_id_fkey" FOREIGN KEY ("ingreso_id") REFERENCES "Ingreso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetalleIngreso_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_ingreso" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,
    "estado" TEXT,
    "eliminado" BOOLEAN DEFAULT false,
    "total" DECIMAL DEFAULT 0,
    CONSTRAINT "Ingreso_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ingreso" ("eliminado", "fecha_ingreso", "id", "usuario_id") SELECT "eliminado", "fecha_ingreso", "id", "usuario_id" FROM "Ingreso";
DROP TABLE "Ingreso";
ALTER TABLE "new_Ingreso" RENAME TO "Ingreso";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
