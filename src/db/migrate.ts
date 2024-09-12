import { migrate } from "drizzle-orm/postgres-js/migrator";

import config from "@/../drizzle.config";
import { env } from "@/env/server";

import db, { client } from "./index";

if (!env.DB_MIGRATING) {
  throw new Error("You must set DB_MIGRATING to true.");
}

await migrate(db, { migrationsFolder: config.out! });

await client.end();
