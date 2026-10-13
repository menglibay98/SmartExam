import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole: "ADMIN" | "TEACHER" | "STUDENT";
}

function ProtectedRoute({
    children,
    allowedRole
}: ProtectedRouteProps) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {

        if (role === "ADMIN") {
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );
        }

        if (role === "TEACHER") {
            return (
                <Navigate
                    to="/teacher/dashboard"
                    replace
                />
            );
        }

        if (role === "STUDENT") {
            return (
                <Navigate
                    to="/student/dashboard"
                    replace
                />
            );
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;