
const PORT = process.env.PORT || 3000;
const app = require('./index');
const http = require('http');
const WebSocket = require('ws');
require('./modules/database.js');

const server = http.createServer(app);

const websocketServer = new WebSocket.Server({ server: server });

console.log('WebSocket server is running on ws://localhost:' + PORT);

websocketServer.on('connection', (ws, req) => {
  console.log('Request URL:', req.url);

  if(req.url.includes('browser')) {
    ws.type = 'browser';
    console.log( '\n' + new Date().toLocaleString() + ` Browser client connected \n`);
  }

  if(req.url.includes('data-node')) {
    ws.type = 'data-node';
    console.log(  '\n' +new Date().toLocaleString() + ` Data node client connected \n` );
  }

  ws.on('message', (message) => {
    console.log( new Date().toLocaleString() + `  Received: ${message}` );
    websocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.type === 'browser') {
        console.log( `Sending: ${message} to frontend clients \n`);
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
