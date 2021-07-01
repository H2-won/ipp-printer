import { Menu, Tray } from 'electron';
import { ipcMain } from 'electron/main';

let tray: any = null;
export function initialTray() {
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

export function destroyTray() {
  tray.destroy();
}

ipcMain.on('saveSetting', (e, checked) => {
  // 아이콘 표시 체크 안되어있으면 사라지게
  if (!checked) {
    destroyTray();
  }
  // 아이콘 표시 체크되어있고, 현재 tray 아이콘이 없는 경우 생성
  else if (tray.isDestroyed()) {
    initialTray();
  }
});
