/*
  # Initial Schema for Vocalys Care

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (enum: family, municipality, admin)
      - `subscription_status` (enum: active, expired, trial)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `beneficiaries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `phone` (text)
      - `address` (text, nullable)
      - `emergency_contact` (text, nullable)
      - `call_schedule` (text array, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `calls`
      - `id` (uuid, primary key)
      - `beneficiary_id` (uuid, foreign key)
      - `status` (enum: pending, in_progress, completed, failed)
      - `started_at` (timestamp, nullable)
      - `ended_at` (timestamp, nullable)
      - `duration` (integer, nullable) -- in seconds
      - `elevenlabs_conversation_id` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `summaries`
      - `id` (uuid, primary key)
      - `call_id` (uuid, foreign key)
      - `summary` (text)
      - `mood` (enum: positive, neutral, negative)
      - `alert_level` (enum: none, low, medium, high, critical)
      - `keywords` (text array, nullable)
      - `health_mentions` (text array, nullable)
      - `concerns` (text array, nullable)
      - `transcript` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('family', 'municipality', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'trial');
CREATE TYPE call_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');
CREATE TYPE mood_type AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE alert_level AS ENUM ('none', 'low', 'medium', 'high', 'critical');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role DEFAULT 'family',
  subscription_status subscription_status DEFAULT 'trial',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text,
  emergency_contact text,
  call_schedule text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create calls table
CREATE TABLE IF NOT EXISTS calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL,
  status call_status DEFAULT 'pending',
  started_at timestamptz,
  ended_at timestamptz,
  duration integer, -- in seconds
  elevenlabs_conversation_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid REFERENCES calls(id) ON DELETE CASCADE NOT NULL,
  summary text NOT NULL,
  mood mood_type NOT NULL,
  alert_level alert_level DEFAULT 'none',
  keywords text[],
  health_mentions text[],
  concerns text[],
  transcript text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for beneficiaries table
CREATE POLICY "Users can read own beneficiaries"
  ON beneficiaries
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert own beneficiaries"
  ON beneficiaries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own beneficiaries"
  ON beneficiaries
  FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own beneficiaries"
  ON beneficiaries
  FOR DELETE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Create policies for calls table
CREATE POLICY "Users can read calls for their beneficiaries"
  ON calls
  FOR SELECT
  TO authenticated
  USING (
    beneficiary_id IN (
      SELECT id FROM beneficiaries WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert calls for their beneficiaries"
  ON calls
  FOR INSERT
  TO authenticated
  WITH CHECK (
    beneficiary_id IN (
      SELECT id FROM beneficiaries WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update calls for their beneficiaries"
  ON calls
  FOR UPDATE
  TO authenticated
  USING (
    beneficiary_id IN (
      SELECT id FROM beneficiaries WHERE user_id::text = auth.uid()::text
    )
  );

-- Create policies for summaries table
CREATE POLICY "Users can read summaries for their calls"
  ON summaries
  FOR SELECT
  TO authenticated
  USING (
    call_id IN (
      SELECT c.id FROM calls c
      JOIN beneficiaries b ON c.beneficiary_id = b.id
      WHERE b.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert summaries for their calls"
  ON summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    call_id IN (
      SELECT c.id FROM calls c
      JOIN beneficiaries b ON c.beneficiary_id = b.id
      WHERE b.user_id::text = auth.uid()::text
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_beneficiaries_user_id ON beneficiaries(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_beneficiary_id ON calls(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at);
CREATE INDEX IF NOT EXISTS idx_summaries_call_id ON summaries(call_id);
CREATE INDEX IF NOT EXISTS idx_summaries_alert_level ON summaries(alert_level);
CREATE INDEX IF NOT EXISTS idx_summaries_mood ON summaries(mood);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_summaries_updated_at BEFORE UPDATE ON summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();