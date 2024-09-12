import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import users from "./users";

const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export default sessions;
