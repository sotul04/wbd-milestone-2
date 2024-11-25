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
        profile_photo_path: string;
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

export type GetUsersPayload = {
    search?: string;
}

export type GetUsersResponse = Response & {
    body: {
        id: string;
        email: string;
        full_name: string;
        work_history: string | null;
        profile_photo_path: string | null;
    }[]
}

export type ConnectionSendPayload = {
    to: number;
}

export type ConnectionSendResponse = Response & {
    body: null;
}

export type ConnectionDeletePayload = {
    to: string;
}

export type ConnectionDeleteResponse = ConnectionSendResponse

export type ConnectionConnectPayload = {
    to: number;
    accept: boolean;
}

export type ConnectionConnectResponse = ConnectionDeleteResponse;

export type ConnectionRequestsResponse = Response & {
    body: {
        from_id: string;
        to_id: string;
        from_user: {
            username: string;
            email: string;
            full_name: string;
            profile_photo_path: string | null;
        };
        created_at: Date;
    }[];
}

export type ConnectionListPayload = {
    userId: string;
}

export type ConnectionListResponse = Response & {
    body: {
        id: string;
        username: string;
        email: string;
        full_name: string;
        profile_photo_path: string | null;
    }[];
}

export type ProfileUpdatePayload = {
    userId: string;
    username?: string;
    name?: string | null;
    skills?: string | null;
    work_history?: string | null;
    delete_photo?: boolean;
    profilePhotoFile?: File;
}

export type ProfileUpdateResponse = ConnectionConnectResponse;

export type GetProfilePayload = {
    userId: string
}

export type GetProfileResponse = Response & {
    body: {
        name: string;
        username: string;
        work_history?: string | null;
        skills?: string | null;
        profile_photo?: string | null;
        relevant_posts?: {
            id: string;
            created_at: Date;
            updated_at: Date;
            content: string;
            user_id: string;
        }[] | null;
        connection_count: number;
        connect_status?: string | null;
    }
}