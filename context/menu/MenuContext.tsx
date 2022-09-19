import { createContext } from 'react';


interface ContextProps {
    isMenuOpen: boolean;
    toggleSideMenu: () => void;
    confirmation: boolean | null;
    setConfirmation: ( c: boolean ) => void;
}


export const MenuContext = createContext({} as ContextProps)