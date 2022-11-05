import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const wss = new WebSocketServer(8080);
let clients: WebSocketClient[] = [];

wss.on("connection", function (ws: WebSocketClient) {
  clients.push(ws);
  ws.on("message", function (message: string) {
    console.log(message);
    clients.forEach((client) => {
      client.send(message);
    });
  });
});



async function handleRequest(request: Request): Promise<Response> {
  const index = await Deno.readFile("./index.html");
  return new Response(
    index,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

serve(handleRequest);
