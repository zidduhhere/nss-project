-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activities (
  title text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['blood_donation'::text, 'tree_tagging'::text, 'community_service'::text, 'awareness_program'::text, 'other'::text])),
  description text,
  date date NOT NULL,
  time time without time zone,
  location text NOT NULL,
  max_participants integer,
  unit_id uuid,
  status text NOT NULL CHECK (status = ANY (ARRAY['upcoming'::text, 'ongoing'::text, 'completed'::text, 'cancelled'::text])),
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.nss_units(id)
);
CREATE TABLE public.activity_registrations (
  activity_id uuid NOT NULL,
  student_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['registered'::text, 'attended'::text, 'absent'::text])),
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  points_awarded integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT activity_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT activity_registrations_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id),
  CONSTRAINT activity_registrations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
CREATE TABLE public.blood_donations (
  student_id uuid NOT NULL,
  donation_date date NOT NULL,
  hospital_name text NOT NULL,
  blood_group text,
  certificate_url text,
  donation_case text,
  status text NOT NULL CHECK (status = ANY (ARRAY['submitted'::text, 'approved'::text, 'rejected'::text])),
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  units_donated integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blood_donations_pkey PRIMARY KEY (id),
  CONSTRAINT blood_donations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
CREATE TABLE public.colleges (
  id text NOT NULL,
  name text NOT NULL,
  district text NOT NULL,
  number_of_units integer NOT NULL,
  CONSTRAINT colleges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.nss_units (
  unit_number text NOT NULL UNIQUE,
  college_id text NOT NULL,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  strength integer DEFAULT 0,
  CONSTRAINT nss_units_pkey PRIMARY KEY (id),
  CONSTRAINT nss_units_college_id_fkey FOREIGN KEY (college_id) REFERENCES public.colleges(id)
);
CREATE TABLE public.students (
  ktu_id text NOT NULL UNIQUE,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  mobile_number character varying NOT NULL,
  email character varying NOT NULL,
  college_id character varying NOT NULL,
  avatar_url text NOT NULL,
  name text NOT NULL CHECK (length(name) < 40),
  CONSTRAINT students_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tree_taggings (
  student_id uuid NOT NULL,
  plantation_date date NOT NULL,
  trees_planted integer NOT NULL,
  photos_url ARRAY NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['submitted'::text, 'approved'::text, 'rejected'::text])),
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tree_taggings_pkey PRIMARY KEY (id),
  CONSTRAINT tree_taggings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);