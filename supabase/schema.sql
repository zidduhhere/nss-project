-- NSS Project Database Schema and Security Policies for Supabase
-- Creation Date: 2025-09-08

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Schema definition
CREATE SCHEMA IF NOT EXISTS "public";

--------------------
-- TABLES
--------------------

-- Profiles table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'unit_coordinator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id TEXT PRIMARY KEY ,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  number_of_units integer NOT NULL
);

-- NSS Units table
CREATE TABLE IF NOT EXISTS nss_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_number TEXT unique NOT NULL,
  college_id  REFERENCES colleges(id) ON DELETE CASCADE NOT NULL,
  strength INTEGER DEFAULT 0
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ktu_id TEXT UNIQUE NOT NULL,
  unit_id TEXT REFERENCES nss_units(unit_number) ON DELETE SET NULL,
  course TEXT NOT NULL,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  is_active BOOLEAN DEFAULT true
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('blood_donation', 'tree_tagging', 'community_service', 'awareness_program', 'other')),
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  max_participants INTEGER,
  unit_id UUID REFERENCES nss_units(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Activity Registrations (Students registered for activities)
CREATE TABLE IF NOT EXISTS activity_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('registered', 'attended', 'absent')),
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(activity_id, student_id)
);

-- Blood Donations table
CREATE TABLE IF NOT EXISTS blood_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  donation_date DATE NOT NULL,
  hospital_name TEXT NOT NULL,
  units_donated INTEGER NOT NULL DEFAULT 1,
  blood_group TEXT,
  certificate_url TEXT,
  donation_case TEXT,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tree Tagging table
CREATE TABLE IF NOT EXISTS tree_taggings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  plantation_date DATE NOT NULL,
  trees_planted INTEGER NOT NULL,
  photos_url TEXT[] NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);


-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

--------------------
-- INDEXES
--------------------

-- Profiles
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Students
CREATE INDEX IF NOT EXISTS students_unit_id_idx ON students(unit_id);
CREATE INDEX IF NOT EXISTS students_college_id_idx ON students(college_id);
CREATE INDEX IF NOT EXISTS students_ktu_id_idx ON students(ktu_id);

-- Activities
CREATE INDEX IF NOT EXISTS activities_unit_id_idx ON activities(unit_id);
CREATE INDEX IF NOT EXISTS activities_date_idx ON activities(date);
CREATE INDEX IF NOT EXISTS activities_status_idx ON activities(status);
CREATE INDEX IF NOT EXISTS activities_type_idx ON activities(type);

-- Blood Donations
CREATE INDEX IF NOT EXISTS blood_donations_student_id_idx ON blood_donations(student_id);
CREATE INDEX IF NOT EXISTS blood_donations_status_idx ON blood_donations(status);
CREATE INDEX IF NOT EXISTS blood_donations_donation_date_idx ON blood_donations(donation_date);

-- Tree Taggings
CREATE INDEX IF NOT EXISTS tree_taggings_student_id_idx ON tree_taggings(student_id);
CREATE INDEX IF NOT EXISTS tree_taggings_status_idx ON tree_taggings(status);
CREATE INDEX IF NOT EXISTS tree_taggings_plantation_date_idx ON tree_taggings(plantation_date);

--------------------
-- FUNCTIONS
--------------------

-- Function to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate and update student points
CREATE OR REPLACE FUNCTION update_student_points(student_uuid UUID)
RETURNS VOID AS $$
DECLARE
  blood_points INTEGER;
  tree_points INTEGER;
  activity_points INTEGER;
