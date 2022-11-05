import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

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
