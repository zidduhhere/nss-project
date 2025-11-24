# Supabase Integration Setup Guide

This guide will help you set up the Supabase backend for the volunteer registration system.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `nss-project` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for setup to complete

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Run Database Migrations

1. In your Supabase project, go to **SQL Editor** (in the sidebar)
2. Click "New Query"
3. Copy the contents of `supabase/migrations/create_volunteers_table.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

This will:

- Create the `volunteers` table with all required fields
- Set up indexes for better query performance
- Enable Row Level Security (RLS) policies
- Create storage buckets for photos and signatures
- Set up storage policies for file uploads

## Step 5: Verify Setup

### Check Database Table

1. Go to **Table Editor** in Supabase
2. You should see the `volunteers` table
3. Click on it to view the schema

### Check Storage Buckets

1. Go to **Storage** in Supabase
2. You should see two buckets:
   - `volunteer-photos`
   - `volunteer-signatures`
3. Both should be marked as "Public"

## Step 6: Install Dependencies

Make sure you have the Supabase client library installed:

```bash
npm install @supabase/supabase-js
```

## Step 7: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the volunteer registration page

3. Fill out the form and submit

4. Check your Supabase project:
   - **Table Editor**: Verify the volunteer record was created
   - **Storage**: Check if photo and signature were uploaded

## Database Schema

The `volunteers` table includes:

### Institution Details

- `unit` - College unit
- `semester` - Current semester
- `course` - Course name
- `admission_year` - Year of admission
- `ktu_id` - KTU ID (unique)

### Personal Details

- `name` - Full name
- `gender` - Gender
- `dob` - Date of birth
- `contact_number` - Contact number
- `whatsapp_number` - WhatsApp number
- `religion` - Religion
- `community` - Community
- `blood_group` - Blood group
- `height` - Height in cm
- `weight` - Weight in kg

### Address Details

- `district` - District
- `taluk` - Taluk
- `village` - Village
- `pincode` - Pincode
- `permanent_address` - Full address

### Parent/Guardian Details

- `parent_name` - Parent/Guardian name
- `parent_contact` - Parent/Guardian contact

### Documents

- `photo_url` - URL to uploaded photo
- `signature_url` - URL to uploaded signature

### Other

- `languages_known` - JSON array of known languages
- `created_at` - Timestamp of record creation
- `updated_at` - Timestamp of last update

## Security Notes

### Row Level Security (RLS)

The table has RLS enabled with the following policies:

- Authenticated users can read all volunteers
- Authenticated users can insert new volunteers
- Authenticated users can update volunteers
- Authenticated users can delete volunteers

**Important**: These policies allow full access to authenticated users. In production, you may want to restrict:

- Updates to only the volunteer's own record
- Deletes to admin users only
- Reads based on user role

### Storage Policies

Files in both storage buckets:

- Can be uploaded by authenticated users
- Are publicly readable (so photos/signatures can be displayed)
- Can be deleted by authenticated users

## Common Issues

### "Missing Supabase environment variables" error

- Make sure `.env` file exists in project root
- Verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after creating `.env`

### File upload fails

- Check if storage buckets exist in Supabase
- Verify storage policies are set up correctly
- Check browser console for specific error messages

### Database insert fails

- Verify the migration was run successfully
- Check if all required fields are being sent
- Look for unique constraint violations (e.g., duplicate KTU ID)

## Next Steps

- Implement user authentication to restrict access
- Add admin dashboard to view all volunteers
- Set up email notifications on registration
- Add data export functionality
- Implement volunteer profile editing
- Add role-based access control

## Support

For Supabase-specific issues, check:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
