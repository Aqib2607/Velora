import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: 'seller' | 'admin';
}

/**
 * Wraps routes that require specific authentication or authorization logic.
 * Currently utilizes placeholder logic pending global Auth context implementation.
 */
const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    // TODO: Replace with absolute authentication logic (e.g., Zustand authStore or React Query)
    const isAuthenticated = true;
    const userRole: string = 'admin'; // 'guest', 'seller', 'admin'

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Very basic RBAC fallback
    if (role === 'admin' && userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    if (role === 'seller' && userRole !== 'seller' && userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
