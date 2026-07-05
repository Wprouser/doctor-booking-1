-- Note: the "user", "session", "account", and "verification" tables are owned by
-- Better Auth and managed via `npx @better-auth/cli migrate --config server/auth.ts`,
-- not by this file.

CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  review_count INTEGER NOT NULL,
  location TEXT NOT NULL,
  consultation_fee INTEGER NOT NULL,
  bio TEXT NOT NULL,
  education TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id TEXT NOT NULL REFERENCES doctors (id),
  user_id TEXT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  slot TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent double-booking the same doctor/slot while an appointment is still upcoming.
CREATE UNIQUE INDEX IF NOT EXISTS appointments_doctor_slot_upcoming_idx
  ON appointments (doctor_id, slot)
  WHERE status = 'upcoming';

CREATE INDEX IF NOT EXISTS appointments_user_idx ON appointments (user_id);
