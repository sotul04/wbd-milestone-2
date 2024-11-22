import { FeedSerializable } from "./Feed";

export type User = {
    id: bigint;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export type UserProfile = {
    name: string;
    description: string;
    profile_photo?: string | null;
    relevant_posts?: FeedSerializable[] | null;
    connection_count: number;
    experiences?: string | null;
    skills?: string | null;
    connect_status?: boolean | null;
}

export type UserCreate = {
    username: string;
    email: string;
    name: string;
    password: string;
}

export type UserUpdate = {
    id: bigint;
    email?: string;
    name?: string;
    description?: string;
    profile_photo?: Express.Multer.File;
    skills?: string;
    experiences?: string;
}

export type UserFindUnique = {
    username?: string;
    email?: string;
}

export type UserFindId = {
    id: bigint;
}

export type UserFindConnection = {
    idClient: bigint;
    idTarget: bigint;
}

export type UserAuth = {
    username: string;
    password: string;
}