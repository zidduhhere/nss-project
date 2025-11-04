

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."user_role" AS ENUM (
    'student',
    'unit',
    'admin'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."assign_student_role_on_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  -- If admin already created a role row, don't overwrite
  if exists (select 1 from public.user_roles where user_id = new.id) then
    return new;
  end if;

  insert into public.user_roles (user_id, role_id)
  values (new.id, public.role_id('student'))
  on conflict (user_id) do nothing;

  return new;
end;
$$;


ALTER FUNCTION "public"."assign_student_role_on_signup"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_student_on_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_name       text := COALESCE(NEW.raw_user_meta_data->>'name', '');
  v_meta_email text := COALESCE(NEW.raw_user_meta_data->>'email', '');
  v_mobile     text := COALESCE(NEW.raw_user_meta_data->>'mobile_number', '');
  v_ktu_id     text := NULLIF(NEW.raw_user_meta_data->>'ktu_id', '');
  v_college_id text := COALESCE(NEW.raw_user_meta_data->>'college_id', '');
BEGIN
  -- normalize / enforce lengths
  v_name := LEFT(v_name, 40);
  v_mobile := regexp_replace(v_mobile, '[^0-9]', '', 'g'); -- digits only
  v_mobile := LEFT(v_mobile, 10);

  -- college_id is required and must exist (because of your FK + NOT NULL)
  v_college_id := LEFT(v_college_id, 255); -- adjust if you later cap length
  IF v_college_id = '' THEN
    RAISE EXCEPTION 'college_id is required' USING ERRCODE = '23514';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.colleges c WHERE c.id = v_college_id) THEN
    RAISE EXCEPTION 'college_id % does not exist', v_college_id USING ERRCODE = '23503';
  END IF;

  -- If metadata email was provided and differs from auth email, ignore it (or log)
  -- Canonical email is NEW.email from auth.users
  INSERT INTO public.students (
    id, name, email, mobile_number, ktu_id, college_id, unit_uuid, created_at, updated_at
  ) VALUES (
    NEW.id,
    v_name,
    NEW.email,                -- canonical
    NULLIF(v_mobile, ''),
    v_ktu_id,
    v_college_id,
    NULL,                     -- set later when you assign a unit
    NOW(), NOW()
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_student_on_signup"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
  declare
    claims jsonb;
    is_admin boolean;
  begin
    -- Check if the user is marked as admin in the profiles table
    select is_admin into is_admin from profiles where user_id = (event->>'user_id')::uuid;

    -- Proceed only if the user is an admin
    if is_admin then
      claims := event->'claims';

      -- Check if 'user_metadata' exists in claims
      if jsonb_typeof(claims->'user_metadata') is null then
        -- If 'user_metadata' does not exist, create an empty object
        claims := jsonb_set(claims, '{user_metadata}', '{}');
      end if;

      -- Set a claim of 'admin'
      claims := jsonb_set(claims, '{user_metadata, admin}', 'true');

      -- Update the 'claims' object in the original event
      event := jsonb_set(event, '{claims}', claims);
    end if;

    -- Return the modified or original event
    return event;
  end;
$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user_student_default"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- If a profile already exists (e.g., admin-created user), do nothing
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'full_name',''),
          'student');

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user_student_default"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_permission"("_resource" "text", "_action" "text") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid()
      and p.resource = _resource
      and p.action   = _action
  );
$$;


ALTER FUNCTION "public"."has_permission"("_resource" "text", "_action" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_role"("_role" "text") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and r.name = _role
  );
$$;


