import { pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 320 }).notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: varchar('image', { length: 2048 }).notNull(),
  password: text('password'),  // For credentials auth
})

export const account = pgTable('account', {
  userId: uuid('userId').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: text('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] })
}))

export const session = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId').notNull(),
  expires: timestamp('expires').notNull(),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert 