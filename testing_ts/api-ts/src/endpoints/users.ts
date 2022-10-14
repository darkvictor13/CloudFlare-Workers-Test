// import await
import SingletonPostgrestClient from "../singleton_postgrest_client";
import { response_headers } from "../utils";

export async function countUsers(): Promise<Response> {
  const { data, error, count} = await SingletonPostgrestClient.getInstance()
    .from("users")
    .select("id", { count: "exact" });

  if (error !== null) {
    return new Response(JSON.stringify({error}), {
      status: 500,
      headers: response_headers,
    });
  }
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: response_headers,
  });
}
