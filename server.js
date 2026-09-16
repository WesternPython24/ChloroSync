
const PORT = process.env.PORT || 3000;
const app = require('./index');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(app);

const websocketServer = new WebSocket.Server({ server: server });

console.log('WebSocket server is running on ws://localhost:' + PORT);

websocketServer.on('connection', (ws) => {

  console.log('New client connected');


  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    websocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(`Sending: ${message} to frontend clients`);
        client.send(message);
      }
    });
  });

  websocketServer.on('close', () => {
  console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server and WebSockets are running on port ${PORT}`);
});



