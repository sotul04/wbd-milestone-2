import { Outlet, RouteObject, createBrowserRouter, useLocation } from "react-router-dom";

import {
    Login,
    Home,
    NotFound,
    Unauthorized,
    Register
} from "@/pages";

import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/nav/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

const AuthProviderLayout = () => {
    const location = useLocation();
    const hideHeaderRoutes = ["/unauthorized", "/login", "/register"];
    const hideHeader = hideHeaderRoutes.includes(location.pathname);

    return <>
        <AuthProvider>
            {!hideHeader && <Header />}
            <Outlet />
        </AuthProvider>
    </>
}

const routes: RouteObject[] = [
    {
        path: "/",
        element: <AuthProviderLayout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/login",
                element: <ProtectedRoute redirectTo="/" invert>
                    <Login />
                </ProtectedRoute>
            },
            {
                path: "/register",
                element: <ProtectedRoute redirectTo="/" invert>
                    <Register />
                </ProtectedRoute>
            },
            {
                path: '/unauthorized',
                element: <Unauthorized />
            }
        ],
    }
];

export const router = createBrowserRouter(routes);