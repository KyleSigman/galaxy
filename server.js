
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const WebSocket = require('ws');
const httpServer = require('http').createServer(app);
const server = new WebSocket.Server({ server: httpServer });

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Сервер на порту ${PORT}`);
});

// httpServer.listen(8080, () => {
//   console.log('🚀 Сервер на http://localhost:8080');
// });
// const server = new WebSocket.Server({ port: 8080 });

const rooms = new Map(); // roomId -> { sockets, author, mode, allowedUsers }

server.on('connection', (socket) => {
  console.log('🟢 Новое подключение');

  socket.on('message', (data) => {
    const msg = JSON.parse(data);
    
    // Подключение к комнате
    if (msg.type === 'join') {
      // Если комната новая - создаем
      if (!rooms.has(msg.roomId)) {
        rooms.set(msg.roomId, {
          sockets: [],
          author: msg.nick,  // первый вошедший = автор
          mode: 'dialog',
          allowedUsers: []
        });
        console.log(`🆕 Создана комната ${msg.roomId}, автор: ${msg.nick}`);
      }
      
      const room = rooms.get(msg.roomId);
      room.sockets.push(socket);
      
      // Сохраняем данные на сокете
      socket.roomId = msg.roomId;
      socket.nick = msg.nick;
      socket.isAuthor = (msg.nick === room.author);
      
      console.log(`👤 ${msg.nick} вошел в ${msg.roomId} ${socket.isAuthor ? '(автор)' : ''}`);
      
      // Отправляем клиенту его статус
      socket.send(JSON.stringify({
        type: 'init',
        isAuthor: socket.isAuthor,
        mode: room.mode,
        allowedUsers: room.allowedUsers
      }));
      
      // Оповещаем всех о новом участнике
      broadcast(msg.roomId, {
        type: 'system',
        message: `${msg.nick} вошел в чат`
      }, socket); // исключаем текущего сокета
    }
    
    // Смена режима (только для автора)
    if (msg.type === 'change_mode' && socket.isAuthor) {
      const room = rooms.get(socket.roomId);
      room.mode = msg.mode;
      room.allowedUsers = msg.allowedUsers || [];
      
      console.log(`🔄 Режим ${room.mode} в комнате ${socket.roomId}`);
      
      // Оповещаем всех о смене режима
      broadcast(socket.roomId, {
        type: 'mode_changed',
        mode: room.mode,
        allowedUsers: room.allowedUsers
      });
    }
    
    // Добавление разрешенного пользователя (только для автора)
    if (msg.type === 'allow_user' && socket.isAuthor) {
      const room = rooms.get(socket.roomId);
      if (!room.allowedUsers.includes(msg.user)) {
        room.allowedUsers.push(msg.user);
        
        broadcast(socket.roomId, {
          type: 'mode_changed',
          mode: room.mode,
          allowedUsers: room.allowedUsers
        });
      }
    }
    
    // Обычное сообщение
    if (msg.type === 'message') {
      const room = rooms.get(socket.roomId);
      
      // Проверяем может ли пользователь писать
      let canWrite = true;
      if (room.mode === 'channel' && !socket.isAuthor) canWrite = false;
      if (room.mode === 'conference' && !socket.isAuthor && !room.allowedUsers.includes(socket.nick)) canWrite = false;
      
      if (canWrite) {
        broadcast(socket.roomId, {
          type: 'message',
          nick: socket.nick,
          message: msg.message,
          time: Date.now()
        });
      }
    }
  });

  socket.on('close', () => {
    if (socket.roomId && rooms.has(socket.roomId)) {
      const room = rooms.get(socket.roomId);
      const index = room.sockets.indexOf(socket);
      if (index > -1) room.sockets.splice(index, 1);
      
      broadcast(socket.roomId, {
        type: 'system',
        message: `${socket.nick} покинул чат`
      });
      
      // Если комната пуста - удаляем
      if (room.sockets.length === 0) {
        rooms.delete(socket.roomId);
        console.log(`🗑️ Комната ${socket.roomId} удалена`);
      }
    }
  });
});

function broadcast(roomId, data, excludeSocket = null) {
  if (!rooms.has(roomId)) return;
  rooms.get(roomId).sockets.forEach(socket => {
    if (socket !== excludeSocket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  });
}

console.log('🔵 WebSocket сервер на ws://localhost:8080');
