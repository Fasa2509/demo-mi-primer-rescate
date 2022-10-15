import { createContext } from 'react';
import { IUser } from '../../interfaces';


interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser;

    // methods
    loginUser: ( email: string, password: string ) => Promise<{ error: boolean, message: string }>;
    registerUser: ( name: string, email: string, password: string, isSubscribed: boolean ) => Promise<{ error: boolean, message: string }>;
    logoutUser: () => void;
}


export const AuthContext = createContext({} as ContextProps)