CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS rounds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  store_name text NOT NULL,
  pick_up_time timestamptz NOT NULL,
  max_orders integer,
  location_default text,
  note text,
  status text NOT NULL DEFAULT 'open',
  created_by text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id uuid NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  customer text NOT NULL,
  location text,
  item_name text NOT NULL,
  qty integer NOT NULL DEFAULT 1,
  size text,
  sweetness text,
  ice_level text,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);
