import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { LoginRequest } from "@/types";
import { AuthApi } from "@/api/auth-api";

type AuthCtx = {
    authenticated: boolean;
    login: (payload: LoginRequest) => void;
    logout: () => void;
    userId: number;
    username: string;
    name: string;
    email: string;
    photoUrl: string;
    update: boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthCtx>({
    authenticated: false,
    login: () => { },
    logout: () => { },
    userId: 0,
    username: '',
    name: '',
    email: '',
    photoUrl: '',
    update: false,
    setUpdate: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [userId, setUserId] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [update, setUpdate] = useState(false);
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        const verifyUser = async () => {
            setLoading(true);
            try {
                const user = await AuthApi.checkAuth();
                if (user) {
                    setAuthenticated(true);
                    setName(user.body.full_name ?? '');
                    setUserId(Number(user.body.id));
                    setUsername(user.body.username);
                    setPhotoUrl(user.body.profile_photo_path);
                    setEmail(user.body.email);
                }
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }

        verifyUser();
    }, [update]);

    const login = async (payload: LoginRequest) => {
        await AuthApi.login(payload);
        setUpdate(prev => !prev);
    }

    const logout = async () => {
        try {
            await AuthApi.logout();
        } catch (error) {
            console.error(error);
        }
        setAuthenticated(false);
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