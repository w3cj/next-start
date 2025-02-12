import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 2048 }),
  password: text("password"),
  disabled: boolean("disabled").notNull().default(false),
  blocked: boolean("blocked").notNull().default(false),
  role: userRoleEnum("role").notNull().default('user'),
});

export default users;
