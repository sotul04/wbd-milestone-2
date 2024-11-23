import { z } from 'zod';

// /api/connection?search=:query
export type UsersGet = {
    search?: string;
}

export const usersGetQuery = z.object({
    search: z.string().optional(),
});

// /api/connection/send
export type ConnectionSend = {
    from: bigint;
    to: bigint;
}

export const connectionSendSchema = z.object({
    to: z.union([z.number().transform(val => BigInt(val)), z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'userId must be a valid bigint' }
    ).transform(val => BigInt(val))]),
});

// /api/connection/requests
export type ConnectionRequests = {
    id: bigint
}

// api/connection/connect
export type ConnectionConnect = {
    from: bigint;
    to: bigint;
    accept: boolean;
}

export const connectionConnectSchema = z.object({
    to: z.union([z.number().transform(val => BigInt(val)), z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'userId must be a valid bigint' }
    )]),
    accept: z.union([z.boolean(), z.string().refine(val => val === 'true' || val === 'false', {
        message: "accept must be 'true' or 'false' as string"
    }).transform(val => val === "true" ? true : false)])
});

// /api/connection/list/:userId
export type ConnectionList = {
    id: bigint
}

export const connectionListParams = z.object({
    userId: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'userId must be a valid bigint' }
    ).transform(val => BigInt(val))
});

// api/connection/delete/:to
export type ConnectionDelete = {
    from: bigint,
    to: bigint
}

export const connectionDeleteParams = z.object({
    to: z.string().refine(
        (val) => {
            try {
                BigInt(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'userId must be a valid bigint' }
    ).transform(val => BigInt(val))
})