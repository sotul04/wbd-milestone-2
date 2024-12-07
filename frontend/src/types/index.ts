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
        can_connect?: boolean;
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
            full_name: string | null;
            profile_photo_path: string;
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
        full_name: string | null;
        profile_photo_path: string;
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
        profile_photo?: string;
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

export type UserProfile = {
    name: string;
    username: string;
    work_history?: string | null;
    skills?: string | null;
    profile_photo?: string;
    relevant_posts?: {
        id: string;
        created_at: Date;
        updated_at: Date;
        content: string;
        user_id: string;
    }[] | null;
    connection_count: number;
    connect_status?: string | null;
};

export type UserEditProfile = {
    name: string;
    username: string;
    work_history: string;
    skills: string;
};

export type GetUserChatsPayload = {
    userId: string
}

export type GetUserChatsResponse = Response & {
    body: {
        first_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
        second_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
        id: string;
        updated_at: Date;
        last_message: string | null;
    }[]
}

export type LoadChatPayload = {
    roomId: string;
    cursor?: Date | null;
}

export type LoadChatResponse = {
    body: {
        messages: {
            from_id: string;
            to_id: string;
            message: string;
            timestamp: Date;
        }[];
        nextCursor: Date | null;
    }
}

export type Message = {
    from_id: string;
    to_id: string;
    message: string;
    timestamp: Date;
}

export type RoomChatSearchPayload = {
    roomId: string
}

export type RoomChatSearchResponse = Response & {
    body: {
        first_user_id: string;
        second_user_id: string;
        first_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
        second_user: {
            id: string;
            full_name: string | null;
            profile_photo_path: string;
        };
    }
}

export type Feed = {
    id: number;
    name?: string;
    title?: string;
    created_at: Date;
    updated_at: Date;
    content: string;
    user_id: string;
    likes?: number;
    comments?: number;
}

export type UserProps = {
    id: string;
    username: string;
    email: string;
    full_name: string | null;
    profile_photo_path: string;
}

export type GetFeedsPayload = {
    cursor?: string | null;
    limit: number;
}

export type GetFeedsResponse = Response & {
    body: {
        feeds: {
            id: string;
            user_id: string;
            content: string;
            user: {
                full_name: string | null;
                profile_photo_path: string;
            };
            created_at: Date;
            updated_at: Date;
        }[];
        nextCursor: string | null;
        cursor: bigint | undefined;
    }
}

export interface FeedSchema {
    id: string;
    user_id: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}

export type CreateFeedPayload = {
    content: string
}

export type CreateFeedResponse = Response & {
    body: {
        id: string;
        user_id: string;
        content: string;
        created_at: Date;
        updated_at: Date;
    }
}

export type ReadFeedPayload = Response & {
    id: number | string;
}

export type ReadFeedResponse = Response & {
    body: {
        id: string;
        user_id: string;
        content: string;
        user: {
            full_name: string | null;
            profile_photo_path: string;
        };
        created_at: Date;
        updated_at: Date;
    }
}

export type UpdateFeedPayload = {
    id: number | string;
    content: string;
}

export type UpdateFeedResponse = CreateFeedResponse;

export type DeleteFeedPayload = {
    id: number;
}

export type DeleteFeedResponse = Response & {
    body: null;
};
