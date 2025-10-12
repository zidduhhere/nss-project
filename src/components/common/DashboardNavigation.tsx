import { NavLink, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { UseAuthContext } from '@/context/AuthContext';
import images from '@/assets/images';
interface DashboardNavigationProps {
    mode: 'student' | 'unit';
}

const DashboardNavigation = ({ mode }: DashboardNavigationProps) => {
    const navigate = useNavigate();
    const { logoutUser } = UseAuthContext();

    // Navigation items based on mode
    const getNavItems = () => {
        if (mode === 'student') {
            return [
                { name: 'Dashboard', path: '/dashboard/student' },
                { name: 'Volunteer Registration', path: '/dashboard/student/volunteer-registration' },
                { name: 'Submit Certificate', path: '/dashboard/student/certificates' },
            ];
        } else {
            return [
                { name: 'Dashboard', path: '/dashboard/unit' },
                { name: 'Volunteers', path: '/dashboard/unit/volunteer' },
                { name: 'Submissions', path: '/dashboard/unit/submissions' },
                { name: 'Activity', path: '/dashboard/unit/activity' }

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
            : '/dashboard/unit/profile';
        navigate(profilePath);
    };

    // Styling classes
    const baseItem = 'px-3 py-2 rounded-full text-sm font-medium transition-colors';
    const linkInactive = 'text-white/70 hover:text-white hover:bg-white/5';
    const linkActive = 'text-white bg-white/10';

    return (
        <nav className="bg-transparent py-4">
            <img src={images.logo} width={60} height={60} className='absolute top-4 left-2' />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-6">
                <div className="flex  items-center justify-between bg-black border border-white/10 rounded-2xl px-2 py-2">

                    {/* Navigation Links */}
                    <div className=" flex  items-center gap-1 justify-end">
                        {getNavItems().map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `${baseItem} ${isActive ? linkActive : linkInactive}`
                                }
                                end
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side buttons */}
                    <div className="flex  gap-4 justify-end ">
                        {/* Profile Button */}
                        <button
                            type="button"
                            className="px-3 py-2 rounded-full text-sm font-medium transition-colors text-white/70 hover:text-white hover:bg-white/5 border border-white/80"
                            onClick={handleProfile}
                            title="Profile"
                        >
                            <User className="h-4 w-4" />
                        </button>

                        {/* Logout Button */}
                        <button
                            type="button"
                            className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-500 transition-colors"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default DashboardNavigation;