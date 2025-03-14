import { app, BrowserWindow, protocol } from "electron";
/* import { createRequire } from 'node:module' */
import { fileURLToPath } from "node:url";
import path, { join } from "path";
import ipcMainModules from "./main/ipc-main-process/ipcMainModules";

/* const require = createRequire(import.meta.url) */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.setIcon(path.join(process.env.VITE_PUBLIC, "icono-logo.png"));
  win.maximize(); // Maximize the window

  const dbPath = join(app.getPath("userData"), "database", "dev.db"); // Ruta segura
  console.log("Ruta de la base de datos:", dbPath);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.whenReady().then(() => {
  createWindow();
  ipcMainModules();
});