BEGIN
  -- Get points from blood donations
  SELECT COALESCE(SUM(points_awarded), 0) INTO blood_points
  FROM blood_donations
  WHERE student_id = student_uuid AND status = 'approved';
  
  -- Get points from tree taggings
  SELECT COALESCE(SUM(points_awarded), 0) INTO tree_points
  FROM tree_taggings
  WHERE student_id = student_uuid AND status = 'approved';
  
  -- Get points from activities
  SELECT COALESCE(SUM(points_awarded), 0) INTO activity_points
  FROM activity_registrations
  WHERE student_id = student_uuid AND status = 'attended';
  
  -- Update student record
  UPDATE students
  SET total_points = blood_points + tree_points + activity_points,
      updated_at = now()
  WHERE id = student_uuid;
END;
$$ LANGUAGE plpgsql;

--------------------
-- TRIGGERS
--------------------

-- Updated at triggers
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at
BEFORE UPDATE ON colleges
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_nss_units_updated_at
BEFORE UPDATE ON nss_units
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_blood_donations_updated_at
BEFORE UPDATE ON blood_donations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tree_taggings_updated_at
BEFORE UPDATE ON tree_taggings
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_points_config_updated_at
BEFORE UPDATE ON points_config
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Points Update Triggers
CREATE OR REPLACE FUNCTION trigger_update_student_points()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_student_points(
    CASE 
      WHEN TG_TABLE_NAME = 'blood_donations' THEN NEW.student_id
      WHEN TG_TABLE_NAME = 'tree_taggings' THEN NEW.student_id
      WHEN TG_TABLE_NAME = 'activity_registrations' THEN NEW.student_id
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blood_donations_points_update
AFTER INSERT OR UPDATE OF status, points_awarded ON blood_donations
FOR EACH ROW EXECUTE PROCEDURE trigger_update_student_points();

CREATE TRIGGER tree_taggings_points_update
AFTER INSERT OR UPDATE OF status, points_awarded ON tree_taggings
FOR EACH ROW EXECUTE PROCEDURE trigger_update_student_points();

CREATE TRIGGER activity_registrations_points_update
AFTER INSERT OR UPDATE OF status, points_awarded ON activity_registrations
FOR EACH ROW EXECUTE PROCEDURE trigger_update_student_points();

--------------------
-- INITIAL DATA
--------------------


-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Students are viewable by authenticated users"
  ON students FOR SELECT
  USING (auth.role() IN ('authenticated'));

CREATE POLICY "Students can update their own record"
  ON students FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Unit coordinators can view students in their unit"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN nss_units u ON p.id = u.coordinator_id
      WHERE p.id = auth.uid() AND u.id = students.unit_id
    )
  );

CREATE POLICY "Unit coordinators can update students in their unit"
  ON students FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN nss_units u ON p.id = u.coordinator_id
      WHERE p.id = auth.uid() AND u.id = students.unit_id
    )
  );

-- Blood Donations policies
CREATE POLICY "Students can view their own blood donations"
  ON blood_donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = blood_donations.student_id
      AND students.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own blood donations"
  ON blood_donations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = blood_donations.student_id
      AND students.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own blood donations"
  ON blood_donations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = blood_donations.student_id
      AND students.profile_id = auth.uid()
    )
    AND status = 'submitted' -- Only allow updates if not yet reviewed
  );

CREATE POLICY "Unit coordinators can view blood donations of their students"
  ON blood_donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN nss_units u ON s.unit_id = u.id
      JOIN profiles p ON u.coordinator_id = p.id
      WHERE s.id = blood_donations.student_id
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Unit coordinators can update blood donation status"
  ON blood_donations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN nss_units u ON s.unit_id = u.id
      JOIN profiles p ON u.coordinator_id = p.id
      WHERE s.id = blood_donations.student_id
      AND p.id = auth.uid()
    )
  );

-- Tree Taggings policies
CREATE POLICY "Students can view their own tree taggings"
  ON tree_taggings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = tree_taggings.student_id
      AND students.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own tree taggings"
  ON tree_taggings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = tree_taggings.student_id
      AND students.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own tree taggings"
  ON tree_taggings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = tree_taggings.student_id
      AND students.profile_id = auth.uid()
    )
    AND status = 'submitted' -- Only allow updates if not yet reviewed
  );

