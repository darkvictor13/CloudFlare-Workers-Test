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

const router = Router({ base: "/api" });
const client = new PostgrestClient(POSTGREST_ENDPOINT);

// Count all users in the database
router.get("/count/users", async (request) => {
  const { _ , error, count } = await client
    .from("users")
    .select("id", { count: "exact" });

  if (error !== null) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

// Endpoint for documents analytics
// Returns the number of documents edited, downloaded and uploaded separeted by day
router.get("/documents", async (request) => {
  const {data, error} = await client
    .from("documents")
    .select("id, createdAt, updatedAt");

  if (error !== null) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
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

  return new Response(JSON.stringify({"created": created, "updated": updated}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});


router.get("/tasks/:status", async (request) => {
  const status = request.params.status || 'DONE';
  const { data, error } = await client
    .from("tasks")
    .select("tags, status, createdAt, updatedAt")
    .eq("status", status);

  if (error !== null) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

router.all("*", () => new Response("Not Found", { status: 404 }));

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  return router.handle(request);
}