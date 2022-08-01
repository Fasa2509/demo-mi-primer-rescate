import { createContext } from 'react';


interface ContextProps {
    isLoggedIn: boolean;
    logIn: () => void;
    logOut: () => void;
}


export const AuthContext = createContext({} as ContextProps)