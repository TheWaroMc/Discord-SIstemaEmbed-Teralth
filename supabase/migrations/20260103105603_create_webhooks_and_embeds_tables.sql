/*
  # Create Webhooks and Embeds Storage

  1. New Tables
    - `webhooks`: Store saved webhook URLs
      - `id` (uuid, primary key)
      - `name` (text, webhook display name)
      - `url` (text, webhook URL)
      - `created_at` (timestamp)
    
    - `saved_embeds`: Store saved embed templates
      - `id` (uuid, primary key)
      - `name` (text, embed template name)
      - `data` (jsonb, full embed data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `roles`: Store Discord roles with formatting
      - `id` (uuid, primary key)
      - `name` (text, role name)
      - `format` (text, role format/mention)
      - `created_at` (timestamp)
  
  2. Security
    - RLS enabled for all tables
    - Data stored locally in browser via localStorage for user convenience
*/

CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_embeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  format text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_embeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on webhooks"
  ON webhooks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on webhooks"
  ON webhooks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public delete on webhooks"
  ON webhooks FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read on saved_embeds"
  ON saved_embeds FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on saved_embeds"
  ON saved_embeds FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on saved_embeds"
  ON saved_embeds FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on saved_embeds"
  ON saved_embeds FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read on roles"
  ON roles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on roles"
  ON roles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on roles"
  ON roles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on roles"
  ON roles FOR DELETE
  TO public
  USING (true);
