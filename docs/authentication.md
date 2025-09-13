# Authentication System Documentation

This document explains how to use the NSS project's authentication system, which is integrated with Supabase.

## Overview

The authentication system provides:

1. User authentication (signup, signin, signout)
2. Role-based access control (student, unit coordinator, admin)
3. Protected routes
4. Profile management

## Setup

Ensure your Supabase project has the necessary tables as defined in `supabase/schema.sql`.

The authentication system requires these environment variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Authentication Context

The `AuthContext` provides authentication state and methods to all components:

```tsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isLoading, error, signIn, signOut } = useAuth();

  // Use authentication state and methods
}
```

### Available Properties and Methods

- `user`: The current authenticated user or null
- `isLoading`: Boolean indicating if authentication is in progress
- `error`: Any authentication error messages
- `signIn(email, password)`: Sign in with email and password
- `signUp(email, password, role, userData)`: Register a new user
- `signOut()`: Sign out the current user
- `resetPassword(email)`: Send a password reset email
- `updateProfile(data)`: Update the user's profile information

## Protected Routes

Use the `ProtectedRoute` component to restrict access to authenticated users:

```tsx
<Route
  path="/dashboard/student"
  element={<ProtectedRoute component={StudentDashboard} roles={["student"]} />}
/>
```

This will:

1. Check if the user is authenticated
2. Verify the user has the required role
3. Show a loading indicator while checking authentication
4. Redirect to login if not authenticated
5. Redirect to home if the user doesn't have the required role

## User Registration Flow

1. User fills registration form
2. `signUp` method creates auth user and profile record
3. If role is 'student', creates student record
4. If role is 'unit', links coordinator to unit
5. User receives verification email
6. After verification, user can log in

## Authentication Events

The system automatically handles auth state changes:

- Login success: User profile is loaded
- Logout: User state is cleared
- Session expired: User is redirected to login

## Error Handling

Authentication errors are available through the `error` property:

```tsx
const { error } = useAuth();

if (error) {
  // Display error message
}
```

## Role-Based UI Rendering

Use the `user` object to conditionally render UI elements:

```tsx
const { user } = useAuth();

return (
  <div>
    {user?.role === "student" && <StudentMenu />}
    {user?.role === "unit" && <UnitCoordinatorMenu />}
    {user?.role === "admin" && <AdminMenu />}
  </div>
);
```

## Profile Management

Update user profile information:

```tsx
const { updateProfile } = useAuth();

const handleUpdateProfile = async () => {
  await updateProfile({
    name: "New Name",
    avatar_url: "https://example.com/avatar.jpg",
  });
};
```

## Security Considerations

1. All user data should be validated on both client and server
2. Sensitive operations should be protected by Row Level Security (RLS) policies
3. Use role-based access control consistently throughout the application
4. Never store sensitive data in localStorage or client-side state

## Testing Authentication

Use test accounts for different roles:

- Student: student@example.com / testpassword
- Unit Coordinator: unit@example.com / testpassword
- Admin: admin@example.com / testpassword

## Troubleshooting

Common issues:

1. **"User not found"**: User may not have verified email
2. **Permission errors**: Check RLS policies in Supabase
3. **"Invalid login credentials"**: Check email/password combination
4. **Profile missing after login**: Check profile creation in registration flow
