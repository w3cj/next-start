import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/env/server";
import * as schema from "./schema";

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  // Disable SSL for local development
  ssl: false
});

// Test the database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Successfully connected to database');
  }
});

const db = drizzle(pool, { 
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export default db;
