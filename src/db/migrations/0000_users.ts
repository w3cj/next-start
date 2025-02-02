import { text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.createTable('users', {
    id: varchar('id', { length: 128 }).primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    password: text('password'),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  })
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('users')
} 