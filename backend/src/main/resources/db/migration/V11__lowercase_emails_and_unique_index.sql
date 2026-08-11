-- Standardize existing emails to lowercase & trimmed
UPDATE account SET email = LOWER(TRIM(email)) WHERE email IS NOT NULL;

-- Enforce case-insensitive unique constraint via lowercase functional index
CREATE UNIQUE INDEX IF NOT EXISTS idx_account_email_lower ON account (LOWER(email));
