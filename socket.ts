import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import {everyMinute, every15Minute, stop, start} from 'https://deno.land/x/deno_cron/cron.ts';

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

wss.on("connection", async function (ws: WebSocketClient) {
  clients.push(ws);
  const messages = [];

  for await (const entry of kv.list({ prefix: ["messages"] })) {
    const message = await kv.get(entry.key);
    messages.push(message);
  }

  messages.reverse().forEach((message) => ws.send(JSON.stringify(message.value)));

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
     await broadcastMessage({
        ...parsed,
        data: '/clear'
      })
    }

    if (parsed.type === 'text' && parsed.data === '/stop-cron') {
      stop();

      parsed = {
        metadata: {
          user: {
            name: 'System'
          }
        },
        data: `Cron stopped`,
        type: 'text'
      }
    }

    if (parsed.type === 'text' && parsed.data === '/start-cron') {
      start();

      parsed = {
        metadata: {
          user: {
            name: 'System'
          }
        },
        data: `Cron started`,
        type: 'text'
      }
    }

    if (parsed.type === 'text' && parsed.data === '/clients-count') {
      start();

      parsed = {
        metadata: {
          user: {
            name: 'System'
          }
        },
        data: `Clients count: ${clients.length}`,
        type: 'text'
      }
    }

    await broadcastMessage(parsed);
  });
});

everyMinute(async () => await broadcastMessage({
  metadata: {
    user: {
      name: 'System'
    }
  },
  data: `Cron schedule executed at: ${new Date().toLocaleString()}`,
  type: 'text'
}))

every15Minute(async () => await broadcastMessage({
  metadata: {
    user: {
      name: 'System'
    }
  },
  data: `Clients count: ${clients.length}`,
  type: 'text'
}))

async function createMessage(message: Message) {
  const uuid = crypto.randomUUID();
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

async function broadcastMessage(message: Message) {
  await createMessage(message);
  clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}
