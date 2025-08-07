// server.js
import WebSocket, { WebSocketServer } from 'ws';
import { Buffer } from 'buffer';
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // If message is a Buffer, convert to string
    let msgString = message;
    if (Buffer.isBuffer(message)) {
      msgString = message.toString();
    }
    // Optionally, parse and re-stringify to ensure valid JSON
    let data;
    try {
      data = JSON.parse(msgString);
    } catch {
      data = { text: msgString, from: 'unknown', to: '', timestamp: Date.now() };
    }
    // Broadcast as string
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});
