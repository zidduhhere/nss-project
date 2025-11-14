-- Seed file for NSS Project
-- This file initializes the database with required roles and permissions

-- Insert roles
INSERT INTO public.roles (id, name, description)
VALUES
  (1, 'student', 'Regular student user with basic permissions'),
  (2, 'unit', 'Unit coordinator with access to manage students in their unit'),
  (3, 'admin', 'Administrator with full system access')
ON CONFLICT (name) DO NOTHING;

-- Reset the sequence to continue from the highest ID
SELECT setval('public.roles_id_seq', (SELECT MAX(id) FROM public.roles));

-- Insert permissions (simplified structure)
INSERT INTO public.permissions (id, resource, action)
VALUES
  (1, 'student', 'read'),
  (2, 'student', 'edit'),
  (3, 'unit', 'read'),
  (4, 'unit', 'edit'),
  (5, 'college', 'read'),
  (6, 'admin', 'admin')
ON CONFLICT (resource, action) DO NOTHING;

-- Reset the sequence to continue from the highest ID
SELECT setval('public.permissions_id_seq', (SELECT MAX(id) FROM public.permissions));

-- Assign permissions to roles
INSERT INTO public.role_permissions (role_id, permission_id)
VALUES
  -- Student role: can read/edit student data
  (1, 1), (1, 2),
  
  -- Unit role: can read/edit students and units, plus read colleges
  (2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
  
  -- Admin role: has admin permission (full access)
  (3, 6)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Sample colleges data (you can add more as needed)
INSERT INTO public.colleges (id, college_name, district)
VALUES
  ('TST001', 'Test College of Engineering', 'Malappuram'),
  ('TST002', 'Sample Arts and Science College', 'Kozhikode')
ON CONFLICT (id) DO NOTHING;

-- Sample NSS units (you can add more as needed)
INSERT INTO public.nss_units (id, unit_number, college_id)
VALUES
  (gen_random_uuid(), '001', 'TST001'),
  (gen_random_uuid(), '002', 'TST002')
ON CONFLICT (unit_number) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database seeded successfully!';
  RAISE NOTICE 'Roles: % rows', (SELECT COUNT(*) FROM public.roles);
  RAISE NOTICE 'Permissions: % rows', (SELECT COUNT(*) FROM public.permissions);
  RAISE NOTICE 'Role-Permission mappings: % rows', (SELECT COUNT(*) FROM public.role_permissions);
  RAISE NOTICE 'Colleges: % rows', (SELECT COUNT(*) FROM public.colleges);
  RAISE NOTICE 'NSS Units: % rows', (SELECT COUNT(*) FROM public.nss_units);
END $$;
