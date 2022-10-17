import axios from "axios";
import bcrypt from 'bcryptjs';
import { db } from ".";
import { User } from "../models";
import { IUser, Role } from "../interfaces";
import { mprApi } from "../api";

export const updateUserRole = async ( userId: string, role: Role ): Promise<{ error: boolean; message: string }> => {

    try {
        const { data } = await mprApi.put(`/user/${ userId }?role=${ role }`);

        return data;
    } catch( error ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
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

export const deleteUserById = async ( userId: string ): Promise<{ error: boolean; message: string }> => {

    try {
        const { data } = await mprApi.delete(`/user/${ userId }`);

        return data;
    } catch( error ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
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

export const getUserById = async ( userId: string ): Promise<IUser | null> => {

    try {
        await db.connect();

        const user = await User.findById( userId );

        await db.disconnect();

        return JSON.parse( JSON.stringify( user ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

}

export const getAllUsers = async (): Promise<IUser[] | null> => {

    try {
        await db.connect();
        
        const users = await User.find({ isAble: true });

        await db.disconnect();

        return JSON.parse( JSON.stringify(users) );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return null;
    }

}

export const CheckUserEmailPassword = async ( email: string, password: string ) => {

    await db.connect();
    
    const user = await User.findOne({ email }).lean();

    await db.disconnect();

    if ( !user ) return null;

    const match = await bcrypt.compare(password, user.password!);

    if ( match ) {
        const { _id, name, email, role } = user;
        return {
            _id,
            name,
            email,
            role
        }
    }

    return null;

};

export const oAuthToDbUser = async ( oAuthEmail: string, oAuthName: string ) => {

    await db.connect();

    const user = await User.findOne({ email: oAuthEmail, isAble: true });

    if ( user ) {
        await db.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'user' });

    await newUser.save();

    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };

};