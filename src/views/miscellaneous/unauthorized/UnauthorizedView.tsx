import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import { UseAuthContext } from '@/context/AuthContext';

export default function UnauthorizedView() {
    const navigate = useNavigate();
    const { role } = UseAuthContext();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="mb-8 text-nss-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V6a3 3 0 00-3-3H9a3 3 0 00-3 3v12a3 3 0 003 3h6a3 3 0 003-3V9a3 3 0 00-3-3h-3m-3 0H9" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-nss-text mb-4">Unauthorized Access</h1>
                <p className="text-nss-text-secondary mb-8 max-w-md">
                    You don't have permission to access this page. This area is restricted to users with specific roles.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                    {role ? (
                        <button
                            onClick={() => navigate(role.role === 'student' ? '/dashboard/student' : '/dashboard/unit')}
                            className="px-6 py-3 rounded-lg bg-nss-600 text-white hover:bg-nss-700 transition"
                        >
                            Go to My Dashboard
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 rounded-lg bg-nss-600 text-white hover:bg-nss-700 transition"
                        >
                            Log In
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 rounded-lg border border-nss-300 text-nss-text hover:bg-nss-50 transition"
                    >
                        Go to Home Page
                    </button>
                </div>
            </main>
            <footer className="py-6 text-center text-sm text-nss-text-secondary">© {new Date().getFullYear()} NSS Portal</footer>
        </div>
    );
}