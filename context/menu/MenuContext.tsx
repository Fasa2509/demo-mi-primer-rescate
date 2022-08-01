import { createContext } from 'react';


interface ContextProps {
    isMenuOpen: boolean;
    toggleSideMenu: () => void;
}


export const MenuContext = createContext({} as ContextProps)