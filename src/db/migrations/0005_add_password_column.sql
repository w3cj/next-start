-- Add password column
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "password" TEXT; 