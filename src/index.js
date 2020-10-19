const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const Filter = require('bad-words');
const { createMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('Nova konekcija je ostvarena');
  
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ username, id: socket.id, room });
    if(error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', createMessage('Welcome!', 'Admin'));
    socket.broadcast.to(user.room).emit('message', createMessage(`${user.username} has joined.`, 'Admin'));
    io.to(user.room).emit('roomData', {
      users: getUsersInRoom(user.room),
      room: user.room
    });
    callback();
  });

  socket.on('helloMessage', (clientMessage, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter();
    if(filter.isProfane(clientMessage)) {
      return callback('Profanities are not allowed!');
    }
    
    io.to(user.room).emit('message', createMessage(clientMessage, user.username));
    callback('Delivered!');
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('message', createMessage(`${user.username} has left.`, 'Admin'));
      io.to(user.room).emit('roomData', {
        users: getUsersInRoom(user.room),
        room: user.room
      });
    }
  });

  socket.on('sendLocation', (location, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.lat},${location.long}`, user.username));
    callback();
  });
});

server.listen(port, () => {
  console.log('Chat app pokrenuta');
});