import { text, timestamp, varchar } from "drizzle-orm/pg-core"

export async function up(db) {
  await db.schema
    .createTable('users')
    .addColumn('id', varchar('id', { length: 128 }), (col) => col.primaryKey())
    .addColumn('name', text('name'))
    .addColumn('email', text('email'), (col) => col.notNull().unique())
    .addColumn('password', text('password'))
    .addColumn('image', text('image'))
    .addColumn('created_at', timestamp('created_at'), (col) => col.defaultNow())
    .addColumn('updated_at', timestamp('updated_at'), (col) => col.defaultNow())
    .execute()

  await db.schema
    .createTable('accounts')
    .addColumn('id', varchar('id', { length: 128 }), (col) => col.primaryKey())
    .addColumn('user_id', varchar('user_id', { length: 128 }), (col) => col.notNull())
    .addColumn('type', text('type'), (col) => col.notNull())
    .addColumn('provider', text('provider'), (col) => col.notNull())
    .addColumn('provider_account_id', text('provider_account_id'), (col) => col.notNull())
    .addColumn('refresh_token', text('refresh_token'))
    .addColumn('access_token', text('access_token'))
    .addColumn('expires_at', timestamp('expires_at'))
    .addColumn('token_type', text('token_type'))
    .addColumn('scope', text('scope'))
    .addColumn('id_token', text('id_token'))
    .addColumn('session_state', text('session_state'))
    .execute()

  await db.schema
    .createTable('sessions')
    .addColumn('id', varchar('id', { length: 128 }), (col) => col.primaryKey())
    .addColumn('user_id', varchar('user_id', { length: 128 }), (col) => col.notNull())
    .addColumn('session_token', text('session_token'), (col) => col.notNull())
    .addColumn('expires', timestamp('expires'), (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('verification_tokens')
    .addColumn('identifier', text('identifier'), (col) => col.notNull())
    .addColumn('token', text('token'), (col) => col.notNull())
    .addColumn('expires', timestamp('expires'), (col) => col.notNull())
    .execute()
}

export async function down(db) {
  await db.schema.dropTable('verification_tokens').execute()
  await db.schema.dropTable('sessions').execute()
  await db.schema.dropTable('accounts').execute()
  await db.schema.dropTable('users').execute()
} 