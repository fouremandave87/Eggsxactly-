/*
  # Eggsxactly Database Schema
  
  ## Overview
  Creates the database schema for tracking poultry flocks and egg production.
  
  ## New Tables
  
  ### 1. birds
  Stores information about individual birds in the flock
  - `id` (uuid, primary key) - Unique identifier for each bird
  - `name` (text) - Bird's name
  - `species` (text) - Species/breed (e.g., "Rhode Island Red", "Pekin Duck")
  - `type` (text) - General type ("chicken" or "duck")
  - `is_laying` (boolean) - Whether the bird is currently laying eggs
  - `date_acquired` (date) - When the bird was acquired
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp
  
  ### 2. egg_records
  Tracks daily egg collection by bird
  - `id` (uuid, primary key) - Unique identifier for each record
  - `bird_id` (uuid, foreign key) - References the bird that laid the egg
  - `date` (date) - Date the egg was collected
  - `count` (integer) - Number of eggs collected
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  - Enable RLS on all tables
  - Tables are open for anonymous read/write for demo purposes
  - In production, these should be restricted to authenticated users
  
  ## Notes
  - Uses UUID for primary keys with automatic generation
  - Includes timestamps for audit trails
  - Foreign key constraints ensure data integrity
*/

CREATE TABLE IF NOT EXISTS birds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  type text NOT NULL CHECK (type IN ('chicken', 'duck')),
  is_laying boolean DEFAULT true,
  date_acquired date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS egg_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bird_id uuid REFERENCES birds(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  count integer DEFAULT 1 CHECK (count >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE birds ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to birds"
  ON birds FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to birds"
  ON birds FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to birds"
  ON birds FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to birds"
  ON birds FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to egg_records"
  ON egg_records FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to egg_records"
  ON egg_records FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to egg_records"
  ON egg_records FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to egg_records"
  ON egg_records FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_egg_records_bird_id ON egg_records(bird_id);
CREATE INDEX IF NOT EXISTS idx_egg_records_date ON egg_records(date);

INSERT INTO birds (name, species, type, is_laying) VALUES
  ('Henrietta', 'Rhode Island Red', 'chicken', true),
  ('Daisy', 'Pekin Duck', 'duck', true),
  ('Clucky', 'Leghorn', 'chicken', true),
  ('Penny', 'Sussex', 'chicken', true)
ON CONFLICT DO NOTHING;
