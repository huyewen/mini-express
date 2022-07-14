//引入net模块
const net = require('net');
const http = require('http');
const fs = require('fs');
const dateFormat = require('./utils/date');

const LISTEN_PORT = 10089;
const PROXY_TARGET = '14.215.227.240'; // 14.215.227.240
const PROXY_TARGET_POST = 11522;

//创建TCP服务器
const server = net.createServer(function (socket) {

  let strData = '';
  let proxy_count = 2; // 代理转发次数，假如失败的话

  socket.on("data", function (data) {  //监听data事件
    strData += data.toString();
  });

  socket.on('end', function () {

    const writeStream = fs.createWriteStream(`./log/log_${dateFormat(new Date(), 'yyyyMMdd-hhmmss-S')}-${Math.floor((Math.random() * 10000))}.txt`, {
      encoding: 'utf-8'
    });

    writeStream.write(strData);

    const proxy_request = async () => {
      const options = {
        host: PROXY_TARGET,
        port: PROXY_TARGET_POST,
        path: '/rest/zj/nonSiteData',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(strData)
        }
      }

      const request = () => {
        return new Promise((resolve, reject) => {
          const req = http.request(options, res => {
            let resStr = ''

            res.on('data', chunk => {
              resStr += chunk;
            })

            res.on('end', () => {
              const resData = JSON.parse(resStr);
              console.log(resData);

              if (resData.rscode === 200 && resData.rsmsg === 'success') {
                resolve(resData);
              } else {
                reject(new Error('failure'));
              }
            })

          })

          req.on('error', reject);

          req.write(strData);
          req.end();
        })
      }

      try {
        await request();
      } catch (e) {
        console.log(e);
        proxy_count--;
        proxy_count >= 0 && proxy_request();
      }
    }

    proxy_request();
  })
});
//设置监听端口
server.listen(LISTEN_PORT, function () {
  console.log(`TCP服务监听中...`)
});