import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ComponentType } from 'react';

interface ProtectedRouteProps {
    component: ComponentType<any>;
    roles?: Array<'student' | 'unit' | 'admin'>;
    [key: string]: any;
}

export default function ProtectedRoute({ component: Component, roles, ...rest }: ProtectedRouteProps) {
    const { user, isLoading, signOut } = useAuth();
    const isAuthenticated = !!user;
    const location = useLocation();

    // Show loading indicator while checking authentication
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nss-500"></div>
        </div>;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to home if user doesn't have required role
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/home" replace />;
    }

    // Render the protected component
    return <Component user={user} onLogout={signOut} {...rest} />;
}
