import { FC, useEffect, useReducer } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import { mprApi } from '../../mprApi';
import axios from 'axios';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}


interface props {
    children: JSX.Element
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}


export const AuthProvider: FC<props> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const session = useSession();

    useEffect(() => {
        if ( session.status === 'authenticated' ) {
            dispatch({ type: 'Auth - Login', payload: session.data.user as IUser })
        }
    }, [session.status, session.data])

    const loginUser = async ( email: string, password: string ): Promise<{ error: boolean, message: string }> => {
        try {
            const { data } = await mprApi.post('/user/login', { email, password });

            const { token, user } = data;

            Cookies.set('token', token);

            dispatch({ type: 'Auth - Login', payload: user })
            return {
                error: false,
                message: ''
            }
        } catch( error: any ) {
            return {
                error: true,
                message: error.response.data.message || 'Ocurrió un error',
            };
        }
    }

    const registerUser = async ( name: string, email: string, password: string, isSubscribed: boolean ): Promise<{ error: boolean, message: string }> => {
        try {
            const { data } = await mprApi.post('/user/register', { name, email, password, isSubscribed });

            const { token, user } = data;

            Cookies.set('token', token);

            dispatch({ type: 'Auth - Login', payload: user });

            return {
                error: false,
                message: '',
                // message: `Bienvenid@ ${ user.name.split(' ')[0] }`,
            }
        } catch( error: any ) {
            // if ( axios.isAxiosError( error ) ) return { error: true, message: 'Error de axios' };
            return {
                error: true,
                message: error.response.data.message || 'Ocurrió un error',
            }
        }
    }

    const logoutUser = () => {
        if ( session.status !== 'authenticated' ) return;
        
        Cookies.remove('mpr__cart');
        Cookies.remove('mpr__extendSession');
        Cookies.remove('mpr__shopInfo');
        Cookies.remove('token');

        signOut();
    }

    return(
        <AuthContext.Provider value={{
            ...state,

            // methods
            loginUser,
            registerUser,
            logoutUser,
        }}>
            { children }
        </AuthContext.Provider>
    )
}