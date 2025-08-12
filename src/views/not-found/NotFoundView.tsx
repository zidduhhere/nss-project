import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';

export default function NotFoundView() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-7xl font-bold text-nss-text mb-4">404</h1>
                <p className="text-nss-text-secondary mb-8 max-w-md">The page you're looking for doesn't exist or was moved.</p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/hom')} className="px-6 py-3 rounded-lg bg-nss-600 text-white hover:bg-nss-700 transition">Go Home</button>
                    <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg border border-nss-300 text-nss-text hover:bg-nss-50 transition">Go Back</button>
                </div>
            </main>
            <footer className="py-6 text-center text-sm text-nss-text-secondary">© {new Date().getFullYear()} NSS Portal</footer>
        </div>
    );
}
