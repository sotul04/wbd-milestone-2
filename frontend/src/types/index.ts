export type Response = {
    success: boolean;
    message: string;
}

export type AuthCheckResponse = Response & {
    body: {
        username: string;
        email: string;
        id: number;
        full_name: string;
        profile_photo_path: string | null;
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