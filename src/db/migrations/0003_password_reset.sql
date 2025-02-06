CREATE TABLE IF NOT EXISTS "password_reset_token" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
); 