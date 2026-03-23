# NSS Volunteer Management System - Architecture Guide

## Tech Stack
- **Frontend**: React 18.3.1 + TypeScript 5.5 + Vite 7
- **Styling**: Tailwind CSS 3.4.17 (custom palettes: `nss`, `blood`, `tree`) + shadcn/ui
- **State**: React Context (Auth + UserData) + TanStack React Query
- **Forms**: React Hook Form 7 + Zod 4 validation
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v6 with lazy-loaded routes
- **Animations**: GSAP 3.14
- **Icons**: Lucide React
- **Deployment**: Vercel

## Supabase Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with `role` (student/unit/admin), `college_id`, `unit_id` |
| `volunteers` | Volunteer registrations with status workflow (pending→approved→certified) |
| `activities` | NSS activities (camps, workshops, awareness programs) |
| `courses` | College courses linked to `college_id` |
| `nss_units` | NSS unit info (PO details, college association) |
| `colleges` | College names and districts |
| `blood_donations` | Blood donation records with certificate uploads (FK: volunteer_id) |
| `tree_tagging` | Tree tagging records (FK: volunteer_id) |
| `profiles_with_unit` | **View** - pre-joined profiles + nss_units + colleges |
| `user_with_college` | **View** - profiles joined with college info |

## Storage Buckets
- `volunteer-photos` - Volunteer registration photos
- `volunteer-signatures` - Volunteer registration signatures
- `blood-donations` - Blood donation certificates
- `tree-tagging` - Tree tagging photos
- `website-images` - Website static images

## Directory Structure

```
src/
├── assets/images/          # Static images + index.ts barrel export
├── components/
│   ├── common/             # Shared layout/UI components
│   │   ├── Navbar.tsx              # Public page navbar (auth-aware)
│   │   ├── DashboardNavigation.tsx # Dashboard sidebar nav (mode: student|unit|admin)
│   │   ├── DashboardHeader.tsx     # Dashboard page header
│   │   ├── ErrorBoundary.tsx       # React error boundary wrapper
│   │   ├── ErrorMessage.tsx        # Inline error display
│   │   ├── ErrorPop.tsx            # Toast-style error popup
│   │   ├── LoadingSpinner.tsx      # Full-page loading spinner
│   │   ├── GlobalLoader.tsx        # Global loading overlay
│   │   ├── ImagePreviewFileUpload.tsx # Drag-drop file upload with preview
│   │   ├── SuccessModal.tsx        # Success confirmation modal
│   │   ├── UnitInfoCard.tsx        # Unit info display card
│   │   ├── VolunteerDetailsOverlay.tsx # Volunteer detail modal overlay
│   │   ├── NavTransitionLink.tsx   # Animated nav link
│   │   └── Placeholder.tsx         # Placeholder component
│   ├── forms/              # Form components
│   │   ├── BloodDonationSubmission.tsx # Blood donation form
│   │   ├── TreeTaggingSubmission.tsx   # Tree tagging form
│   │   ├── RegisterForm.tsx            # Student registration form
│   │   └── StudentInfo.tsx             # Student info sub-form
│   ├── shadcn/             # shadcn/ui components (auto-generated)
│   └── ui/                 # Custom UI primitives
│       ├── Button.tsx, FilledButton.tsx, OutlinedButton.tsx
│       ├── TextField.tsx, TextArea.tsx, Dropdown.tsx
│       ├── Table.tsx               # Generic typed table component
│       ├── FileUpload.tsx          # Basic file upload
│       ├── StatCard.tsx            # Statistics card
│       ├── Footer.tsx, HyphenLogo.tsx
│       ├── NoDataFound.tsx, ProfilePlaceholder.tsx
│       ├── FinalCTA.tsx, FlowDiagram.tsx
│       ├── ListTileCardWithIcon.tsx, HeroInfoBadge.tsx
│       └── index.ts               # Barrel exports
├── config/
│   └── uiConstants.ts      # Animation timing, UI constants
├── context/
│   ├── AuthContext.tsx      # Auth state: session, role, signUp/signIn/logout
│   ├── UserDataContext.tsx  # Shared user data + avatar state
│   ├── authContextTypes.ts # RoleResult = { role: string, unit_id?: string }
│   └── userContextTypes.ts
├── handlers/               # Complex UI interaction handlers (class-based)
│   ├── adminVolunteerHandlers.ts
│   └── adminUsersHandlers.ts
├── hooks/
│   ├── useStudentDashboard.ts       # Student stats, activities, notifications
│   ├── useProfileService.ts         # Profile CRUD, volunteer status checks
│   ├── useAdminService.ts           # Admin profile, volunteers, users, stats
│   ├── useUnitProfile.ts            # Unit profile CRUD + course management
│   ├── useUnitVolunteerManagement.ts # Unit volunteer approve/reject/promote
│   ├── useVolunteerRegistration.ts  # Volunteer registration + course fetching
│   ├── useReportService.ts          # Report generation hooks
│   ├── useGeneralHook.ts            # College fetching utilities
│   ├── useScrollReveal.ts           # GSAP scroll animations (currently no-op)
│   └── scrollToTopHook.ts           # Auto-scroll on route change
├── routes/
│   ├── routeConfig.tsx     # All route definitions with lazy imports
│   └── ProtectedRoute.tsx  # Role-based route guard
├── services/               # Supabase API layer
│   ├── supabase.ts                  # Supabase client init
│   ├── volunteerService.ts          # Volunteer CRUD + file uploads
│   ├── profileService.ts            # Profile CRUD + volunteer status
│   ├── studentService.ts            # Dashboard stats + activities
│   ├── activitiesService.ts         # Activity CRUD
│   ├── activitySubmissionService.ts # Blood donation + tree tagging submissions
│   ├── activityStatusServices.ts    # Approve/reject/certify submissions
│   ├── adminService.ts              # Admin operations (1200+ lines)
│   ├── unitProfileService.ts        # Unit profile + stats + courses
│   ├── unitVolunteerService.ts      # Unit-level volunteer management
│   ├── reportService.ts             # Report generation
│   ├── blogService.ts               # Blog CRUD
│   ├── contactService.ts            # Contact form submission
│   └── generalService.ts            # General utilities
├── structures/tables/
│   ├── volunteerColumns.tsx # Table column definitions for volunteer lists
│   └── index.ts
├── types/                  # TypeScript interfaces
│   ├── UserProfile.ts, VolunteerProfile.ts, AdminProfile.ts
│   ├── CompleteProfile.ts, UnitProfile.ts, UserWithDetails.ts
│   ├── StudentFormSchema.ts, VolunteerFormSchema.ts (Zod), LoginSchema.ts
│   ├── ActivityType.ts (enum: BloodDonation, TreeTagging)
│   ├── BloodDonation.ts, TreeTagging.ts
│   └── index.ts
├── utils/
│   ├── data/collegeUnits.ts, community.ts, taluks.ts  # Static data
│   └── exportUtils.ts      # CSV/report export helpers
├── views/
│   ├── auth/               # Login, Register, AdminLogin, UnitLogin, ResetPassword
│   ├── dashboard/
│   │   ├── student/        # StudentDashboard, StudentProfile, ProfilePage,
│   │   │   │               # ActivitySubmissionPage, CertificateSubmission,
│   │   │   │               # VolunteerRegistrationPage
│   │   │   └── sections/   # StatsSection, ActivitiesSection, CertificatesSection, DashboardHeader
│   │   ├── unit/           # UnitDashboard, UnitProfile, UnitVolunteers,
│   │   │                   # UnitSubmissions, UnitActivity
│   │   └── admin/          # AdminDashboard, AdminProfile, AdminVolunteers,
│   │                       # AdminUsers, AdminReports
│   └── miscellaneous/      # Home, About, Blog, BloodDonation, TreeTag,
│                           # Activities, WebsiteTeam, Contact, NotFound, Unauthorized
├── App.tsx                 # Root component with ErrorBoundary + RouterProvider
├── main.tsx                # Entry: AuthProvider > UserDataProvider > QueryClientProvider > App
└── index.css               # Tailwind directives + CSS variables + fonts
```

