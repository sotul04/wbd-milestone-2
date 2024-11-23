import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";

import { 
    Login,
    Home, 
} from "@/pages";

import { AuthProvider } from "@/context/AuthContext";
import React from "react";
import Header from "@/components/nav/Header";

const AuthProviderLayout = () => {
    return <>
        <AuthProvider>
            <Header/>
            <Outlet/>
        </AuthProvider>
    </>
}

const routes: RouteObject[] = [
    {
        path: "/",
        element: <AuthProviderLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login/>
            }
        ],
    }
];

export const router = createBrowserRouter(routes);