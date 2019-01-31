const startServer = require('./app.js');
const WebSocket = require('ws');
const io = require('socket.io-client');

let wss;
let ws1, ws2, ws3;

beforeEach(() => {

})

afterEach(() => {
  wss.close();
})

test('ws1 sends the message to ws2 & ws3', done => {
  wss = startServer();
  let check2, check3;

  ws1 = io('http://localhost:4444/hello');
  ws2 = io('http://localhost:4444/hello');
  ws3 = io('http://localhost:4444/hello');

  ws1.on('error', (err) => {
    console.error(err);
  });

  ws2.on('error', (err) => {
    console.error(err);
  });

  ws2.on('data', (msg) => {
    expect(msg).toEqual('hello');
    check2 = true;
    if (check2 && check3) {
      done();
    }
  });

  ws3.on('data', (msg) => {
    expect(msg).toEqual('hello');
    check3 = true;
    if (check2 && check3) {
      done();
    }
  });

  ws1.on('connect', () => {
    ws1.emit('data', 'hello');
  })

});