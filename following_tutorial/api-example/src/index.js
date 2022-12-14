/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { PostgrestClient } from "@supabase/postgrest-js";
import { Router } from "itty-router";

const router = Router();
const client = new PostgrestClient(POSTGREST_ENDPOINT);

router.get("/users", async (request) => {
  const { data, error } = await client.from("users").select();
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
});

router.get("/users/:id", async ({ params }) => {
  console.log(params);
  const { id } = params;
  const { data, error } = await client.from("users").select().eq("id", id);
  console.log(data);
  const user = data.length ? data[0] : null;
  return new Response(JSON.stringify({ user }), {
    headers: { "content-type": "application/json" },
  });
});

router.post("/users", async (request) => {
  const userData = await request.json();
  const { data, error } = await client.from("users").insert(userData);
  const user = data.length ? data[0] : null;
  return new Response(JSON.stringify({user}), {
    headers: { "content-type": "application/json" },
  });
});

router.all("*", () => new Response("Not Found", { status: 404 }));


addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  return router.handle(request);
}
