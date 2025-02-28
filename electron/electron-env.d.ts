/// <reference types="vite-plugin-electron/electron-env" />

const {
  CrearPedidoConDetalles,
  EditarPedidoConDetalles,
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
    createMesa: (mesaData: any) => Promise<any>;
    editMesaById: (id: number, mesaData: any) => Promise<any>;
    getOneMesaById: (id: number) => Promise<any>;
    deleteMesaById: (id: number) => Promise<any>;
    //usuarios
    getUsuarios: () => Promise<any>;
    createUsuario: (usuarioData: any) => Promise<any>;
    editUsuarioById: (id: number, usuarioData: any) => Promise<any>;
    getOneUsuarioById: (id: number) => Promise<any>;
    deleteUsuarioById: (id: number) => Promise<any>;
    authenticateUsuario: (usuario: string, password: string) => Promise<any>;
    //roles
    getRoles: () => Promise<any>;
    getOneRoleById: (id: number) => Promise<any>;
    //pedidos
    getPedidos: () => Promise<any>;
    editEstadoPedidoById: (id: number, estado: any) => Promise<any>;
    getOnePedidoById: (id: number) => Promise<any>;
    deletePedidoById: (id: number) => Promise<any>;
    crearPedidoConDetalles: (data: CrearPedidoConDetalles) => Promise<any>;
    editarPedidoConDetalles: (data: EditarPedidoConDetalles) => Promise<any>;
  };
  ipcRenderer: import("electron").IpcRenderer;
}
