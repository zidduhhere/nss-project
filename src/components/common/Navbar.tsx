import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { appRoutes } from '@/routes/routeConfig';
import { X, Menu } from 'lucide-react';
import { OutlinedButton, FilledButton } from '../ui';
import ProfilePlaceholder from '../ui/ProfilePlaceholder';
import images from '@/assets/images';

interface NavbarProps {
    user?: {
        name: string;
        role: string;
    };
}

export default function Navbar({ }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = appRoutes.filter(r => r.nav).map(r => ({ name: r.label!, path: r.path }));
    const moreLinks = [
        { name: 'Blog', path: '/blog' },
        { name: 'Website Team', path: '/website-team' },
        { name: 'Contact Us', path: '/contact' }
    ];
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        };
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, []);

    return (
        <nav className="bg-transparent py-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6">
                <div className="bg-black border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                                    <img src={images.logo} alt='logo' />
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation (visible only on large screens) */}
                        <div className="hidden lg:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {(navLinks).map((link) => {
                                    const active = location.pathname === link.path;
                                    return (
                                        <button
                                            key={link.name}
                                            onClick={() => navigate(link.path)}
                                            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                        >
                                            {link.name}
                                        </button>
                                    );
                                })}
                                {/* More dropdown */}
                                <div className="relative" ref={moreRef}>
                                    <button
                                        onClick={() => setMoreOpen(o => !o)}
                                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${moreLinks.some(l => l.path === location.pathname) ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                    >
                                        More
                                    </button>
                                    {moreOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-black border border-white/10 rounded-xl shadow-lg py-2 z-50">
                                            {moreLinks.map(l => (
                                                <button
                                                    key={l.path}
                                                    onClick={() => { navigate(l.path); setMoreOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-sm transition ${location.pathname === l.path ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                                >
                                                    {l.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons (desktop only) */}
                        <div className="hidden lg:flex items-center space-x-3">
                            {
                                isLoggedIn ?
                                    <div className='hidden lg:flex items-center space-x-3'>
                                        <OutlinedButton
                                            onClick={() => navigate('/login')}
                                            size="md"
                                        >
                                            Sign In
                                        </OutlinedButton>
                                        <FilledButton
                                            onClick={() => navigate('/register')}
                                            size="md"
                                            variant="lightNss"
                                        >
                                            Sign Up
                                        </FilledButton>
                                    </div>
                                    : <div className='hidden lg:flex items-center space-x-3'>
                                        <ProfilePlaceholder size="sm" />
                                        <OutlinedButton
                                            onClick={() => navigate('/login')}
                                            size="md"
                                        >
                                            Logout
                                        </OutlinedButton>
                                    </div>
                            }



                        </div>

                        {/* Drawer trigger (shown on mobile & tablet) */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-white/70 hover:text-white p-2"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drawer for mobile & tablet */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>

                    {/* Side Menu */}
                    <div className="fixed top-0 right-0 w-80 h-full bg-black/95 backdrop-blur-lg border-l border-white/10 transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">NSS</span>
                                    </div>
                                    <span className="text-white font-semibold">Menu</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-white/70 hover:text-white p-2"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 px-6 py-4 space-y-2">
                                {navLinks.map(link => {
                                    const active = location.pathname === link.path;
                                    return (
                                        <button
                                            key={link.name}
                                            onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                                            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${active ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                        >
                                            {link.name}
                                        </button>
                                    );
                                })}
                                {/* More group (mobile) */}
                                <div className="pt-4 border-t border-white/10">
                                    <div className="px-4 pb-2 text-xs uppercase tracking-wide text-white/40">More</div>
                                    {moreLinks.map(l => {
                                        const active = location.pathname === l.path;
                                        return (
                                            <button
                                                key={l.name}
                                                onClick={() => { navigate(l.path); setIsMobileMenuOpen(false); }}
                                                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${active ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                            >
                                                {l.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 border-t border-white/10 space-y-3">
                                <OutlinedButton
                                    onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                                    size="lg"
                                    className="w-full"
                                >
                                    Sign In
                                </OutlinedButton>
                                <FilledButton
                                    onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}
                                    size="lg"
                                    variant="lightNss"
                                    className="w-full"
                                >
                                    Sign Up
                                </FilledButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
