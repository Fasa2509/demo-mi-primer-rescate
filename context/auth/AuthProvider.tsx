import { FC, useState } from 'react';
import { AuthContext } from './';

export interface AuthState {
    isLoggedIn: boolean;
}


interface props {
    children: JSX.Element
}


export const AuthProvider: FC<props> = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState( false );

    const logIn = () => setIsLoggedIn( true )

    const logOut = () => setIsLoggedIn( false )

    return(
        <AuthContext.Provider value={{
            isLoggedIn,
            logIn,
            logOut,
        }}>
            { children }
        </AuthContext.Provider>
    )
}