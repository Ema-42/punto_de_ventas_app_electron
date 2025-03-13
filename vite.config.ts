import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron/main.ts', // Punto de entrada del proceso principal
        vite: {
          build: {
            outDir: 'dist-electron', // Carpeta de salida para el proceso principal
            rollupOptions: {
              external: ['@prisma/client', '.prisma'], // Excluye Prisma de la compilación
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'), // Punto de entrada del preload
      },
      renderer: {}, // Configuración del renderer (frontend)
    }),
  ],
  build: {
    outDir: 'dist', // Carpeta de salida para el frontend
    emptyOutDir: true, // Limpia la carpeta antes de construir
  },
});