const fs = require('fs');
const rc = require('rc');
const url = require('url');
const http = require('http');
const IppPrinter = require('ipp-printer');
import { ipcMain } from 'electron';

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
      name: 'Printer',
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

  ipcMain.on('defaultSendToGetJobInfo', (e: any) => {
    // When Print Job Comes
    printer.on('job', function (job: any) {
      console.log(job);
      console.log('[job %d] Printing document: %s', job.id, job.name);
      let filename = 'job-' + job.id + '.prn';

      job.pipe(fs.createWriteStream(filename)).on('finish', function () {
        let filepath = 'temp/' + filename;
        console.log('printed:', filename);
        let job_item = {
          job_id: job.id,
          doc_name: job.name,
          file_path: filepath,
          page_cnt: 1,
          timestamp: job.completedAt,
        };
        queue.push(job_item);
        console.log(queue);
        e.sender.send('responseJobInfo', queue);
      });
    });
  });

  ipcMain.on('requestJobInfo', (e: any) => {
    e.sender.send('responseJobInfo', queue);
  });
};
