/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Env } from "./enviroment";
import SingletonPostgrestClient from "./singleton_postgrest_client";
import my_router from "./router";

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		SingletonPostgrestClient.build(env.POSTGREST_ENDPOINT);
		return my_router.handle(request, env, ctx)
	},
};