import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8080);
const clients: WebSocketClient[] = [];

const kv = await Deno.openKv();

type Message = {
  metadata: {
    user: {
      name: string;
    }
  },
  data: string;
  type: 'text' | 'audio';
}

wss.on("connection", function (ws: WebSocketClient) {
  clients.push(ws);
  ws.on("message", async function (message: string) {
    const parsed: Message = JSON.parse(message);
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const date = new Date().toISOString().split('T')[0];
    await kv.set(
      [
        "messages",
        parsed.metadata.user.name,
        date,
        uuid
      ],
      parsed
    );
    clients.forEach((client) => {
      client.send(message);
    });
  });
});
