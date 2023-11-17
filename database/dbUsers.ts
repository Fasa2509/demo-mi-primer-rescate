import { User as NextAuthUser } from "next-auth";
import axios from "axios";
import bcrypt from 'bcryptjs';
import { isValidObjectId } from "mongoose";

import { db } from ".";
import { User } from "../models";
import { IUser, Role } from "../interfaces";
import { ApiResponse, ApiResponsePayload, mprApi } from "../mprApi";
import { validations } from "../utils";

export const updateUserRole = async (userId: string, role: Role): Promise<{ error: boolean; message: string }> => {

    try {
        const { data } = await mprApi.put(`/user/${userId}?role=${role}`);

        return data;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error eliminando el usuario',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const deleteUserById = async (userId: string, enable: boolean): Promise<{ error: boolean; message: string }> => {

    try {
        const { data } = await mprApi.delete(`/user/${userId}?enable=${String(enable)}`);

        return data;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error eliminando el usuario',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const updateUserPassword = async (token: string, userPassword: string): Promise<{ error: boolean; message: string; }> => {

    if (!token || !validations.isValidPassword(userPassword))
        return { error: true, message: 'La información no es válida' };

    try {
        const { data } = await mprApi.put('/user/login', { token, newPassword: userPassword });

        return data;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error buscando el usuario',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const sendMailPassword = async (userEmail: string): Promise<{ error: boolean; message: string; }> => {

    if (!validations.isValidEmail(userEmail)) return { error: true, message: 'El correo no es válido' };

    try {
        const { data } = await mprApi.get(`/user/login?email=${userEmail}`);

        return data;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error buscando el usuario',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const getUserById = async (userId: string): Promise<IUser | null> => {

    try {
        if (!isValidObjectId(userId)) return null;

        await db.connect();

        const user = await User.findById(userId).populate('orders').populate('pets');

        await db.disconnect();

        if (!user) return null;

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        await db.disconnect();
        return null;
    }

}

export const getUsers = async (): Promise<IUser[] | null> => {

    try {
        await db.connect();

        const users = await User.find().skip(0).limit(20).sort({ createdAt: -1 }).lean();

        await db.disconnect();

        return JSON.parse(JSON.stringify(users.sort((a: IUser, b: IUser) => b.createdAt - a.createdAt)));
    } catch (error) {
        await db.disconnect();
        return null;
    }

}

export const getPaginatedUsers = async (page: number): Promise<ApiResponsePayload<{ users: IUser[] }>> => {

    try {
        const { data } = await mprApi.get<ApiResponsePayload<{ users: IUser[] }>>('/user?p=' + page);

        return data;
    } catch (error) {

        // @ts-ignore
        if (axios.isAxiosError(error)) return error.response ? error.response.data : { error: true, message: 'Ocurrió un error' };

        return {
            error: true,
            message: 'Ocurrió un error obteniendo los usuarios'
        }
    }

}

export const CheckUserEmailPassword = async (email: string, password: string): Promise<NextAuthUser | null> => {

    try {
        await db.connect();

        const user = await User.findOne({ email: email.toLowerCase(), isAble: true }).lean();

        await db.disconnect();

        if (!user) return null;

        const match = await bcrypt.compare(password, user.password!);

        if (match) {
            const { _id, name, email, role } = user;
            return {
                id: undefined,
                _id: String(_id),
                name,
                email,
                role,
            }
        }

        return null;
    } catch (error) {
        return null;
    }

};

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {

    await db.connect();

    const user = await User.findOne({ email: oAuthEmail }).lean();

    if (user) {
        await db.disconnect();

        // if ( !user.isAble ) return undefined;   // rejects the user signin
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'user', isAble: true, isSubscribed: true });

    await newUser.save();

    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };

};