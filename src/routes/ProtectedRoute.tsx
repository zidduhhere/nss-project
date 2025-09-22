import { Navigate, useLocation } from 'react-router-dom';
import { ComponentType, Suspense } from 'react';
import { UseAuthContext } from '@/context/AuthContext';
import { GlobalLoader } from '@/components/common/GlobalLoader';

interface ProtectedRouteProps {
    component: ComponentType<any>;
    roles?: Array<'student' | 'unit' | 'admin'>;
    [key: string]: any;
}

export default function ProtectedRoute({ component: Component, roles, ...rest }: ProtectedRouteProps) {
    const { role, session, loading, logoutUser } = UseAuthContext();
    const location = useLocation();

    // Show loading indicator while checking authentication
    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nss-500"></div>
        </div>;
    }

    // Redirect to login if not authenticated
    if (session === null) {
        console.log("No active session, redirecting to login.");
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Redirect to home if user doesn't have required role
    if (roles && role && !roles.includes(role.role)) {
        console.log(`User has role ${role.role} but needs one of ${roles.join(', ')}`);
        return <Navigate to="/home" replace />;
    }

    // Render the protected component with its own Suspense boundary
    console.log("Rendering protected component for role:", role);
    return (
        <Suspense fallback={<GlobalLoader />}>
            <Component role={role?.role} onLogout={logoutUser} {...rest} />
        </Suspense>
    );
}
