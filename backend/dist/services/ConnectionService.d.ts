import * as ConnectionModel from '../model/Connection';
export declare const ConnectionService: {
    getUsers: (param: ConnectionModel.UsersGet) => Promise<{
        id: string;
        can_connect: boolean;
        email: string;
        full_name: string | null;
        profile_photo_path: string;
    }[]>;
    connectionSend: (data: ConnectionModel.ConnectionSend) => Promise<"You are now connected" | "Connection request successfully created">;
    connectionDelete: (data: ConnectionModel.ConnectionDelete) => Promise<void>;
    connectionConnect: (data: ConnectionModel.ConnectionConnect) => Promise<void>;
    connectionRequests: (data: ConnectionModel.ConnectionRequests) => Promise<{
        from_id: string;
        to_id: string;
        from_user: {
            username: string;
            email: string;
            full_name: string | null;
            profile_photo_path: string;
        };
        created_at: Date;
    }[]>;
    connectionList: (data: ConnectionModel.ConnectionList) => Promise<{
        id: string;
        username: string;
        email: string;
        full_name: string | null;
        profile_photo_path: string;
    }[]>;
};
