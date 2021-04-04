const express = require('express');
const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const path = require('path');

const socket = require('socket.io');
const io = socket(server);

const messages = [];
const users = [];

// LISTENERS //

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('login', (userName) => {
    users.push({name: userName, id: socket.id});
    socket.broadcast.emit('message', {author: 'Chat Bot', content: userName + " has joined the conversation"});
    console.log('Client: ', socket.id, " is logged in as: ", userName);
  });

  socket.on('disconnect', () => { 
    const myUser = users.find(user => user.id === socket.id);
    if (myUser) {
      const indexOf = users.indexOf(myUser);
      users.splice(indexOf, 1);
      socket.broadcast.emit('message', {author: 'Chat Bot', content: myUser.name + " has left the conversation"});
      console.log('Oh, socket ' + socket.id + ' has left');
    }
  });
});

app.use(express.static(path.join(__dirname + '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});