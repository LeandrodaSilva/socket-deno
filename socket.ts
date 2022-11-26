import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8080);
const clients: WebSocketClient[] = [];

wss.on("connection", function (ws: WebSocketClient) {
  clients.push(ws);
  ws.on("message", async function (message: string) {
    await createMessage(
      JSON.parse(message) as { data: string; author: string },
    );
    clients.forEach((client) => {
      client.send(message);
    });
  });
});

/** Create a new quote in the database. */
async function createMessage({ data, author, }: {
  data: string;
  author: string;
}): Promise<{ data?: string; author?: string; errors?: FaunaError[] }> {
  const query = `
    mutation($data: String!, $author: String!) {
      createMessage(data: { data: $data, author: $author }) {
        _id
        data
        author
      }
    }
  `;

  const { data: queryData, errors } = await queryFauna(query, { data, author });
  if (errors) {
    return { errors };
  }

  const { createMessage } = queryData as {
    createMessage: {
      data: string;
      author: string;
    };
  };

  return createMessage; // {data: "*", author: "*"}
}

/** Get all quotes available in the database. */
async function getAllMessages() {
  const query = `
    query {
      allMessages {
        data {
          data
          author
        }
      }
    }
  `;

  const { data, errors } = await queryFauna(query, {});
  if (errors) {
    return { errors };
  }

  const {
    allMessages: { data: messages },
  } = data as { allMessages: { data: string[] } };

  return { messages };
}



type FaunaError = {
  message: string;
};


/** Query FaunaDB GraphQL endpoint with the provided query and variables. */
async function queryFauna(
  query: string,
  variables: { [key: string]: unknown },
): Promise<{
  data?: unknown;
  errors?: FaunaError[];
}> {
  // Grab the secret from the environment.
  const token = Deno.env.get("FAUNA_SECRET");
  if (!token) {
    throw new Error("environment variable FAUNA_SECRET not set");
  }

  try {
    // Make a POST request to fauna's graphql endpoint with body being
    // the query and its variables.
    const res = await fetch("https://graphql.fauna.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();
    if (errors) {
      // Return the first error if there are any.
      return { data, errors };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { errors: [{ message: "failed to fetch data from fauna" }] };
  }
}
