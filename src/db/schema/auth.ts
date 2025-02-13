import { integer, pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 320 }).notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: varchar('image', { length: 2048 }),
  password: text('password'),  // For credentials auth
})

export const account = pgTable('account', {
  userId: uuid('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] })
}))

export const session = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

export const passwordResetToken = pgTable('password_reset_token', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
export type PasswordResetToken = typeof passwordResetToken.$inferSelect
export type NewPasswordResetToken = typeof passwordResetToken.$inferInsert 