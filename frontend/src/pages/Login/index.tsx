import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/axiosInstance";
import { useState } from "react";
import * as Auth from '@/lib/cookies';

interface LoginResponse {
    success: boolean;
    message: string;
    body: {
        token: string;
    };
}

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function handleLogin() {
        const response = await apiClient.post<LoginResponse>("/login", {
            username: email,
            password
        })

        if (response.status === 200) {
            console.log('Login success');
            console.log(response.data);
            console.log(response.config);
            const token = response.data.body.token;
            Auth.login(token);
        } else {
            console.log('Error');
        }
    }

    function handleLogout() {
        Auth.logout();
        console.log("Logout");
    }

    function seeToken() {
        console.log(Auth.getToken());
    }

    async function tryAuth() {
        const response = await apiClient.get("/verify");
        if (response.status === 200) {
            console.log(response.data);
        }
    }

    return <>
        <div>
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={seeToken}>See Token</Button>
            <Button onClick={tryAuth}>try Auth</Button>
            </div>

        </div>
    </>;
}