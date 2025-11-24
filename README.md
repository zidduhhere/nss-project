# NSS Portal

A comprehensive web application for the National Service Scheme (NSS) built with React, TypeScript, Tailwind CSS, and Supabase.

## 🏗️ Project Structure

```
nss-project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   │   ├── DashboardHeader.tsx  # Reusable dashboard header component
│   │   │   ├── DashboardNavigation.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── ErrorPop.tsx
│   │   │   ├── GlobalLoader.tsx
│   │   │   ├── ImagePreviewFileUpload.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavTransitionLink.tsx
│   │   │   ├── Placeholder.tsx
│   │   │   ├── SuccessModal.tsx
│   │   │   ├── UnitInfoCard.tsx
│   │   │   └── VolunteerDetailsOverlay.tsx
│   │   ├── forms/          # Form components
│   │   │   ├── BloodDonationForm.tsx
│   │   │   ├── BloodDonationSubmission.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── StudentInfo.tsx
│   │   │   ├── TreeTaggingForm.tsx
│   │   │   └── TreeTaggingSubmission.tsx
│   │   └── ui/             # UI primitives
│   │       ├── Button.tsx
│   │       ├── Dropdown.tsx
│   │       ├── FileUpload.tsx
│   │       ├── FilledButton.tsx
│   │       ├── FinalCTA.tsx
│   │       ├── FlowDiagram.tsx
│   │       ├── Footer.tsx
│   │       ├── GlassCard.tsx
│   │       ├── HeroButton.tsx
│   │       ├── HeroInfoBadge.tsx
│   │       ├── HyphenLogo.tsx
│   │       ├── ListTileCardWithIcon.tsx
│   │       ├── OutlinedButton.tsx
│   │       ├── ProfilePlaceholder.tsx
│   │       ├── StatCard.tsx
│   │       ├── StatSectionWrapper.tsx
│   │       ├── Table.tsx
│   │       ├── TextArea.tsx
│   │       └── TextField.tsx
│   │
│   ├── views/              # Page-level views
│   │   ├── auth/           # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── contact/        # Contact pages
│   │   │   └── ContactPage.tsx
│   │   ├── dashboard/      # Role-specific dashboards
│   │   │   ├── admin/      # Admin dashboard views
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminProfile.tsx
│   │   │   │   ├── AdminUnits.tsx
│   │   │   │   └── AdminVolunteers.tsx
│   │   │   ├── student/    # Student dashboard views
│   │   │   │   ├── ProfilePage.tsx
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   └── StudentProfile.tsx
│   │   │   └── unit/       # Unit coordinator dashboards
│   │   │       ├── UnitDashboard.tsx
│   │   │       ├── UnitProfile.tsx
│   │   │       ├── UnitSubmissions.tsx
│   │   │       └── UnitVolunteers.tsx
│   │   └── miscellaneous/  # Public pages
│   │       ├── AboutPage.tsx
│   │       ├── HomePage.tsx
│   │       └── NotFoundPage.tsx
│   │
│   ├── services/           # Backend service layer (Supabase)
│   │   ├── supabase.ts     # Supabase client configuration
│   │   ├── adminService.ts # Admin operations
│   │   ├── profileService.ts # User profile operations
│   │   ├── volunteerService.ts # Volunteer registration
│   │   ├── unitProfileService.ts # Unit profile management
│   │   └── unitVolunteerService.ts # Unit volunteer operations
│   │
│   ├── context/            # React context providers
│   │   ├── AuthContext.tsx # Authentication state management
│   │   ├── authContextTypes.ts
│   │   ├── UserDataContext.tsx # User data management
│   │   └── userContextTypes.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useScrollReveal.ts  # Scroll reveal animations
│   │   ├── useVolunteerRegistration.ts
│   │   └── useUnitProfile.ts  # Unit profile with course management
│   │
│   ├── types/              # TypeScript type definitions
│   │   ├── AdminProfile.ts
│   │   ├── CompleteProfile.ts
│   │   ├── LoginSchema.ts
│   │   ├── StudentFormSchema.ts
│   │   ├── UnitProfile.ts
│   │   ├── UserProfile.ts
│   │   ├── UserWithDetails.ts
│   │   ├── VolunteerFormSchema.ts
│   │   └── VolunteerProfile.ts
│   │
│   ├── routes/             # Route configuration
│   │   ├── ProtectedRoute.tsx
│   │   └── routeConfig.tsx
│   │
│   ├── utils/              # Utility functions
│   │   ├── CardDetails.ts
│   │   ├── dateUtils.ts
│   │   ├── fileUtils.ts
│   │   ├── tableStructure.tsx
│   │   ├── validationUtils.ts
│   │   ├── data/           # Static data
│   │   │   ├── college.ts
│   │   │   └── collegeUnits.ts
│   │   └── mockData/       # Mock data for development
│   │
│   ├── assets/             # Static assets
│   │   ├── images/         # Images
│   │   │   ├── backgrounds/
│   │   │   ├── icons/
│   │   │   ├── illustrations/
│   │   │   └── logos/
│   │   ├── fonts/          # Custom fonts
│   │   └── utils/          # Asset utilities
│   │       ├── students.ts
│   │       └── volunteers.ts
│   │
│   ├── config/             # Configuration files
│   │   └── uiConstants.ts
│   │
│   ├── handlers/           # Event handlers
│   │   └── adminVolunteerHandlers.ts
│   │
│   ├── structures/         # Data structures
│   │   └── tables/         # Table column definitions
│   │       └── volunteerColumns.tsx
│   │
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind
│
├── backend/                # Backend server (Express.js)
│   ├── package.json
│   └── server.js
│
├── supabase/               # Supabase configuration
│   ├── config.toml
│   └── custom/
│       └── custom_schema.sql
│
├── docs/                   # Documentation
│   ├── authentication.md
│   └── SUPABASE_SETUP.md
│
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Features

### Multi-Role System

The application supports three distinct user roles:

#### **Admin Dashboard**
- System-wide statistics and analytics
- Volunteer certification management (certify approved volunteers)
- Unit management and oversight
- Complete volunteer database access
- Bulk operations and data export

#### **Unit Coordinator Dashboard**
- Unit-specific volunteer management
- Approve/reject volunteer applications
- View pending, approved, rejected, and certified volunteers
- Unit profile management
- Program Officer details editing
- **College course management** (add, view, delete courses)
- Submission tracking (blood donation, tree tagging)
- Password reset functionality

#### **Student Dashboard**
- Profile management
- Volunteer registration
- Application status tracking (pending → approved → certified)
- Activity submissions (blood donation, tree tagging)
- Personal statistics and achievements

### Volunteer Status Flow

```
pending → approved (by unit) → certified (by admin only)
         ↓
       rejected (by unit)
