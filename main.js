const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

// Safe module check for electron-updater
let autoUpdater = null;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (err) {
  console.log('electron-updater is not installed. Auto-updates disabled.');
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 728,
    title: "TEMPTEA POS System",
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false
    }
  });

  // Load interface safely from the app package
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Force open DevTools on startup to diagnose the white screen issue
  mainWindow.webContents.openDevTools();

  // Clean UI setup
  mainWindow.setMenuBarVisibility(false);

  // Trigger auto-update check once UI is ready
  mainWindow.once('ready-to-show', () => {
    if (autoUpdater) {
      autoUpdater.checkForUpdatesAndNotify().catch(err => {
        console.log("Error checking for updates:", err);
      });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Auto-Updater Event Handlers
if (autoUpdater) {
  autoUpdater.on('update-available', () => {
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: 'A new version of TEMPTEA POS is available. Downloading now in the background...'
      });
    }
  });

  autoUpdater.on('update-downloaded', () => {
    if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'The update has been downloaded. The app will restart now to apply the updates.',
        buttons: ['Restart Now']
      }).then(() => {
        autoUpdater.quitAndInstall();
      });
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Auto Updater Error:', err);
  });
}

process.on('uncaughtException', (error) => {
  console.error('Main Process Error:', error);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});