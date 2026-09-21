-- Leads — Cloudflare D1 source of truth for form submissions.
-- D1-first: every submission is written here before any best-effort email.

CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  form          TEXT NOT NULL,
  name          TEXT,
  email         TEXT,
  phone         TEXT,
  subject       TEXT,
  message       TEXT,
  fields_json   TEXT NOT NULL,
  page_path     TEXT,
  ip            TEXT,
  user_agent    TEXT,
  email_status  TEXT NOT NULL DEFAULT 'pending',
  email_error   TEXT,
  created_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_form    ON leads (form);
CREATE INDEX IF NOT EXISTS idx_leads_email   ON leads (email);
