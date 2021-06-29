// Modules to control application life and create native browser window
import { app, BrowserWindow, Menu, Tray } from 'electron';
const glob = require('glob');
const path = require('path');
const printServer = require('./src/main/printer');

let mainWindow: BrowserWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    // 상단 메뉴바 숨기기, Alt 누르면 나타남
    autoHideMenuBar: true,
    // 작업표시줄에 아이콘 안뜨게 = true
    skipTaskbar: false,
  });

  // and load the index.html of the app.
  mainWindow.loadFile('../public/index.html');

  // 작업표시줄 아이콘에 작은 이미지 띄워줄때 (디스코드 빨간불 느낌)
  // mainWindow.setOverlayIcon('./huiIcon.png', 'Description for overlay');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Modal window 부모 윈도우 비활성화하면서 모달 띄움
  // let child = new BrowserWindow({
  //   parent: mainWindow,
  //   modal: true,
  //   show: false,
  // });
  // child.loadURL("https://resemble.ga");
  // child.once("ready-to-show", () => {
  //   child.show();
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  loadMainProcessFiles();
  createWindow();
  initialTray();
  printServer();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  tray.destroy();
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
let tray: any = null;
function initialTray() {
  tray = new Tray('./huiIcon.png');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Tray Icon 숨기기',
      // click시 tray icon 숨김
      click: () => {
        tray.destroy();
      },
    },
    {
      label: 'Item2',
      click: () => {
        console.log('Item2 clicked');
      },
    },
    {
      label: 'Item3',
      click: () => {
        console.log('Item3 clicked');
      },
    },
    {
      label: 'Item4',
      click: () => {
        console.log('Item4 clicked');
      },
    },
  ]);
  tray.setToolTip('Ipp-printer');
  tray.setContextMenu(contextMenu);
}

// Require each jS file in the main-process dir
function loadMainProcessFiles() {
  const files = glob.sync(path.join(__dirname, '/src/main/*.js'));
  files.forEach((file: string) => {
    require(file);
  });
}

export { mainWindow };
