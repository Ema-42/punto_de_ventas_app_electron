export enum EstadosMesa {
  LIBRE = "Libre",
  OCUPADA = "Ocupada",
  RESERVADA = "Reservada",
  MANTENIMIENTO = "En Mantenimiento",
}
export const ESTADOS_MESA_ARRAY = Object.entries(EstadosMesa).map(
  ([valor, etiqueta]) => ({
    valor,
    etiqueta,
  })
);
