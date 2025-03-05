export enum EstadosMesa {
  LIBRE = "LIBRE",
  OCUPADA = "OCUPADA",
  RESERVADA = "RESERVADA",
  MANTENIMIENTO = "MANTENIMIENTO",
}

export enum Roles {
  ADMIN = "ADMIN",
  CAJERO = "CAJERO",
  MESERO = "MESERO",
}
export const ESTADOS_MESA_ARRAY = Object.entries(EstadosMesa).map(
  ([valor, etiqueta]) => ({
    valor,
    etiqueta,
  })
);
