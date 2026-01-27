import { Navigate, Outlet } from "react-router-dom";

interface RequireRoleProps {
    role: "admin" | "shop_owner" | "customer";
}

export default function RequireRole({ role }: RequireRoleProps) {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user || user.role !== role) {
        // Optionally redirect to a specific unauthorized page or home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
