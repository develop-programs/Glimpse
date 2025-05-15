import { app, BrowserWindow, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Keep a global reference to prevent garbage collection
let mainWindow = null;

// Store window state
let windowState = {
  width: 1000,
  height: 700,
  x: undefined,
  y: undefined
};

function saveWindowState() {
  if (mainWindow) {
    const bounds = mainWindow.getBounds();
    windowState = {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y
    };
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 800,
    minHeight: 600,
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    // Better appearance
    backgroundColor: "#f0f0f0",
    autoHideMenuBar: process.platform === "win32", // Auto-hide menu bar on Windows
    icon: path.join(__dirname, "../assets/icon.png"), // Add your app icon
  });

  // Save window state on resize and move
  ['resize', 'move'].forEach(event => {
    mainWindow.on(event, () => {
      if (!mainWindow.isMaximized()) {
        saveWindowState();
      }
    });
  });

  // Open external links in browser instead of new Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Show window when content has loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Load the app
  if (process.env.NODE_ENV === "development") {
    // In dev mode, load from dev server
    await mainWindow.loadURL("http://localhost:5173/");
    mainWindow.webContents.openDevTools();
  } else {
    // In prod mode, load from build directory
    await mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// Ensure single instance of the app
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      await createWindow();
    } catch (error) {
      console.error("Failed to create window:", error);
    }

    app.on("activate", async () => {
      // On macOS, recreate window when dock icon is clicked and no windows are open
      if (BrowserWindow.getAllWindows().length === 0) {
        try {
          await createWindow();
        } catch (error) {
          console.error("Failed to recreate window:", error);
        }
      }
    });
  });
}

app.on("window-all-closed", () => {
  // Quit when all windows are closed, except on macOS
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  // Save window state and perform cleanup
  saveWindowState();
  
  // Remove all event listeners to prevent memory leaks
  if (mainWindow) {
    mainWindow.removeAllListeners();
  }
});

// Check for updates if not in development
if (process.env.NODE_ENV !== "development") {
  app.on('ready', () => {
    // Import this conditionally to avoid errors in dev mode
    import('electron-updater').then(({ autoUpdater }) => {
      autoUpdater.checkForUpdatesAndNotify()
        .catch(err => console.error('Error checking for updates:', err));
    }).catch(err => {
      console.error('Could not setup auto-updates:', err);
    });
  });
}
