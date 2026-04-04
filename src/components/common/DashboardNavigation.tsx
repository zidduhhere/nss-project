import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, Menu, X, LogOut } from 'lucide-react';
import { UseAuthContext } from '@/context/AuthContext';
import images from '@/assets/images';
import { FilledButton, OutlinedButton } from '../ui';
interface DashboardNavigationProps {
    mode: 'student' | 'unit' | 'admin';
}

const DashboardNavigation = ({ mode }: DashboardNavigationProps) => {
    const navigate = useNavigate();
    const { logoutUser } = UseAuthContext();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Navigation items based on mode
    const getNavItems = () => {
        if (mode === 'student') {
            return [
                { name: 'Dashboard', path: '/dashboard/student', tourId: 'nav-dashboard' },
                { name: 'Volunteer Registration', path: '/dashboard/student/volunteer-registration', tourId: 'nav-volunteer-registration' },
                { name: 'Submit Certificate', path: '/dashboard/student/submit', tourId: 'nav-submit-certificate' },
            ];
        } else if (mode === 'admin') {
            return [
                { name: 'Dashboard', path: '/dashboard/admin', tourId: 'nav-dashboard' },
                { name: 'Volunteers', path: '/dashboard/admin/volunteers', tourId: 'nav-volunteers' },
                { name: 'Submissions', path: '/dashboard/admin/submissions', tourId: 'nav-submissions' },
                { name: 'Activities', path: '/dashboard/admin/activities', tourId: 'nav-activities' },
                { name: 'Users', path: '/dashboard/admin/users', tourId: 'nav-users' },
            ];
        } else {
            return [
                { name: 'Dashboard', path: '/dashboard/unit', tourId: 'nav-dashboard' },
                { name: 'Volunteers', path: '/dashboard/unit/volunteer', tourId: 'nav-volunteers' },
                { name: 'Submissions', path: '/dashboard/unit/submissions', tourId: 'nav-submissions' },
                { name: 'Activities', path: '/dashboard/unit/activities', tourId: 'nav-activities' },
            ];
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login', { replace: true });
    };



    const handleProfile = () => {
        const profilePath = mode === 'student'
            ? '/dashboard/student/profile'
            : mode === 'admin'
            ? '/dashboard/admin/profile'
            : '/dashboard/unit/profile';
        navigate(profilePath);
    };

    // Mobile drawer handlers
    const closeDrawer = () => setIsDrawerOpen(false);
    const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

    // Close on Escape and lock body scroll when open
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeDrawer();
        };
        if (isDrawerOpen) {
            document.addEventListener('keydown', onKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [isDrawerOpen]);

    // Styling classes
    const baseItem = 'px-3 py-2 rounded-full text-sm font-medium transition-colors';
    const linkInactive = 'text-white/70 hover:text-white hover:bg-white/5';
    const linkActive = 'text-white bg-white/10';

    return (
        <nav className="bg-transparent py-4">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-6">
                <div className="flex items-center justify-between bg-black border  rounded-2xl px-2 py-2">
                    <img src={images.logo} width={60} height={60} className='' />
                    {/* Mobile: Hamburger */}
                    <button
                        type="button"
                        onClick={toggleDrawer}
                        aria-controls="mobile-drawer"
                        aria-expanded={isDrawerOpen}
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        <Menu className="size-6" />
                        <span className="sr-only">Open navigation menu</span>
                    </button>

                    {/* Desktop: Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {getNavItems().map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                data-tour={item.tourId}
                                className={({ isActive }) =>
                                    `${baseItem} ${isActive ? linkActive : linkInactive}`
                                }
                                end
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop: Right side buttons */}
                    <div className="hidden md:flex gap-4 px-6 justify-end">
                        {/* Profile Button */}
                        <button
                            type="button"
                            className="px-3 py-2 rounded-full text-sm font-medium transition-colors text-white/70 hover:text-white hover:bg-white/5 border border-white/80"
                            onClick={handleProfile}
                            title="Profile"
                        >
                            <User className="size-4" />
                        </button>

                        {/* Logout Button */}
                        <FilledButton
                            size='md'
                            className='px-3 py-2 rounded-full text-sm font-medium transition-colors bg-red-600 hover:bg-red-500 flex items-center gap-2'
                            onClick={handleLogout}
                        >
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </FilledButton>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className={`md:hidden fixed inset-0 z-50 ${isDrawerOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeDrawer}
                />

                {/* Drawer Panel */}
                <aside
                    id="mobile-drawer"
                    role="dialog"
                    aria-modal="true"
                    className={`absolute right-0 top-0 h-full w-72 max-w-[85%] bg-black shadow-xl   transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <img src={images.logo} alt="NSS" className="size-8" />
                            <span className="font-semibold text-md text-white">Menu</span>
                        </div>
                        <button
                            type="button"
                            onClick={closeDrawer}
                            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10"
                            aria-label="Close menu"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Drawer Content: Nav Links */}
                    <div className="flex flex-col justify-between px-3 py-6 h-[calc(100%-60px)] overflow-y-auto">
                        <nav className="flex flex-col gap-1 w-full">
                            {getNavItems().map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeDrawer}
                                    className={({ isActive }) =>
                                        `font-isans px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        }`
                                    }
                                    end
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="mt-6 border-t border-white/10 pt-4 flex flex-col w-full items-center gap-3">
                            <OutlinedButton
                                size='md'
                                className='flex flex-row w-full justify-center gap-2'
                                loadingText='Loading...'
                                onClick={() => { closeDrawer(); handleProfile(); }}
                            >
                                <User className="size-5" />
                                Profile
                            </OutlinedButton>
                            <FilledButton
                                size='md'
                                className='flex flex-row gap-2 w-full justify-center bg-red-600 hover:bg-red-500'
                                onClick={() => { closeDrawer(); handleLogout(); }}
                            >
                                <LogOut className="size-5" />
                                Logout
                            </FilledButton>
                        </div>
                    </div>
                </aside>
            </div >
        </nav >
    );
};

export default DashboardNavigation;