ALTER FUNCTION "public"."has_role"("_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."role_id"("_name" "text") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $$
  select id from public.roles where name = _name
$$;


ALTER FUNCTION "public"."role_id"("_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_profile_email"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_profile_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_student_email"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  update public.students set email = new.email, updated_at = now()
  where id = new.id;
  return new;
end;
$$;


ALTER FUNCTION "public"."sync_student_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin new.updated_at = now(); return new; end $$;


ALTER FUNCTION "public"."touch_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_volunteers_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;


ALTER FUNCTION "public"."touch_volunteers_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."colleges" (
    "id" "text" NOT NULL,
    "college_name" "text" NOT NULL,
    "district" "text" NOT NULL
);


ALTER TABLE "public"."colleges" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    CONSTRAINT "roles_name_check" CHECK (("name" = ANY (ARRAY['student'::"text", 'unit'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "role_id" integer NOT NULL,
    "unit_uuid" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."current_user_role" AS
 SELECT "ur"."user_id",
    "r"."name" AS "role",
    "ur"."unit_uuid"
   FROM ("public"."user_roles" "ur"
     JOIN "public"."roles" "r" ON (("r"."id" = "ur"."role_id")))
  WHERE ("ur"."user_id" = "auth"."uid"());


ALTER VIEW "public"."current_user_role" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nss_units" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "unit_number" "text" NOT NULL,
    "college_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."nss_units" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" integer NOT NULL,
    "resource" "text" NOT NULL,
    "action" "text" NOT NULL
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."permissions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."permissions_id_seq" OWNED BY "public"."permissions"."id";



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "role_id" integer NOT NULL,
    "permission_id" integer NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";



CREATE TABLE IF NOT EXISTS "public"."students" (
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "mobile_number" "text" DEFAULT ''::"text" NOT NULL,
    "ktu_id" "text",
    "college_id" character varying(6) NOT NULL,
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "unit_uuid" "uuid",
    CONSTRAINT "students_email_check" CHECK ((("email" IS NOT NULL) OR ("char_length"("email") <= 40))),
    CONSTRAINT "students_mobile_number_check" CHECK (("length"("mobile_number") = 10))
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."volunteers" (
    "student_id" "uuid" NOT NULL,
    "semester" integer,
    "course" "text" NOT NULL,
    "unit_number" character varying(10) NOT NULL,
    "admission_year" integer,
    "reg_no" character varying(20),
    "enroll_no" character varying(20),
    "gender" "text",
    "dob" "date",
    "whatsapp_number" character varying(10),
    "religion" "text",
    "community" "text",
    "blood_group" "text",
    "height" numeric(5,2),
    "weight" numeric(5,2),
    "district" "text",
    "taluk" "text",
    "village" "text",
    "pincode" character varying(6),
    "parent_name" "text",
    "parent_contact_number" character varying(10),
    "parent_contact_number_2" character varying(10),
    "permanent_address" "text",
    "current_address" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "volunteers_admission_year_check" CHECK ((("admission_year" >= 2000) AND (("admission_year")::numeric <= EXTRACT(year FROM CURRENT_DATE)))),
    CONSTRAINT "volunteers_blood_group_check" CHECK (("blood_group" = ANY (ARRAY['A+'::"text", 'A-'::"text", 'B+'::"text", 'B-'::"text", 'AB+'::"text", 'AB-'::"text", 'O+'::"text", 'O-'::"text"]))),
    CONSTRAINT "volunteers_gender_check" CHECK (("gender" = ANY (ARRAY['male'::"text", 'female'::"text", 'other'::"text"]))),
    CONSTRAINT "volunteers_parent_contact_number_2_check" CHECK ((("parent_contact_number_2")::"text" ~ '^[0-9]{10}$'::"text")),
    CONSTRAINT "volunteers_parent_contact_number_check" CHECK ((("parent_contact_number")::"text" ~ '^[0-9]{10}$'::"text")),
    CONSTRAINT "volunteers_pincode_check" CHECK ((("pincode")::"text" ~ '^[0-9]{6}$'::"text")),
    CONSTRAINT "volunteers_semester_check" CHECK ((("semester" >= 1) AND ("semester" <= 8))),
    CONSTRAINT "volunteers_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text"]))),
    CONSTRAINT "volunteers_whatsapp_number_check" CHECK ((("whatsapp_number")::"text" ~ '^[0-9]{10}$'::"text"))
);


ALTER TABLE "public"."volunteers" OWNER TO "postgres";


ALTER TABLE ONLY "public"."permissions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."permissions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."colleges"
    ADD CONSTRAINT "colleges_college_name_key" UNIQUE ("college_name");



ALTER TABLE ONLY "public"."colleges"
    ADD CONSTRAINT "colleges_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nss_units"
    ADD CONSTRAINT "nss_units_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nss_units"
    ADD CONSTRAINT "nss_units_unit_number_key" UNIQUE ("unit_number");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_resource_action_key" UNIQUE ("resource", "action");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."volunteers"
    ADD CONSTRAINT "volunteers_pkey" PRIMARY KEY ("student_id");



CREATE INDEX "idx_students_college_id" ON "public"."students" USING "btree" ("college_id");



CREATE INDEX "idx_volunteers_admission_yr" ON "public"."volunteers" USING "btree" ("admission_year");



CREATE INDEX "idx_volunteers_pincode" ON "public"."volunteers" USING "btree" ("pincode");



CREATE INDEX "idx_volunteers_unit_number" ON "public"."volunteers" USING "btree" ("unit_number");



CREATE UNIQUE INDEX "ux_students_ktu_id" ON "public"."students" USING "btree" ("ktu_id");



CREATE OR REPLACE TRIGGER "trg_students_touch" BEFORE UPDATE ON "public"."students" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();



CREATE OR REPLACE TRIGGER "trg_volunteers_touch" BEFORE UPDATE ON "public"."volunteers" FOR EACH ROW EXECUTE FUNCTION "public"."touch_volunteers_updated_at"();



ALTER TABLE ONLY "public"."nss_units"
    ADD CONSTRAINT "nss_units_college_id_fkey" FOREIGN KEY ("college_id") REFERENCES "public"."colleges"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_college_fk" FOREIGN KEY ("college_id") REFERENCES "public"."colleges"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_unit_uuid_fkey" FOREIGN KEY ("unit_uuid") REFERENCES "public"."nss_units"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_unit_uuid_fkey" FOREIGN KEY ("unit_uuid") REFERENCES "public"."nss_units"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."volunteers"
    ADD CONSTRAINT "volunteers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



CREATE POLICY "Enable insert for authenticated users only" ON "public"."students" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."colleges" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."role_permissions" AS RESTRICTIVE FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."roles" AS RESTRICTIVE FOR SELECT USING (true);



CREATE POLICY "Enable users to view their own data only" ON "public"."students" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."colleges" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nss_units" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "students_read" ON "public"."students" FOR SELECT TO "authenticated" USING ((("id" = "auth"."uid"()) OR ("public"."has_role"('unit'::"text") AND ("unit_uuid" = ( SELECT "current_user_role"."unit_uuid"
   FROM "public"."current_user_role"))) OR ("public"."has_role"('unit'::"text") AND (EXISTS ( SELECT 1
   FROM (("public"."current_user_role" "me"
     JOIN "public"."nss_units" "u_me" ON (("u_me"."id" = "me"."unit_uuid")))
     JOIN "public"."nss_units" "u_st" ON (("u_st"."id" = "students"."unit_uuid")))
  WHERE ("u_me"."college_id" = "u_st"."college_id")))) OR "public"."has_role"('admin'::"text")));



