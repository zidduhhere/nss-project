import { useState } from 'react';
import { useAuthViewModel } from './viewmodels';
import { LoginForm, RegisterForm, StudentDashboard, FacultyDashboard, LoadingSpinner } from './views';

function App() {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const authViewModel = useAuthViewModel();

    // Show loading spinner during initial load
    if (authViewModel.isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" message="Loading..." />
            </div>
        );
    }

    // Show authentication forms if not authenticated
    if (!authViewModel.isAuthenticated) {
        return authMode === 'login' ? (
            <LoginForm
                onLogin={authViewModel.login}
                onSwitchToRegister={() => setAuthMode('register')}
                isLoading={authViewModel.isLoading}
                error={authViewModel.error}
            />
        ) : (
            <RegisterForm
                onRegister={authViewModel.register}
                onSwitchToLogin={() => setAuthMode('login')}
                isLoading={authViewModel.isLoading}
                error={authViewModel.error}
            />
        );
    }

    // Show appropriate dashboard based on user role
    if (authViewModel.user?.role === 'student') {
        return <StudentDashboard user={authViewModel.user} onLogout={authViewModel.logout} />;
    }

    if (authViewModel.user?.role === 'faculty') {
        return <FacultyDashboard user={authViewModel.user} onLogout={authViewModel.logout} />;
    }

    // Fallback for invalid user role
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600">Invalid user role</p>
                <button
                    onClick={authViewModel.logout}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default App;
