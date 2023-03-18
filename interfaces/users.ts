export interface IUser {
    id?: undefined;
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: Role;
    isSubscribed: boolean;
    isAble: boolean;
    orders: string[];
    pets: string[];
    createdAt: number;
}

export type Role = 'user' | 'superuser' | 'admin';
export const RoleArray: Role[] = ['user', 'superuser', 'admin'];