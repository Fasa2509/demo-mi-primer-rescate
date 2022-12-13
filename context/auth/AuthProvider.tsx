import { FC, useEffect, useReducer } from 'react';
import { Session } from 'next-auth';
import { useSession, signOut, getSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { isBefore, isToday, isTomorrow } from 'date-fns';
import Cookies from 'js-cookie';

import { mprApi } from '../../mprApi';
import { IUser } from '../../interfaces';
import { ConfirmNotificationButtons, PromiseConfirmHelper, validations } from '../../utils';

import { AuthContext, authReducer } from './';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
    expires?: number;
}


interface props {
    children: JSX.Element;
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
    expires: undefined,
}


export const AuthProvider: FC<props> = ({ children }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const session = useSession();

    useEffect(() => {
        ( session.status === 'authenticated' ) && dispatch({ type: 'Auth - Login', payload: session.data });
    }, [session.status, session.data]);

    useEffect(() => {
        if ( session.data && session.data.expires ) {
          if ( Cookies.get('mpr__extendSession') === 'true' && ( isToday( new Date( session.data.expires ) ) || isTomorrow( new Date( session.data.expires ) ) )) {
            (async () => {
    
              let key = enqueueSnackbar('Tu sesión está a punto de expirar, ¿quieres extenderla?', {
                variant: 'info',
                autoHideDuration: 15000,
                action: ConfirmNotificationButtons,
              })
    
              const confirm = await PromiseConfirmHelper( key, 15000 );
           
              if ( !confirm ) {
                Cookies.set('mpr__extendSession', 'false');
                return;
              }
    
              const resession = await getSession();

              resession && resession.user && dispatch({ type: 'Auth - Login', payload: resession as Session });
    
            })();
          }

        }
        let now = (() => Date.now())();
        state.expires && isBefore( state.expires, now ) && dispatch({ type: 'Auth - Logout' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session.data]);

    const loginUser = async ( email: string, password: string ): Promise<{ error: boolean, message: string }> => {
        try {
            if ( !validations.isValidEmail( email ) || !validations.isValidPassword( password ) )
                return { error: true, message: 'La información del usuario no es válida' };

            const { data } = await mprApi.post('/user/login', { email, password });

            const { token, user } = data;

            Cookies.set('token', token);

            dispatch({ type: 'Auth - Login', payload: user });
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
            if ( !validations.isValidEmail( email ) || !validations.isValidPassword( password ) )
                return { error: true, message: 'La información no es válida' };

            const { data } = await mprApi.post('/user/register', { name, email, password, isSubscribed });

            return data;
        } catch( error: any ) {
            return {
                error: true,
                message: error.response ? error.response.data.message || 'Ocurrió un error' : 'Ocurrió un error',
            }
        }
    }

    const logoutUser = () => {
        if ( session.status !== 'authenticated' ) return;
        
        window.localStorage.removeItem('mpr__shopInfo');
        Cookies.remove('mpr__cart');
        Cookies.remove('mpr__extendSession');
        Cookies.remove('token');
        dispatch({ type: 'Auth - Logout' });

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