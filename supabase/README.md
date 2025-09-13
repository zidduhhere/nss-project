# Supabase Configuration and Guidelines

This document provides guidance on setting up and managing the Supabase backend for the NSS Project.

## Setup Instructions

1. Create a new Supabase project
2. Run the schema.sql script in the SQL Editor
3. Configure storage buckets for file uploads
4. Set up authentication providers
5. Configure environment variables

## Database Structure

The NSS Project database includes the following main tables:

- **profiles**: Extended user profiles linked to Supabase Auth
- **colleges**: Information about educational institutions
- **nss_units**: NSS units within colleges
- **students**: Student records with academic information
- **activities**: NSS activities and events
- **blood_donations**: Blood donation submissions
- **tree_taggings**: Tree planting and tagging records
- **activity_registrations**: Student participation in activities
- **notifications**: User notifications

## Security Policies

The database implements Row Level Security (RLS) policies with three main user roles:

1. **Student**: Can manage their own submissions and participate in activities
2. **Unit Coordinator**: Can manage their unit, students, and review submissions
3. **Admin**: Has full system access

## File Storage

Two storage buckets are required:

1. **certificates**: For blood donation certificates (.pdf, .jpg, .png)
2. **tree-photos**: For tree tagging photos (.jpg, .png)
3. **activity-photos**: For activity participation photos (.jpg, .png)
4. **volunteer-registration-documents**: For volunteer registration documents (.pdf, .jpg, .png)

## Environment Variables

Required environment variables for your frontend:

```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## API Usage

Use the Supabase client to interact with the database:

```typescript
import { supabase } from "@/utils/supabase";

// Example: Get all activities for a unit
const getActivities = async (unitId) => {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("unit_id", unitId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};
```

## Authentication Flow

1. Users sign up/sign in via Supabase Auth
2. On authentication, create or update the user's profile
3. Based on the user's role, direct them to the appropriate dashboard

## Testing

Use the following test credentials for development:

- **Student**: student@example.com / nssStudent123
- **Unit Coordinator**: coordinator@example.com / nssCoord123
- **Admin**: admin@example.com / nssAdmin123

## Backups

Enable daily backups for your Supabase project to prevent data loss.

## Security Best Practices

1. Never expose your service role key in the frontend
2. Use prepared statements to prevent SQL injection
3. Validate all user inputs server-side
4. Use the minimum required permissions for each operation
5. Regularly review RLS policies and security settings
