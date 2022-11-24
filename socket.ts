// import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
//@ts-ignore
import "npm:mssql";
import { createRequire } from "https://deno.land/std@0.165.0/node/module.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const require = createRequire(import.meta.url);
const sql = require("mssql");
// const wss = new WebSocketServer(8080);
// const clients: WebSocketClient[] = [];

const sqlConfig = {
  user: "leproj.admin",
  password: "79RdDJt779PMMuw",
  database: "leproj_db",
  server: 'leproj-sql.database.windows.net',
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

serve(async (_req) => {
  try {
    console.log(sql)
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig)
    const result = await sql.query`select * from Messages`
    console.dir(result)
    return new Response(result, {
      headers: { "content-type": "text/plain" },
    });
  } catch (err) {
    console.log(err)
    return new Response(err.toString(), {
      headers: { "content-type": "text/plain" },
    });
  }
  return new Response("error", {
    headers: { "content-type": "text/plain" },
  });
});

// wss.on("connection", function (ws: WebSocketClient) {
//   clients.push(ws);
//   ws.on("message", function (message: string | Uint8Array) {
//     clients.forEach((client) => {
//       client.send(message);
//     });
//   });
// });
