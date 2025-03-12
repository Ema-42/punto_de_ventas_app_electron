import { TipoPago } from "./enums";

export interface Rol {
  id: number;
  nombre: string;
  usuarios: Usuario[];
}

export interface Usuario {
  id?: number;
  nombre: string;
  password: string;
  rol_id: number;
  rol?: {
    id: number;
    nombre: string;
  };
}

export interface UsuarioAuth {
  id?: number;
  nombre: string;
  password: string;
  rol_id: number;
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  buffer: number[];
}
export interface Mesa {
  id?: number;
  numero: number;
  estado?: string;
  eliminado?: boolean;
}

export interface CategoriaProducto {
  id?: number;
  nombre: string;
  eliminado?: boolean;
}

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  imagen_url?: string;
  categoria_id: number;
  maneja_stock?: boolean;
  stock?: number;
  fecha_creacion: Date;
  eliminado?: boolean;
  categoria?: { id: number; nombre: string };
}

export interface CrearPedidoConDetalles {
  pedido_padre_id?: number;
  mesa_id: number;
  mesera_id: number;
  cajero_id: number;
  estado?: string; // "EN_ATENCION" o "CONCLUIDO"
  fecha_concluido?: Date;
  tipo_pago?: TipoPago;
  num_pedido_dia?: number;
  para_llevar?: boolean,
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export interface CrearIngresoConDetalles {
  usuario_id: number;
  estado?: string;
  total?: number;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}
export enum EstadoPedido {
  EN_PREPARACION = "EN PREPARACION",
  COMPLETADO = "COMPLETADO",
  CANCELADO = "CANCELADO",
}

export enum EstadoIngreso {
  CONSOLIDADO = "CONSOLIDAD",
  ELIMINADO = "ELIMINADO",
}

export interface EditarPedidoConDetalles {
  id: number;
  pedido_padre_id?: number;
  mesa_id?: number;
  mesera_id: number;
  cajero_id: number;
  estado?: string;
  fecha_concluido?: Date;
  detalles: {
    id?: number; // Si existe, se actualiza; si no, se crea
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    eliminado?: boolean; // Si es `true`, se elimina
  }[];
}

export interface EditarIngresoConDetalles {
  id: number;
  usuario_id: number;
  estado?: string;
  fecha_ingreso?: Date;
  detalles: {
    id?: number; // Si existe, se actualiza; si no, se crea
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    eliminado?: boolean; // Si es `true`, se elimina
  }[];
}

export interface PedidoEditData {
  pedido_padre_id?: number;
  mesa_id?: number;
  mesera_id?: number;
  cajero_id?: number;
  estado?: string;
  fecha_concluido?: Date;
}

export interface ProductoIngreso {
  id: number;
  nombre: string;
  imagen_url?: string;
  maneja_stock?: boolean;
}

export interface DetalleIngreso {
  id: number;
  ingreso_id: number;
  producto: ProductoIngreso;
  cantidad: number;
  precio_unitario: string;
}

export interface Ingreso {
  id: number;
  fecha_ingreso: string;
  usuario: Usuario;
  estado: string;
  total: string;
  detalles?: DetalleIngreso[];
}
