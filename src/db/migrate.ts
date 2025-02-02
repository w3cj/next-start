import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from './schema/auth'

// Load environment variables
config()

// Verify environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production'
})

// Test the connection before migrating
async function main() {
  try {
    console.log('Testing database connection...')
    const client = await pool.connect()
    console.log('Database connection successful')
    client.release()

    console.log('Running migrations...')
    const db = drizzle(pool, { schema })
    await migrate(db, { migrationsFolder: 'src/db/migrations' })
    console.log('Migrations completed!')
  } catch (err) {
    console.error('Error:', err)
    throw err
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Migration failed!')
  console.error(err)
  process.exit(1)
})
