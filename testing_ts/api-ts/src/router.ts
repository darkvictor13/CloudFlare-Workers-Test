import { Router } from "itty-router";

import { helloWorld } from "./endpoints/hello_world";
import { notFound } from "./endpoints/not_found";
import { getTasksByStatus } from "./endpoints/tasks";
import { countUsers } from "./endpoints/users";

const my_router = Router({ base: "/api" });

my_router.get("/users/count", countUsers);
// endpoint /tasks/:status, should pass the status to the handler
my_router.get("/tasks/:status", getTasksByStatus);
my_router.get("/", helloWorld);
my_router.all("*", notFound);

export default my_router;
