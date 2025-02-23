/// <reference types="vite-plugin-electron/electron-env" />

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
    //categorias
    getCategorias: () => Promise<any>;
    createCategoria: (categoriaData: any) => Promise<any>;
    editCategoriaById: (id: number, categoriaData: any) => Promise<any>;
    getOneCategoriaById: (id: number) => Promise<any>;
    deleteCategoriaById: (id: number) => Promise<any>;
  };
  ipcRenderer: import("electron").IpcRenderer;
}
