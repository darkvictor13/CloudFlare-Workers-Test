import SingletonPostgrestClient from "../singleton_postgrest_client";
import { response_headers } from "../utils";

export async function getTasksByStatus(status: string): Promise<Response> {
  if (
    status !== "OPENED" &&
    status !== "BLOCKED" &&
    status !== "DOING" &&
    status !== "DONE"
  ) {
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
  const { data, error } = await SingletonPostgrestClient.getInstance()
    .from("tasks")
    .select("tags, status, createdAt, updatedAt")
    .eq("status", status);

  const has_error = error !== null;
  return new Response(JSON.stringify(has_error ? error : data), {
    status: has_error ? 500 : 200,
    headers: response_headers,
  });
}
