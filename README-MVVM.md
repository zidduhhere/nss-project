# NSS Project - MVVM Architecture

This project has been restructured to follow the **Model-View-ViewModel (MVVM)** architectural pattern for better separation of concerns, maintainability, and testability.

## 🏗️ Project Structure

```
src/
├── models/                 # Data models and interfaces
│   ├── User.ts            # User-related models
│   ├── Submission.ts      # Blood donation and tree tagging models
│   ├── Dashboard.ts       # Dashboard statistics models
│   └── index.ts           # Central export
│
├── services/              # Data access layer
│   ├── StorageService.ts  # localStorage operations
│   ├── AuthService.ts     # Authentication logic
│   ├── SubmissionService.ts # Submission CRUD operations
│   └── index.ts           # Central export
│
├── viewmodels/            # Business logic and state management
│   ├── AuthViewModel.ts   # Authentication state and logic
│   ├── StudentViewModel.ts # Student dashboard logic
│   ├── UnitViewModel.ts # UNIT dashboard logic
│   └── index.ts           # Central export
│
├── views/                 # UI components (pure presentation)
│   ├── common/            # Shared UI components
│   │   ├── Layout.tsx
│   │   ├── StatCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── index.ts
│   │
│   ├── auth/              # Authentication views
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── index.ts
│   │
│   ├── student/           # Student-specific views
│   │   ├── StudentDashboard.tsx
│   │   ├── components/
│   │   │   ├── BloodDonationForm.tsx
│   │   │   ├── TreeTaggingForm.tsx
│   │   │   ├── SubmissionsList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── faculty/           # Faculty-specific views
│   │   ├── FacultyDashboard.tsx
│   │   ├── components/
│   │   │   ├── SubmissionReviewPanel.tsx
│   │   │   ├── SubmissionHistory.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── index.ts           # Central export
│
├── utils/                 # Utility functions
│   ├── dateUtils.ts       # Date formatting and validation
│   ├── validationUtils.ts # Form validation helpers
│   ├── fileUtils.ts       # File handling utilities
│   └── index.ts           # Central export
│
├── App-MVVM.tsx          # Main application (MVVM version)
└── ...
```

## 🎯 MVVM Architecture Benefits

### **Models** (`/models`)

- **Purpose**: Define data structures and interfaces
- **Responsibilities**:
  - Type definitions for entities (User, Submissions, etc.)
  - Data contracts between layers
  - No business logic or UI concerns

### **Views** (`/views`)

- **Purpose**: Pure UI components focused on presentation
- **Responsibilities**:
  - Render UI elements
  - Handle user interactions
  - Receive data from ViewModels
  - No direct data access or business logic

### **ViewModels** (`/viewmodels`)

- **Purpose**: Business logic and state management
- **Responsibilities**:
  - Manage component state
  - Handle business operations
  - Coordinate with Services
  - Provide data to Views
  - Input validation and processing

### **Services** (`/services`)

- **Purpose**: Data access and external operations
- **Responsibilities**:
  - localStorage operations
  - API calls (when backend is added)
  - Data persistence
  - External service integration

### **Utils** (`/utils`)

- **Purpose**: Shared utility functions
- **Responsibilities**:
  - Validation helpers
  - Date formatting
  - File operations
  - Common calculations

## 🚀 Key Improvements

### **1. Separation of Concerns**

- Each layer has a single responsibility
- Business logic separated from UI
- Data access isolated in services

### **2. Reusability**

- ViewModels can be reused across different views
- Services can be shared between components
- Utility functions are centralized

### **3. Testability**

- ViewModels can be unit tested independently
- Services can be mocked for testing
- Views can be tested with mock ViewModels

### **4. Maintainability**

- Changes in one layer don't affect others
- Easy to locate and fix issues
- Clear code organization

### **5. Type Safety**

- Strong TypeScript typing throughout
- Interface-based contracts
- Compile-time error detection

## 🔄 Data Flow

```
User Interaction → View → ViewModel → Service → Data Store
                     ↑        ↑         ↑
                    UI    Business    Data
                         Logic      Access
```

## 🎨 Component Usage Examples

### **Using AuthViewModel in a View**

```tsx
import { useAuthViewModel } from "../viewmodels";

function LoginView() {
  const authViewModel = useAuthViewModel();

  return (
    <LoginForm
      onLogin={authViewModel.login}
      isLoading={authViewModel.isLoading}
      error={authViewModel.error}
    />
  );
}
```

### **Using StudentViewModel**

```tsx
import { useStudentViewModel } from "../viewmodels";

function StudentDashboard({ user }) {
  const viewModel = useStudentViewModel(user.id);

  return (
    <Dashboard
      stats={viewModel.stats}
      submissions={viewModel.submissions}
      onSubmit={viewModel.submitBloodDonation}
    />
  );
}
```

## 🛠️ Migration from Context-based Architecture

The original context-based architecture has been refactored to MVVM:

- **AppContext** → Split into **ViewModels** and **Services**
- **Component logic** → Moved to **ViewModels**
- **Data operations** → Moved to **Services**
- **UI components** → Simplified to pure **Views**

## 📋 Usage Instructions

1. **To use the MVVM version**: Replace `App.tsx` with `App-MVVM.tsx`
2. **Import components**: Use central exports from each layer
3. **Add new features**: Follow the MVVM pattern
4. **Testing**: Test each layer independently

## 🎯 Best Practices

1. **Keep Views Pure**: No business logic in UI components
2. **Single Responsibility**: Each ViewModel handles one domain
3. **Type Everything**: Use TypeScript interfaces consistently
4. **Error Handling**: Handle errors at ViewModel level
5. **Loading States**: Manage loading in ViewModels
6. **Validation**: Use utility functions for validation

This MVVM architecture provides a solid foundation for scaling the NSS project while maintaining clean, testable, and maintainable code.
