// import { ipcRenderer } from 'electron';
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

// Job 정보 불러와서 렌더링
ipcRenderer.on('responseJobInfo', (e: any, data: any) => {
  const Container: any = document.getElementById('jobInfoContainer');
  const jobInfo = document.createElement('div');
  const jobId = document.createElement('span');
  const jobName = document.createElement('span');
  const jobTime = document.createElement('span');
  jobId.innerText = 'ID : ' + data.job_id;
  jobName.innerText = 'NAME : ' + data.doc_name;
  jobTime.innerText = 'TIME : ' + data.timestamp;

  jobInfo.append(jobId, jobName, jobTime);
  Container.appendChild(jobInfo);

  console.log(data);
});

const getJobListBtn = document.getElementById('getJobListBtn');
getJobListBtn!.addEventListener('click', () => {
  fetch('http://localhost:3000/api/jobList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log('res :', res);
    });
});

const settingBtn = document.getElementById('settingBtn');
settingBtn!.addEventListener('click', () => {
  ipcRenderer.send('loadSettingPage');
});
