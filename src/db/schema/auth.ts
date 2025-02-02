import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'), // Hashed password
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert 