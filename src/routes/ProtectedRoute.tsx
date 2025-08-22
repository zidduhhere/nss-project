import { Navigate, useLocation } from 'react-router-dom';
import { useMasterAuth } from '@/context/MasterAuthContext';
import { ComponentType } from 'react';

interface ProtectedRouteProps {
    component: ComponentType<any>;
    roles?: Array<'student' | 'unit'>;
    [key: string]: any;
}

export default function ProtectedRoute({ component: Component, roles, ...rest }: ProtectedRouteProps) {
    const { currentUser: user, logout } = useMasterAuth();
    const isAuthenticated = !!user;
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/hom" replace />;
    }

    return <Component user={user} onLogout={logout} {...rest} />;
}
