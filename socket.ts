import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8080);
const clients: WebSocketClient[] = [];

const kv = await Deno.openKv();

wss.on("connection", function (ws: WebSocketClient) {
  clients.push(ws);
  ws.on("message", async function (message: string) {
    const parsed: { data: string; author: string } = JSON.parse(message);
    const dateStr = new Date().toISOString();
    await kv.set(["messages", parsed.author, dateStr], parsed);
    clients.forEach((client) => {
      client.send(message);
    });
  });
});
