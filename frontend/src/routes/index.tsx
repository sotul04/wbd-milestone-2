import { Outlet, RouteObject, createBrowserRouter, useLocation } from "react-router-dom";

import {
    Login,
    Home,
    NotFound,
    Unauthorized,
    Register,
    Chat,
    Connections,
    Feed,
    Profile,
    Requests,
    Users
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
                path: "/chat",
                element: <ProtectedRoute redirectTo="/login">
                    <Chat/>
                </ProtectedRoute>
            },
            {
                path: "/connections/:userId",
                element: <Connections/>
            },
            {
                path: "/feed",
                element: <ProtectedRoute redirectTo="/login">
                    <Feed/>
                </ProtectedRoute>
            },
            {
                path: "/profile/:userId",
                element: <Profile/>
            },
            {
                path: "/requests",
                element: <ProtectedRoute redirectTo="/login">
                    <Requests/>
                </ProtectedRoute>
            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: '/unauthorized',
                element: <Unauthorized />
            }
        ],
    }
];

export const router = createBrowserRouter(routes);