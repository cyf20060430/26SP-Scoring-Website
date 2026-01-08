const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let score = { itemA: 0, itemB: 0, itemC: 0 };

io.on('connection', (socket) => {
  console.log('裁判员连接');
  socket.emit('scoreUpdate', score);

  socket.on('modifyScore', ({ item, delta }) => {
    score[item] += delta;
    console.log(`分数修改: ${item} -> ${score[item]}`);
    io.emit('scoreUpdate', score);
  });

  socket.on('disconnect', () => {
    console.log('裁判员断开连接');
  });
});

server.listen(3001, () => {
  console.log('后端运行在 http://localhost:3001');
});
