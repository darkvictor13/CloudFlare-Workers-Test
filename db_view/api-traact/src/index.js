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

const response_headers = new Headers({ "Content-Type": "application/json" });
const router = Router({ base: "/api" });
const client = new PostgrestClient(POSTGREST_ENDPOINT);

// Count all users in the database
router.get("/count/users", async (request) => {
  const { _, error, count } = await client
    .from("users")
    .select("id", { count: "exact" });

  if (error !== null) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: response_headers,
    });
  }
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: response_headers,
  });
});

// Endpoint for documents analytics
// Returns the number of documents edited, downloaded and uploaded separated by day
router.get("/documents", async (request) => {
  const { data, error } = await client
    .from("documents")
    .select("id, createdAt, updatedAt");

  if (error !== null) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: response_headers,
    });
  }

  let created = data.reduce((acc, doc) => {
    const date = new Date(doc.createdAt).toLocaleDateString();
    if (acc[date]) {
      acc[date] += 1;
    } else {
      acc[date] = 1;
    }
    return acc;
  }, {});
  // sort by date
  created = Object.keys(created)
    .sort((a, b) => new Date(a) - new Date(b))
    .reduce((acc, key) => {
      acc[key] = created[key];
      return acc;
    }, {});

  let updated = data.reduce((acc, doc) => {
    const date = new Date(doc.updatedAt).toLocaleDateString();
    if (acc[date]) {
      acc[date] += 1;
    } else {
      acc[date] = 1;
    }
    return acc;
  }, {});
  // sort by date
  updated = Object.keys(updated)
    .sort((a, b) => new Date(a) - new Date(b))
    .reduce((acc, key) => {
      acc[key] = updated[key];
      return acc;
    }, {});

  return new Response(JSON.stringify({ created: created, updated: updated }), {
    status: 200,
    headers: response_headers,
  });
});

router.get("/tasks/:status", async (request) => {
  const status = request.params.status;
  if (
    status !== "OPENED" &&
    status !== "BLOCKED" &&
    status !== "DOING" &&
    status !== "DONE"
  ) {
    response_status = 400;
    return new Response(
      JSON.stringify({
        error: "Invalid status",
        hint: "Status must be one of OPENED, BLOCKED, DOING or DONE",
      }),
      {
        status: 400,
        headers: response_headers,
      }
    );
  }
  const { data, error } = await client
    .from("tasks")
    .select("tags, status, createdAt, updatedAt")
    .eq("status", status);

  const has_error = error !== null;
  return new Response(JSON.stringify(has_error ? error : data), {
    status: has_error ? 500 : 200,
    headers: response_headers,
  });
});

// Respond to any request
// with a JSON object containing the request details
router.all("*", (req) => {
  return new Response(
    JSON.stringify({
      message: "Page not Found",
      hint: `The server cant handle url: ${req.url}`,
    }),
    {
      status: 404,
      headers: response_headers,
    }
  );
});

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  return router.handle(request);
}
