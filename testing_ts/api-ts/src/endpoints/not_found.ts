export function notFound(): Response {
    return new Response("Not Found", { status: 404 });
}