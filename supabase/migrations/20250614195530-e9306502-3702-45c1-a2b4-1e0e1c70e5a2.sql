
-- Remove "bpm", "key", "daw" columns from projects table, and drop default if set
ALTER TABLE projects DROP COLUMN IF EXISTS bpm;
ALTER TABLE projects DROP COLUMN IF EXISTS key;
ALTER TABLE projects DROP COLUMN IF EXISTS daw;
