-- Add disabled column with default value false
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "disabled" BOOLEAN NOT NULL DEFAULT false; 