const startServer = require("./app.js");
const io = require("socket.io-client");
const axios = require("axios");

let wss;
let ws1, ws2, ws3;

beforeAll(() => {
  wss = startServer();
});

afterAll(() => {
  wss.close();
});

test("ws1 sends the message to ws2 & ws3", done => {
  let check2, check3;

  ws1 = io("http://localhost:4444/test");
  ws2 = io("http://localhost:4444/test");
  ws3 = io("http://localhost:4444/test");

  ws1.on("error", err => {
    console.error(err);
    done();
  });

  ws2.on("error", err => {
    console.error(err);
    done();
  });

  ws2.on("data", msg => {
    expect(msg).toEqual("hello");
    check2 = true;
    if (check2 && check3) {
      done();
    }
  });

  ws3.on("data", msg => {
    expect(msg).toEqual("hello");
    check3 = true;
    if (check2 && check3) {
      done();
    }
  });

  ws1.on("connect", () => {
    ws1.emit("data", "hello");
  });
});

test("getting the random string", done => {
  axios
    .get("http://localhost:4444/get-uuid")
    .then(response => {
      expect(typeof response).toBe("object");
      expect(response.status).toBe(200);
      expect(Object.keys(response.data)).toEqual(["uuid"]);
      expect(response.data.uuid.length).toEqual(16);
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
});

test("full integration test", async done => {
  try {
    const { data } = await axios.get("http://localhost:4444/get-uuid");

    ws1 = io(`http://localhost:4444/${data.uuid}`);
    ws2 = io(`http://localhost:4444/${data.uuid}`);

    ws1.on("error", err => {
      console.error(err);
      done();
    });

    ws2.on("error", err => {
      console.error(err);
      done();
    });

    ws2.on("data", msg => {
      expect(msg).toEqual("hello");
      done();
    });

    ws1.on("connect", () => {
      ws1.emit("data", "hello");
    });
  } catch (err) {
    console.error(err);
    done();
  }
});
