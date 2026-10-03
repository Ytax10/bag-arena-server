const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let players = [];

io.on('connection', (socket) => {
  console.log('Игрок подключился:', socket.id);
  players.push(socket.id);

  if (players.length === 2) {
    io.emit('start', { players: players });
  }

  socket.on('input', (data) => {
    socket.broadcast.emit('input', data);
  });

  socket.on('state', (data) => {
    socket.broadcast.emit('state', data);
  });

  socket.on('disconnect', () => {
    console.log('Игрок отключился:', socket.id);
    players = players.filter(id => id !== socket.id);
    io.emit('playerLeft');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Сервер запущен на порту', PORT);
});
