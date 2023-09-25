const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');


const port = process.env.PORT || 5000;
const app = express();

app.get('/', (_req, res) => {
  return res.json({
    message: 'Hello World'
  });
});

const server = createServer(app);

const wss = new WebSocket.Server({server});

// WS
wss.on('connection', (ws) => {
    // message recieved
    ws.on('message', (jsonMsg) => {
      const parsed = JSON.parse(jsonMsg);
      const id = `${parsed.session} + ${parsed.id}`;
      ws.id = id;

      if (parsed.type === 'chat') {
        const newMsg = JSON.stringify({
          content: parsed.content,
          username: parsed.username
        });

        wss.clients.forEach(client => {
          // possible ready states are CONNECTING, OPEN, CLOSING, CLOSED
          if (client.id === id) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(newMsg);
            }
          }
        })

      }



    });

    // close recieved
    ws.on('close', (e) => {
      // ...
    });
  });

  server.listen(port, () => console.log(`WS listening for messages on ${port}`));
