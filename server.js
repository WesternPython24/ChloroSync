
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = require('./index');
const http = require('http');
const WebSocket = require('ws');
require('./modules/database.js');

const NODE_WHITE_LIST = JSON.parse(process.env.NODE_WHITE_LIST || '{}');

const server = http.createServer(app);
const websocketServer = new WebSocket.Server({ server: server });
console.log('WebSocket server is running on ws://localhost:' + PORT);

websocketServer.on('connection', (ws, req) => {
  console.log('\nRequest URL:', req.url);

  if(req.url.includes('browser')) {
    ws.type = 'browser';
    console.log(new Date().toLocaleString() + ` Browser client connected \n` );
  }

  if(req.url.includes('data-node')) {
    const params = new URL(req.url, 'http://localhost').searchParams;
    const nodeId = params.get('NODE_ID');
    const nodeKey = params.get('NODE_KEY');
    if (!nodeId || !nodeKey || NODE_WHITE_LIST[nodeId] !== nodeKey) {
      console.log( '\n' + new Date().toLocaleString() + ` Invalid node credentials for NODE_ID: ${nodeId} \n`);
      ws.close(1008, 'Invalid node credentials');
      return;
    }
    ws.type = 'data-node';
    ws.NODE_ID = nodeId;
    console.log( new Date().toLocaleString() + ` Data node client connected \n` );
  }

  ws.on('message', (message) => {
    if(ws.type !== 'data-node') {
      console.log( new Date().toLocaleString() + `  Received message from non-data-node client: ${message} \n`);
      return;
    }
    console.log( new Date().toLocaleString() + `  Received: ${message}` );
    const jsonData = JSON.parse(message);
    jsonData.NODE_ID = ws.NODE_ID;
    message = JSON.stringify(jsonData);

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
