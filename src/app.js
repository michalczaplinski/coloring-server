const WebSocket = require('ws');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 4444

function startServer() {

  server.listen(port);

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  io.of('/hello').on('connection', function (socket) {
    socket.on('message', (msg) => {
      socket.broadcast.send(msg);
    })
  });

  return io;

}

module.exports = startServer;
