// import { useState } from 'react';
// import { AppProvider, useApp } from './context/AppContext';
// import LoginForm from './components/forms/LoginForm';
// import RegisterForm from './components/forms/RegisterForm';
// import StudentDashboard from './components/student/StudentDashboard';
// import UnitDashboard from './components/unit/UnitDashboard';

// function AppContent() {
//   const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
//   const { user, isAuthenticated, isLoading } = useApp();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-2 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return authMode === 'login' ? (
//       <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
//     ) : (
//       <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
//     );
//   }

//   if (user?.role === 'student') {
//     return <StudentDashboard />;
//   }

//   if (user?.role === 'unit') {
//     return <UnitDashboard />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <p className="text-gray-600">Invalid user role</p>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <AppProvider>
//       <AppContent />
//     </AppProvider>
//   );
// }

// export default App;