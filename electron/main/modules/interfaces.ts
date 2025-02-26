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

export interface Pedido {
  id: number;
  pedido_padre_id?: number;
  mesa_id?: number;
  mesera_id: number;
  cajero_id: number;
  estado?: string;
  fecha_creacion: Date;
  fecha_concluido?: Date;
  total?: number;
  pedido_padre?: Pedido;
  pedidos_hijos: Pedido[];
  mesa?: Mesa;
  mesera: Usuario;
  cajero: Usuario;
  detalles: DetallePedido[];
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  pedido: Pedido;
  producto_id: number;
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
}

export interface Ingreso {
  id: number;
  producto_id: number;
  cantidad: number;
  fecha_ingreso: Date;
  usuario_id: number;
  producto: Producto;
  usuario: Usuario;
}