## Routes

### Public
| Path | View | Nav |
|------|------|-----|
| `/home` | HomeView | Yes |
| `/about` | AboutView | Yes |
| `/blood-donation` | BloodDonationView (Rudhirasena) | Yes |
| `/tree-tag` | TreeTagView (NRPF) | Yes |
| `/blog` | BlogView | More menu |
| `/website-team` | WebsiteTeamView | More menu |
| `/contact` | ContactView | More menu |
| `/login` | LoginView | - |
| `/register` | RegisterView | - |
| `/adminlogin` | AdminLogin | - |
| `/auth/reset-password` | ResetPasswordView | - |

### Protected (Student)
| Path | View |
|------|------|
| `/dashboard/student` | StudentDashboard |
| `/dashboard/student/profile` | ProfilePage |
| `/dashboard/student/submit` | ActivitySubmissionPage |
| `/dashboard/student/volunteer-registration` | VolunteerRegistrationPage |

### Protected (Unit)
| Path | View |
|------|------|
| `/dashboard/unit` | UnitDashboard |
| `/dashboard/unit/profile` | UnitProfile |
| `/dashboard/unit/volunteer` | UnitVolunteers |
| `/dashboard/unit/submissions` | UnitSubmissions |
| `/dashboard/unit/activity` | UnitActivity |

### Protected (Admin)
| Path | View |
|------|------|
| `/dashboard/admin` | AdminDashboard |
| `/dashboard/admin/profile` | AdminProfile |
| `/dashboard/admin/volunteers` | AdminVolunteers |
| `/dashboard/admin/users` | AdminUsers |
| `/dashboard/admin/reports` | AdminReports |

## Auth Flow
1. `AuthProvider` wraps the app, manages `session` + `role` state
2. On mount, checks `supabase.auth.getSession()` and fetches role from `profiles` table
3. `onAuthStateChange` listener keeps session/role in sync
4. `ProtectedRoute` checks `session` + `role` before rendering children
5. Roles: `student`, `unit`, `admin`

## Data Flow Pattern
```
View → Hook (useXxxService) → Service (xxxService) → Supabase Client → PostgreSQL
```
- Views consume hooks for state management
- Hooks manage loading/error/data states
- Services are pure async functions calling Supabase
- No direct Supabase calls in views or components

## Custom Color Palettes (Tailwind)
- **nss**: `#0F2027` → `#203A43` → `#2C5364` (dark blue-teal gradient)
- **blood**: Red palette centered on `#c1121f` (for Rudhirasena/blood donation)
- **tree**: Green palette centered on `#3a5a40` (for NRPF/tree tagging)
