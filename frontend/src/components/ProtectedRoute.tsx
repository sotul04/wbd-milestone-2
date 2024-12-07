import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo: string;
    invert?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo, invert = false }) => {
    const { authenticated } = useAuth();
    const location = useLocation();

    if (!invert && !authenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    if (invert && authenticated) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute;