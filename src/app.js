const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const randomize = require("randomatic");
const helmet = require("helmet");
const cors = require("cors");
const Sentry = require("@sentry/node");

require("dotenv").config();
Sentry.init({
  dsn: "https://220dfff7bdfa46b9b6da8c33227a447c@sentry.io/1388525"
});
const port = process.env.PORT || 4444;

function startServer() {
  server.listen(port);

  app.use(helmet());
  app.use(cors());

  app.get("/get-uuid", (req, res) => {
    const key = randomize("Aa09", 16);
    createChannel(key);
    res.json({ uuid: key });
    console.log(key);
  });

  app.use((req, res) => {
    res.status(404).send("Sorry can't find that!");
  });

  app.use((err, req, res, next) => {
    const eventId = Sentry.captureException(err);
    res.status(500).send(`Something broke! ${eventId}`);
  });

  createChannel("/test");

  return io;
}

function createChannel(name) {
  io.of(name).on("connect", socket => {
    console.log(socket.id);

    socket.on("data", msg => {
      socket.broadcast.emit("data", msg);
      console.log(msg);
    });
    socket.on("error", err => {
      Sentry.captureException(err);
    });
  });
}

module.exports = startServer;
