/// <reference types="vite-plugin-electron/electron-env" />

const { EstadosMesa } = require("./main/modules/enums");

const {
  CrearPedidoConDetalles,
  EditarPedidoConDetalles,
  CrearIngresoConDetalles,
  EditarIngresoConDetalles,
} = require("./main/modules/interfaces");

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

declare module "file-saver" {
  export function saveAs(data: Blob | string, filename?: string): void;
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  api: {
    getProductos: () => Promise<any>;
    createProducto: (data: any) => Promise<any>;
    editProductoById: (id: number, data: any) => Promise<any>;
    getOneProductoById: (id: number) => Promise<any>;
    deleteProductoById: (id: number) => Promise<any>;
    uploadFile: (fileData: any) => Promise<any>;
    //categorias
    getCategorias: () => Promise<any>;
    createCategoria: (categoriaData: any) => Promise<any>;
    editCategoriaById: (id: number, categoriaData: any) => Promise<any>;
    getOneCategoriaById: (id: number) => Promise<any>;
    deleteCategoriaById: (id: number) => Promise<any>;
    //mesas
    getMesas: () => Promise<any>;
    getMesasByEstado: (estado: EstadosMesa) => Promise<any>;
    createMesa: (mesaData: any) => Promise<any>;
    editMesaById: (id: number, mesaData: any) => Promise<any>;
    getOneMesaById: (id: number) => Promise<any>;
    deleteMesaById: (id: number) => Promise<any>;
    //usuarios
    getUsuarios: () => Promise<any>;
    getMeseroMasLibre: () => Promise<any>;
    createUsuario: (usuarioData: any) => Promise<any>;
    editUsuarioById: (id: number, usuarioData: any) => Promise<any>;
    getOneUsuarioById: (id: number) => Promise<any>;
    deleteUsuarioById: (id: number) => Promise<any>;
    authenticateUsuario: (usuario: string, password: string) => Promise<any>;
    //roles
    getRoles: () => Promise<any>;
    getOneRoleById: (id: number) => Promise<any>;
    //ingresos
    getIngresos: () => Promise<any>;
    getOneIngresoById: (id: number) => Promise<any>;
    crearIngresoConDetalles: (data: CrearIngresoConDetalles) => Promise<any>;
    editarIngresoConDetalles: (data: EditarIngresoConDetalles) => Promise<any>;
    //pedidos
    getPedidos: () => Promise<any>;
    getNumeroPedidoDia: () => Promise<number>;
    cambiarEstadoPedido: (id: number, estado: string) => Promise<any>;
    getOnePedidoById: (id: number) => Promise<any>;
    deletePedidoById: (id: number) => Promise<any>;
    crearPedidoConDetalles: (data: CrearPedidoConDetalles) => Promise<any>;
    editarPedidoConDetalles: (data: EditarPedidoConDetalles) => Promise<any>;
  };
  ipcRenderer: import("electron").IpcRenderer;
}
