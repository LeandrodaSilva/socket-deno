// import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
// import "npm:mssql";
import {Request, Connection} from "npm:tedious";
import { createRequire } from "https://deno.land/std@0.165.0/node/module.ts";
import { serveTls, serve } from "https://deno.land/std@0.140.0/http/server.ts";

// const require = createRequire(import.meta.url);
// const sql = require("./index.js");
// const wss = new WebSocketServer(8080);
// const clients: WebSocketClient[] = [];

var config = {
  "server": "leproj-sql.database.windows.net",
  "authentication": {
    "type": "default",
    "options": {
      "userName": "leproj.admin",
      "password": "79RdDJt779PMMuw"
    }
  },
  "options": {
    "port": 1433,
    "database": "leproj_db",
    "trustServerCertificate": true
  }
}

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

await serve(async (_req) => {
  try {
    // console.log(sql)
    // make sure that any items are correctly URL encoded in the connection string
    // await sql.connect(sqlConfig)
    // const result = await sql.query`select * from Messages`
    const connection = new Connection(config);
    connection.on('connect', (err: any) => {
      if (err) {
        console.log('Connection Failed');
        throw err;
      }
      executeStatement();
    });
    connection.connect();
    function executeStatement() {
      const request = new Request("select * from Messages", (err: any, rowCount: number) => {
        if (err) {
          throw err;
        }
        console.log('DONE!');
        connection.close();
      });
      // Emits a 'DoneInProc' event when completed.
      request.on('row', (columns: Array<{value: null | string}>) => {
        columns.forEach((column) => {
          if (column.value === null) {
            console.log('NULL');
          } else {
            console.log(column.value);
            console.dir(column.value)
            return new Response(column.value, {
              headers: { "content-type": "text/plain" },
            });
          }
        });
      });
      // In SQL Server 2000 you may need: connection.execSqlBatch(request);
      connection.execSql(request);
    }
  } catch (err) {
    console.log(err)
    return new Response(err.toString(), {
      headers: { "content-type": "text/plain" },
    });
  }
  return new Response("error", {
    headers: { "content-type": "text/plain" },
  });
}, {
  // certFile: "./server.crt",
  // keyFile: "./server.key",
});

// wss.on("connection", function (ws: WebSocketClient) {
//   clients.push(ws);
//   ws.on("message", function (message: string | Uint8Array) {
//     clients.forEach((client) => {
//       client.send(message);
//     });
//   });
// });
