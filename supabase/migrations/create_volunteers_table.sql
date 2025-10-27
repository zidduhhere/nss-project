-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Institution Details
  unit TEXT NOT NULL,
  semester TEXT NOT NULL,
  course TEXT NOT NULL,
  admission_year INTEGER NOT NULL,
  ktu_id TEXT NOT NULL UNIQUE,
  
  -- Personal Details
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE NOT NULL,
  contact_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  religion TEXT NOT NULL,
  community TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  height NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  
  -- Address Details
  district TEXT NOT NULL,
  taluk TEXT NOT NULL,
  village TEXT NOT NULL,
  pincode TEXT NOT NULL,
  permanent_address TEXT NOT NULL,
  
  -- Parent/Guardian Details
  parent_name TEXT NOT NULL,
  parent_contact TEXT NOT NULL,
  
  -- Documents (URLs from Supabase Storage)
  photo_url TEXT NOT NULL,
  signature_url TEXT NOT NULL,
  
  -- Languages Known (stored as JSON array)
  languages_known JSONB
);

-- Create index on ktu_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_volunteers_ktu_id ON volunteers(ktu_id);

-- Create index on unit for filtering
CREATE INDEX IF NOT EXISTS idx_volunteers_unit ON volunteers(unit);

-- Create index on semester for filtering
CREATE INDEX IF NOT EXISTS idx_volunteers_semester ON volunteers(semester);

-- Enable Row Level Security
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all volunteers
CREATE POLICY "Allow authenticated users to read volunteers"
  ON volunteers FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert volunteers
CREATE POLICY "Allow authenticated users to insert volunteers"
  ON volunteers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update their own volunteer records
CREATE POLICY "Allow authenticated users to update volunteers"
  ON volunteers FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete volunteers
CREATE POLICY "Allow authenticated users to delete volunteers"
  ON volunteers FOR DELETE
  TO authenticated
  USING (true);

-- Create storage buckets for photos and signatures
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('volunteer-photos', 'volunteer-photos', true),
  ('volunteer-signatures', 'volunteer-signatures', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for volunteer-photos bucket
CREATE POLICY "Allow authenticated users to upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'volunteer-photos');

CREATE POLICY "Allow public to view photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'volunteer-photos');

CREATE POLICY "Allow authenticated users to delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'volunteer-photos');

-- Create storage policies for volunteer-signatures bucket
CREATE POLICY "Allow authenticated users to upload signatures"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'volunteer-signatures');

CREATE POLICY "Allow public to view signatures"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'volunteer-signatures');

CREATE POLICY "Allow authenticated users to delete signatures"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'volunteer-signatures');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on row update
CREATE TRIGGER update_volunteers_updated_at
  BEFORE UPDATE ON volunteers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