```

- **Pending**: New volunteer application
- **Approved**: Unit coordinator approved
- **Certified**: Admin certified (final status, cannot be modified by unit)
- **Rejected**: Application rejected by unit

### Authentication & Authorization

- **Supabase Auth**: Secure authentication with email/password
- **Role-based Access Control**: Protected routes based on user roles
- **Context-based State**: AuthContext and UserDataContext
- **Password Reset**: Email-based password recovery

### Data Management

- **Real-time Updates**: Supabase real-time subscriptions
- **Optimistic UI Updates**: Instant feedback with automatic rollback on errors
- **Error Handling**: Global error boundaries and user-friendly error messages
- **Loading States**: Skeleton loaders and loading spinners

## 🎨 Design System

### Color Scheme

NSS-themed gradient color palette:

```css
--nss-50: #f0f7fa;
--nss-100: #d9ebf3;
--nss-200: #b8d9e8;
--nss-300: #8bbfd8;
--nss-400: #579fc4;
--nss-500: #3c7fa3;
--nss-600: #2c5364;
--nss-700: #203a43;
--nss-800: #1a2f37;
--nss-900: #0f2027;
--nss-950: #081419;
```

### UI Components

#### **Buttons**
- **FilledButton**: Primary action buttons with loading states
  - Variants: primary, secondary, lightNss
- **OutlinedButton**: Secondary actions with border styling
- **HeroButton**: Large call-to-action buttons for landing pages

#### **Cards & Layouts**
- **DashboardHeader**: Reusable header with title, subtitle, icon, and badges
- **StatCard**: Statistics display with icons and gradients
- **GlassCard**: Liquid glass UI cards with backdrop blur
- **UnitInfoCard**: Compact unit information display
- **ListTileCardWithIcon**: Feature cards with icons

#### **Forms**
- **TextField**: Input fields with validation
- **TextArea**: Multi-line text input
- **Dropdown**: Select dropdowns with custom styling
- **FileUpload**: Image upload with preview
- **ImagePreviewFileUpload**: Advanced file upload component

#### **Tables**
- Responsive data tables
- Sortable columns
- Action buttons per row
- Volunteer details overlay

### Responsive Design

- **Mobile-first**: Optimized for small screens
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Adaptive Layouts**: Different layouts for mobile/tablet/desktop
- **Touch-friendly**: Optimized touch targets with proper spacing
- **Simple Animations**: Quick fade-in animations (0 → 10% → 100% opacity in 0.4s)
- **Fully Responsive Dashboards**: All dashboard pages optimized for mobile, tablet, and desktop
  - Unit Dashboard: Responsive stats grid, course management
  - Unit Profile: Stacked forms on mobile
  - Unit Volunteers: Horizontal scroll tables on mobile
  - Student Registration: Multi-column grids adapt to screen size
  - Profile Pages: Responsive image galleries and info sections

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6
- **Date Handling**: Day.js
- **Query Management**: TanStack React Query

## 📦 Key Services

### unitProfileService
- Get unit profile with college details
- Update Program Officer information
- Fetch unit statistics (total, approved, certified, pending, rejected)
- **Course management** (get, add, delete college courses)
- Password reset for unit accounts

### unitVolunteerService
- Get volunteers by unit
- Update volunteer status (approve/reject/pending)
- Bulk approve/reject operations
- Volunteer statistics by semester

### adminService
- System-wide statistics
- Volunteer certification (admin-only)
- Unit management
- Global volunteer operations

### volunteerService
- Student volunteer registration
- Profile updates
- File uploads (photo, signature)

## 🔒 Security Features

- **Row Level Security (RLS)**: Supabase policies for data access
- **Protected Routes**: Route guards based on authentication
- **Role-based Permissions**: Users can only access authorized features
- **Secure File Upload**: Validated file types and sizes
- **SQL Injection Prevention**: Parameterized queries via Supabase

## 🔧 Development

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Code Architecture

### Service Layer Pattern
All backend operations are abstracted into service files with:
- Comprehensive JSDoc documentation
- Error handling with user-friendly messages
- Type-safe interfaces
- Reusable functions

### Custom Hooks Pattern
Complex logic is encapsulated in custom hooks:
- `useUnitProfile`: Profile, stats, and course management
- `useVolunteerRegistration`: Registration workflow
- `useScrollReveal`: Scroll-based reveal animations

### Context Pattern
Global state management:
- `AuthContext`: Authentication state, login/logout
- `UserDataContext`: User profile data

## 🔄 Recent Updates

### Mobile Responsiveness (November 2025)
- ✅ All dashboard pages fully responsive across devices
- ✅ Unit Dashboard: Adaptive grid layouts (1→2→5 columns)
- ✅ Unit Profile: Form layouts stack on mobile
- ✅ Unit Volunteers: Horizontal scroll for tables
- ✅ Student Registration: Multi-column grids adapt to screen size
- ✅ Profile Pages: Responsive image galleries

### Course Management Feature (November 2025)
- ✅ Unit coordinators can manage college courses
- ✅ Add courses with name and code
- ✅ Delete courses with confirmation
- ✅ Real-time course list updates
- ✅ Integrated into Unit Dashboard
- ✅ Modal-based add course interface

### Component Architecture (November 2025)
- ✅ Created reusable `DashboardHeader` component
- ✅ Standardized header design across dashboards
- ✅ Flexible badge system for metadata display
- ✅ Responsive icon and text layouts

## 🔄 Migration Notes

### Faculty → Unit Renaming
The role "faculty" has been renamed to "unit" throughout the codebase:
- Old routes redirect automatically
- LocalStorage keys migrated on first load
- Database role updated to "unit"

---

**Designed and developed for NSS Kerala**