CREATE POLICY "Unit coordinators can view tree taggings of their students"
  ON tree_taggings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN nss_units u ON s.unit_id = u.id
      JOIN profiles p ON u.coordinator_id = p.id
      WHERE s.id = tree_taggings.student_id
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Unit coordinators can update tree taggings status"
  ON tree_taggings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN nss_units u ON s.unit_id = u.id
      JOIN profiles p ON u.coordinator_id = p.id
      WHERE s.id = tree_taggings.student_id
      AND p.id = auth.uid()
    )
  );

-- Activities policies
CREATE POLICY "Activities are viewable by all authenticated users"
  ON activities FOR SELECT
  USING (auth.role() IN ('authenticated'));

CREATE POLICY "Unit coordinators can insert activities for their unit"
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nss_units
      WHERE nss_units.id = activities.unit_id
      AND nss_units.coordinator_id = auth.uid()
    )
  );

CREATE POLICY "Unit coordinators can update their unit's activities"
  ON activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM nss_units
      WHERE nss_units.id = activities.unit_id
      AND nss_units.coordinator_id = auth.uid()
    )
  );

CREATE POLICY "Unit coordinators can delete their unit's activities"
  ON activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM nss_units
      WHERE nss_units.id = activities.unit_id
      AND nss_units.coordinator_id = auth.uid()
    )
    AND status = 'upcoming' -- Only allow deletion of upcoming activities
  );

-- Activity registrations policies
CREATE POLICY "Students can view their own activity registrations"
  ON activity_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = activity_registrations.student_id
      AND students.profile_id = auth.uid()
    )
  );

CREATE POLICY "Students can register for activities"
  ON activity_registrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = activity_registrations.student_id
      AND students.profile_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM activities
      WHERE activities.id = activity_registrations.activity_id
      AND activities.status = 'upcoming'
    )
  );

CREATE POLICY "Unit coordinators can view activity registrations for their unit"
  ON activity_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities a
      JOIN nss_units u ON a.unit_id = u.id
      WHERE a.id = activity_registrations.activity_id
      AND u.coordinator_id = auth.uid()
    )
  );

CREATE POLICY "Unit coordinators can update activity registration status"
  ON activity_registrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM activities a
      JOIN nss_units u ON a.unit_id = u.id
      WHERE a.id = activity_registrations.activity_id
      AND u.coordinator_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can see only their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark their notifications as read"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() 
    AND (OLD.is_read = false AND NEW.is_read = true) -- Only allow changing is_read from false to true
  );

-- Points configuration policies
CREATE POLICY "Points configuration is viewable by all authenticated users"
  ON points_config FOR SELECT
  USING (auth.role() IN ('authenticated'));

CREATE POLICY "Only admins can modify points configuration"
  ON points_config FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Colleges policies
CREATE POLICY "Colleges are viewable by all authenticated users"
  ON colleges FOR SELECT
  USING (auth.role() IN ('authenticated'));

CREATE POLICY "Only admins can modify colleges"
  ON colleges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- NSS Units policies
CREATE POLICY "NSS Units are viewable by all authenticated users"
  ON nss_units FOR SELECT
  USING (auth.role() IN ('authenticated'));

CREATE POLICY "Unit coordinators can update their own unit"
  ON nss_units FOR UPDATE
  USING (coordinator_id = auth.uid());

CREATE POLICY "Only admins can insert or delete NSS units"
  ON nss_units FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Storage bucket policies for file uploads
-- These would be implemented in the Supabase dashboard
-- Create a storage bucket called 'certificates' for blood donation certificates
-- Create a storage bucket called 'tree-photos' for tree tagging photos
-- Set appropriate CORS and security policies

-- Example of how to create buckets (to be executed in the Supabase dashboard or via API):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'Blood Donation Certificates', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tree-photos', 'Tree Tagging Photos', false);
