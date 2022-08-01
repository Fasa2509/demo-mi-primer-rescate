import { createContext } from 'react';


interface ContextProps {
    scrolled: boolean;
    passedImage: boolean;
}


export const ScrollContext = createContext({} as ContextProps)