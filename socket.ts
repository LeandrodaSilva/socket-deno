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
    let parsed: Message = JSON.parse(message);

    if (parsed.type === 'text' && parsed.data === '/clear-database') {
      const entries = [];
      for await (const entry of kv.list({ prefix: ["messages"] })) {
        entries.push(entry);
        await kv.delete(entry.key);
      }
      parsed = {
        metadata: {
          user: {
            name: 'System'
          }
        },
        data: `Deleted ${entries.length} messages by ${parsed.metadata.user.name}`,
        type: 'text'
      };
    }

    await createMessage(parsed);

    clients.forEach((client) => {
      client.send(JSON.stringify(parsed));
    });
  });
});

async function createMessage(message: Message) {
  const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const date = new Date().toISOString().split('T')[0];
  await kv.set(
    [
      "messages",
      message.metadata.user.name,
      date,
      uuid
    ],
    message
  );
}
