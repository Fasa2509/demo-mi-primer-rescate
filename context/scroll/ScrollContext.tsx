import { createContext } from 'react';


interface ContextProps {
    passedElements: string[];
}


export const ScrollContext = createContext({} as ContextProps)