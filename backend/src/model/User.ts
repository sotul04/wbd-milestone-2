export type User = {
    id: bigint;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
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
}

export type UserFindUnique = {
    username?: string;
    email?: string;
}

export type UserFindId = {
    id: bigint;
}

export type UserAuth = {
    username: string;
    password: string;
}