CREATE POLICY "students_update" ON "public"."students" FOR UPDATE TO "authenticated" USING ((("id" = "auth"."uid"()) OR ("public"."has_role"('unit'::"text") AND ("unit_uuid" = ( SELECT "current_user_role"."unit_uuid"
   FROM "public"."current_user_role"))) OR ("public"."has_role"('unit'::"text") AND (EXISTS ( SELECT 1
   FROM (("public"."current_user_role" "me"
     JOIN "public"."nss_units" "u_me" ON (("u_me"."id" = "me"."unit_uuid")))
     JOIN "public"."nss_units" "u_st" ON (("u_st"."id" = "students"."unit_uuid")))
  WHERE ("u_me"."college_id" = "u_st"."college_id")))) OR "public"."has_role"('admin'::"text"))) WITH CHECK (true);



CREATE POLICY "units_read" ON "public"."nss_units" FOR SELECT TO "authenticated" USING (("public"."has_role"('admin'::"text") OR ("public"."has_role"('unit'::"text") AND ("id" = ( SELECT "current_user_role"."unit_uuid"
   FROM "public"."current_user_role")))));



CREATE POLICY "units_update" ON "public"."nss_units" FOR UPDATE TO "authenticated" USING (("public"."has_role"('admin'::"text") OR ("public"."has_role"('unit'::"text") AND ("id" = ( SELECT "current_user_role"."unit_uuid"
   FROM "public"."current_user_role"))))) WITH CHECK (true);



ALTER TABLE "public"."volunteers" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."assign_student_role_on_signup"() TO "anon";
GRANT ALL ON FUNCTION "public"."assign_student_role_on_signup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_student_role_on_signup"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_student_on_signup"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_student_on_signup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_student_on_signup"() TO "service_role";



GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_student_default"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_student_default"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_student_default"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_permission"("_resource" "text", "_action" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_permission"("_resource" "text", "_action" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_permission"("_resource" "text", "_action" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_role" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_role" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."role_id"("_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."role_id"("_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."role_id"("_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_profile_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profile_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profile_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_student_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_student_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_student_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_volunteers_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_volunteers_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_volunteers_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."colleges" TO "anon";
GRANT ALL ON TABLE "public"."colleges" TO "authenticated";
GRANT ALL ON TABLE "public"."colleges" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."current_user_role" TO "anon";
GRANT ALL ON TABLE "public"."current_user_role" TO "authenticated";
GRANT ALL ON TABLE "public"."current_user_role" TO "service_role";



GRANT ALL ON TABLE "public"."nss_units" TO "anon";
GRANT ALL ON TABLE "public"."nss_units" TO "authenticated";
GRANT ALL ON TABLE "public"."nss_units" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."volunteers" TO "anon";
GRANT ALL ON TABLE "public"."volunteers" TO "authenticated";
GRANT ALL ON TABLE "public"."volunteers" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






