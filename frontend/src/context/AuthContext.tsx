import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { LoginRequest } from "@/types";
import * as Auth from "@/lib/cookies";
import { AuthApi } from "@/api/auth-api";

type AuthCtx = {
    authenticated: boolean;
    login: (payload: LoginRequest) => void;
    logout: () => void;
    userId: number;
    username: string;
    name: string;
    email: string;
    photoUrl: string | null;
    update: boolean;
    setUpdate: (prop: boolean) => void
}

const AuthContext = createContext<AuthCtx>({
    authenticated: false,
    login: () => { },
    logout: () => { },
    userId: 0,
    username: '',
    name: '',
    email: '',
    photoUrl: null,
    update: false,
    setUpdate: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [userId, setUserId] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [update, setUpdate] = useState(false);
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        const verifyUser = async () => {
            setLoading(true);

            if (Auth.getToken()) {
                try {
                    const user = await AuthApi.checkAuth();
                    if (user) {
                        setAuthenticated(true);
                        setName(user.body.full_name ?? '');
                        setUserId(user.body.id);
                        setUsername(user.body.username);
                        setPhotoUrl(user.body.profile_photo_path ?? null);
                        setEmail(user.body.email);
                    }
                } catch (error) {
                    Auth.logout();
                }
            }
            setLoading(false);
        }

        verifyUser();
    }, [update]);

    const login = async (payload: LoginRequest) => {
        try {
            const auth = await AuthApi.login(payload);
            setUpdate(false);
            Auth.login(auth.body.token);
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        setAuthenticated(false);
        Auth.logout();
    }

    if (loading) return null;

    return <>
        <AuthContext.Provider
            value={{ authenticated, userId, username, name, email, photoUrl, login, logout, setUpdate, update }}
        >
            {children}
        </AuthContext.Provider>
    </>
}

export const useAuth = () => {
    return useContext(AuthContext);
}