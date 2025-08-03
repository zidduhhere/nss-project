import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView, RegisterView } from './views/auth';
import StudentDashboard from './components/student/StudentDashboard';
import FacultyDashboard from './components/faculty/FacultyDashboard';

function AppContent() {
  const { user, isAuthenticated } = useApp();
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {showRegister ? (
          <RegisterView onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginView onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nss-50">
      {user?.role === 'student' ? <StudentDashboard /> : <FacultyDashboard />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="font-sans antialiased">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;