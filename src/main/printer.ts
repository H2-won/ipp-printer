import { ipcMain } from 'electron';
import { mainWindow } from '../../main';
import FormData from 'form-data';
// import { fetch } from 'node-fetch';
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const rc = require('rc');
const url = require('url');
const IppPrinter = require('ipp-printer');

const multer = require('multer');
const http = require('http');
const net = require('net');
const socketIO = require('socket.io');
// const express = require('express');
// const app = express();

// interface를 뜻하는 I 붙여줌 변수에
interface IQueue {
  job_id: number;
  doc_name: string;
  file_path: string;
  page_cnt: number;
  timestamp: string;
}

module.exports = () => {
  let queue: IQueue[] = [];

  const printer = new IppPrinter(
    rc('Printer', {
      name: 'Boba Printer',
      dir: process.cwd(),
      port: 3030,
    }),
  );

  printer.server.on('listening', () => {
    console.log(
      'ipp-printer listening on :',
      url.format({
        protocol: 'http',
        hostname: '127.0.0.1',
        port: 3030,
      }),
    );
  });

  // When Print Job Comes
  printer.on('job', function (job: any) {
    console.log(job);
    console.log('[job %d] Printing document: %s', job.id, job.name);
    let filename = 'job-' + job.id + '.prn';

    job.pipe(fs.createWriteStream(filename)).on('finish', function () {
      let filepath = './' + filename;
      console.log('printed:', filename);
      let job_item = {
        job_id: job.id,
        doc_name: job.name,
        file_path: filepath,
        page_cnt: 1,
        timestamp: job.completedAt,
      };
      mainWindow.webContents.send('responseJobInfo', job_item);
      queue.push(job_item);
      console.log('***********************queue************************\n', queue);
      console.log('Printer.jobs === ', printer.jobs);

      const printFile = fs.createReadStream(filepath);
      printFile.on('readable', () => {
        console.log(`readable: ${printFile.read()}`);
      });
      printFile.on('end', () => {
        console.log('print File');
        const formData: any = new FormData();
        formData.append('file', printFile);

        axios
          .post('http://192.168.31.19:80', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((res: any) => console.log(res))
          .catch((err: any) => console.log(err));

        // fetch('http://192.168.31.19:80', {
        //   method: 'POST',
        //   headers: {},
        //   body: formData,
        // }).then((res: any) => console.log(res));

        // console.log(formData);
        // const reqConfig = {
        //   method: 'POST',
        //   url: 'http://192.168.31.19:80',
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        //   data: formData,
        // };
        // return axios(reqConfig);
      });
    });
  });

  // const server = http.createServer((req: any, res: any) => {
  //   res.writeHead(200, { 'Content-Type': 'text/html' });
  //   fs.readFile('index.html', (err: any, data: any) => {
  //     if (err) {
  //       console.log('file read error');
  //     } else {
  //       res.writeHead(200, { 'Content-Type': 'text/html' });
  //       res.end(data);
  //     }
  //   });
  // });
  // server.listen(80, () => {
  //   console.log('Web server running');
  // });
  // const io = socketIO(server);

  // async function print_action(dtmp: IQueue) {
  //   // temp폴더에 임시저장된 job 읽어오기
  //   let data = fs.readFileSync(dtmp.file_path, 'utf8');
  //   console.log('Print_action -> data ', data);
  //   // boba 프린터기 가져오기
  //   var boba = await getConnection('boba');
  //   fs.readFile(dtmp.file_path, function (err: any, data: any) {
  //     if (err) throw err;

  //     // 프린터기로 전송
  //     writeData(boba, data);

  //     // 프린터기로 전송한뒤 job리스트에서 프린트한 job 제외
  //     const idx = queue.findIndex(function (item: IQueue) {
  //       return item.job_id == dtmp.job_id;
  //     }); // findIndex = find + indexOf
  //     if (idx > -1) queue.splice(idx, 1);

  //     io.emit('delete_job', dtmp);
  //     boba.end();
  //   });
  //   fs.unlinkSync(dtmp.file_path);
  //   console.log('AFTER PRINT ', queue);
  // }

  // // JOB데이터 프린터로 전송
  // function writeData(socket: any, data: any) {
  //   var success = !socket.write(data);
  //   if (!success) {
  //     (function (socket, data) {
  //       socket.once('drain', function () {
  //         writeData(socket, data);
  //       });
  //     })(socket, data);
  //   }
  // }

  // // 프린터 커넥션 풀
  // async function getConnection(connName: string) {
  //   var client = await net.connect({ port: 9100, host: '192.168.31.19' }, function (this: any) {
  //     console.log(connName + ' Connected: ');
  //     console.log('   local = %s:%s', this.localAddress, this.localPort);
  //     console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
  //     //this.setTimeout(500);
  //     this.setEncoding('utf8');
  //     this.on('data', function (this: any, data: any) {
  //       console.log(connName + ' From Server: ' + data.toString());
  //       this.end();
  //     });
  //     this.on('end', function () {
  //       console.log(connName + ' Client disconnected');
  //     });
  //     this.on('error', function (err: any) {
  //       console.log('Socket Error: ', JSON.stringify(err));
  //     });
  //     this.on('timeout', function () {
  //       console.log('Socket Timed Out');
  //     });
  //     this.on('close', function () {
  //       console.log('Socket Closed');
  //     });
  //   });
  //   return client;
  // }
};
