import { Outlet, RouteObject, createBrowserRouter, useLocation } from "react-router-dom";

import {
    Login,
    Home,
    NotFound,
    Unauthorized,
    Register,
    Chats,
    Connections,
    Feed,
    FeedDetail,
    Profile,
    Requests,
    Users,
    UserChat,
    ChatUnaccessible
} from "@/pages";

import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/nav/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "@/context/ChatContext";

const queryClient = new QueryClient();

const AuthProviderLayout = () => {
    const location = useLocation();
    const hideHeaderRoutes = ["/unauthorized", "/login", "/register"];
    const hideHeader = hideHeaderRoutes.includes(location.pathname);

    return <QueryClientProvider client={queryClient}>
        <SocketProvider>
            <AuthProvider>
                {!hideHeader && <Header />}
                <Outlet />
            </AuthProvider>
        </SocketProvider>
    </QueryClientProvider>
}

const routes: RouteObject[] = [
    {
        path: "/",
        element: <AuthProviderLayout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />
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
                    <Chats />
                </ProtectedRoute>
            },
            {
                path: "/chat/:roomId",
                errorElement: <ChatUnaccessible/>,
                element: <ProtectedRoute redirectTo="/login">
                    <UserChat />
                </ProtectedRoute>
                
            },
            {
                path: "/connections/:userId",
                element: <Connections />
            },
            {
                path: "/feed",
                element: <ProtectedRoute redirectTo="/login">
                    <Feed />
                </ProtectedRoute>
            },
            {
                path: "/feed/:postId",
                element: <ProtectedRoute redirectTo="/login">
                    <FeedDetail />
                </ProtectedRoute>
            },
            {
                path: "/profile/:userId",
                element: <Profile />
            },
            {
                path: "/requests",
                element: <ProtectedRoute redirectTo="/login">
                    <Requests />
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