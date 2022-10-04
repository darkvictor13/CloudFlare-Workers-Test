# CloudFlare-Workers-Test
## Followed tutorials:
- https://www.youtube.com/watch?v=inLOwovtqQM
- https://developers.cloudflare.com/workers/tutorials/postgres

## Run the worker:
1. Clone this repository with submodules:
```
git clone --recurse-submodules <url>
or
git clone <url>
git submodule update --init --recursive
```
2. Run the docker: 
```
cd CloudFlare-Workers-Test/following_tutorial/postgres-postgrest-cloudflared-example
docker-compose up -d
```
3. Get the tunel from cloudflare
- Get the output from thr docker
```
docker-compose logs --follow
```
- The docker-compose output should produce something like:
```
postgres-postgrest-cloudflared-example-cloudflared-1  | 2022-10-04T13:35:44Z INF +--------------------------------------------------------------------------------------------+
postgres-postgrest-cloudflared-example-cloudflared-1  | 2022-10-04T13:35:44Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
postgres-postgrest-cloudflared-example-cloudflared-1  | 2022-10-04T13:35:44Z INF |  https://url.trycloudflare.com                           |
postgres-postgrest-cloudflared-example-cloudflared-1  | 2022-10-04T13:35:44Z INF +--------------------------------------------------------------------------------------------+
```
4. Deploy the worker:
- Install wrangler2, my case `paru -S cloudflare-wrangler2`;
- Login: `wrangler2 login`;
- Set the url for the worker:
```
wrangler2 secret put POSTGREST_ENDPOINT
```
-> Enter a secret value: the_url_from_docker_logs
- Change the account_id in wrangler.toml
- publish the worker: `wrangler2 publish`
