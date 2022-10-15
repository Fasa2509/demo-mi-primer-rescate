import { createContext } from 'react';


interface ContextProps {
    passedElements: string[];
    isLoading: boolean;
    setIsLoading: (a: boolean) => void;
}


export const ScrollContext = createContext({} as ContextProps)