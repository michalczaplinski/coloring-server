const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const randomize = require('randomatic');
const helmet = require('helmet');
const Redis = require('ioredis');
const cors = require('cors');

require('dotenv').config()

var redis = new Redis(process.env.REDIS_URL);
const port = process.env.PORT || 4444

function startServer() {

  server.listen(port);

  app.use(helmet())
  app.use(cors())

  app.get('/get-uuid', (req, res) => {
    // redis.set('')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.json({ uuid: randomize('Aa09', 16) });
  });

  app.use((req, res) => {
    res.status(404).send("Sorry can't find that!")
  })

  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  io.of('/hello').on('connection', (socket) => {
    socket.on('data', (msg) => {
      socket.broadcast.emit('data', msg);
    })
  });

  return io;

}

module.exports = startServer;
