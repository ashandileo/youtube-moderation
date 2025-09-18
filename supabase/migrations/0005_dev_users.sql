-- Create initial users for development (local only)
-- This migration prepares the database for development users

-- Note: Development users will be created using the create-dev-users.js script
-- This ensures proper authentication flow and profile creation through triggers

-- The script will create:
-- 1. admin@example.com / password123 (admin role)
-- 2. reviewer@example.com / password123 (reviewer role)
-- 3. annotator@example.com / password123 (annotator role)

-- Run: node scripts/create-dev-users.js after migrations are applied
