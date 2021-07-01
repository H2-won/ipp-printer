const electron = require('electron');

const saveSettingBtn = document.getElementById('saveSettingBtn');
const trayCheckbox: any = document.getElementById('trayCheckbox');

saveSettingBtn!.addEventListener('click', () => {
  electron.ipcRenderer.send('saveSetting', trayCheckbox.checked);
});

const homeBtn = document.getElementById('homeBtn');
homeBtn!.addEventListener('click', () => {
  electron.ipcRenderer.send('loadIndexPage');
});
