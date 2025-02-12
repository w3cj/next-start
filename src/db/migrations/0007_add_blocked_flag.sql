-- Add blocked column with default value false
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "blocked" BOOLEAN NOT NULL DEFAULT false; 