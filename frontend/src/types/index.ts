export type Response = {
    success: boolean;
    message: string;
}

export type AuthCheckResponse = Response & {
    body: {
        id: number;
        username: string;
        email: string;
        profile: {
            name: string;
            photo_url: string | null;
        } | null;
    }
}

export type LoginRequest = {
    username: string;
    password: string;
}

export type LoginPayload = {
    username: string;
    password: string;
}

export type LoginResponse = Response & {
    body: {
        token: string
    }
}

export type RegisterPayload = {
    username: string;
    email: string;
    name: string;
    password: string;
}