export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: Role;
    orders: string[];
    isSubscribed: boolean;
    isAble: boolean;

    createdAt: number;
}

export type Role = 'user' | 'superuser' | 'admin';
export const RoleArray: Role[] = ['user', 'superuser', 'admin'];