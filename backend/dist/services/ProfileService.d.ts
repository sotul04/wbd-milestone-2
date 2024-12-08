import * as UserModel from '../model/User';
export declare const ProfileService: {
    publicAccess: (data: UserModel.UserFindId) => Promise<UserModel.UserProfile | null>;
    authenticatedAccess: (data: UserModel.UserFindConnection) => Promise<UserModel.UserProfile | null>;
    selfAccess: (data: UserModel.UserFindId) => Promise<UserModel.UserProfile | null>;
};
