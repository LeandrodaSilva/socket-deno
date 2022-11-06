import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8080);
const clients: WebSocketClient[] = [];

wss.on("connection", function (ws: WebSocketClient) {
  clients.push(ws);
  ws.on("message", function (message: string | Uint8Array) {
    console.log("message", message);
    clients.forEach((client) => {
      client.send(message);
    });
  });
});
