import { app, BrowserWindow, protocol } from "electron";
/* import { createRequire } from 'node:module' */
import { fileURLToPath } from "node:url";
import path, { join } from "node:path";
import ipcMainModules from "./main/ipc-main-process/ipcMainModules";
import { screen } from "electron";
import { readFile } from "node:fs/promises";

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
  /* win.setSize(1000, 800);
  const primaryDisplay = screen.getPrimaryDisplay();
  const allDisplays = screen.getAllDisplays();
  const secondaryDisplay = allDisplays.find(
    (display) => display.id !== primaryDisplay.id
  );

  if (secondaryDisplay) {
    const { x, y } = secondaryDisplay.bounds;
    win?.setBounds({ x, y, width: secondaryDisplay.bounds.width, height: 900 });
  } */
  win.maximize(); // Maximize the window
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

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
