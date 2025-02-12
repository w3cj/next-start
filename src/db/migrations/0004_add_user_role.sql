-- Create the role enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column with default value
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" user_role NOT NULL DEFAULT 'user';

-- Update existing admin emails to have admin role
UPDATE "user" 
SET role = 'admin' 
WHERE email IN ('admin@example.com', 'b2kcloud@gmail.com'); 