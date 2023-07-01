import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8080);
const clients: WebSocketClient[] = [];

const kv = await Deno.openKv();

wss.on("connection", function (ws: WebSocketClient) {
  clients.push(ws);
  ws.on("message", async function (message: string) {
    const parsed: { data: string; author: string } = JSON.parse(message);
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await kv.set(["messages", uuid], parsed);
    clients.forEach((client) => {
      client.send(message);
    });
  });
});
