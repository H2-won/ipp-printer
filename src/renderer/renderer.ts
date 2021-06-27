const { ipcRenderer } = require('electron');
// notification (아이콘 있는 알림)
const notification = {
  title: 'Electron Tutorial!',
  body: 'for HP Project',
  icon: require('path').join(__dirname, '/images/huiIcon.png'),
};

const notificationButton = document.getElementById('notificationBtn');

notificationButton!.addEventListener('click', () => {
  const myNotification = new window.Notification(notification.title, notification);

  myNotification.onclick = () => {
    console.log('Notification clicked');
  };
});

const jobInfoBtn = document.querySelector('#jobInfoBtn');
jobInfoBtn!.addEventListener('click', () => {
  ipcRenderer.send('requestJobInfo');
  console.log('request Job Info');
});

ipcRenderer.on('responseJobInfo', (e: any, data: any) => {
  const jobInfoRendering = document.querySelector('#jobInfoRendering');
  jobInfoRendering!.innerHTML = data;
  console.log(data);
});

// default send
ipcRenderer.send('defaultSendToGetJobInfo');
