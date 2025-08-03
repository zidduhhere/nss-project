# NSS Portal

A modern web application for the National Service Scheme (NSS) built with React, TypeScript, and Tailwind CSS.

## 🏗️ Project Structure

```
nss-project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── StudentInfo.tsx
│   │   ├── faculty/        # Faculty-specific components
│   │   │   └── FacultyDashboard.tsx
│   │   ├── student/        # Student-specific components
│   │   │   ├── BloodDonationForm.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   └── TreeTaggingForm.tsx
│   │   └── Layout.tsx      # Main layout component
│   │
│   ├── views/              # Page-level components
│   │   ├── auth/           # Authentication views
│   │   │   ├── login/      # Login page variants
│   │   │   │   ├── desktop/
│   │   │   │   └── mobile/
│   │   │   ├── register/   # Registration page variants
│   │   │   │   ├── desktop/
│   │   │   │   └── mobile/
│   │   │   ├── LoginView.tsx
│   │   │   ├── RegisterView.tsx
│   │   │   ├── LoginLeftSide.tsx
│   │   │   ├── LoginRightSide.tsx
│   │   │   ├── RegisterLeftSide.tsx
│   │   │   └── RegisterRightSide.tsx
│   │   ├── common/         # Shared view components
│   │   │   └── index.ts
│   │   ├── faculty/        # Faculty dashboard views
│   │   └── student/        # Student dashboard views
│   │
│   ├── utils/              # Utility functions and reusable components
│   │   ├── CardDetails.ts  # NSS card data and interfaces
│   │   └── HyphenLogo.tsx  # Hyphen attribution component
│   │
│   ├── assets/             # Static assets
│   │   ├── images/         # Image files
│   │   └── fonts/          # Font files
│   │
│   ├── context/            # React context providers
│   │   └── AppContext.tsx  # Global application state
│   │
│   ├── models/             # TypeScript interfaces and types
│   ├── services/           # API services and data fetching
│   ├── viewmodels/         # Business logic layer
│   │
│   ├── App.tsx             # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind configuration
│
├── public/                 # Public assets
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design System

### Color Scheme

The application uses a sophisticated color palette based on `#0F2027`, `#203A43`, and `#2C5364`:

- **Primary Colors**: NSS-themed gradient colors
- **Glass UI**: Liquid glass components with backdrop blur effects
- **Typography**: Instrument Sans font family
- **Responsive**: Mobile-first design approach

### Global Components

Located in `/src/components/global/`:

- **TextField**: Reusable input component with password toggle
- **TextArea**: Multi-line text input component
- **Dropdown**: Select dropdown with consistent styling
- **Button**: Multiple variants (primary, secondary, ghost) with loading states
- **GlassCard**: Liquid glass UI cards with icons and content

## 🚀 Features

### Authentication System

- **Login/Register**: Separate forms for students and faculty
- **Role-based**: Different interfaces for student and faculty users
- **Responsive Design**: Adaptive layouts for mobile and desktop
- **Glass UI**: Modern liquid glass design elements

### Student Features

- **Registration**: Complete student information collection
- **Dashboard**: Personalized student interface
- **Forms**: Blood donation and tree tagging forms
- **Profile Management**: Student-specific data handling

### Faculty Features

- **Dashboard**: Faculty-specific interface
- **Management Tools**: Administrative capabilities

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom configuration
- **Icons**: Lucide React icon library
- **Build Tool**: Vite
- **State Management**: React Context API
- **Architecture**: MVVM pattern with separated concerns

## 📱 Responsive Design

The application features a responsive design with:

- **Mobile-first approach**: Optimized for mobile devices
- **Adaptive layouts**: Different layouts for mobile, tablet, and desktop
- **Glass UI components**: Modern liquid glass design system
- **Touch-friendly**: Optimized for touch interactions

## 🔧 Configuration

### Color Configuration

Primary colors are configured in `tailwind.config.js` and `src/index.css`:

```css
--nss-primary: #2c5364;
--nss-primary-dark: #203a43;
--nss-text: #0f2027;
```

### Global Styles

Custom CSS classes and utilities are defined in `src/index.css` with Tailwind layers.

## 📦 Component Architecture

### Reusable Components

- Global components for consistent UI elements
- Modular card system with NSS-themed content
- Responsive layout components

### View Structure

- Separated desktop and mobile views
- Component composition for complex layouts
- Shared utilities and common components

## 🎯 Development Guidelines

1. **Component Organization**: Keep components focused and reusable
2. **TypeScript**: Use proper typing for all components and props
3. **Styling**: Follow the established design system and color scheme
4. **Responsive**: Ensure mobile-first responsive design
5. **Accessibility**: Include proper ARIA labels and semantic HTML

## 🔄 State Management

The application uses React Context API for:

- Authentication state
- User role management
- Global application settings
- Form data persistence

---

**Designed and developed by Hyphen**
